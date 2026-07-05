---
creation_date: 2026-07-01
modification_date: 2026-07-01T12:56:48-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Project - USA Parcels SDI
tags:
  - Type/Project
  - Status/WIP
  - Topic/Development
  - Topic/R
  - Topic/Geospatial
aliases:
  - Project - USA Parcels SDI
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Core Integrations

I have separated these into the following "realms":

- Data: non-GDAL data context and work
- GDAL: core GDAL pipelines and algorithms
- Vector Tiles: creation and serving of vector tiles
- Maps: Maplibre maps and styles
- STAC: STAC integration and metadata
- Remote: Management of remote resources
- User Interface: Interfaces on top of the backend data architecture

### Data

This realm deals with the data outside of just the GDAL context, for example, analysis of the `gpkg` as a SQLite database or assessment of output parquet's outside of just the GDAL context, etc.

Packages:

General:

- [tidyverse](https://tidyverse.org/)

GeoPackage:

- [gpkg](https://github.com/brownag/gpkg)

SQLite:

- [DBI](https://github.com/r-dbi/dbi) and [RSQLite](https://github.com/r-dbi/RSQLite/)

ADBC:

- [adbi](https://github.com/r-dbi/adbi)
- [adbcdrivermanager](https://github.com/apache/arrow-adbc/tree/main/r/adbcdrivermanager) 
- [adbcsqlite](https://github.com/apache/arrow-adbc/tree/main/r/adbcsqlite)

Arrow/Parquet:

- [nanoarrow](https://github.com/apache/arrow-nanoarrow/tree/main/r) 
- [nanoparquet](https://github.com/r-lib/nanoparquet/)
- [geoarrow](https://github.com/geoarrow/geoarrow-r)
- [sfarrow](https://github.com/wcjochem/sfarrow)

DuckDB:

- [duckdb](https://github.com/duckdb/duckdb-r) 
- [duckspatial](https://github.com/Cidree/duckspatial)
- [duckplyr](https://github.com/tidyverse/duckplyr/)
- [duckdbfs](https://github.com/cboettig/duckdbfs)

Experimental (SedonaDB):

- [sx](https://github.com/e-kotov/sx)
- [sedonadb](https://github.com/apache/sedona-db)


### GDAL

`gdalraster` C++ bindings to `GDALAlg` and `GDALVector` are the core for all primary workflows that read from data sources and write out modernized CNF formats leveraging declarative, streamed, algorithmic pipelines and `GDALG` etc. 

Currently the core pipeline(s) for the parcels are highly detailed with many steps and nuances using various modern [gdal vector pipeline](https://gdal.org/en/latest/programs/gdal_vector_pipeline.html#gdal-vector-pipeline) steps/features such as but not limited to: 

- Pre-pipeline algorithm configuration and setup/environment
- Read step with custom format-specific open options
- Filter step(s) for spatial and/or attribute filtering
- Selection of fields to keep/ignore
- Application of custom SQL
- Making geometries valid
- Setting the types of the fields & the geometry type
- Reprojection to target CRS
- Writing to GDALG/Reading from GDALG
- Writing outputs with format-specific lco's and options 
- Partitioning to many outputs for GeoParquet
- Post-pipeline logic (i.e. updating `_metadata` with a new state's partitioned outputs via `gdal driver parquet create-metadata-file` etc.)   
- Writing to remote virtual file destinations via the GDAL VSI APIs

**Core Packages**: 
- [gdalraster](https://github.com/firelab/gdalraster/) (custom via `gdalraster.windows`)
- [gdalraster.windows](https://github.com/jimbrig/gdalraster.windows) (my package)

**Supplementary Packages**:
- [sf](https://github.com/r-spatial/sf/)
- [terra](https://github.com/rspatial/terra/)
- [geos](https://github.com/paleolimbot/geos/)
- [s2](https://github.com/r-spatial/s2)
- [vapour](https://github.com/hypertidy/vapour/)
- [gpkg](https://github.com/brownag/gpkg)
- [wk](https://github.com/paleolimbot/wk)
- [hypertidy/lazysf](https://github.com/hypertidy/lazysf) (reference only)
- [brownag/gdalcli](https://github.com/brownag/gdalcli) (reference only)

#### Ideas & Experimental

- Custom orchestration of GDAL workloads using targets with custom tarchetypes or `tar_format()`
- Incorporating optimized, parallel, or concurrent processing workloads
- Enhancing the logging/progress/feedback during executions

Ideas/Experimental Related Packages:

Targets Related:

- [targets](https://github.com/ropensci/targets)
- [tarchetypes](https://github.com/ropensci/tarchetypes)
- [geotargets](https://github.com/ropensci/geotargets) (reference only)

Other:

- [nanonext](https://github.com/r-lib/nanonext)
- [mirai](https://github.com/r-lib/mirai)
- [progressr](https://github.com/futureverse/progressr)
- [mori](https://github.com/shikokuchuo/mori)

### Vector Tiles

- [freestiler](https://github.com/walkerke/freestiler) and my custom [jimbrig/freestiler](https://github.com/jimbrig/freestiler) fork
- [pmtiles](https://github.com/walkerke/pmtiles)

### Maps

- [mapgl](https://github.com/walkerke/mapgl)

Experimental

- [toro](https://github.com/Epi-interactive-Ltd/toro/)
- [r-spatial/deckglgeoarrow](https://github.com/r-spatial/deckglgeoarrow)

### STAC & STAC Browser

- [stacbuildr](https://github.com/stevenpawley/stacbuildr)
- [rstac](https://github.com/brazil-data-cube/rstac/)

### Remote

- `gdalraster::vsi_*()` and `gdalraster::VSIFile` class
- [rcloner](https://github.com/boettiger-lab/rcloner)

Experiemental:

- [hypertidy/robstore](https://github.com/hypertidy/robstore)




***

## Appendix

*Note created on [[2026-07-01]] and last modified on [[2026-07-01]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
