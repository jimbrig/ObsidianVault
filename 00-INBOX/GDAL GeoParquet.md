---
creation_date: 2026-06-15
modification_date: 2026-06-15T19:42:03-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL GeoParquet
tags:
  - Type/Guide
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
  - Topic/DataEngineering
aliases:
  - GDAL GeoParquet
---

```
--layer-creation-option "COMPRESSION=ZSTD"
--layer-creation-option "COMPRESSION_LEVEL=15"
--layer-creation-option "GEOMETRY_ENCODING=WKB"
```

### Compression (`COMPRESSION`)

- `NONE`
- `UNCOMPRESSED`
- `SNAPPY`
- `BROTLI`
- `ZSTD`
- `LZ4_RAW`
- `LZ4_HADOOP`

### Compression Level (`COMPRESSION_LEVEL`)

Run `gdal --format Parquet` and see the XML for the Open Option values:

```powershell
➜ gdal --format Parquet | Select-String "COMPRESSION_LEVEL"

<Option name="COMPRESSION_LEVEL" type="int" min="-131072" max="22" description="Compression level, codec dependent.
GZIP: [1,9], default=9. BROTLI: [0,11], default=8. ZSTD: [-131072,22], default=9. LZ4_RAW: [1,12], default=1."
default="-1" />
```




> [!SOURCE]
> [(Geo)Parquet Driver - Layer Creation Options | GDAL](https://gdal.org/en/stable/drivers/vector/parquet.html#layer-creation-options)

Layer creation options can be specified in command-line tools using the syntax `-lco <NAME>=<VALUE>` or by providing the appropriate arguments to [`GDALDatasetCreateLayer()`](https://gdal.org/en/stable/api/raster_c_api.html#_CPPv422GDALDatasetCreateLayer12GDALDatasetHPKc20OGRSpatialReferenceH18OGRwkbGeometryType12CSLConstList "GDALDatasetCreateLayer") (C) or [`Dataset.CreateLayer`](https://gdal.org/en/stable/api/python/raster_api.html#osgeo.gdal.Dataset.CreateLayer "osgeo.gdal.Dataset.CreateLayer") (Python). The following layer creation options are supported:

- **COMPRESSION=[NONE​/​UNCOMPRESSED​/​SNAPPY​/​GZIP​/​BROTLI​/​ZSTD​/​LZ4_RAW​/​LZ4_HADOOP]:**
    
    Compression method. Available values depend on how the Parquet library was compiled. Defaults to SNAPPY when available, otherwise NONE.
    
- **COMPRESSION_LEVEL=<integer>:** (GDAL >= 3.12) Specify the compression level for the selected compression method. The compression level has a different meaning for each codec. The description of this option, returned at runtime for example by `ogrinfo --format PARQUET`, gives the range and default value for each codec.
    
- **GEOMETRY_ENCODING=[WKB​/​WKT​/​GEOARROW​/​GEOARROW_INTERLEAVED]:** Defaults to `WKB`. Geometry encoding. WKB is the default and recommended choice for maximal interoperability. WKT is _not_ allowed by the GeoParquet specification, but are handled as an extension. As of GDAL 3.9, GEOARROW uses the GeoParquet 1.1 GeoArrow "struct" based encodings (where points are modeled as a struct field with a x and y subfield, lines are modeled as a list of such points, etc.). The GEOARROW_INTERLEAVED option has been renamed in GDAL 3.9 from what was named GEOARROW in previous versions, and uses an encoding where points uses a FixedSizedList of (x,y), lines a variable-size list of such FixedSizedList of points, etc. This GEOARROW_INTERLEAVED encoding is not part of the official GeoParquet specification, and its use is not encouraged.
    
- **ROW_GROUP_SIZE=<integer>:** Defaults to `65536`. Maximum number of rows per group.
    
- **GEOMETRY_NAME=value:** Defaults to `geometry`. Name of geometry column.
    
- **FID=value:** Name of the FID (Feature Identifier) column to create. If none is specified, no FID column is created. Note that if using ogr2ogr with the Parquet driver as the target driver and a source layer that has a named FID column, this FID column name will be automatically used to set the FID layer creation option of the Parquet driver (unless `-lco FID=` is used to set an empty name)
    
- **POLYGON_ORIENTATION=[COUNTERCLOCKWISE​/​UNMODIFIED]:** Defaults to `COUNTERCLOCKWISE`. Whether exterior rings of polygons should be counterclockwise oriented (and interior rings clockwise oriented), or left to their original orientation.
    
- **EDGES=[PLANAR​/​SPHERICAL]:** Defaults to `PLANAR`. How to interpret the edges of the geometries: whether the line between two points is a straight cartesian line (PLANAR) or the shortest line on the sphere (geodesic line) (SPHERICAL).
    
- **CREATOR=value:** Name of creating application.
    
- **WRITE_COVERING_BBOX=[AUTO​/​YES​/​NO]:** (GDAL >= 3.9) Defaults to `AUTO`. Whether to write xmin/ymin/xmax/ymax columns with the bounding box of geometries. Writing the geometry bounding box may help applications to perform faster spatial filtering. Writing a geometry bounding box is less necessary for the GeoArrow geometry encoding than for the default WKB, as implementations may be able to directly use the geometry columns.
    
    If the [`USE_PARQUET_GEO_TYPES`](https://gdal.org/en/stable/drivers/vector/parquet.html#drivers/vector/parquet-lco-USE_PARQUET_GEO_TYPES) layer creation option is set to `ONLY`, and [`WRITE_COVERING_BBOX`](https://gdal.org/en/stable/drivers/vector/parquet.html#drivers/vector/parquet-lco-WRITE_COVERING_BBOX) is set or let to its default `AUTO` value, no covering bounding box columns is written.
    
- **COVERING_BBOX_NAME=<string>:** (GDAL >= 3.13) Name of the bounding box of geometries Only used if [`WRITE_COVERING_BBOX`](https://gdal.org/en/stable/drivers/vector/parquet.html#drivers/vector/parquet-lco-WRITE_COVERING_BBOX) is set. If not set, it defaults to the geometry column name, suffixed with `_bbox`.
    
- **USE_PARQUET_GEO_TYPES=[YES​/​NO​/​ONLY]:** (GDAL >= 3.12) Defaults to `NO`. Only available with libarrow >= 21.
    
    Whether to use Parquet Geometry/Geography logical types (introduced in libarrow 21), when using the default GEOMETRY_ENCODING=WKB encoding.
    
    - `YES`: use the Geometry logical type (or the Geography one if the EDGES=SPHERICAL creation option is also set), and also write file-level GeoParquet metadata. Such files can be read by older GDAL, but require libarrow >= 20.
        
    - `NO` (default): only file-level GeoParquet metadata is written. Such files can be read by older GDAL and libarrow versions.
        
    - `ONLY`: use the Geometry logical type (or the Geography one if the EDGES=SPHERICAL creation option is also set), but do not write file-level GeoParquet metadata. Such files will only be fully compatible of GDAL >= 3.12 and libarrow >= 21. With libarrow 20, the geometry column of such files will only be recognized if it is among one of the GEOM_POSSIBLE_NAMES open option value, and the CRS of such files will not be recognized. With older libarrow, such files cannot be opened at all.
        
    
- **SORT_BY_BBOX=[YES​/​NO]:** (GDAL >= 3.9) Defaults to `NO`. Whether features should be sorted based on the bounding box of their geometries, before being written in the final file. Sorting them enables faster spatial filtering on reading, by grouping together spatially close features in the same group of rows.
    
    Note however that enabling this option involves creating a temporary GeoPackage file (in the same directory as the final Parquet file), and thus requires temporary storage (possibly up to several times the size of the final Parquet file, depending on Parquet compression) and additional processing time.
    
    The efficiency of spatial filtering depends on the ROW_GROUP_SIZE. If it is too large, too many features that are not spatially close will be grouped together. If it is too small, the file size will increase, and extra processing time will be necessary to browse through the row groups.
    
    Note also that when this option is enabled, the Arrow writing API (which is for example triggered when using ogr2ogr to convert from Parquet to Parquet), fallbacks to the generic implementation, which does not support advanced Arrow types (lists, maps, etc.).
    
- **TIMESTAMP_WITH_OFFSET=[AUTO​/​YES​/​NO]:** (GDAL >= 3.13) Defaults to `AUTO`. Whether OGR datetime fields should be written as Arrow timestamp with offset fields, following the [Timestamp With Offset extension](https://github.com/apache/arrow/blob/main/docs/source/format/CanonicalExtensions.rst#timestamp-with-offset) specification. Such fields store both the datetime as a timestamp expressed in the UTC timezone and the offset to UTC of the timezone in which the datetime is defined. In AUTO mode, they are used as soon as a DateTime field reports a mixed time zone flag (i.e. [`OGRFieldDefn::GetTZFlag()`](https://gdal.org/en/stable/api/ogrfeature_cpp.html#_CPPv4NK12OGRFieldDefn9GetTZFlagEv "OGRFieldDefn::GetTZFlag") returns `OGR_TZFLAG_MIXED_TZ`). As few drivers are able to automatically set this flag, it may be useful to override the flag by setting this option to YES. Setting it to NO forces the use of a DateTime field with the UTC timezone.