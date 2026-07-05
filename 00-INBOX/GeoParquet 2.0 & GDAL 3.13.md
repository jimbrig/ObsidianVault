---
creation_date: 2026-06-16
modification_date: 2026-06-16T17:12:55-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GeoParquet 2.0 & GDAL 3.13
tags:
  - Type/Note
  - Status/WIP
  - Topic/Geospatial
  - Topic/DataEngineering
  - Topic/Development
  - Topic/Tools
  - Topic/Cloud
aliases:
  - GeoParquet 2.0 & GDAL 3.13
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCES]
> - [Geoparquet 2.0: Going Native | Cloud-Native Geospatial Forum - CNG](https://cloudnativegeo.org/blog/2025/02/geoparquet-2.0-going-native/)
> - [Native Geospatial Types in Apache Parquet | Parquet](https://parquet.apache.org/blog/2026/02/13/native-geospatial-types-in-apache-parquet/)
> - [How We Added Geospatial Support To Lance With No New Code](https://www.lancedb.com/blog/geo-support#native-geoarrow-vs-wkb-encoding-anchor)

The [[Parquet]] specification's formal adoption of native `GEOMETRY` and `GEOGRAPHY` logical types in March 2025 (`Parquet 2.11.0`) marks a watershed moment for [[cloud-native geospatial]] data. `GDAL 3.12` introduced the `USE_PARQUET_GEO_TYPES` creation option to expose these new types, and the [[GeoParquet]] community's working direction for **`GeoParquet 2.0`** is to use these native types as the singular geometry representation, dropping the need for the separate `bbox` covering column since [[Parquet]] itself now stores per-row-group geospatial statistics. 

## What Changed

Prior to March 2025, geometry in [[Parquet]] was stored as a raw `BYTE_ARRAY` column with no semantic meaning attached at the file schema level, only the separate [[GeoParquet]] `geo` key in file metadata told readers what that binary blob meant. With Parquet format version `2.11.0`, `GEOMETRY` and `GEOGRAPHY` are now first-class **logical types**, equivalent to how `INT64` or `FLOAT32` are first-class. 

This brings two major benefits:

1. **Schema Level Semantics**: Any Parquet-aware reader ([[DuckDB]], Spark, Iceberg, etc.) can discover geometry columns directly from the schema, without needing the GeoParquet `geo` metadata key.
2. **Native per-row-group geospatial statistics**: The Parquet format now stores bounding box and geometry type statistics at the row group level inside the Parquet footer itself. This means query engines can skip non-matching row groups purely from the Parquet metadata; the same performance optimization that `WRITE_COVERING_BBOX=YES` was trying to achieve by embedding an explicit `bbox` struct column.

The key distinction is encoding: the `GEOMETRY` logical type in Parquet **still stores WKB as the underlying `BYTE_ARRAY` value** - it is the binary encoding mechanism, just with a richer type annotation. This makes `GEOMETRY` + [[WKB]] the natural bridge: maximally interoperable encoding ([[WKB]]) combined with the richer logical type metadata.

## GeoParquet 2.0

GeoParquet 2.0 is not yet formally released as of June 2026, but the design intent is clear and has been stated publicly by [[Chris Holmes ]](core GeoParquet contributor):

- GeoParquet 2.0 will use the native Parquet `GEOMETRY`/`GEOGRAPHY` types as the **sole** geometry type
- It will **drop support for [[GeoArrow]] native encodings** (`geoarrow.point`, `geoarrow.polygon`, etc.) inside Parquet; the native stats from Parquet `GEOMETRY` accomplish the main goal [[GeoArrow]] was solving (column statistics for spatial pushdown), without needing a separate encoding
- The `bbox` covering column will be **removed from the spec** since Parquet-level geospatial statistics replace it
- The GeoParquet `geo` metadata key will likely persist only for the `primary_column` concept (telling readers which geometry column is the "main" one), since Parquet has no equivalent concept
- The GeoParquet community will continue writing dual metadata for backward compatibility during the transition period

This means that when [[GDAL GeoParquet|creating GeoParquet using GDAL]], using the [[layer creation options]]:

- `USE_PARQUET_GEO_TYPES=YES`
- `GEOMETRY_ENCODING=WKB`
- `WRITE_COVERING_BBOX=NO`


should produce ~GeoParquet v2.0 outputs.

### `USE_PARQUET_GEO_TYPES`

> [!TIP]+ Note:
> From the official [GDAL (Geo)Parquet Layer Creation Options Documentation](https://gdal.org/en/stable/drivers/vector/parquet.html#layer-creation-options):
> 
> **USE_PARQUET_GEO_TYPES=[YES​/​NO​/​ONLY]:** (GDAL >= 3.12) Defaults to `NO`. Only available with libarrow >= 21.
> 
> Whether to use Parquet Geometry/Geography logical types (introduced in libarrow 21), when using the default GEOMETRY_ENCODING=WKB encoding.
> 
> - `YES`: use the Geometry logical type (or the Geography one if the EDGES=SPHERICAL creation option is also set), and also write file-level GeoParquet metadata. Such files can be read by older GDAL, but require libarrow >= 20.
> - `NO` (default): only file-level GeoParquet metadata is written. Such files can be read by older GDAL and libarrow versions.
> - `ONLY`: use the Geometry logical type (or the Geography one if the EDGES=SPHERICAL creation option is also set), but do not write file-level GeoParquet metadata. Such files will only be fully compatible of GDAL >= 3.12 and libarrow >= 21. With libarrow 20, the geometry column of such files will only be recognized if it is among one of the GEOM_POSSIBLE_NAMES open option value, and the CRS of such files will not be recognized. With older libarrow, such files cannot be opened at all.


This is the most important new option. It requires **libarrow ≥ 21** (released July 17, 2025) and **GDAL ≥ 3.12**

| Value | Behavior | Backward Compatibility | Recommendation |
|-------|----------|----------------------|----------------|
| `NO` (default) | Writes only GeoParquet 1.x `geo` metadata. Legacy behavior. | Maximum — works with any GDAL/libarrow version | Production default until ecosystem matures |
| `YES` | Writes the native Parquet `GEOMETRY` logical type **AND** the GeoParquet `geo` metadata | Files require libarrow ≥ 20 to read, but older GDAL can still read the `geo` metadata | **Recommended for this project** — forward-leaning while retaining fallback |
| `ONLY` | Writes native Parquet `GEOMETRY` logical type **but NOT** the GeoParquet `geo` metadata | Requires GDAL ≥ 3.12 and libarrow ≥ 21 to be fully recognized; older libarrow cannot read the file at all | Not recommended for broad distribution yet; appropriate for internal closed-stack use only |

**Recommendation: use `YES`**, not `ONLY`. The reason is critical: with `YES`, your files are dual-annotated - they carry both the native Parquet `GEOMETRY` schema annotation (used by modern tools: DuckDB ≥ 1.5.0, PyArrow ≥ 21.0, Spark, GDAL ≥ 3.12) and the GeoParquet `geo` metadata (used by GDAL < 3.12, QGIS, MapLibre-based renderers, and every other tool that implements the GeoParquet 1.x spec). With `ONLY`, any tool that reads the GeoParquet `geo` key for CRS information will fail silently or error. For a US parcels dataset that will be read by diverse tooling, `YES` is the correct choice during the current transition period.

## Example GDAL with Updated Options

Example Command Syntax:

```bash
gdal vector pipeline \
  ! read ...
  ! ... steps ...
  ! sort --method hilbert
  ! write --output output.parquet --output-format Parquet \
    --lco "COMPRESSION=ZSTD" \
    --lco "COMPRESSION_LEVEL=15" \
    --lco "GEOMETRY_ENCODING=WKB" \
    --lco "ROW_GROUP_SIZE=100000" \
    --lco "GEOMETRY_NAME=geometry" \
    --lco "EDGES=PLANAR" \
    --lco "CREATOR=GDAL" \
    --lco "WRITE_COVERING_BBOX=NO" \
    --lco "USE_PARQUET_GEO_TYPES=YES" \
    --lco "SORT_BY_BBOX=NO" \
    --lco "TIMESTAMP_WITH_OFFSET=AUTO"
```

 
***

## Appendix

*Note created on [[2026-06-16]] and last modified on [[2026-06-16]].*

### See Also

#### Internal

- [[MOC - Geospatial]]
- [[MOC - Development|Development MOC]]
- [[GDAL - Vector Driver Configuration Options]]
- [[GDAL Configuration]]
- [[GDAL GeoParquet]]
- [[GDAL Vector Commands]]
- [[List - GeoParquet Tools|GeoParquet Tools]]

#### External

- [geoparquet.org](https://geoparquet.org/)
- [opengeospatial/geoparquet: Specification for storing geospatial vector data (point, line, polygon) in Parquet](https://github.com/opengeospatial/geoparquet)
- [GeoParquet Community - Google Groups](https://groups.google.com/a/cloudnativegeo.org/g/geoparquet-community)
- [Native Geospatial Types in Apache Parquet | Parquet](https://parquet.apache.org/blog/2026/02/13/native-geospatial-types-in-apache-parquet/)
- [Geoparquet 2.0: Going Native | Cloud-Native Geospatial Forum - CNG](https://cloudnativegeo.org/blog/2025/02/geoparquet-2.0-going-native/)
- [How We Added Geospatial Support To Lance With No New Code](https://www.lancedb.com/blog/geo-support#native-geoarrow-vs-wkb-encoding-anchor)
- [GeoParquet & Parquet Geospatial Types: A Time of Transition | Cloud-Native Geospatial Forum - CNG](https://cloudnativegeo.org/blog/2025/10/geoparquet-parquet-geospatial-types-a-time-of-transition/)
- [2.0 · Milestone #10 · opengeospatial/geoparquet](https://github.com/opengeospatial/geoparquet/milestone/10)
- [Google Open Buildings · The Centre for Humanitarian Data (HDX) · Source Cooperative | Source Cooperative](https://source.coop/hdx/google-open-buildings/geoparquet-2.0)

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026