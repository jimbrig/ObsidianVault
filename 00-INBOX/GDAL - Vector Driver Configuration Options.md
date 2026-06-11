---
creation_date: 2026-06-10
modification_date: 2026-06-10T17:39:37-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL - Vector Driver Configuration Options
tags:
  - Type/Reference
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
aliases:
  - GDAL Vector Driver Configuration Options
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

## Drivers

- [GeoJSON Configuration Options](https://gdal.org/en/stable/drivers/vector/geojson.html#configuration-options)
- [GPKG Configuration Options](https://gdal.org/en/stable/drivers/vector/gpkg.html#configuration-options)
- [SQLite Configuration Options](https://gdal.org/en/stable/drivers/vector/sqlite.html#configuration-options)
- [ESRI Shapefile Configuration Options](https://gdal.org/en/stable/drivers/vector/shapefile.html#configuration-options)
- [OpenFileGDB Configuration Options](https://gdal.org/en/stable/drivers/vector/openfilegdb.html#configuration-options)
- FlatGeobuf Configuration Options: *No `--config` options directly.*
- (Geo)Parquet Configuration Options: *No `--config` options directly.*
- PMTiles Configuration Options: *No `--config` options directly.*


For ESRI Shapefile, also see these resources:
- https://gdal.org/en/stable/drivers/vector/shapefile.html#esri-shapefile-dbf
- https://gdal.org/en/stable/drivers/vector/shapefile.html#encoding

For SQLite also see these resources:
- https://www.sqlite.org/pragma.html#pragma_journal_mode
- https://gdal.org/en/stable/drivers/vector/sqlite.html#performance-hints

### GeoJSON

> [!SOURCE]
> <https://gdal.org/en/stable/drivers/vector/geojson.html#configuration-options>

> [!NOTE]
> *Configuration options can be specified in command-line tools using the syntax `--config <NAME>=<VALUE>` or using functions such as `CPLSetConfigOption()` ([[C]]) or `gdal.config_options` ([[MOC - Python|Python]]). 
 

The following configuration options are available:

- `GEOMETRY_AS_COLLECTION=[YES/NO]`: Defaults to `NO`. Used to control translation of geometries: `YES`: wrap geometries with `OGRGeometryCollection` type.
- `ATTRIBUTES_SKIP=[YES/NO]`: Controls translation of attributes. If `YES`, skip all attributes.
- `OGR_GEOJSON_ARRAY_AS_STRING=value`: Equivalent of `ARRAY_AS_STRING` [[open option]].
- `OGR_GEOJSON_DATE_AS_STRING=value`: Equivalent of `DATE_AS_STRING` open option.
- `OGR_GEOJSON_MAX_OBJ_SIZE=<MBytes>`: (GDAL >= 3.0.2) Defaults to `200`. Size in megabytes of the maximum accepted single feature, or `0` to allow for a unlimited size (GDAL >= 3.5.2).

### FlatGeobuf




## Appendix

*Note created on [[2026-06-10]] and last modified on [[2026-06-10]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
