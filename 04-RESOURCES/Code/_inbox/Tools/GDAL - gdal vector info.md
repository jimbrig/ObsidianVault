---
creation_date: 2026-05-08
modification_date: 2026-05-08
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/Geospatial
  - Topic/Development
  - Status/WIP
aliases:
  - gdal vector info
  - gdal vector info Code
publish: true
permalink:
description:
cssclasses:
  - code
---

# `gdal vector info`

> [!info] Code Properties
> - **Language**: `N/A`
> - **Tools**: [[Geospatial Data Abstraction Library (GDAL)|GDAL]] v3.11+

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - [gdal vector info](https://gdal.org/en/stable/programs/gdal_vector_info.html#gdal-vector-info)

Demonstrations of using the modernized `gdal vector info` sub-command that replaces the traditional `ogrinfo` utility from [[Geospatial Data Abstraction Library (GDAL)|GDAL]].

**gdal vector info** lists various information about a GDAL supported vector dataset, and returns them on the standard output stream when used from the command line, or in the `output` parameter when used from the API.

Starting with [[Geospatial Data Abstraction Library (GDAL)|GDAL]] 3.12, **gdal vector info** can be used as the last step of a [[GDAL - gdal vector pipeline|pipeline]].

## Reference

The `--help` output for `gdal vector info` is as follows:

```sh
➜  ~ gdal vector info --help
Usage: gdal vector info [OPTIONS] <INPUT>...

Return information on a vector dataset.

Positional arguments:
  -i, --dataset, --input <INPUT>                       Input vector datasets [may be repeated] [required]

Common Options:
  -h, --help                                           Display help message and exit
  --json-usage                                         Display usage as JSON document and exit
  --config <KEY>=<VALUE>                               Configuration option [may be repeated]

Options:
  -f, --of, --format, --output-format <OUTPUT-FORMAT>  Output format. OUTPUT-FORMAT=json|text
  -l, --layer, --input-layer <INPUT-LAYER>             Input layer name [may be repeated]
                                                       Mutually exclusive with --sql
  --features                                           List all features (beware of RAM consumption on large layers)
                                                       Mutually exclusive with --summary
  --summary                                            List the layer names and the geometry type
                                                       Mutually exclusive with --features
  --limit <FEATURE-COUNT>                              Limit the number of features per layer (implies --features)
  --sql <statement>|@<filename>                        Execute the indicated SQL statement and return the result
                                                       Mutually exclusive with --input-layer
  --where <WHERE>|@<filename>                          Attribute query in a restricted form of the queries used in the SQL WHERE statement
  --dialect <DIALECT>                                  SQL dialect
  --update                                             Open the dataset in update mode

Advanced Options:
  --oo, --open-option <KEY>=<VALUE>                    Open options [may be repeated]
  --if, --input-format <INPUT-FORMAT>                  Input formats [may be repeated]

For more details, consult https://gdal.org/programs/gdal_vector_info.html
```

Some noteworthy items from this output are:

- the output format via `--format` or `--output-format` can be one of `json` or `text`
- `--summary` and `--features` arguments are mutually exclusive
- `--layer` and `--sql` and `--where` are mutually exclusive with each other
- supports default global or driver-specific `--config` configurations, i.e. `CPL_*` etc.
- the `--sql` and `--where` arguments can accept paths to files containing the content for the expressions
- `--fid` (added in 3.13), allows getting info for an individual feature
- `--crs-format` (added in 3.13) can be specified

## Schema

Note that the JSON output for any call to `gdal vector info` will mirror the same structure from the traditional `ogrinfo` schema and the actual [[JSON Schema]] can be found here:

https://raw.githubusercontent.com/OSGeo/gdal/refs/heads/master/apps/data/ogrinfo_output.schema.json

## Examples

## Usage

How to use this code:

```sh
gdal vector info \
  --input "/vsizip/vsicurl/https://www2.census.gov/geo/tiger/TIGER2025/STATE/tl_2025_us_state.zip/tl_2025_us_state.shp" \
  --sql "@tiger_states.sql" \
  --format=json
```

where `@tiger_states.sql`:

```sql
SELECT
  GEOID AS geoid,
  STATEFP AS state_fips,
  STUSPS AS state_abbr,
  NAME AS state_name,
  REGION AS region,
  DIVISION AS division,
  MTFCC AS mtfcc,
  FUNCSTAT AS funcstat,
  ALAND AS area_land_m2,
  AWATER AS area_water_m2,
  INTPTLAT AS centroid_latitude,
  INTPTLON AS centroid_longitude
FROM tl_2025_us_state
WHERE STATEFP NOT IN ('02','15','60','66','69','72','74','78')
```

## Notes

Additional notes about the code.

***

## Appendix

*Note created on [[2026-05-08]] and last modified on [[2026-05-08]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]

### Backlinks

```dataview
LIST FROM [[Untitled]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
