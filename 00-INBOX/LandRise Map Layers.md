---
creation_date: 2026-06-10
modification_date: 2026-06-10T18:04:26-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Basemap Providers
tags:
  - Type/Guide
  - Status/Complete
  - Topic/Geospatial
aliases:
  - Basemap Providers
---

## LandRise Layer Taxonomy

### Base Layers

> [!NOTE]
> **Purpose**: Base layers provide **geographic context**; only one is visible at a time with a [[Z-Index]] set to `0` (bottom).

#### Raster Basemap Providers

- **OpenStreetMap** - Default open source streets
- **CartoDB.Positron** - Clean minimal design for data overlays
- **CartoDB.Voyager** - Balanced general mapping
- **Esri.WorldImagery** - Satellite imagery for visual assessment
- **Esri.WorldTopoMap** - Professional topographic mapping
- **Esri.WorldStreetMap** - Street-level navigation
- **OpenTopoMap** - Open source topography with contours
- **Wikimedia** - Open alternative basemap

#### Vector Tile Basemap Providers

- **Mapbox.Streets** - Customizable street map
- **Mapbox.Outdoors** - Terrain-focused styling
- **Mapbox.Satellite** - Satellite with vector overlays





Here’s the **final clarified layer taxonomy** that cleanly distinguishes between persistent _basemap providers_ (true basemaps that serve as the visual foundation) and all _overlay tile/vector layers_ (contextual or analytic layers that are drawn above the basemap in LandRise maps).

---

## **1. Basemap Providers (Primary Background Layers)**

These are **foundational layers** loaded via `leaflet::addProviderTiles()` or tile URLs. Only **one is visible at a time**; all other layer types are drawn _on top_ of one of these.

| Category | Provider | Description | Type | Notes / Source |  
|-----------|-----------|--------------|------|----------------|  
| General purpose | OpenStreetMap | Default open community map | Raster | Free, fast, standard |  
| General purpose | CartoDB.Positron | Light gray/white style | Raster | Ideal for overlays (Parcel or Floods) |  
| General purpose | CartoDB.Voyager | Balanced geographic design | Raster | General thematic mapping |  
| Dark theme | CartoDB.DarkMatter | High-contrast dark map | Raster | Best for night/report backgrounds |  
| Topographic | OpenTopoMap | OSM topographic contours | Raster | Best for environmental context |  
| Topographic | Esri.WorldTopoMap | Professional vector topo | Raster | Commercial-quality topography |  
| Street/Navigation | Esri.WorldStreetMap | Street infrastructure map | Raster | For routing/address context |  
| Satellite | Esri.WorldImagery | High resolution imagery | Raster | Excellent for site visualization |  
| Satellite | Mapbox.Satellite | Alt. satellite imagery | Vector or Raster | Requires API key |  
| Hybrid terrain | Mapbox.Outdoors | Terrain + vector context | Vector | Requires API key |  
| Terrain | Esri.WorldTerrain | Hillshade + relief | Raster | Great for slope visualization |  
| National basemap | Wikimedia | Open tile-based map | Raster | Open data fallback |

**Summary:**  
Use only one basemap per map context. CartoDB.Positron (light) or Esri.WorldImagery (satellite) are typical defaults in LandRise.

---

## **2. Reference Tile Layers (Overlay Tiles / not Basemaps)**

These are **multi-tile image or vector layers** added with `addTiles()` or similar above a basemap. They render thematic or contextual data — **never raw background map features.**

| Category | Provider / Source | Description | Format | Layer Type | Notes |  
|-----------|------------------|--------------|---------|-------------|-------|  
| Parcels | Regrid Parcels | Nationwide parcel boundaries | Raster / MVT | External data tiles | API key required |  
| Parcels | Esri USA Parcels | Cached U.S. parcel geometry | Vector | Living Atlas | Aggregated |  
| Flood | FEMA NFHL | National Flood Hazard (zones/floodways) | WMS / REST export | External image overlays | Dynamic service; used interactively |  
| Topography | Mapbox Terrain-RGB | RGB-encoded elevation | Raster | Analytical overlay | Converts color values → elevation |  
| Wetlands | FWS Wetlands Mapper | Wetlands boundaries | WMS | Environmental overlay | Vectorized polygon render |  
| Hydrography | Esri Surface Water | Major rivers and lakes | Vector | Context overlay | Part of Esri Environment Basemap |  
| Soil/Vegetation | Esri Environment Base | Vegetation, soils | Vector | Context overlay | Great for suitability maps |  
| Federal reference | USGS National Map | Boundaries, hydrography contours | WMS | Context overlay | Static tile base for analysis |

**Summary:**  
Reference tiles overlay the basemap and visually enhance context. They are usually _read-only imagery_ or _symbolized features_ like parcels, flood areas, or watersheds.

---

## **3. Analytical or Internal Vector Layers (LandRise Data Layers)**

These are **sf/vector data** served locally or from LandRise’s internal APIs/PostGIS. They provide parcel-level or computed results dynamically atop the map.

| Category | Layer | Geometry | Source | Type | Use |  
|-----------|--------|-----------|----------|------|-----|  
| Parcels | Selected Parcels | Polygon | REAPI + internal | Vector | Highlight selected property(ies) |  
| Parcels | Search Results | Polygon | REAPI | Vector | Display search features |  
| Analysis | Slope Classes | Polygon / raster derived | DEM | Analytical | Terrain buildability |  
| Analysis | Buildable Area | Polygon | Internal calculation | Analytical | Final buildable footprint |  
| Hydrology | Flood Intersect | Polygon | Computed from FEMA NFHL | Analytical | Intersection results |  
| Infrastructure | Sewer Buffers | Polygon | Internal | Analytical | Distance-availability analysis |  
| Infrastructure | Road Access | Line / point | Internal | Reference overlay | Context for site selection |

All of these layers are runtime `sf` objects or vector tiles served from LandRise’s back end — they’re _interactive_ and used in reporting and analytics workflows.

---

## **4. Operational / Contextual Overlays (Static Boundary + Context)**

Used as **semi-permanent visual references** in maps, drawn above base imagery and below analytical features.

| Category | Example Layers | Geometry | Source | Purpose |  
|-----------|----------------|-----------|----------|----------|  
| Boundaries | County, MSA, ZIP code, City | Polygon | Census TIGER | Regional context, filtering |  
| Infrastructure | Roads, water, sewer networks | Line & point | County/City GIS | Service availability |  
| Environmental | Wetlands, protected areas, water bodies | Polygon | Federal datasets | Constraint identification |  
| Zoning | Zoning, Land Use Overlays | Polygon | Local GIS | Development constraints |  
| Demographics | Census tracts/block groups | Polygon | Census API | Market and population analysis |  
| Points of Interest | Schools, amenities, healthcare | Point | OSM / Public APIs | Model accessibility |  
| Natural Hazards | FEMA / NOAA / USGS sources | Polygon / raster | FEMA NFHL, USGS | Contextual hazard mapping |

Operational overlays are vector or WMS layers, typically used for reference but not stored directly in LandRise databases.

---

## **5. Dynamic / Computed Visualizations (Client-Side Layers)**

Rendered on demand, updated reactively (e.g., within Shiny or static report outputs).

| Visualization | Type | Library | Purpose |  
|----------------|------|----------|----------|  
| Heatmaps | Raster/point aggregation | leaflet.extras | Density of sales or development |  
| Choropleths | Polygon color fill by attribute | Leaflet standard | Suitability, zoning intensity |  
| Isochrones | Polygons from travel times | Mapbox Isochrone API | Access/travel modeling |  
| 3D Terrain | Relief visualization | Mapbox terrain or deck.gl | Elevation & slope display |  
| Animated Layers | Real-time layers | leaflet.glify / Shiny reactive | Time-based visualizations |

---

### **Hierarchy of Layer Stacking (Render Order)**

From bottom → top:

1. **Basemap provider** — background imagery (single active layer)
2. **Reference tiles** — static context overlays (flood, parcel tiles, terrain)
3. **Operational overlays** — administrative/infra/environment context
4. **Analytical & internal layers** — results and user data
5. **Dynamic visualization/annotation** — temporary, interactive features

---

### **LandRise Default Configuration Recommendations**

| Function | Default Layers |  
|-----------|----------------|  
| **Parcel search map** | Basemap: CartoDB.Positron + Reference: Regrid Parcels + Overlay: County + Zoning |  
| **Site analysis map** | Basemap: Esri.WorldImagery + Reference: FEMA Flood (tiles) + Analytical: BuildableArea, Slope |  
| **Environmental context map** | Basemap: Esri.WorldTopoMap + Reference: Wetlands & Hydrography + Overlay: Protected Areas |  
| **Market analysis map** | Basemap: Voyager + Reference: Census Tracts + Dynamic: Demographic Choropleth |

---

**In short:**

- **Basemap providers** = foundational map imagery (always one active).
- **Reference tile layers** = external imagery layers stacked above basemap.
- **Operational overlays** = contextual static GIS information (boundaries, zones).
- **Analytical/internal layers** = LandRise-generated computations.
- **Dynamic visualizations** = Interactive client‑side summaries.

This structure ensures clarity for both data architecture and map rendering order in LandRise.

Sources