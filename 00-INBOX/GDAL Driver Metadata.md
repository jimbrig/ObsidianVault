---
creation_date: 2026-06-04
modification_date: 2026-06-04
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL Driver Metadata
tags:
  - Type/List
  - Status/Complete
  - Topic/Geospatial
  - Topic/Development
aliases:
  - GDAL Driver Metadata
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Quick Notes

- In [[MOC - R|R]], with the [[R - gdalraster|gdalraster]] package, the `gdalraster::getCreationOptions()` and `gdalraster::validateCreationOptions()` functions will not work for vector [[OGR]] drivers that have `DS_LAYER_CREATIONOPTIONLIST` defined instead of `DMD_CREATIONOPTIONLIST`.

## Driver Metadata

You can see driver-specific metadata via the `gdal --format <format>` CLI command:

```pwsh
➜ gdal --format "ESRI Shapefile"
Format Details:
  Short Name: ESRI Shapefile
  Long Name: ESRI Shapefile
  Supports: Vector
  Extensions: shp dbf shz shp.zip
  Help Topic: drivers/vector/shapefile.html
  Supports: Open() - Open existing dataset.
  Supports: Create() - Create writable dataset.
  Supports: Update
  Supports: Virtual IO - eg. /vsimem/
  Creation Field Datatypes: Integer Integer64 Real String Date
  Creation Field Data Sub-types: Boolean
  Supports: 3D (Z) geometries.
  Supports: Measured (M) geometries.
  Supported SQL dialects: OGRSQL SQLITE
  Supported items for update: Features

<CreationOptionList />


<LayerCreationOptionList>
  <Option name="SHPT" type="string-select" description="type of shape" default="automatically detected">
    <Value>POINT</Value>
    <Value>ARC</Value>
    <Value>POLYGON</Value>
    <Value>MULTIPOINT</Value>
    <Value>POINTZ</Value>
    <Value>ARCZ</Value>
    <Value>POLYGONZ</Value>
    <Value>MULTIPOINTZ</Value>
    <Value>POINTM</Value>
    <Value>ARCM</Value>
    <Value>POLYGONM</Value>
    <Value>MULTIPOINTM</Value>
    <Value>POINTZM</Value>
    <Value>ARCZM</Value>
    <Value>POLYGONZM</Value>
    <Value>MULTIPOINTZM</Value>
    <Value>MULTIPATCH</Value>
    <Value>NONE</Value>
    <Value>NULL</Value>
  </Option>
  <Option name="2GB_LIMIT" type="boolean" description="Restrict .shp and .dbf to 2GB" default="NO" />
  <Option name="ENCODING" type="string" description="DBF encoding" default="LDID/87" />
  <Option name="RESIZE" type="boolean" description="To resize fields to their optimal size." default="NO" />
  <Option name="SPATIAL_INDEX" type="boolean" description="To create a spatial index." default="NO" />
  <Option name="DBF_DATE_LAST_UPDATE" type="string" description="Modification date to write in DBF header with YYYY-MM-DD format" />
  <Option name="AUTO_REPACK" type="boolean" description="Whether the shapefile should be automatically repacked when needed" default="YES" />
  <Option name="DBF_EOF_CHAR" type="boolean" description="Whether to write the 0x1A end-of-file character in DBF files" default="YES" />
</LayerCreationOptionList>

<OpenOptionList>
  <Option name="ENCODING" type="string" description="to override the encoding interpretation of the DBF with any encoding supported by CPLRecode or to &quot;&quot; to avoid any recoding" />
  <Option name="DBF_DATE_LAST_UPDATE" type="string" description="Modification date to write in DBF header with YYYY-MM-DD format" />
  <Option name="ADJUST_TYPE" type="boolean" description="Whether to read whole .dbf to adjust Real-&gt;Integer/Integer64 or Integer64-&gt;Integer field types if possible" default="NO" />
  <Option name="ADJUST_GEOM_TYPE" type="string-select" description="Whether and how to adjust layer geometry type from actual shapes" default="FIRST_SHAPE">
    <Value>NO</Value>
    <Value>FIRST_SHAPE</Value>
    <Value>ALL_SHAPES</Value>
  </Option>
  <Option name="AUTO_REPACK" type="boolean" description="Whether the shapefile should be automatically repacked when needed" default="YES" />
  <Option name="DBF_EOF_CHAR" type="boolean" description="Whether to write the 0x1A end-of-file character in DBF files" default="YES" />
</OpenOptionList>

  Other metadata items:
    GDAL_DMD_GEOMETRY_FLAGS=EquatesMultiAndSingleLineStringDuringWrite EquatesMultiAndSinglePolygonDuringWrite
    GDAL_DCAP_MULTIPLE_VECTOR_LAYERS_IN_DIRECTORY=YES
    GDAL_DMD_ALTER_FIELD_DEFN_FLAGS=Name Type WidthPrecision
```

## API Object Model

The actual underlying registered metadata for a driver retrieved or defined via API uses named fields as follows:

> [!TIP]
> `DCAP_` prefixes stand for *Driver Capabilities* and `DMD_` stands for *Driver Metadata*

- `DCAP_*`: *Driver Capabilities*
	- `DCAP_VECTOR`: Whether the driver handles vector data
	- `DCAP_CREATE_LAYER`
	- `DCAP_DELETE_LAYER`
	- `DCAP_CREATE_FIELD`
	- `DCAP_DELETE_FIELD`
	- `DCAP_REORDER_FIELDS`
	- `DCAP_MEASURED_GEOMETRIES`
	- ``


***

## Appendix

*Note created on [[2026-06-04]] and last modified on [[2026-06-04]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026