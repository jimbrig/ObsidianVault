---
creation_date: 2026-05-27
modification_date: 2026-05-27
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Geospatial Abstraction Layers
tags:
  - Type/Code
  - Type/Idea
  - Type/Note
  - Status/WIP
  - Topic/Development
  - Topic/R
  - Topic/Geospatial
aliases:
  - Geospatial Abstraction Layers
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Providers

- Google Maps (`gmaps_*())
- FEMA (`fema_*()`)
- OpenTopography (`opentopo_*()`)
- MapBox (`mapbox_*()`)
- OpenStreetMap (`osm_*()`)
- TIGER (`tiger_*()`)
- Census (`census_*()`)
- Mapillary (`mapillary_*()`)
- SSURGO (`ssurgo_*()`)


## HTTP Providers

- USGS EPQS
- USGS TNM
- OpenTopography
- ArcGIS REST (MapServer, FeatureServer, ImageServer, GPServer)
- OGC OWS (WMS, WFS, WCS, WMTS)
- OGC API (Features, Tiles, Records, Coverages, Maps)

## Data Provider Modules

Combined transport protocols, formats, and data retrieval methods available for a particular organization or specific domain. Essentially a collection of connectors specific to a particular provider or data source.

Examples: 
- FEMA
	- MSC Search
	- MSC Download
	- MSC ArcGIS
	- Hazards ArcGIS
	- Hazards Download
	- Hazards ArcGIS



## Examples

### HTTP via `httr2`

```R
http_request <- function(base_url, path = NULL, query = list(), timeout = 30L, ...) {
  
} 

# constructor
new_http_request <- function(
  url,
  class_name = "geo",
  method = NULL,
  headers = list(),
  body = NULL,
  fields = list(),
  options = list(),
  policies = list(),
  error_call = rlang::caller_env()
) {  
  structure(
    list(
      url = url,
      method = method,
      headers = headers,
      body = body,
      fields = fields,
      options = options,
      policies = policies,
      state = rlang::new_environment()
    ),
    class = c(paste0(class_name, "_request"), "httr2_request")
  )
}
```

### USGS Elevation Point Services

- Elevation Point Query Service (EPQS): Point Elevation from 3DEP/NED
- The National Map (TNM): 

The [[United States Geographic Survey (USGS)|USGS]] [[Elevation Point Query Service (EPQS)|EPQS]] API returns elevation in international feet or meters for a specific latitude/longitude ([[NAD 1983]]) point from the [USGS Elevation Service hosted at the NGTOC]()

[EPQS API Documentation](https://epqs.nationalmap.gov/v1/docs)
[The National Map](https://apps.nationalmap.gov/epqs/)


```R
usgs_epqs_base_url <- "https://epqs.nationalmap.gov/v1"
usgs_tnm_base_url <- "https://tnmaccess.nationalmap.gov/api/v1/products"
```