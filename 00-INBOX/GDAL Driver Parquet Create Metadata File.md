---
creation_date: 2026-06-16
modification_date: 2026-06-17T17:47:38-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: GDAL Driver Parquet Create Metadata File
tags:
  - Type/Code
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
  - Topic/DataEngineering
aliases:
  - GDAL Driver Parquet Create Metadata File
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```


> [!SOURCE]
> [gdal driver parquet create-metadata-file — GDAL documentation](https://gdal.org/en/stable/programs/gdal_driver_parquet_create_metadata_file.html)

**Create the` _metadata` file for a partitioned Parquet dataset:**

```bash
Usage: gdal driver parquet create-metadata-file [OPTIONS] <INPUT>... <OUTPUT>

Create the _metadata file for a partitioned dataset

Positional arguments:
  --input <INPUT>         Input Parquet datasets (created by algorithm) [1.. values] [required]
  --output <OUTPUT>       Output Parquet dataset [required]

Common Options:
  -h, --help              Display help message and exit
  --json-usage            Display usage as JSON document and exit
  --config <KEY>=<VALUE>  Configuration option [may be repeated]

Options:
  --overwrite             Whether overwriting existing output is allowed
```

This program is automatically called by [gdal vector partition](https://gdal.org/en/stable/programs/gdal_vector_partition.html#gdal-vector-partition) for a Parquet output.

## Example

```bash
gdal driver parquet create-metadata-file \
  --input noclocks-spatial/parcels/state_fips=13/part_0.parquet \
  --input noclocks-spatial/parcels/state_fips=14/part_0.parquet \
  ... (all state files) \
  --output noclocks-spatial/parcels/_metadata
```
