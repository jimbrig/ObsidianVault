---
creation_date: 2026-06-05
modification_date: 2026-06-05
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Spatial Temporal Asset Catalog (STAC)
tags:
  - Type/Definition
  - Status/Complete
  - Topic/Geospatial
  - Topic/DataEngineering
  - Topic/Development
aliases:
  - Spatial Temporal Asset Catalog (STAC)
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

**Spatial Temporal Asset Catalog (STAC)** is a specification for organizing and sharing geospatial data in a standardized way, enabling easier discovery and access to spatial datasets. STAC provides a common language for describing geospatial assets and their metadata.

## Components

The key components in STAC are:

- **Item** is a single spatial temporal asset (i.e., one satellite scene).
- **Catalog** is a collection of Items and child Catalogs.
- **Collection** is a set of related Items with shared metadata.
- **Asset** is a file associated with an Item ([[Cloud Optimized GeoTIFF (COG)|COG]], thumbnail, metadata).
- **Extension** adds domain-specific metadata fields.

| Component | Description |
|-----------|-------------|
| STAC Catalog | JSON file organizing Items/Collections |
| STAC Collection | JSON describing a dataset collection |
| STAC Item | JSON describing a single asset |
| STAC API | RESTful API for searching catalogs |

## Example

```json
{
  "type": "Feature",
  "stac_version": "1.0.0",
  "id": "scene-123",
  "geometry": {...},
  "bbox": [...],
  "properties": {
    "datetime": "2024-01-15T10:30:00Z"
  },
  "assets": {
    "image": {"href": "s3://bucket/image.tif"}
  }
}
```

## Resources

***

## Appendix

*Note created on [[2026-06-05]] and last modified on [[2026-06-05]].*

### See Also

- [[MOC - Geospatial|Geospatial MOC]]
- [[Geographic Information Systems (GIS)]]
- [[Cloud Native Group (CNG)]]
- [[Guide - Best Practices for Distributing GeoParquet|GeoParquet Distribution Best Practice]]


***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026