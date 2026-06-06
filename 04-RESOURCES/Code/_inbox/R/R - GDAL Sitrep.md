---
creation_date: 2026-04-14
modification_date: 2026-04-14
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Geospatial
  - Topic/Development
aliases:
  - 'GDAL Situation Report (sitrep) in R'
  - 'Summary of GDAL environment in R'
publish: true
permalink:
description:
cssclasses:
  - code
---

# GDAL `sitrep` Functionality in R

> [!info] Code Properties
> - **Language**: [[MOC - R|R Language]]
> - **Packages**: [gdalraster](https://github.com/firelab/gdalraster), [sf](https://github.com/r-spatial/sf/), [terra](https://github.com/rspatial/terra/), [vapour](https://github.com/hypertidy/vapour), [stars](https://github.com/r-spatial/stars)

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - *Source URL or reference*

Getting a structured and comprehensive overview of the many various aspects around a [[Geospatial Data Abstraction Library (GDAL)|GDAL]] development environment and its many bindings to various R packages and various possible driver plugin shared libraries is no trivial task. This code attempts to provide a mechanism for this regarding the following various package bindings and variations of `libgdal` or `GDAL`:

- System Environment Installations
- Project Environment Installations
- Package Specific Bindings:
	- `sf`
	- `gdalraster`
	- `terra`
	- `stars`
	- `vapour`

## Requirements

A comprehensive sitrep is no trivial task in this context.

Relevant information includes but is not limited to:

-   System Installed GDAL Binary Path
    -   `Sys.which("gdal")`
-   Packages:
    -   `gdalraster`
    -   `sf`
    -   `terra`
    -   `vapour`
    -   `wk`
    -   `geos`
-   Versions:
    -   System Version
    -   `gdalraster` Package, GDAL, PROJ, GEOS Versions
    -   `sf` Package, GDAL, PROJ, GEOS Versions
    -   `terra` Package, GDAL Versions
    -   `vapour` Package, GDAL Versions
-   Algorithmic Capabilities:
    -   `gdalraster::gdal_global_reg_names()`
-   Drivers/Formats:
    -   `gdalraster::`

## Code

### System GDAL

```R
# ensure on PATH
sys_exe <- function(program) {
  Sys.which(program) |> normalizePath(winslash = "/", mustWork = FALSE)
}

gdal_exe <- sys_exe("GDAL")
gdalinfo_exe <- sys_exe("gdalinfo")

# create functions for versions

```

### `gdalraster` Metadata

`gdalraster` is arguably the most significant, low-level binding to the GDAL C++ APIs and exposes various functions to get information:

```R
require(gdalraster)

# versions of installed low-level libraries being used
gdalraster::gdal_version()
gdalraster::geos_version()
gdalraster::proj_version()

# drivers/plugins
gdalraster::gdal_formats()

# 

```

## Usage

How to use this code:

```
# usage example
```

## Notes

Additional notes about the code.

***

## Appendix

*Note created on [[2026-04-14]] and last modified on [[2026-04-14]].*

### See Also

- [[04-RESOURCES/Code/README|Code Index]]

### Backlinks

```dataview
LIST FROM [[Untitled]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
