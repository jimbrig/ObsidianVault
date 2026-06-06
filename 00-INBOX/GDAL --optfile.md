---
creation_date: 2026-06-04
modification_date: 2026-06-04
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL optfile
tags:
  - Type/Code
  - Status/Ongoing
  - Topic/Geospatial
  - Topic/Tools
aliases:
  - GDAL optfile
  - --optfile
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```



## Externalize Options with `--optfile`

> [!SOURCE]
> [--optfile Documentation](https://gdal.org/en/stable/programs/vector_common_options.html#cmdoption-vector_common_options-optfile)

The `--optfile` argument is a lesser known feature in modern GDAL syntax as it is not documented across the various vector programs and commands nor the configuration options details. It confusingly only appears in the ["Traditional" applications > Vector Programs > Common Options](https://gdal.org/en/stable/programs/vector_common_options.html) docs even though it can be used with non-traditional programs as well.

Its great for use cases where you have many `--config` options and want to keep the command self-defined without needing to rely on global state, environment variables, or external `GDAL_CONFIG_FILE` definitions as `--optfile` is essentially an inline text insertion mechanism, from the docsL

```plaintext
--optfile <filename>
Read the named file and substitute the contents into the command line options list. Lines beginning with # will be ignored. Multi-word arguments may be kept together with double quotes.
```

For example, let's consider a scenario where we are reading from remote [TIGER shp zips](https://www2.census.gov/geo/tiger/TIGER2025) and want to ensure best practice [[Common Portability Language (CPL)|CPL]], `VSI_`/`VSIL-`, `CURL`, etc. options are applied.

First let's create a [[GDALG]]:

```pwsh
gdal vector pipeline `
  ! read --input "/vsizip/vsicurl/https://www2.census.gov/geo/tiger/TIGER2025/STATE/tl_2025_us_state.zip/tl_2025_us_state.shp" --layer "tl_2025_us_state" `
  ! filter --where "STATEFP NOT IN ('02','15','60','66','69','72','74','78')" `
  ! sql --sql "SELECT GEOID AS geoid, STATEFP AS state_fips, STUSPS AS state_abbr, NAME AS state_name, ALAND AS area_land_m2, AWATER AS area_water_m2 FROM tl_2025_us_state" --dialect OGRSQL `
  ! reproject --output-crs "EPSG:4326" `
  ! make-valid `
  ! set-geom-type --multi --skip `
  ! sort --method hilbert `
  ! write --output "tiger_states.gdalg.json" --output-format GDALG --overwrite
```

then, we can create and optfile to use, i.e. `gdal.optfile`

```plaintext
# performance options
--config GDAL_NUM_THREADS ALL_CPUS
--config GDAL_ALGORITHM_ALLOW_WRITES_IN_STREAM YES
# logging options
--config CPL_LOG_ERRORS ON
--config CPL_TIMESTAMP ON
--config CPL_DEBUG ON
--config CPL_LOG gdal.log
# vsi/remote specific options
--config VSI_CACHE TRUE
--config VSI_CACHE_SIZE 134217728
--config GDAL_HTTP_CONNECTTIMEOUT 30
--config GDAL_HTTP_TIMEOUT 60
--config GDAL_HTTP_MAX_RETRY 5
--config GDAL_HTTP_RETRY_DELAY 2
--config GDAL_HTTP_RETRY_CODES 429,500,502,503,504
--config GDAL_HTTP_TCP_KEEPALIVE YES
--config GDAL_HTTP_USERAGENT gdalvector/0.0.1
# shapefile specific
--config GDAL_DISABLE_READDIR_ON_OPEN EMPTY_DIR
--config SHAPE_RESTORE_SHX NO
```

then we can perform the pipeline and write the streamed algorithm's output to parquet:

```pwsh
gdal vector convert `
  --optfile gdal.optfile --input tiger_states.gdalg.json --input-format GDALG `
  --output tiger_states.parquet --output-format PARQUET --output-layer tiger_states --overwrite --skip-errors `
    --lco COMPRESSION=ZSTD --lco COMPRESSION_LEVEL=9 --lco GEOMETRY_ENCODING=WKB --lco ROW_GROUP_SIZE=65536 `
    --lco GEOMETRY_NAME=geometry --lco CREATOR=gdal --lco WRITE_COVERING_BBOX=YES --lco COVERING_BBOX_NAME=bbox_geometry `
    --lco USE_PARQUET_GEO_TYPES=NO --lco SORT_BY_BBOX=YES
```



***

## Appendix

*Note created on [[2026-06-04]] and last modified on [[2026-06-04]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
