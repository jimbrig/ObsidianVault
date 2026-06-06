---
creation_date: 2026-05-04
modification_date: 2026-05-04
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: 'FlatGeoBuf (FGB) Definition'
tags:
  - Type/Definition
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
  - Topic/ComputerScience
aliases: 
  - FGB
  - FlatGeoBuf
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE]
> - [FlatGeoBuf](https://flatgeobuf.org/)

**FlatGeoBuf (FGB)** is a modern, performant binary encoding for geographic data based on [flatbuffers](http://google.github.io/flatbuffers/) that can hold a collection of [Simple Features](https://en.wikipedia.org/wiki/Simple_Features) including circular interpolations as defined by [SQL-MM Part 3](https://dl.gi.de/server/api/core/bitstreams/e56229fd-545f-449d-9de1-dba1818faa84/content).

Inspired by [geobuf](https://github.com/mapbox/geobuf) and [flatbush](https://github.com/mourner/flatbush). Deliberately does not support random writes for simplicity and to be able to cluster the data on a [packed Hilbert R-Tree](https://en.wikipedia.org/wiki/Hilbert_R-tree#Packed_Hilbert_R-trees) enabling fast bounding box spatial filtering. The spatial index is optional to allow the format to be efficiently written as a stream, support appending, and for use cases where spatial filtering is not needed.

Goals are to be suitable for large volumes of static data, significantly faster than legacy formats without size limitations for contents or metainformation and to be suitable for streaming/random access.

The site [switchfromshapefile.org](http://switchfromshapefile.org/) has more in depth information about the problems of legacy formats and provides some alternatives but acknowledges that the current alternatives has some drawbacks on their own, for example they are not suitable for streaming.

FlatGeobuf is open source under the [BSD 2-Clause License](https://tldrlegal.com/license/bsd-2-clause-license-\(freebsd\)).

## Specification

![](https://flatgeobuf.org/doc/layout.svg)

- MB: Magic bytes (`0x6667620366676201`)
- H: Header (variable size [flatbuffer](https://github.com/flatgeobuf/flatgeobuf/blob/master/src/fbs/header.fbs))
- I (optional): Static packed Hilbert R-tree index (static size [custom buffer](https://github.com/flatgeobuf/flatgeobuf/blob/master/src/cpp/packedrtree.h))
- DATA: Features (variable size [flatbuffer](https://github.com/flatgeobuf/flatgeobuf/blob/master/src/fbs/feature.fbs)s)

The fourth byte in the magic bytes indicates major specification version. The last byte of the magic bytes indicate patch level. Patch level is backwards compatible so an implementation for a major version should accept any patch level version.

Encoding of any string value is assumed to be UTF-8.

A changelog of the specification is available [here](https://flatgeobuf.org/doc/format-changelog.html).

I recommend these blog posts by Horace Williams provides more details and explanations:

- https://worace.works/2022/02/23/kicking-the-tires-flatgeobuf/
- https://worace.works/2022/03/12/flatgeobuf-implementers-guide/

The OWL (RDF) ontology corresponding to the specification is available [here](https://github.com/flatgeobuf/flatgeobuf/blob/master/src/rdf/schema.ttl)

## Implementations

- [GDAL/OGR driver](https://gdal.org/drivers/vector/flatgeobuf.html)
- [GeoServer WFS output format](https://docs.geoserver.org/latest/en/user/community/flatgeobuf/index.html)

### Supported Applications/Libraries

- [Fiona](https://fiona.readthedocs.io/) (1.8.18 and forward)
- [GDAL](https://gdal.org/) (3.1 and forward)
- [Geo Data Viewer (Visual Studio Code extension)](https://marketplace.visualstudio.com/items?itemName=RandomFractalsInc.geo-data-viewer) (2.3 and forward)
- [GeoServer](https://geoserver.org/) (2.17 and forward)
- [GeoTools](https://geotools.org/) (23.0 and forward)
- [MapServer](https://mapserver.org/input/vector/flatgeobuf.html) (with GDAL >=3.1.0)
- [PostGIS](https://postgis.net/) (3.2.0 and forward)
- [pyogrio](https://pyogrio.readthedocs.io/en/latest/)
- [QField](https://qfield.org/)
- [QGIS](https://qgis.org/) (3.16 and forward)
- [ldproxy](https://github.com/interactive-instruments/ldproxy) (3.3 and forward)
- [gogama/flatgeobuf](https://github.com/gogama/flatgeobuf)

### TypeScript / JavaScript

- [API Docs](http://unpkg.com/flatgeobuf/dist/doc/index.html)

#### Prebuilt Bundles (Client Side)

- [flatgeobuf.min.js](https://unpkg.com/flatgeobuf/dist/flatgeobuf.min.js) (contains the generic module)
- [flatgeobuf-geojson.min.js](https://unpkg.com/flatgeobuf/dist/flatgeobuf-geojson.min.js) (contains the [[GeoJSON]] module)
- [flatgeobuf-ol.min.js](https://unpkg.com/flatgeobuf/dist/flatgeobuf-ol.min.js) (contains the `ol` module)

### Node Usage

See [this](https://github.com/flatgeobuf/flatgeobuf/tree/master/examples/node) example for a minimal how to depend on and use the FlatGeoBuf [[Node Package Manager (NPM)|npm]] package.

***

## Appendix

*Note created on [[2026-06-06]] and last modified on [[2026-06-06]].*

### See Also

- [[Guide - Optimizing Remotely Hosted FlatGeobufs]]
- [[MOC - Geospatial|Geospatial MOC]]
- [[Cloud Native Group (CNG)|Cloud Native]] 

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
