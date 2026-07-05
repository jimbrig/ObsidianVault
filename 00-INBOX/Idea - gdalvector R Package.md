---
creation_date: 2026-05-24
modification_date: 2026-05-24
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: gisdata - Ideas
tags:
  - Type/Code
  - Status/Ongoing
  - Topic/R
  - Topic/Geospatial
aliases:
  - gisdata - Ideas
---

- create a [[Seek Optimized Zip (sozip)]] for a single state's full [[GeoPackage]]
- test out leveraging [`gdal vector index`](https://gdal.org/en/stable/programs/gdal_vector_index.html)
- difference between using `tee [ ... ]` with `/vsimem/` writes vs. [`materialize`](https://gdal.org/en/stable/programs/gdal_vector_materialize.html)
- [`gdal vector concat`](https://gdal.org/en/stable/programs/gdal_vector_concat.html) as an alternative entrypoint to [`! read ...`](https://gdal.org/en/stable/programs/gdal_vector_read.html)

## `gpkg` Schema



## `gpkg` Spatial Index Check

Testing `gdalraster`'s [[GDAL]] bindings have [[Spatialite]] support:

```R
gdalraster::has_spatialite()
```

Testing `gpkg` has a [[Spatial Index]]:

```sql
SELECT HasSpatialIndex('<layer>', '<geom>') AS has_spatial_index;
```

```sh
gdal vector info \
  --config "CPL_DEBUG=ON" --config "CPL_LOG_ERRORS=ON" --config "GDAL_NUM_THREADS=ALL_CPUS" --config "OGR_GPKG_NUM_THREADS=4" \
  --oo "LIST_ALL_TABLES=NO" \
  --oo "PRELUDE_STATEMENTS=PRAGMA cache_size=-4000000;PRAGMA temp_store=MEMORY; PRAGMA mmap_size=8589934592;" \
  --input "C:/GEODATA/LR_PARCEL_NATIONWIDE_FILE_US_2026_Q1.gpkg" \
  --features \
  --sql "SELECT HasSpatialIndex('lr_parcel_us', 'geom') AS has_spatial_index" --dialect SQLITE \
  --format json
```

## Geometry Emptiness & Validity

- `ST_IsValid(geom)`
- `ST_IsValidReason(geom)`
- `ST_MakeValid(geom)`
- `ST_IsEmpty(geom)`
- `ST_AsText(geom)`


> [!TIP] TIP
> Since GDAL 3.13, the geometry conversion between the [[GeoPackage]] standard's blob format and [[Spatialite]] blob format is **automatic and implicit**, i.e. the use of `AsGPB()` is no longer needed.

The goal is to have preliminary diagnostic steps performed against the source data to determine what initial records have empty or invalid geometries up-front.

First, we will filter for a specific state by [[Federal Information Processing Standards (FIPS)]] code and then use [`gdal vector sql`](https://gdal.org/en/stable/programs/gdal_vector_sql.html) to get the state's records and [[FID]]s that contain non-null, but empty geometries:

To accomplish this we will use this SQL expression:

```sql
SELECT 
  CAST(rowid AS INTEGER) AS source_fid,
  geoid AS geoid,
  statefp AS state_fips,
  countyfp AS county_fips,
  ST_AsText(geom) AS geom_wkt,
  'Empty Geometry' AS invalid_reason
FROM lr_parcel_us 
WHERE ST_IsEmpty(geom)
```

a couple things to note from this:

- the use of `CAST(rowid AS INTEGER) AS source_fid,` is a trick to workaround the fact that *GDAL treats the source's `FID` field as unqueryable as an attribute in the SQL expression*, and therefore, `rowid` is used instead and I explicitly `CAST` it to ensure it ends up as an attribute in the resulting output layer.

```sql
"C:/gdal-ucrt64/bin/gdal.exe" vector pipeline --progress --config "CPL_DEBUG=ON" --config \
  "CPL_LOG_ERRORS=ON" --config "GDAL_NUM_THREADS=ALL_CPUS" --config "OGR_GPKG_NUM_THREADS=4" "!" read \
  "C:/GEODATA/LR_PARCEL_NATIONWIDE_FILE_US_2026_Q1.gpkg" --layer lr_parcel_us --oo "LIST_ALL_TABLES=NO" --oo \
  "PRELUDE_STATEMENTS=PRAGMA cache_size=-4000000;PRAGMA temp_store=MEMORY; PRAGMA mmap_size=8589934592;" "!" \
  filter --where "statefp = '13'" "!" sql --sql \
  "" \
  --dialect SQLITE "!" write --output /vsistdout/ --output-format CSV

```


Consolidate reconciliation steps into more streamlined single steps:

```
```