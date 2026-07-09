---
creation_date: 2026-07-09
modification_date: 2026-07-09
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: List for Federal Geospatial Data Sources
tags:
  - Type/List
  - Status/WIP
  - Topic/NA
aliases:
  - Federal Geospatial Data Sources
  - Federal Geospatial Data Sources List
  - United States Geospatial Data Sources
  - Government Geospatial Data Sources
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

Curated collection of *United States federal, government geospatial data sources* available for integration. These sources provide **authoritative data** for various geospatial data types such as but not limited to: administrative boundaries, terrain, elevation, environmental, hazards, flood zones, wetlands, demographics, soil, air quality, and more.

## [[United States Census Bureau]]

The [[United States Census Bureau]] provides various forms of data and services related to the census, demographics, administrative boundaries, and more.

- [[Topologically Integrated Geographic Encoding and Referencing (TIGER)]] - Boundaries, roads, water features and more
	- Hosted Archives (TIGER/Line Shapefiles): https://census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
	- Cartographic Boundary Archives: https://census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html
	- TIGERweb [[Guide - ArcGIS REST API|ArcGIS REST Services]]: Interactive map services for Census Geography via ArcGIS: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/
	- TIGERweb - Web mapping service for Census geography; [Website](https://tigerweb.geo.census.gov/tigerweb/)
	- Census API - Demographic data with geometry; [Website](https://census.gov/data/developers/data-sets.html)
	- American Community Survey - Demographic estimates API; [Website](https://census.gov/programs-surveys/acs)

## [[United States Geographic Survey (USGS)]]

- [3DEP (3D Elevation Program)](https://www.usgs.gov/3d-elevation-program): high-quality topographic data and three-dimensional (3D) representations of the Nation's natural and constructed features
	- See Also:
		- [What is 3DEP? | U.S. Geological Survey](https://www.usgs.gov/3d-elevation-program/what-3dep)
		- [3D National Topography Model | U.S. Geological Survey](https://www.usgs.gov/3d-national-topography-model)

- [Elevation Point Query Service (EPQS)](https://epqs.nationalmap.gov/v1/docs): [[Elevation Point Query Service (EPQS)]] provides a simple to use web [[Application Programming Interface (API)|API]] returning elevation data from the [[United States Geographic Survey (USGS)]] Elevation Service hosted at the [[NGTOC]].

- [The National Map (TNM)](https://nationalmap.gov/): As a cornerstone of the [[United States Geological Survey (USGS)|U.S. Geological Survey]]'s [[National Geospatial Program (NGP)]], [[The National Map (TNM)]] is a collaborative effort among the [[United States Geological Survey|USGS]] and governmental, academic, non-profit, and industry partners to improve and deliver topographic information for the Nation.

## [[Federal Emergency Management Agency (FEMA)]]

FEMA provides ...

- FEMA NFHL Map Service Center (MSC)
- FEMA NFHL ArcGIS Hosted Services
- Flood Insurance Rate Map (FIRM)
- Special Flood Hazard Area (SFHA)
- Base Flood Elevation (BFE)
- National Flood Insurance Program (NFIP)
- Letter of Map Ammendment (LOMA)
 
- **National Flood Hazard Layer (NFHL)** - Flood zones, FIRMs, floodplain boundaries; [Website](https://fema.gov/flood-maps/national-flood-hazard-layer) - [[National Flood Hazard Layer (NFHL)]]
- **NFHL Viewer** - Interactive flood map viewer; [Website](https://hazards-fema.maps.arcgis.com/apps/webappviewer/index.html)
- **NFHL Configuration (Python)** - Python config for NFHL ArcGIS REST layers (flood zones, LOMR, BFE, levees, LOMAs); [GitHub](https://github.com/agrc/nfhl-skid/blob/main/src/nfhl/config.py)
- **Map Service Center (MSC)** - Official FEMA flood map downloads; [Website](https://msc.fema.gov)
- **FEMA GIS Services** - ArcGIS REST services for NFHL; [ArcGIS](https://hazards.fema.gov/gis/nfhl/rest/services)

## NOAA - Weather & Environmental

- **NOAA Data Catalog** - Environmental and climate data; [Website](https://data.noaa.gov)
- **National Weather Service API** - Weather forecasts and alerts; [API Docs](https://www.weather.gov/documentation/services-web-api)
- **Coastal LIDAR** - Coastal elevation data; [Website](https://coast.noaa.gov/digitalcoast/data/)
- **NCEI (Climate Data)** - Historical climate records; [Website](https://ncei.noaa.gov)

## USDA/NRCS - Soils & Agriculture

- **SSURGO** - Soil Survey Geographic Database; soil properties, interpretations, mapping; [Website](https://ssurgo.sc.egov.usda.gov) - [Web Soil Survey](https://websoilsurvey.sc.egov.usda.gov)
- **Soil Data Access** - Programmatic access to SSURGO and other NRCS soil data; [SDA](https://sdmdataaccess.sc.egov.usda.gov/)
- **STATSGO2** - State soil geographic database; [Website](https://nrcs.usda.gov/wps/portal/nrcs/detail/soils/survey/geo/)
- **CropScape** - Cropland data layers; [Website](https://nassgeodata.gmu.edu/CropScape/)
- **NAIP Imagery** - Aerial imagery; [Website](https://naip-usdaonline.hub.arcgis.com)

## EPA - Environmental

- **EnviroAtlas** - Environmental data and mapping; [Website](https://enviroatlas.epa.gov)
- **Facility Registry Service** - Regulated facility locations; [Website](https://epa.gov/frs)
- **WATERS GeoViewer** - Water quality and watershed data; [Website](https://epa.gov/waterdata/waters-geoviewer)

## BLM - Public Lands

- **General Land Office Records** - Historical land patents; [Website](https://glorecords.blm.gov)
- **Public Land Survey System** - Township/Range/Section data; [Website](https://blm.gov/services/land-surveying)
- **BLM Geospatial Data** - Land management boundaries; [Website](https://gbp-blm-egis.hub.arcgis.com)

## National Park Service

- **NPS Open Data** - Park boundaries and facilities; [Website](https://public-nps.opendata.arcgis.com)
- **IRMA Data Store** - NPS resource management data; [Website](https://irma.nps.gov/DataStore/)

## Multi-Agency Portals

- **GeoPlatform** - Federal geospatial data catalog; [Website](https://geoplatform.gov)
- **Data.gov** - Federal open data portal; [Website](https://data.gov)
- **HIFLD Open** - Homeland infrastructure data; [Website](https://hifld-geoplatform.opendata.arcgis.com)
- **US Interagency Elevation Inventory** - Elevation data catalog; [Website](https://coast.noaa.gov/inventory/)

***

## Appendix

*Note created on [[2026-07-09]] and last modified on [[2026-07-09]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
