---
creation_date: 2026-06-19
modification_date: 2026-06-19T20:19:01-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: ZSTD Compression
tags:
  - Type/Guide
  - Status/WIP
  - Topic/Geospatial
  - Topic/DataEngineering
  - Topic/ComputerScience
  - Topic/Development
aliases:
  - ZSTD Compression
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

Use the `zstd` [[Command Line Interface (CLI)|CLI]] tool to apply [[ZSTD]] compression. For example, a [[FlatGeoBuf (FGB)|FlatGeoBuf]] has no built-in compression codec; its on-disk layout is uncompressed binary tuned for HTTP range reads. To shrink the cold-storage footprint, compress at the storage or transport layer.

For example, store `.fgb` objects with `ZSTD` at the object-store tier, or serve them `gzip`/`Brotli`-encoded over HTTP. 

Level 9 `ZSTD` delivers roughly 40% better ratios than level 3 with negligible decompression latency on modern ARM/x86 silicon. 

For workloads that need columnar, internally-compressed storage, migrate the analytical tier to [[GeoParquet]] instead.

```powershell
➜ zstd --version
*** Zstandard CLI (64-bit) v1.5.7, by Yann Collet ***
➜ zstd -9 .\parcels.q2.min.fgb -o .\parcels.q2.min.fgb.zst
.\parcels.q2.min.fgb : 40.87%   (  2.21 GiB =>    924 MiB, .\parcels.q2.min.fgb.zst)
```

***

## Appendix

*Note created on [[2026-06-19]] and last modified on [[2026-06-19]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
