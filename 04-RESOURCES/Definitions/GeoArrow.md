---
creation_date: 2026-06-25
modification_date: 2026-06-27T17:01:21-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Definition of the GeoArrow format
tags:
  - Type/Definition
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
  - Topic/DataEngineering
aliases:
  - GeoArrow
  - (Geo)Arrow
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

**GeoArrow** is a subset of the [[Apache Arrow]] project providing a standardized, language-independent, columnar, in-memory format for geospatial data. It enables shared computational libraries, zero-copy shared memory and streaming messaging, inter-process communication, and is supported by many programming languages and data libraries.

Spatial information can be represented as a collection of discrete objects using points, lines and polygons (i.e., vector data).

- The **Simple Feature Access** standard provides a widely used abstraction, defining a set of geometries: *`Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, `MultiPolygon`, and `GeometryCollection`*.
- Next to a geometry, simple features can also have non-spatial attributes that describe the feature.

The GeoArrow specification defines how the vector features (geometries) can be stored in [[Apache Arrow]] (and Arrow-compatible) data structures.

## Relationship to [[GeoParquet]]

[[GeoParquet]] is a file-level metadata specification, [[GeoArrow]] is a field-level metadata and memory layout specification that applies in-memory (an Arrow array), on disk (using Parquet readers/writers provided by an Arrow implementation), and over the wire (using the [[Arrow IPC Format]]).

***

## Appendix

*Note created on [[2026-06-25]] and last modified on [[2026-06-25]].*

### See Also

- [[MOC - Geospatial]]
- [[GeoParquet]]


***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
