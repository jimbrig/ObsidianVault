---
creation_date: 2026-05-18
modification_date: 2026-05-18
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GeoPackage
tags:
  - Type/Note
  - Status/WIP
  - Topic/Geospatial
aliases:
  - GeoPackage
  - GPKG
  - gpkg
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Specification

> [!SOURCE]
> - [GeoPackage Standard – Open SQLite Format for Geospatial Data](https://www.ogc.org/standards/geopackage/)
> - [OGC GeoPackage Encoding Standard](https://www.geopackage.org/spec140/index.html)
> - [Release Notes for OGC GeoPackage 1.4.0](https://docs.ogc.org/is/12-128r19/23-018r1.html)

The [[Open Geospatial Consortium (OGC)]] provides the underlying standard for the GeoPackage format specification. It is an encoding standard describing the rules and conventions necessary in order to *conform* to the GeoPackage specification. 

GeoPackage is [[SQLite]] under the hood.

## Metadata Tables

The GeoPackage is expected to contain the following metadata tables/views:

- `gpkg_contents`: provides a list of all geospatial contents in a GeoPackage. Used for identification and descriptive information that an application can display to a user as a menu of geospatial data that is available for access and/or update. 

- `gpkg_geometry_columns`: 

- `gpkg_spatial_ref_sys`: 

### `gpkg_contents` Table

> [!SOURCE]
> [gpkg_contents Table Definition SQL DDL](https://www.geopackage.org/spec140/index.html#gpkg_contents_sql)

The `gpkg_contents` table is intended to provide a list of all geospatial contents (i.e., entity stores) in a GeoPackage. It provides identifying and descriptive information that an application can display to a user as a menu of geospatial data that is available for access and/or update.

Table Definition:

| Column Name   | Type     | Description                                                  | Null | Default                                 | Key  |
| :------------ | :------- | :----------------------------------------------------------- | :--- | :-------------------------------------- | :--- |
| `table_name`  | TEXT     | The name of the actual content (e.g., tiles, features, or attributes) table or view | no   |                                         | PK   |
| `data_type`   | TEXT     | Type of data stored in the table or view                     | no   |                                         |      |
| `identifier`  | TEXT     | A human-readable identifier (e.g. short name) for the table_name content | yes  |                                         | UK   |
| `description` | TEXT     | A human-readable description for the table_name content      | yes  | ''                                      |      |
| `last_change` | DATETIME | timestamp of last change to content, in ISO 8601 format      | no   | `strftime('%Y-%m-%dT%H:%M:%fZ', 'now')` |      |
| `min_x`       | DOUBLE   | Bounding box minimum easting or longitude for all content in table_name. If tiles, this is informational and the tile matrix set should be used for calculating tile coordinates. | yes  |                                         |      |
| `min_y`       | DOUBLE   | Bounding box minimum northing or latitude for all content in table_name. If tiles, this is informational and the tile matrix set should be used for calculating tile coordinates. | yes  |                                         |      |
| `max_x`       | DOUBLE   | Bounding box maximum easting or longitude for all content in table_name. If tiles, this is informational and the tile matrix set should be used for calculating tile coordinates. | yes  |                                         |      |
| `max_y`       | DOUBLE   | Bounding box maximum northing or latitude for all content in table_name. If tiles, this is informational and the tile matrix set should be used for calculating tile coordinates. | yes  |                                         |      |
| `srs_id`      | INTEGER  | Spatial Reference System ID: `gpkg_spatial_ref_sys.srs_id`   | yes  |                                         | FK   |

SQL DDL:

```sql
CREATE TABLE gpkg_contents (
  table_name TEXT NOT NULL PRIMARY KEY,
  data_type TEXT NOT NULL,
  identifier TEXT UNIQUE,
  description TEXT DEFAULT '',
  last_change DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  min_x DOUBLE,
  min_y DOUBLE,
  max_x DOUBLE,
  max_y DOUBLE,
  srs_id INTEGER,
  CONSTRAINT fk_gc_r_srs_id FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys(srs_id)
);
```

### `gpkg_geometry_columns` Table

> [!SOURCE]
> [gpkg_geometry_columns Table Definition SQL DDL](https://www.geopackage.org/spec140/index.html#gpkg_geometry_columns)

A GeoPackage with a `gpkg_contents` table row with a "features" `data_type` SHALL contain a `gpkg_geometry_columns` table per [Table 5](https://www.geopackage.org/spec140/index.html#gpkg_geometry_columns_cols) and [gpkg_geometry_columns Table Definition SQL](https://www.geopackage.org/spec140/index.html#gpkg_geometry_columns_sql).

The second component of the SQL schema for vector features in a GeoPackage is a `gpkg_geometry_columns` table that identifies the geometry columns and geometry types in tables that contain user data representing features.

Table Definition:

| Column Name          | Type    | Description                                                  | Null | Key    |
| :------------------- | :------ | :----------------------------------------------------------- | :--- | :----- |
| `table_name`         | TEXT    | Name of the table containing the geometry column             | no   | PK, FK |
| `column_name`        | TEXT    | Name of a column in the feature table that is a Geometry Column | no   | PK     |
| `geometry_type_name` | TEXT    | Name from [Table 21](https://www.geopackage.org/spec140/index.html#geometry_types_core) or [Table 22](https://www.geopackage.org/spec140/index.html#geometry_types_extension) in [Geometry Types (Normative)](https://www.geopackage.org/spec140/index.html#geometry_types) | no   |        |
| `srs_id`             | INTEGER | Spatial Reference System ID: `gpkg_spatial_ref_sys.srs_id`   | no   | FK     |
| `z`                  | TINYINT | 0: z values prohibited; 1: z values mandatory; 2: z values optional | no   |        |
| `m`                  | TINYINT | 0: m values prohibited; 1: m values mandatory; 2: m values optional | no   |        |

SQL DDL:

```sql
CREATE TABLE gpkg_geometry_columns (
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  geometry_type_name TEXT NOT NULL,
  srs_id INTEGER NOT NULL,
  z TINYINT NOT NULL,
  m TINYINT NOT NULL,
  CONSTRAINT pk_geom_cols PRIMARY KEY (table_name, column_name),
  CONSTRAINT uk_gc_table_name UNIQUE (table_name),
  CONSTRAINT fk_gc_tn FOREIGN KEY (table_name) REFERENCES gpkg_contents(table_name),
  CONSTRAINT fk_gc_srs FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys (srs_id)
);
```

### `gpkg_spatial_ref_sys` Table

> [!SOURCE]
> [gpkg_spatial_ref_sys Table Definition](https://www.geopackage.org/spec140/index.html#spatial_ref_sys_data_table_definition)
> [gpkg_spatial_ref_sys Table SQL](https://www.geopackage.org/spec140/index.html#_gpkg_spatial_ref_sys)

A table named `gpkg_spatial_ref_sys` is the first component of the standard SQL schema for simple features described in clause [Simple Features SQL Introduction](https://www.geopackage.org/spec140/index.html#sfsql_intro). The [[Spatial Reference System (SRS)]] definitions it contains are referenced by the GeoPackage `gpkg_contents` and `gpkg_geometry_columns` tables to relate the vector and tile data in user tables to locations on the earth.

The `gpkg_spatial_ref_sys` table includes the columns specified in [SQL/MM (ISO 13249-3)](https://www.geopackage.org/spec140/index.html#I12) and shown in [gpkg_spatial_ref_sys_cols](https://www.geopackage.org/spec140/index.html#gpkg_spatial_ref_sys_cols) containing data that defines spatial reference systems. 

Table Definition:

| Column Name                | Column Type | Column Description                                           | NOT NULL flag | Key  |
| :------------------------- | :---------- | :----------------------------------------------------------- | :------------ | :--- |
| `srs_name`                 | TEXT        | Human readable name of this SRS                              | true          |      |
| `srs_id`                   | INTEGER     | Unique identifier for each Spatial Reference System within a GeoPackage | true          | PK   |
| `organization`             | TEXT        | Case-insensitive name of the defining organization e.g. EPSG or epsg | true          |      |
| `organization_coordsys_id` | INTEGER     | Numeric ID of the Spatial Reference System assigned by the organization | true          |      |
| `definition`               | TEXT        | Well-known Text [[I32\]](https://www.geopackage.org/spec140/index.html#I32) Representation of the Spatial Reference System | true          |      |
| `description`              | TEXT        | Human readable description of this SRS                       | false         |      |%%  %%

SQL DDL:

```sql
CREATE TABLE gpkg_spatial_ref_sys (
  srs_name TEXT NOT NULL,
  srs_id INTEGER PRIMARY KEY,
  organization TEXT NOT NULL,
  organization_coordsys_id INTEGER NOT NULL,
  definition  TEXT NOT NULL,
  description TEXT
);
```

## Geometry Encoding

> [!SOURCE]
> [GeoPackage SQL Geometry Binary Format](https://www.geopackage.org/spec140/index.html#gpb_spec)
> [BLOB Format](https://www.geopackage.org/spec140/index.html#gpb_data_blob_format)

The GeoPackage's geometries are binary BLOB formats that have a custom encoding specific to the GeoPackage specification:

> A GeoPackage SHALL store feature table geometries with or without optional elevation (Z) and/or measure (M) values in SQL BLOBs using the Standard **GeoPackageBinary** format specified in table [GeoPackage SQL Geometry Binary Format](https://www.geopackage.org/spec140/index.html#gpb_spec) and clause [BLOB Format](https://www.geopackage.org/spec140/index.html#gpb_data_blob_format).

the binary format is as follows:

```plaintext
GeoPackageBinaryHeader {
  byte[2] magic = 0x4750;                 (1)
  byte version;                           (2)
  byte flags;                             (3)
  int32 srs_id;                           (4)
  double[] envelope;                      (5)
}

StandardGeoPackageBinary {                
  GeoPackageBinaryHeader header;          
  WKBGeometry geometry;                   (6)
}
```

where,

- (1): "GP" is [[ASCII]]
- (2): 8-bit unsigned integer, 0 = version 1
- (3): see [bit layout of GeoPackageBinary flags byte](https://www.geopackage.org/spec140/index.html#flags_layout)
- (4): the SRS ID, with the [[endianness]] specified by the *byte order* flag
- (5): see *envelope contents indicator code* below, with the endianness specified by the *byte order* flag
- (6): per [OGC 06-103r4](http://portal.opengeospatial.org/files/?artifact_id=25355)

> [!IMPORTANT]
> *The axis order in [[Well Known Binary (WKB)|WKB]] stored in a GeoPackage follows the de facto standard for axis order in WKB and is therefore always `(x,y{,z}{,m})` where x is easting or longitude, y is northing or latitude, z is optional elevation, and m is optional measure. This ordering explicitly overrides the axis order as specified in the SRS metadata, applying Case 4 from [OGC 08-038r7, Revision to Axis Order Policy and Recommendations](https://www.geopackage.org/spec140/index.html#K11). This was done to maintain consistency with previous implementations of WKB that predated the OGC policy.*

The bit layout of the GeoPackageBinary flags byte:

```plaintext
bit  7  6  5  4  3  2  1  0
use  R  R  X  Y  E  E  E  B
```

**flag bits use:**

- R: reserved for future use; set to 0
- X: GeoPackageBinary type
    - 0: StandardGeoPackageBinary. For all core and extended geometry types. See [Geometry Types (Normative)](https://www.geopackage.org/spec140/index.html#geometry_types).
    - 1: ExtendedGeoPackageBinary. For user-defined geometry types. See [User Defined Geometry Types Extension of GeoPackageBinary Geometry Encoding](https://www.geopackage.org/spec140/index.html#extension_geometry_encoding).
- Y: empty geometry flag
    - 0: non-empty geometry 
    - 1: empty geometry
- E: envelope contents indicator code (3-bit unsigned integer)
    - 0: no envelope (space saving slower indexing option), 0 bytes
    - 1: envelope is [minx, maxx, miny, maxy], 32 bytes
    - 2: envelope is [minx, maxx, miny, maxy, minz, maxz], 48 bytes
    - 3: envelope is [minx, maxx, miny, maxy, minm, maxm], 48 bytes
    - 4: envelope is [minx, maxx, miny, maxy, minz, maxz, minm, maxm], 64 bytes
    - 5-7: invalid
- B: byte order for SRS_ID and envelope values in header (1-bit Boolean)
    - 0: Big Endian (most significant byte first)
    - 1: Little Endian (least significant byte first)   

> [!IMPORTANT]
> *The endianness specified by the B flag technically only pertains to header values, and not to the endianness of the WKBGeometry values themselves. The WKBGeometry has its own endianness flag as described in OGC 06-103r4. These values SHOULD be the same for consistency reasons.*


## GDAL Driver

> [!SOURCE]
> [GPKG - GeoPackage Vector | GDAL documentation](https://gdal.org/en/stable/drivers/vector/gpkg.html)