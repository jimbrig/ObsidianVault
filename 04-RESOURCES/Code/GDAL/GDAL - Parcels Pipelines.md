---
creation_date: 2026-06-15
modification_date: 2026-06-15T19:12:59-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL - Parcels Pipelines
tags:
  - Type/Code
  - Status/Ongoing
  - Topic/Geospatial
  - Topic/Development
  - Topic/DataEngineering
aliases:
  - GDAL - Parcels Pipelines
---

```sh
INPUT_PATH="/mnt/g/SpatialData/parcels/landrecordsus/LR_PARCEL_NATIONWIDE_FILE_US_2026_Q1.gpkg"
INPUT_NAME="LR_PARCEL_NATIONWIDE_FILE_US_2026_Q1.gpkg"
INPUT_FORMAT="GPKG"
INPUT_LAYER="lr_parcel_us"

gdal vector pipeline \
  --progress --debug --skip-errors \
  --config 
  ! read --input  $\
      --input-layer lr_parcel_us --input-format "GPKG" \
      --
```

```JSON
{
  "type":"gdal_streamed_alg",
  "command_line":"gdal vector pipeline read --open-option LIST_ALL_TABLES=NO --open-option \"PRELUDE_STATEMENTS=PRAGMA cache_size=-4000000;PRAGMA temp_store=MEMORY;PRAGMA mmap_size=8589934592;PRAGMA journal_mode=WAL;\" --input C:\/GEODATA\/LR_PARCEL_NATIONWIDE_FILE_US_2026_Q1.gpkg --input-layer lr_parcel_us ! filter --where \"statefp = '13'\" ! tee --tee-pipeline [ sql --sql \"SELECT CAST(rowid AS INTEGER) AS source_fid, geoid, statefp AS state_fips, countyfp AS county_fips, ST_AsText(geom) AS geom_wkt, 'Empty Geometry' AS invalid_reason FROM lr_parcel_us WHERE ST_IsEmpty(geom) = 1\" --dialect SQLITE ! write --output \/vsimem\/empty.arrow --output-format Arrow --overwrite ] ! sql --sql \"SELECT CAST(rowid AS INTEGER) AS source_fid, geoid, statefp AS state_fips, countyfp AS county_fips, geom FROM lr_parcel_us WHERE NOT ST_IsEmpty(geom)\" --dialect SQLITE ! tee --tee-pipeline [ check-geometry --geometry-field geom --include-field ALL ! sql --sql \"SELECT source_fid, state_fips, county_fips, ST_AsText(GEOMETRY) AS geom_wkt, error AS invalid_reason FROM error_location\" --dialect SQLITE ! write --output \/vsimem\/invalid.arrow --output-format Arrow --overwrite ] ! materialize ! make-valid ! set-geom-type --geometry-type MultiPolygon --skip ! reproject --output-crs EPSG:4326 ! sort --method hilbert",
  "gdal_version":"3130000"
}
```