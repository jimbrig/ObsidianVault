---
creation_date: 2026-06-06
modification_date: 2026-06-06
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL Streaming Algorithm Format (GDALG)
tags:
  - Type/Reference
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
  - Topic/DataEngineering
aliases:
  - GDAL Streaming Algorithm Format
  - GDALG
  - GDAL Algorithm
  - gdalg.json
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
> - *<https://gdal.org/en/stable/programs/gdal_cli_gdalg.html>*

A `.gdalg.json` file is a **read-only virtual dataset descriptor**. The `command_line` field encodes the pipeline up to but not including a write step — or, if it includes one, it must use `--output-format=stream` with a non-significant name, which is only meaningful for **in-process programmatic use** via the `GDALAlgorithm` Python/C++ API. The GDALG driver opens the file as a regular OGR datasource and executes the pipeline on demand. It is architecturally the vector equivalent of VRT — a named, composable, lazy virtual layer.

The serialization path is bidirectional: running `gdal vector pipeline ! read in.gpkg ! reproject --dst-crs=EPSG:32632 ! write out.gdalg.json` drops the `write` step and serializes everything before it into the file. The file can then be opened anywhere GDAL expects a vector input — `gdal vector info`, `ogrinfo`, as the `read` source of another pipeline, or as input to `gdal vector convert`.

The `stream` in-process mode is a distinct mechanism: it instructs `GDALAlgorithm.Run()` to return a live in-memory OGR dataset rather than writing to disk, enabling chained programmatic execution without any I/O. This is not HTTP streaming, not inter-process transport, and not usable from the CLI except as a GDALG-serialized endpoint:[](https://gdal.org/en/stable/programs/gdal_cli_gdalg.html)

```python
alg = gdal.GetGlobalAlgorithmRegistry()["vector"]["geom"]["make-valid"]
alg["input"] = src_ds
alg["output"] = ""
alg["output-format"] = "stream"
alg.Run()
out_ds = alg["output"].GetDataset()  # live in-memory OGR dataset
```

## GDALAlgorithm Registry

[RFC 104 (GDAL 3.11)](https://gdal.org/en/stable/development/rfc/rfc104_gdal_cli.html) introduced the unified `gdal` CLI and its underlying `GDALAlgorithmRegistry`. Every sub-command is a registered algorithm with a fully introspectable JSON schema via `--json-usage`. 

The current tree for vector work:

```plaintext
gdal
├── vector
│   ├── info           → schema, layer stats, feature count
│   ├── convert        → format conversion (replaces ogr2ogr core case)
│   ├── pipeline       → composable step-based processing
│   ├── concat         → multi-source merge (serializable to GDALG)
│   ├── filter         → spatial + attribute filter
│   ├── reproject      → CRS transformation
│   ├── select         → field subsetting
│   ├── sql            → OGR SQL / SQLite dialect
│   ├── clip           → geometry-bounded clip
│   ├── edit           → metadata, CRS override, geometry type
│   └── geom
│       ├── buffer
│       ├── make-valid
│       ├── simplify
│       ├── segmentize
│       ├── set-type
│       ├── explode-collections
│       └── swap-xy
└── vsi
    ├── list / ls
    ├── copy / cp
    ├── move / mv
    ├── delete / rm
    ├── sync
    └── sozip
```

The `--json-usage` output from any algorithm is machine-readable JSON describing all arguments, their types, default values, mutual-exclusion groups, and whether they accept arrays — this is the introspection hook for auto-generating OGC Process descriptions.

***

## Appendix

*Note created on [[2026-06-06]] and last modified on [[2026-06-06]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026