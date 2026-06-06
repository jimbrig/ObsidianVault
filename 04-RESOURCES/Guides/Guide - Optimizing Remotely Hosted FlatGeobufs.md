---
creation_date: 2026-06-06
modification_date: 2026-06-06
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Guide - Optimizing Remotely Hosted FlatGeobufs
tags:
  - Type/Guide
  - Status/WIP
  - Topic/Geospatial
  - Topic/Development
  - Topic/DataEngineering
aliases:
  - Optimizing Remotely Hosted FlatGeobufs
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Guide

If you’re accessing a [[FlatGeoBuf (FGB)|FlatGeoBuf]] file over [[Hypertext Transfer Protocol (HTTP)|HTTP]], consider using a [[Content Delivery Network (CDN)|CDN]] to minimize latency.

In particular, when [using the spatial filter](https://flatgeobuf.org/examples/leaflet/filtered.html) to get a subset of features, multiple requests will be made. Often round-trip latency, rather than throughput, is the limiting factor. A caching CDN can be especially helpful here.

Fetching a subset of a file over HTTP utilizes Range requests. If the page accessing the FGB is hosted on a different domain from the CDN, [Cross Origin](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) policy applies, and the required `Range` header will induce an `OPTIONS` (preflight) request.

Popular CDNs, like CloudFront, support Range Requests, but don’t cache the requisite preflight `OPTIONS` requests by default. Consider [enabling OPTIONS request caching](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html#header-caching-web-cors) . Without this, the preflight authorization request could be much slower than necessary.



***

## Appendix

*Note created on [[2026-06-06]] and last modified on [[2026-06-06]].*

### See Also

- [[FlatGeoBuf (FGB)|FlatGeoBuf]]
- [[Guide - Best Practices for Distributing GeoParquet|GeoParquet Distribution Best Practices]]
- [[MOC - Geospatial|Geospatial MOC]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
