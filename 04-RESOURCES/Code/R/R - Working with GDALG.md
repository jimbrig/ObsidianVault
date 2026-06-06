---
creation_date: 2026-05-25
modification_date: 2026-05-25
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - Working with GDALG
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Geospatial
aliases:
  - Working with GDALG in R
---

- [RFC 104: Adding a "gdal" front-end command line interface — GDAL documentation](https://gdal.org/en/stable/development/rfc/rfc104_gdal_cli.html)

```R
new_gdalg <- function(cmd, relative_paths = TRUE) {
    
}
```

Primary Backend: [[R - gdalraster|gdalraster]]

```R
require(gdalraster)

# check GDALG driver
gdalraster::gdal_get_driver_md("GDALG")
# $DCAP_RASTER
# [1] "YES"
# 
# $DCAP_VECTOR
# [1] "YES"
# 
# $DMD_LONGNAME
# [1] "GDAL Streamed Algorithm driver"
# 
# $DMD_EXTENSION
# [1] "gdalg.json"
# 
# $DMD_EXTENSIONS
# [1] "gdalg.json"
# 
# $DCAP_MEASURED_GEOMETRIES
# [1] "YES"
# 
# $DCAP_CURVE_GEOMETRIES
# [1] "YES"
# 
# $DCAP_Z_GEOMETRIES
# [1] "YES"
# 
# $DCAP_VIRTUALIO
# [1] "YES"
# 
# $DCAP_OPEN
# [1] "YES"
```
