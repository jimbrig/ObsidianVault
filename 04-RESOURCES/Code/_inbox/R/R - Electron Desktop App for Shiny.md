---
creation_date: 2024-09-23
modification_date: 2024-12-13
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
tags:
  - Type/Code
  - Topic/Development
  - Topic/R
  - Status/Complete
aliases:
  - Build Electron Desktop App for Shiny R Code
  - RInno Shiny Desktop App
  - Shiny to Desktop Installer
description: Code to build an Electron-based desktop installer for R Shiny applications
cssclasses:
  - code
---

# Electron Desktop App for Shiny

> [!info] Code Properties
> - **Language**: R
> - **Packages**: `RInno`, `here`, `installr`

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

Build a standalone desktop application installer for R Shiny apps using RInno and Electron. This allows distributing Shiny apps as native Windows applications without requiring users to have R installed.

> [!SOURCE] Sources
> - [self-insurance-kpi-app/build-electron.R](https://github.com/jimbrig/self-insurance-kpi-app/blob/main/scripts/build-electron.R)

## Installation

Install required packages:

```r
pak::pak("ficonsulting/RInno")
```

Ensure Inno Setup is installed and on the system PATH:

```r
require(RInno)

if (Sys.which("ISCC.exe") == "") {
  RInno::install_inno()
}
```

## Code

```r
require(RInno)
require(here)
require(installr)

# define app dependencies
libs <- c(
  "shiny",
  "shinyjs",
  "shinyWidgets",
  "shinycssloaders",
  "purrr",
  "lubridate",
  "tibble",
  "dplyr",
  "highcharter",
  "stringr",
  "rintrojs",
  "DT",
  "knitr",
  "rmarkdown",
  "qs"
)

# ensure Inno Setup is available
if (Sys.which("ISCC.exe") == "") {
  RInno::install_inno(quick_start_pack = TRUE)
}

# create the application package
RInno::create_app(
  app_name = "My Shiny App",
  app_dir = here::here(),
  dir_out = "build",
  pkgs = libs,
  pkgs_path = "bin",
  repo = getOption("repos"),
  remotes = NULL,
  include_R = TRUE,
  R_version = .rs.rVersionString(),
  overwrite = TRUE
)

# compile the installer
RInno::compile_iss()
```

## Usage

1. Set up your Shiny app directory with standard structure
2. Update the `libs` vector with your app's dependencies
3. Replace `"My Shiny App"` with your application name
4. Run the script to generate an installer in the `build/` directory

### Output Structure

```
build/
  |- app_name_setup.exe    # Windows installer
  |- app/                  # Application files
  |- bin/                  # R packages
```

***

## Appendix

*Note created on [[2024-09-23]] and last modified on [[2024-12-13]].*

### See Also

- [[04-RESOURCES/Code/R/_README|R Code Index]]

### Backlinks

```dataview
LIST FROM [[R - Electron Desktop App for Shiny]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024

