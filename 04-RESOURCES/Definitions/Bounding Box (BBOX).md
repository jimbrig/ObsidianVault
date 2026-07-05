---
creation_date: 2026-06-25
modification_date: 2026-06-25T12:23:43-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Definition note for Bounding Box (BBOX)
tags:
  - Type/Definition
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
aliases:
  - BBOX
  - Bounding Box
  - Envelope
  - MBR
  - Minimum Bounding Rectangle
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

In [[MOC - Geospatial|Geospatial]] development, a **bounding box (bbox)** is a rectangular area defined by *the minimum and maximum coordinates (latitude and longitude) that encompasses a spatial dataset or map extent*. Bounding boxes are used extensively in spatial queries, web map requests, and data filtering.

A bounding box is composed of the following values:

- **Minimum X (West) or `xmin`**: minimum longitude/easting
- **Minimum Y (South) or `ymin`**: minimum latitude/northing
- **Maximum X (East) or `xmax`**: maximum longitude/easting
- **Maximum Y (North) or `ymax`**: maximum latitude/northing
- **Axis Order**: varies by standard (`lat/lon` vs. `lon/lat`)

## Formats

Bounding boxes come in a variety of formats and flavors:

| Context | Format                      | Example |
| ------- | --------------------------- | ------- |
| WMS 1.1 | `xmin`,`ymin`,`xmax`,`ymax` | -74.25,40.50,-73.70,40.92        |
| WMS 1.3 | (axis order varies) | 40.50,-74.25,40.92,-73.70 |
| GeoJSON | `[minx, miny, maxx, maxy]` | `[-74.25, 40.50, -73.70, 40.92]` |
| WKT | POLYGON from corners | POLYGON((...)) |


***

## Appendix

*Note created on [[2026-06-25]] and last modified on [[2026-06-25]].*

### See Also

- [[MOC - Geospatial]]
- [[OGC Web Map Service (WMS)]]
- [[Coordinate Reference System (CRS)]]
- [[Well Known Text (WKT)]]


***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
