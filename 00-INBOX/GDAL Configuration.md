---
creation_date: 2026-06-05
modification_date: 2026-06-18T19:02:51-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL Configuration
tags:
  - Type/Reference
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
aliases:
  - GDAL Configuration
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - https://gdal.org/en/stable/user/configoptions.html

## Global Configuration Options

### Logging

- **`CPL_CURL_VERBOSE=[YES​/​NO]`:** Set to "YES" to get the curl library to display a lot of verbose information about its operations. Very useful for `libcurl` and/or protocol debugging and understanding.
- **`CPL_DEBUG=[ON​/​OFF​/​<PREFIX>]`:** This may be set to ON, OFF or specific prefixes. If it is ON, all debug messages are reported to `stdout`. If it is OFF or unset no debug messages are reported. If it is set to a particular value, then only debug messages with that "type" value will be reported. For instance debug messages from the HFA driver are normally reported with type "HFA" (seen in the message). At the commandline this can also be set with `--debug <value>` as well as with `--config CPL_DEBUG <value>`.
- **`CPL_LOG=<path>`:** This is used for setting the log file path.
- **`CPL_LOG_ERRORS=[ON​/​OFF]`:** Set to "ON" for printing error messages. Use together with "CPL_LOG" for directing them into a file. 
- **`CPL_TIMESTAMP=[ON​/​OFF]`:** Set to "ON" to add timestamps to CPL debug messages (so assumes that [`CPL_DEBUG`](https://gdal.org/en/stable/user/configoptions.html#config-CPL_DEBUG) is enabled)
- **`CPL_MAX_ERROR_REPORTS=value`:**
- **`CPL_ACCUM_ERROR_MSG=value`:**

Notes:

For robust use-cases a decent default is something like:

```sh
export CPL_DEBUG='ON'
export CPL_TIMESTAMP='YES'
export CPL_LOG_ERRORS='ON'
export CPL_LOG='gdal.log'
```

The last two options do not have any definitions in the official GDAL documentation, but I would be interested in the accumulated error message option and how it works.

### Performance and Caching

- **`GDAL_NUM_THREADS=[ALL_CPUS​/​<integer>]`:** Sets the number of worker threads to be used by GDAL operations that support multithreading. The default value depends on the context in which it is used.

- **`GDAL_CACHEMAX=<size>`:** Defaults to `5%`. Controls the default GDAL raster block cache size. When blocks are read from disk, or written to disk, they are cached in a global block cache by the [`GDALRasterBlock`](https://gdal.org/en/stable/api/gdalrasterband_cpp.html#_CPPv415GDALRasterBlock "GDALRasterBlock") class. Once this cache exceeds [`GDAL_CACHEMAX`](https://gdal.org/en/stable/user/configoptions.html#config-GDAL_CACHEMAX) old blocks are flushed from the cache. This cache is mostly beneficial when needing to read or write blocks several times. This could occur, for instance, in a scanline oriented input file which is processed in multiple rectangular chunks by **gdalwarp**. If its value is small (less than 100000), it is assumed to be measured in megabytes, otherwise in bytes. Alternatively, the value can be set to "X%" to mean X% of the usable physical RAM. Since GDAL 3.11, the value of [`GDAL_CACHEMAX`](https://gdal.org/en/stable/user/configoptions.html#config-GDAL_CACHEMAX) may specify the units directly (e.g., "500MB", "2GB"). Note that this value is only consulted the first time the cache size is requested. To change this value programmatically during operation of the program it is better to use [`GDALSetCacheMax()`](https://gdal.org/en/stable/api/raster_c_api.html#_CPPv415GDALSetCacheMaxi "GDALSetCacheMax") (always in bytes) or or [`GDALSetCacheMax64()`](https://gdal.org/en/stable/api/raster_c_api.html#_CPPv417GDALSetCacheMax647GIntBig "GDALSetCacheMax64"). The maximum practical value on 32 bit OS is between 2 and 4 GB. It is the responsibility of the user to set a consistent value.

- **`GDAL_FORCE_CACHING=[YES​/​NO]`:** Defaults to `NO`. When set to YES, [`GDALDataset::RasterIO()`](https://gdal.org/en/stable/api/gdaldataset_cpp.html#_CPPv4N11GDALDataset8RasterIOE10GDALRWFlagiiiiPvii12GDALDataTypeiPKi8GSpacing8GSpacing8GSpacingP20GDALRasterIOExtraArg "GDALDataset::RasterIO") and [`GDALRasterBand::RasterIO()`](https://gdal.org/en/stable/api/gdalrasterband_cpp.html#_CPPv4N14GDALRasterBand8RasterIOE10GDALRWFlagiiiiPvii12GDALDataType8GSpacing8GSpacingP20GDALRasterIOExtraArg "GDALRasterBand::RasterIO") will use cached IO (access block by block through [`GDALRasterBand::IReadBlock()`](https://gdal.org/en/stable/api/gdalrasterband_cpp.html#_CPPv4N14GDALRasterBand10IReadBlockEiiPv "GDALRasterBand::IReadBlock") API) instead of a potential driver-specific implementation of IRasterIO(). This will only have an effect on drivers that specialize IRasterIO() at the dataset or raster band level, for example JP2KAK, NITF, HFA, WCS, ECW, MrSID, and JPEG.
- **`GDAL_BAND_BLOCK_CACHE=[AUTO​/​ARRAY​/​HASHSET]`:** Defaults to `AUTO`. Controls whether the block cache should be backed by an array or a hashset. By default (`AUTO`) the implementation will be selected based on the number of blocks in the dataset. See [RFC 26: GDAL Block Cache Improvements](https://gdal.org/en/stable/development/rfc/rfc26_blockcache.html#rfc-26) for more information.
- **`GDAL_MAX_DATASET_POOL_SIZE=value`:** Defaults to `100`. Used by [gdalproxypool.cpp](https://github.com/OSGeo/gdal/blob/release/3.13/gcore/gdalproxypool.cpp). Number of datasets that can be opened simultaneously by the `GDALProxyPool` mechanism (used by VRT for example). Can be increased to get better random I/O performance with VRT mosaics made of numerous underlying raster files. Be careful: on Linux systems, the number of file handles that can be opened by a process is generally limited to 1024. This is currently clamped between 2 and 1000.
- **`GDAL_MAX_DATASET_POOL_RAM_USAGE=value`:** (GDAL >= 3.7) Limit the RAM usage of opened datasets in the `GDALProxyPool`. The value can also be suffixed with `MB` or `GB` to respectively express it in megabytes or gigabytes. The default value is 25% of the usable physical RAM minus the [`GDAL_CACHEMAX`](https://gdal.org/en/stable/user/configoptions.html#config-GDAL_CACHEMAX) value.
- **`GDAL_SWATH_SIZE=value`:** Defaults to `1/4` of the maximum block cache size (``GDAL_CACHEMAX``). Used by [rasterio.cpp](https://github.com/OSGeo/gdal/blob/release/3.13/gcore/rasterio.cpp). Size of the [swath](https://gdal.org/en/stable/glossary.html#term-Swath) when copying raster data from one dataset to another one (in bytes). Should not be smaller than [`GDAL_CACHEMAX`](https://gdal.org/en/stable/user/configoptions.html#config-GDAL_CACHEMAX). 
- **`GDAL_DISABLE_READDIR_ON_OPEN=[TRUE​/​FALSE​/​EMPTY_DIR]`:** Defaults to `FALSE`. By default (FALSE), GDAL establishes a list of all the files in the directory of the file passed to [`GDALOpen()`](https://gdal.org/en/stable/api/raster_c_api.html#_CPPv48GDALOpenPKc10GDALAccess "GDALOpen"). This can result in speed-ups in some use cases, but also to major slow-downs when the directory contains thousands of other files. When set to TRUE, GDAL will not try to establish the list of files. The number of files read can also be limited by [`GDAL_READDIR_LIMIT_ON_OPEN`](https://gdal.org/en/stable/user/configoptions.html#config-GDAL_READDIR_LIMIT_ON_OPEN). If set to `EMPTY_DIR`, only the file that is being opened will be seen when a GDAL driver will request sibling files, so this is a way to disable loading side-car/auxiliary files.   
- **`GDAL_READDIR_LIMIT_ON_OPEN=value`:** Defaults to `1000`. Sets the maximum number of files to scan when searching for sidecar files in [`GDALOpen()`](https://gdal.org/en/stable/api/raster_c_api.html#_CPPv48GDALOpenPKc10GDALAccess "GDALOpen").    
- **`VSI_CACHE=[TRUE​/​FALSE]`:** When using the VSI interface files can be cached in RAM by setting the configuration option `VSI_CACHE` to `TRUE`. The cache size defaults to 25 MB, but can be modified by setting the configuration option [`VSI_CACHE_SIZE`](https://gdal.org/en/stable/user/configoptions.html#config-VSI_CACHE_SIZE). (in bytes). When enabled, this cache is used for most I/O in GDAL, including local files.
- **`VSI_CACHE_SIZE=<size in bytes>`:** Set the size of the VSI cache. Be wary of large values for `VSI_CACHE_SIZE` when opening VRT datasources containing many source rasters, as this is a per-file cache. Since GDAL 3.11, the value of `VSI_CACHE_SIZE` may be specified using memory units (e.g., "25 MB").

Notes:



***

## Appendix

*Note created on [[2026-06-05]] and last modified on [[2026-06-06]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026