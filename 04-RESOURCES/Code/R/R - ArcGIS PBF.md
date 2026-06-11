---
creation_date: 2026-05-25
modification_date: 2026-06-11T18:04:36-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - ArcGIS PBF
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Geospatial
  - Topic/Data
aliases:
  - ArcGIS REST API Protobuf Format in R
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!CODE]
> - **Language:** [[MOC - R|R]]
> - **Frameworks:** [[R - httr2|httr2]], [[R - arcgis|arcgis]], [[R - sf|sf]], [[Protobuf (PBF)|Protobuf]]

The [[ArcGIS REST API]] supports returning query results as [[Protocol Buffers (PBF)]] via `f=pbf`. This is significantly faster and more compact than [[JSON]] for large feature sets.

The [`arcpbf`](https://github.com/R-ArcGIS/arcpbf) package provides `arcpbf::resp_body_pbf()` which takes an `httr2::response()` object directly and returns a decoded `sf` data frame.

## Code

> [!SOURCE]
> 

### Setup

```R

#  ------------------------------------------------------------------------
#
# Title : ArcGIS Protobuf Response Parsing
#    By : Jimmy Briggs
#  Date : 2026-06-11
#
#  ------------------------------------------------------------------------

# dependencies ----------------------------------------------------------------------------------------------------
require(sf)
require(arcpbf)
require(arcgislayers)
require(httr2)

# area of interest ------------------------------------------------------------------------------------------------
aoi_bbox <- c(xmin = -84.55, ymin = 33.65, xmax = -84.25, ymax = 33.85)
aoi_geom  <- sf::st_as_sfc(sf::st_bbox(aoi_bbox, crs = sf::st_crs(4326)))
```

### FEMA NFHL Flood Zones

Example for [[Federal Emergency Management Agency (FEMA)|FEMA]] NFHL Flood Hazard Zones:

```R
# FEMA NFHL - Flood Hazard Zones (Layer 28) -----------------------------------------------------------------------

# specify the service url and layer to use
fema_nfhl_mapserver <- arcgislayers::arc_open("https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer")
fema_nfhl_layer <- arcgislayers::get_layer(fema_nfhl_mapserver, "28")

fema_nfhl_layer$supportedQueryFormats
# [1] "JSON", "geoJSON", "PBF"

# create the request parameters in arcgis specific syntax:
aoi_filter <- arcgislayers::prepare_spatial_filter(
  filter_geom = sf::st_transform(aoi_geom, crs = sf::st_crs(fema_nfhl_layer)),
  crs = sf::st_crs(fema_nfhl_layer),
  predicate = "intersects"
)

# construct request
fema_nfhl_request <- httr2::request(fema_nfhl_layer$url) |>
  httr2::req_url_path_append("query") |>
  httr2::req_url_query("where" = "1=1", "outFields" = "*", "f" = "pbf", !!!aoi_filter)

# perform request and check response
fema_nfhl_response <- httr2::req_perform(fema_nfhl_request)
httr2::resp_check_status(fema_nfhl_response)
httr2::resp_content_type(fema_nfhl_response)
# [1] "application/x-protobuf"

# parse response using arcpbf into sf
fema_nfhl_resp_sf <- arcpbf::resp_body_pbf(fema_nfhl_response, use_sf = TRUE)

# map preview
mapview::mapview(fema_nfhl_resp_sf)
```

![](https://i.imgur.com/8ij5i0V.png)

### NWI Wetlands

Example for NWI Wetlands:

```R
nwi_mapserver <- arcgislayers::arc_open("https://fwspublicservices.wim.usgs.gov/wetlandsmapservice/rest/services/Wetlands/MapServer")
nwi_layer <- arcgislayers::get_layer(nwi_mapserver, "0")

nwi_layer$supportedQueryFormats
# [1] "JSON", "geoJSON", "PBF"

aoi_filter <- arcgislayers::prepare_spatial_filter(
  filter_geom = sf::st_transform(aoi_geom, crs = sf::st_crs(nwi_layer)),
  crs = sf::st_crs(nwi_layer),
  predicate = "intersects"
)

nwi_request <- httr2::request(nwi_layer$url) |>
  httr2::req_url_path_append("query") |> 
  httr2::req_url_query(
    "where" = "1=1",
    "outFields" = "WETLAND_TYPE,ATTRIBUTE,ACRES,WETLAND_CODE,SYSTEM,SUBSYSTEM,CLASS",
    "f" = "pbf",
    !!!aoi_filter
  )

# perform request and check response
nwi_response <- httr2::req_perform(nwi_request)
httr2::resp_check_status(nwi_response)
httr2::resp_content_type(nwi_response)
# [1] "application/x-protobuf"

# parse response using arcpbf into sf
nwi_resp_sf <- arcpbf::resp_body_pbf(fema_nfhl_response, use_sf = TRUE)

# map preview
mapview::mapview(nwi_resp_sf)
```

![](https://i.imgur.com/eqECwUo.png)

***

## Appendix

*Note created on [[2026-05-25]] and last modified on [[2026-06-11]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026

