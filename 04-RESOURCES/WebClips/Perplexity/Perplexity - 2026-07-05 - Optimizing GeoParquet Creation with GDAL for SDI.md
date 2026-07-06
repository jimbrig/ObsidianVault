---
creation_date: 2026-07-05
modification_date: 2026-07-05
author: Perplexity
title: Optimizing GeoParquet with GDAL
description: This chat clarifies optimal GeoParquet 2.0 creation using GDAL, addressing CRS issues caused by conversion tools and recommending a GDAL-centric pipeline for robust SDI.
tags:
  - Type/WebClip
  - Type/Chat
  - Status/Complete
  - Topic/GeoParquet
  - Topic/Geospatial
  - Topic/Development
  - Topic/AI
aliases:
  - Optimizing GeoParquet Creation with GDAL
source: https://www.perplexity.ai/search/59a6f6a4-9bee-4929-a5ca-6bb1785407bc
image: https://ppl-ai-public.s3.amazonaws.com/static/img/pplx-default-preview.png
---
# Optimizing GeoParquet Creation with GDAL for SDI

> [!SOURCE] Source:
> [Perplexity Chat](https://www.perplexity.ai/search/59a6f6a4-9bee-4929-a5ca-6bb1785407bc)

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Original Question

> @US Parcels Help me understand the actual optimal, best practice, and latest method the create modern (Geo)Parquet using GDAL, as there is a lot of confusion or inconsistent information floating around due to various changes and updates across specifications & tooling lately, primarily around Parquet's support for native GEOMETRY and GEOGRAPHY data types 
> 
> For example, say I have some pipeline:
> 
> ```powershell
> gdal vector pipeline `
>   --progress `
>   --config <configs> `
>   read <input data> `
>   ! <pipeline steps> `
>   ! sort --method Hilbert `
>   ! <write or partition> <lcos below>
> ```
> 
> and the layer creation options used during the write step of the parquet's are as follows:
> 
> ```plaintext
> # core options needed or related to latest specs and best practices
> --layer-creation-option COMPRESSION=ZSTD
> --layer-creation-option COMPRESSION_LEVEL=15
> --layer-creation-option GEOMETRY_ENCODING=WKB
> --layer-creation-option ROW_GROUP_SIZE=65536 ***
> --layer-creation-option WRITE_COVERING_BBOX=NO ***
> --layer-creation-option USE_PARQUET_GEO_TYPES=YES ***
> --layer-creation-option SORT_BY_BBOX=NO ***
> 
> # less significant options pertaining to this use case/scenario
> --layer-creation-option COVERING_BBOX_NAME=geometry_bbox ***
> --layer-creation-option GEOMETRY_NAME=geometry
> --layer-creation-option FID=
> --layer-creation-option POLYGON_ORIENTATION=COUNTERCLOCKWISE
> --layer-creation-option EDGES=PLANAR
> --layer-creation-option CREATOR=GDAL
> --layer-creation-option TIMESTAMP_WITH_OFFSET=AUTO
> ```
> 
> ***: These are the questionable ones, particularly USE_PARQUET_GEO_TYPES=YES (not only) to make "GeoParquet 2.0" supported if you will, and to leverage the new native parquet geo data types. However, the bbox metadata ones are where I get the most confused, as the gpio and other geoparquet-io related tooling will state things like "
> 
> for example, here's the output of gpio check against a parquet I made using GDAL without the write_covering_bbox and without the sort_by_bbox options, using the parquet geo types, and tweaking the row_group_size to be optimal:
> 
> ```powershell
> gpio check .\atlanta.parquet
> 
> Row Group Analysis:
> Number of row groups: 1
> Average group size: 2.23 MB
> Row group size is appropriate for small file
> Average rows per group: 44,578
> Row count is appropriate for small file
> 
> Total file size: 2.23 MB
> 
> GeoParquet 2.0 Metadata:
> ✓ Version 2.0.0
> ✓ Uses native Parquet GEOMETRY/GEOGRAPHY types
> ✓ No bbox column (correct for GeoParquet 2.0)
> 
> Compression Analysis:
> ✓ ZSTD compression on geometry column 'geom'
> 
> Bloom Filter Analysis:
> Bloom filters found on 3 column(s): county_fips, geoid, state_fips
> Total bloom filter size: 141.00 B
> 
> Spatial Order Analysis:
> ✓ Data appears to be spatially ordered
> 
> Spec Validation:
 >  ✓ 29 checks passed
> ```
> 
> notice how it says:
> 
> ✓ Version 2.0.0
> ✓ Uses native Parquet GEOMETRY/GEOGRAPHY types
> ✓ No bbox column (correct for GeoParquet 2.0)
> 
> and
> 
> Spatial Order Analysis:
> ✓ Data appears to be spatially ordered
> 
> where I did not use the sort_by_bbox option, but I did use the separate gdal vector sort --method Hilbert step (however, note that in other examples with larger data, sometimes this same check would say it did not think it was sptiallly sorted unless I specifically used sort_by_bbox on top of the already gdal vector sort --method Hilbert step or applying the sorting via gpio CLI directly afterwards.
> 
> this is also just a single file and not partitioned, which makes it a little less inline with what production scenarios would be like, and how the _metadata or vector index files would come into play, etc.


### Relevant GDAL Documentation

- [(Geo)Parquet Driver](https://gdal.org/en/stable/drivers/vector/parquet.html)
	- *Particularly the [Layer Creation Options](https://gdal.org/en/stable/drivers/vector/parquet.html#layer-creation-options)*
- [Arrow Driver](https://gdal.org/en/stable/drivers/vector/arrow.html#vector-arrow)
- https://gdal.org/en/stable/programs/gdal_vector_partition.html
- https://gdal.org/en/stable/programs/gdal_driver_parquet_create_metadata_file.html
- https://gdal.org/en/stable/programs/gdal_vector_sort.html
- https://gdal.org/en/stable/programs/gdal_vector_index.html
- https://raw.githubusercontent.com/OSGeo/gdal/refs/heads/release/3.13/swig/python/gdal-utils/osgeo_utils/samples/validate_geoparquet.py

### Other Links

https://parquet.apache.org/blog/2026/02/13/native-geospatial-types-in-apache-parquet/
https://github.com/opengeospatial/geoparquet/issues/274
https://github.com/opengeospatial/geoparquet/blob/d727b4cd568651911860fec013982a06c353b9a0/format-specs/geoparquet.md#L98-L98
https://github.com/opengeospatial/geoparquet
https://github.com/apache/parquet-format
https://parquet.apache.org/
https://geoparquet.org/releases/

https://geoparquet.io/
https://geoparquet.io/CHANGELOG/
https://geoparquet.io/concepts/best-practices/
https://geoparquet.io/concepts/spatial-indices/
https://geoparquet.io/guide/extract/
https://geoparquet.io/guide/convert/
https://geoparquet.io/guide/meta/
https://geoparquet.io/guide/inspect/
https://geoparquet.io/guide/write-strategies/
https://geoparquet.io/guide/check/
https://geoparquet.io/guide/sort/
https://geoparquet.io/guide/add/
https://geoparquet.io/guide/partition/

https://guide.cloudnativegeo.org/geoparquet/
https://cloudnativegeo.org/blog/2025/02/geoparquet-2.0-going-native/
https://rednegra.net/blog/20250925-parquet-with-geometry-type-is-not-geoparquet/
https://medium.com/radiant-earth-insights/geoparquet-parquet-geospatial-types-a-time-of-transition-a42e391cdab2

## Synthesis - GeoParquet 2.0 Best Practices with GDAL

This note synthesizes best practices for creating modern [[GeoParquet]] files using [[GDAL]], focusing on the latest specifications and GDAL's capabilities.

### Core Concepts

*   **GeoParquet 2.0 Convergence:** The specification aims to consolidate around native Parquet `GEOMETRY`/`GEOGRAPHY` logical types, storing data as [[Well Known Binary (WKB)|WKB]]-encoded `BYTE_ARRAY` columns. This eliminates the need for explicit [[Bounding Box (BBOX)|bounding box]] columns (like in GeoParquet 1.1) as row-group-level statistics are embedded directly into the geometry column metadata.
*   **GDAL's Role:** GDAL 3.12+ and libarrow 21+ provide the necessary tools. Using `USE_PARQUET_GEO_TYPES=YES` during GDAL's write process ensures dual compatibility: it writes native Parquet geo types while also preserving the traditional GeoParquet 1.x `geo` metadata block for broader tool support.
*   **Axis Order and CRS:** The Parquet `GEOMETRY` type mandates (longitude, latitude) axis order, overriding CRS definitions. GDAL's direct write handles this correctly by leveraging [[PROJ]] internally. Avoid tools like `gpio convert --geoparquet-version 2.0` which can misinterpret [[Coordinate Reference System (CRS)|CRS]] axis order, leading to incorrect geometry data and downstream errors. Use `EDGES=PLANAR` for projected or [[EPSG:4326]] data, and `EDGES=SPHERICAL` only for global-scale datasets where geodesic paths are critical. Ensure `POLYGON_ORIENTATION=COUNTERCLOCKWISE` for compliance with [[GeoJSON]]/[[GeoParquet]] standards.

### Recommended GDAL Pipeline

For optimal GeoParquet creation, especially for partitioned datasets:

1.  **Input Data:** Start with data that has unambiguous CRS metadata (e.g., FlatGeobuf).
2.  **GDAL Pipeline:** Employ `gdal vector pipeline` with the following key steps:
    *   `read`: Your source data.
    *   `reproject --dst-crs EPSG:4326`: Standardize to WGS84.
    *   `sort --method Hilbert`: Crucial for spatial query performance. Set `SORT_BY_BBOX=NO` in LCOs when using this pipeline sort.
    *   `partition --field <your_field> --scheme hive`: Organizes data into directories based on attribute values.
    *   `write`: Output to Parquet.
        *   `--format Parquet`
        *   `--lco COMPRESSION=ZSTD --lco COMPRESSION_LEVEL=15`
        *   `--lco GEOMETRY_ENCODING=WKB`
        *   `--lco GEOMETRY_NAME=geometry`
        *   `--lco USE_PARQUET_GEO_TYPES=YES` (Crucial for GeoParquet 2.0 compatibility and native stats)
        *   `--lco WRITE_COVERING_BBOX=NO` (Redundant with native geo types)
3.  **Metadata:** Use `gdal driver parquet create-metadata-file` to generate a consolidated `_metadata` file for the partitioned dataset, enabling efficient querying by external tools.

### Key Takeaways and Gotchas

*   **Avoid `gpio convert --geoparquet-version 2.0`:** It can corrupt geometry axis order and break CRS detection for downstream tools like `freestiler`/DuckDB. GDAL's direct write with `USE_PARQUET_GEO_TYPES=YES` is the correct approach.
*   **`gpio check` Spatial Order:** Intermittent failures on large files can be due to GDAL's Arrow fast-path not always writing per-row-group geometry statistics. The `! sort --method Hilbert` pipeline step is still effective. Use `ogrinfo -al -so` for manual checks.
*   **CRS Handling:** Always ensure GDAL writes `USE_PARQUET_GEO_TYPES=YES` (dual-write) to maintain compatibility with tools relying on the GeoParquet `geo` metadata block.
*   **Partitioning:** GDAL's native partitioning (`gdal vector partition` + `create-metadata-file`) is sufficient and recommended for most SDI workflows. `gpio partition` is useful for specialized spatial indices (H3, quadkey) layered on top.

## Key Takeaways

- **GDAL is the Authoritative Source:** Treat GDAL as the primary engine for creating GeoParquet, ensuring consistent schema and metadata.
- **Embrace GeoParquet 2.0 Native Types:** Use `USE_PARQUET_GEO_TYPES=YES` for dual-write compatibility (native Parquet `GEOMETRY` + GeoParquet 1.x `geo` metadata).
- **Avoid `gpio convert --geoparquet-version 2.0`:** This tool can corrupt geometry axis order and CRS detection due to misinterpretation of GeoParquet/Parquet specifications.
- **Prioritize GDAL's Pipeline:** Utilize `gdal vector sort --method Hilbert` and `gdal vector partition` with `create-metadata-file` for optimal, maintainable partitioning and spatial indexing.
- **`EDGES=PLANAR` for Parcels:** Always use `EDGES=PLANAR` for projected or EPSG:4326 data; `SPHERICAL` is for global-scale data where geodesic paths matter.
- **`POLYGON_ORIENTATION=COUNTERCLOCKWISE` is Standard:** Use this for GeoJSON/GeoParquet compliance, especially with spherical geometries.
- **`_metadata` File is Key:** GDAL's `create-metadata-file` enables efficient querying by downstream tools like DuckDB and Spark.

## Implementation Notes

**GeoParquet Creation Pipeline (GDAL-centric):**

*   **Core Writing Options:**
    *   `--layer-creation-option COMPRESSION=ZSTD`
    *   `--layer-creation-option COMPRESSION_LEVEL=15`
    *   `--layer-creation-option GEOMETRY_ENCODING=WKB`
    *   `--layer-creation-option GEOMETRY_NAME=geometry`
    *   `--layer-creation-option USE_PARQUET_GEO_TYPES=YES` (Crucial for GeoParquet 2.0, enables native stats, dual-write with `geo` metadata)
    *   `--layer-creation-option WRITE_COVERING_BBOX=NO` (Not needed with native geo types)
    *   `--layer-creation-option SORT_BY_BBOX=NO` (Use `! sort --method Hilbert` pipeline step instead)
    *   `--layer-creation-option ROW_GROUP_SIZE`: Tune based on feature density (e.g., 65536 for smaller files, up to 100k-150k for larger states).
    *   `--layer-creation-option POLYGON_ORIENTATION=COUNTERCLOCKWISE` (Standard for GeoParquet/GeoJSON)
    *   `--layer-creation-option EDGES=PLANAR` (For projected or EPSG:4326 data; use `SPHERICAL` only for global datasets)

**Partitioning Strategy:**

*   **Core Partitioning:**
    *   Use `gdal vector partition --field <attribute> --scheme hive` (e.g., `--field state_fips --scheme hive`).
    *   Follow with `gdal driver parquet create-metadata-file --input <path> --output _metadata` to generate the consolidated metadata file.

**Spatial Indexing & Advanced Partitioning:**

*   **In-Pipeline Sorting:** Use `! sort --method Hilbert` as a pipeline step *before* writing.
*   **Specialized Partitioning (Optional):**
    *   Use `gpio add_h3` or `gpio add_quadkey` to add spatial index columns to your GDAL-processed data.
    *   Then, use `gpio partition h3 ...` or `gpio partition admin ...` on top of the GDAL GeoParquet output.

**Workflow Avoidance:**

*   **Do NOT use `gpio convert --geoparquet-version 2.0`:** It can corrupt geometry axis order and CRS detection.
*   **When using `freestiler`/DuckDB:** Ensure your input GeoParquet has `USE_PARQUET_GEO_TYPES=YES` (dual-write), not `ONLY`, so that the `geo` metadata block is present for CRS detection.

**Verification:**

*   Use `gdal vector info <file.parquet>` to check extent and CRS.
*   Use `ogrinfo -al -so <file.parquet>` for detailed layer information.

## Corrections And Caveats

- **`gpio convert --geoparquet-version 2.0` Corruption:** This tool incorrectly handles axis order for the native Parquet `GEOMETRY` type, leading to garbage extents and CRS detection failures in downstream tools. The correct method is direct GDAL write with `USE_PARQUET_GEO_TYPES=YES`.
- **CRS Detection Issues:** `freestiler`/DuckDB fails if the GeoParquet `geo` metadata block is missing (as happens with `gpio convert --geoparquet-version 2.0 --geoparquet-only`). GDAL's dual-write approach (`USE_PARQUET_GEO_TYPES=YES`) preserves this block, ensuring compatibility.
- **`gpio check` Spatial Order False Negatives:** For large, partitioned datasets, `gpio check` may report \\"not spatially ordered\\" if GDAL's Arrow fast-path writing doesn't embed per-row-group geometry statistics. This is a heuristic limitation of `gpio` and GDAL's Arrow integration, not a pipeline failure; the Hilbert sort in GDAL is still effective.
- **`USE_PARQUET_GEO_TYPES=ONLY`:** This drops the GeoParquet `geo` metadata, making files incompatible with tools like DuckDB's `ST_Read_Meta()`. It should not be used in production until ecosystem support is universal.
- **`EDGES=SPHERICAL` vs. `PLANAR`:** For typical parcel data, `PLANAR` is correct. `SPHERICAL` is only for global-scale data where geodesic paths are meaningful and requires `POLYGON_ORIENTATION=COUNTERCLOCKWISE` for spec compliance.
- **FlatGeobuf as Input:** FlatGeobuf contains unambiguous CRS metadata, making it a reliable intermediate or source format compared to potentially problematic Parquet conversions.

## Reusable Artifacts

- **GDAL Pipeline:** `gdal vector pipeline ... ! sort --method Hilbert ! partition ... ! write ...`
- **GDAL Write LCOs:** `USE_PARQUET_GEO_TYPES=YES`, `GEOMETRY_ENCODING=WKB`, `POLYGON_ORIENTATION=COUNTERCLOCKWISE`, `EDGES=PLANAR`
- **GDAL Partitioning:** `gdal vector partition --field <key> --scheme hive`
- **Metadata Generation:** `gdal driver parquet create-metadata-file`
- **CRS Handling:** Prefer GDAL direct write over `gpio convert` for GeoParquet 2.0 to maintain correct axis order and CRS metadata.
- **`freestiler` Input:** Use GDAL-written GeoParquet with `USE_PARQUET_GEO_TYPES=YES` (dual-write) or FlatGeobuf.

## Follow Up

- **Task:** Update R `e2e.R` script to use GDAL directly for GeoParquet 2.0 conversion instead of `gpio convert`.
- **Task:** Refactor GDAL CLI calls into a reusable R function for generating partitioned GeoParquet files.
- **Question:** Investigate potential GDAL versions or Arrow configurations that might improve per-row-group geometry statistics writing in the Arrow fast-path.
- **Task:** Document the `EDGES` and `POLYGON_ORIENTATION` LCOs with examples for clarity in the SDI documentation.

***

## Appendix

*Note created via [[Obsidian Web Clipper]] on [[2026-07-05]] and last modified on [[2026-07-05]].*

### See Also

- [[MOC - Geospatial|Geospatial MOC]]
- [[Geospatial Data Abstraction Library (GDAL)]]
- [[GeoParquet]]
- [[List - GeoParquet Tools|GeoParquet Tools List]]
- [[GeoParquet 2.0 & GDAL 3.13]]
- [[Guide - Best Practices for Distributing GeoParquet|GeoParquet Distribution Best Practice]]
- [[Tool - gpio]]
- [[Apache Parquet]]
- [[Apache Arrow]]
- [[Spatial Data Infrastructure (SDI)]]
- [[GDAL - Parcels Pipelines]]
- [[GDAL --optfile]]


***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026