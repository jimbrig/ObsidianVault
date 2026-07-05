---
creation_date: 2026-06-18
modification_date: 2026-06-18T19:35:39-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL - Example Large GeoPackage to FlatGeoBuf Pipeline
tags:
  - Type/Code
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
  - Topic/DataEngineering
aliases:
  - Large GeoPackage to FlatGeoBuf GDAL Pipeline
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Inputs

- [LR_PARCEL_NATIONWIDE_FILE_US_2026_Q1.gpkg]()
- [LR_PARCEL_NATIONWIDE_FILE_US_2026_Q2.gpkg]()

### Schemas

```powershell
$gpkg_path_q1 = "G:\SpatialData\parcels\landrecordsus\LR_PARCEL_NATIONWIDE_FILE_US_2026_Q1.gpkg"
$gpkg_path_q2 = "G:\SpatialData\parcels\landrecordsus\LR_PARCEL_NATIONWIDE_FILE_US_2026_Q2.gpkg"

gdal vector info --input $gpkg_path_q1 --format json
```

```json
INFO: Open of `G:\SpatialData\parcels\landrecordsus\LR_PARCEL_NATIONWIDE_FILE_US_2026_Q1.gpkg'
      using driver `GPKG' successful.

Layer name: lr_parcel_us
Metadata:
  DESCRIPTION=Landrecords.us Parcel Layer. Version 2026_Q1
Geometry: Multi Polygon
Feature Count: 154891095
Extent: (-166.841139, 13.235464) - (145.829905, 71.389488)
Layer Coordinate Reference System:
  - name: WGS 84
  - ID: EPSG:4326
  - type: Geographic 2D
  - area of use: World, west -180.00, south -90.00, east 180.00, north 90.00
Data axis to CRS axis mapping: 2,1
FID Column = lrid
Geometry Column NOT NULL = geom
parcelid: String (0.0)
parcelid2: String (0.0)
geoid: String (0.0)
statefp: String (0.0)
countyfp: String (0.0)
taxacctnum: String (0.0)
taxyear: Integer (0.0)
usecode: String (0.0)
usedesc: String (0.0)
zoningcode: String (0.0)
zoningdesc: String (0.0)
numbldgs: Integer (0.0)
numunits: Integer (0.0)
yearbuilt: Integer (0.0)
numfloors: Integer (0.0)
bldgsqft: Integer (0.0)
bedrooms: Integer (0.0)
halfbaths: Integer (0.0)
fullbaths: Integer (0.0)
imprvalue: Integer64 (0.0)
landvalue: Integer64 (0.0)
agvalue: Integer64 (0.0)
totalvalue: Integer64 (0.0)
assdacres: Real (0.0)
saleamt: Integer64 (0.0)
saledate: Date
ownername: String (0.0)
owneraddr: String (0.0)
ownercity: String (0.0)
ownerstate: String (0.0)
ownerzip: String (0.0)
parceladdr: String (0.0)
parcelcity: String (0.0)
parcelstate: String (0.0)
parcelzip: String (0.0)
legaldesc: String (0.0)
township: String (0.0)
section: String (0.0)
qtrsection: String (0.0)
range: String (0.0)
plssdesc: String (0.0)
book: String (0.0)
page: String (0.0)
block: String (0.0)
lot: String (0.0)
updated: String (0.0)
lrversion: String (0.0)
centroidx: Real (0.0)
centroidy: Real (0.0)
surfpointx: Real (0.0)
surfpointy: Real (0.0)
```

```powershell
gdal vector info --input $gpkg_path_q2 --format json
```

```json
INFO: Open of `G:\SpatialData\parcels\landrecordsus\LR_PARCEL_NATIONWIDE_FILE_US_2026_Q2.gpkg'
      using driver `GPKG' successful.

Layer name: lr_parcel_us
Metadata:
  DESCRIPTION=Landrecords.us Nationwide Parcel Layer. Version 2026_Q2
Geometry: Multi Polygon
Feature Count: 157303747
Extent: (-169.011676, -15.386108) - (145.829905, 71.361413)
Layer Coordinate Reference System:
  - name: WGS 84
  - ID: EPSG:4326
  - type: Geographic 2D
  - area of use: World, west -180.00, south -90.00, east 180.00, north 90.00
Data axis to CRS axis mapping: 2,1
FID Column = fid
Geometry Column NOT NULL = geom
lrid: String (0.0)
parcelid: String (0.0)
parcelid2: String (0.0)
ogparcelid: String (0.0)
ogparcelid2: String (0.0)
parentid: String (0.0)
stackid: String (0.0)
geoid: String (0.0)
statefp: String (0.0)
countyfp: String (0.0)
countyname: String (0.0)
cousubfp: String (0.0)
cousubname: String (0.0)
tractce: String (0.0)
tractname: String (0.0)
taxacctnum: String (0.0)
taxyear: Integer (0.0)
taxdistrict: String (0.0)
usecode: String (0.0)
usedesc: String (0.0)
zoningcode: String (0.0)
zoningdesc: String (0.0)
numbldgs: Integer (0.0)
numunits: Integer (0.0)
yearbuilt: Integer (0.0)
numfloors: Integer (0.0)
bldgsqft: Integer (0.0)
bedrooms: Integer (0.0)
halfbaths: Integer (0.0)
fullbaths: Integer (0.0)
imprvalue: Integer64 (0.0)
landvalue: Integer64 (0.0)
agvalue: Integer64 (0.0)
totalvalue: Integer64 (0.0)
taxacres: Real (0.0)
calcarea: Real (0.0)
saleamt: Integer64 (0.0)
saledate: Date
ownertype: String (0.0)
ownername: String (0.0)
owneraddr: String (0.0)
ownercity: String (0.0)
ownerstate: String (0.0)
ownerzip: String (0.0)
parceladdr: String (0.0)
parcelcity: String (0.0)
parcelstate: String (0.0)
parcelzip: String (0.0)
legaldesc: String (0.0)
township: String (0.0)
section: String (0.0)
qtrsection: String (0.0)
range: String (0.0)
plssdesc: String (0.0)
book: String (0.0)
page: String (0.0)
block: String (0.0)
lot: String (0.0)
parceltype: String (0.0)
accesstype: String (0.0)
iucnclass: String (0.0)
placename: String (0.0)
placetype: String (0.0)
firmid: String (0.0)
firmdate: Date
fldzone: String (0.0)
zonesubty: String (0.0)
staticbfe: Real (0.0)
elevmin: Real (0.0)
elevmax: Real (0.0)
elevavg: Real (0.0)
fireplaces: Integer (0.0)
heating: String (0.0)
heatfuel: String (0.0)
cooling: String (0.0)
foundation: String (0.0)
roofcover: String (0.0)
siding: String (0.0)
bldgtype: String (0.0)
naicscode: String (0.0)
frsid: String (0.0)
dfrurl: String (0.0)
caapermit: String (0.0)
cwapermit: String (0.0)
rcrapermit: String (0.0)
updated: Date
centroidx: Real (0.0)
centroidy: Real (0.0)
surfpointx: Real (0.0)
surfpointy: Real (0.0)
extras: String(JSON) (0.0)
lrversion: String (0.0)
```

## Output Schemas & SQL

These pipelines will apply only the "minimal schema" against the original `gpkg` data, i.e. the unique identifiers and the geometries:

- `source_fid` (`lrid` in `gpkg1` and `FID` in `gpkg2`; unique primary key identifier from the initial version's assigned GDAL `FID`)
- `geoid` (`state_fips` + `county_fips`, 5-digits)
- `state_fips` (from `statefp`, 2-digits)
- `county_fips` (from `county_fips`, 3-digits)
- `geometry` (from `geom` in `gpkg`; reprojected to `EPSG:4326` and dropped empty/invalid where cannot be made valid)

SQL Used in v1:

```sql
SELECT 
  CAST(rowid AS INTEGER) AS source_fid,
  geoid AS geoid,
  statefp AS state_fips,
  countyfp AS county_fips, 
  geom AS geom 
FROM _ogr_layer_
WHERE NOT ST_IsEmpty(geom)
```

SQL Used in v2:

```sql
SELECT 
  CAST(rowid AS INTEGER) AS source_fid,
  lrid AS lrid,
  geoid AS geoid,
  statefp AS state_fips,
  countyfp AS county_fips, 
  geom AS geom 
FROM _ogr_layer_
WHERE NOT ST_IsEmpty(geom)
```

## Pipelines

Example pipeline (`q2`) for a random state FIPS, i.e. `13`:

```powershell
$selected_state_fips = '13'
$gpkg_path = "G:\SpatialData\parcels\landrecordsus\LR_PARCEL_NATIONWIDE_FILE_US_2026_Q2.gpkg"
$gpkg_layer = "lr_parcel_us" # $(gdal vector info $gpkg_path --format json | jq .layers.[].name)
$gpkg_state_filt = "statefp = '$selected_state_fips'"
$gpkg_sql = @"
SELECT 
  CAST(rowid AS INTEGER) AS source_fid,
  geoid AS geoid,
  statefp AS state_fips,
  countyfp AS county_fips, 
  geom AS geom 
FROM ${gpkg_layer}
WHERE NOT ST_IsEmpty(geom)
"@

$fgb_path = "G:\SpatialData\parcels\flatgeobuf\state_fips=${selected_state_fips}\parcels.q2.min.fgb"
$fgb_layer = "parcels"

$gdalg_path = "G:\SpatialData\parcels\flatgeobuf\state_fips=${selected_state_fips}\parcels.q2.min.fgb.gdalg.json"
$log_path = "G:\SpatialData\parcels\flatgeobuf\state_fips=${selected_state_fips}\parcels.q2.min.fgb.gdal.log"

gdal vector pipeline `
  ! read --input $gpkg_path --input-layer $gpkg_layer --input-format "GPKG" `
    --open-option "LIST_ALL_TABLES=NO" `
    --open-option "PRELUDE_STATEMENTS=PRAGMA cache_size=-4000000;PRAGMA temp_store=MEMORY; PRAGMA mmap_size=8589934592;" `
  ! filter --where $gpkg_state_filt `
  ! sql --sql $gpkg_sql --dialect SQLITE `
  ! make-valid `
  ! set-geom-type --multi --skip `
  ! reproject --output-crs "EPSG:4326" `
  ! sort --method hilbert `
  ! write --output $gdalg_path --output-format "GDALG" --overwrite
```

produces the `GDALG`, `parcels.q2.min.fgb.gdalg.json`:

```json
{
  "type":"gdal_streamed_alg",
  "command_line":"gdal vector pipeline read --input-format GPKG --open-option LIST_ALL_TABLES=NO --open-option \"PRELUDE_STATEMENTS=PRAGMA cache_size=-4000000;PRAGMA temp_store=MEMORY; PRAGMA mmap_size=8589934592;\" --input \"G:\\\\SpatialData\\\\parcels\\\\landrecordsus\\\\LR_PARCEL_NATIONWIDE_FILE_US_2026_Q2.gpkg\" --input-layer lr_parcel_us ! filter --where \"statefp = '13'\" ! sql --sql \"SELECT CAST(rowid AS INTEGER) AS source_fid, geoid AS geoid, statefp AS state_fips, countyfp AS county_fips, geom AS geom FROM lr_parcel_us WHERE NOT ST_IsEmpty(geom)\" --dialect SQLITE ! make-valid ! set-geom-type --multi --skip ! reproject --output-crs EPSG:4326 ! sort --method hilbert",
  "gdal_version":"3130100"
}
```

then, perform actual conversion via the serialized `GDALG`:

```powershell
gdal vector convert `
  --config "GDAL_NUM_THREADS=ALL_CPUS" --config "GDAL_ALGORITHM_ALLOW_WRITES_IN_STREAM=YES" `
  --config "CPL_LOG=${log_path}" --config "CPL_DEBUG=ON" --config "CPL_LOG_ERRORS=ON" --config "CPL_TIMESTAMP=ON" `
  --input $gdalg_path --input-format "GDALG" `
  --output $fgb_path --output-format "FlatGeobuf" --output-layer $fgb_layer `
  --lco "SPATIAL_INDEX=YES" `
  --lco "TITLE=LandRecords.us Parcels Data for State FIPS ${selected_state_fips}" `
  --lco "DESCRIPTION=Processed minimal schema parcels for state FIPS ${selected_state_fips} for Q2"
```
