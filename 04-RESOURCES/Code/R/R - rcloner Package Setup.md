---
creation_date: 2026-07-05
modification_date: 2026-07-05T14:23:25-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - rcloner Package Setup
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Development
aliases:
  - rcloner Package Setup
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!INFO] R
> **Language**: R
> **Dependencies**: `rcloner`

> [!SOURCE] Sources
> - [boettiger-lab/rcloner: wrapper around rclone](https://github.com/boettiger-lab/rcloner)
> - [Interface to rclone Cloud Storage Utility • rcloner](https://boettiger-lab.github.io/rcloner/)
> - [Getting started with rcloner • rcloner](https://boettiger-lab.github.io/rcloner/articles/rcloner.html)
> - [Rclone](https://rclone.org/)

## Installation

Install the package via:

```R
# CRAN
pak::pak("rcloner")
# GitHub (development)
pak::pak("boettiger-lab/rcloner)
```

## Code

First, check for an existing installation of [rclone](https://rclone.org/), and install if not found:

```R
# detect rclone installation or install if not found
if (Sys.which("rclone") == "") {
  cli::cli_alert_info("Installing {.field rclone}...")
  inst_path <- rcloner::install_rclone()
  cli::cli_alert_success("RClone successfully installed to system. The path is {.file {inst_path}}.")
} else {
  inst_path <- normalizePath(Sys.which("rclone"), winslash = "/")
  cli::cli_alert_success("RClone discovered under path: {.file {inst_path}}")
}
```

verify installed `rclone` version:

```R
rcloner::rclone_available()
# [1] TRUE
rcloner::rclone_version()
# rclone v1.73.4
# - os/version: Microsoft Windows 11 Pro Dev Dev (64 bit)
# - os/kernel: 10.0.29560.1000 (x86_64)
# - os/type: windows
# - os/arch: amd64
# - go/version: go1.25.9
# - go/linking: static
# - go/tags: cmount
```

Setup an initial [rclone configuration](https://rclone.org/docs/#configure). For this example, I am setting up a configuration for [Tigris Object Storage](https://www.tigrisdata.com/docs/) which is *S3 compatible*:

```R
tigris_rclone_config <- rcloner::rclone_config_create(
  name = "tigris",
  type = "s3",
  provider = "Other",
  access_key_id = Sys.getenv("TIGRIS_STORAGE_ACCESS_KEY_ID"),
  secret_access_key = Sys.getenv("TIGRIS_STORAGE_SECRET_ACCESS_KEY"),
  region = "auto",
  endpoint = Sys.getenv("TIGRIS_STORAGE_ENDPOINT")
)

str(tigris_rclone_config)
# List of 4
#  $ status : int 0
#  $ stdout : chr "[tigris]\ntype = s3\nendpoint = https://t3.storage.dev\nprovider = Other\naccess_key_id = tid_bqGHEjGrpVILOJucD"| __truncated__
#  $ stderr : chr ""
#  $ timeout: logi FALSE

rcloner::rclone_listremotes()
# [1] "tigris"
```

Verify access to buckets:

```R
rcloner::rclone_lsd("tigris:noclocks-spatial")
#      Path    Name Size        MimeType                        ModTime IsDir
# 1 catalog catalog    0 inode/directory 2000-01-01T00:00:00.000000000Z  TRUE
# 2 parcels parcels    0 inode/directory 2000-01-01T00:00:00.000000000Z  TRUE
```

***

## Appendix

*Note created on [[2026-07-05]] and last modified on [[2026-07-05]].*

### See Also

- [[MOC - R]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
