---
creation_date: 2026-05-31
modification_date: 2026-05-31
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Resilient File System (ReFS)
tags:
  - Type/Definition
  - Status/Complete
  - Topic/Development
  - Topic/Windows
aliases:
  - Resilient File System
  - ReFS
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

> [!SOURCE]
> [Resilient File System (ReFS) overview | Microsoft Learn](https://learn.microsoft.com/en-us/windows-server/storage/refs/refs-overview)

The Resilient File System (ReFS) is a modern file system developed by [[Microsoft]] to maximize data availability, scale efficiently to large data sets across diverse workloads, and provide data integrity with resiliency to corruption. ReFS seeks to address an expanding set of storage scenarios and establish a foundation for future innovations.

## Key Benefits

### Resiliency

ReFS has features that can precisely detect corruptions and also fix those corruptions while remaining online, helping provide increased integrity and availability for your data:

- **Integrity-streams** - ReFS uses checksums for metadata and optionally for file data, giving ReFS the ability to reliably detect corruptions.
- **Storage Spaces integration** - When used with a mirror or parity space, ReFS can automatically repair detected corruptions using the alternate copy of the data provided by Storage Spaces. Repair processes are both localized to the area of corruption and performed online, requiring no volume downtime.
- **Salvaging data** - If a volume becomes corrupted and an alternate copy of the corrupted data doesn't exist, ReFS removes the corrupt data from the namespace. ReFS keeps the volume online while it handles most non-correctable corruptions, but there are rare cases that require ReFS to take the volume offline.
- **Proactive error correction** - In addition to validating data before reads and writes, ReFS introduces a data integrity scanner, known as a _scrubber_. This scrubber periodically scans the volume, identifying latent corruptions and proactively triggering a repair of corrupt data.

### Performance

In addition to providing resiliency improvements, ReFS has features for performance-sensitive and virtualized workloads. Real-time tier optimization, block cloning, and sparse valid data length (VDL) are good examples of the evolving capabilities of ReFS, which are designed to support dynamic and diverse workloads:

- **[Mirror-accelerated parity](https://learn.microsoft.com/en-us/windows-server/storage/refs/mirror-accelerated-parity)** - Mirror-accelerated parity delivers both high performance and also capacity efficient storage for your data.
    
    To deliver both high performance and capacity efficient storage, ReFS divides a volume into two logical storage groups, known as tiers. These tiers can have their own drive and resiliency types, allowing each tier to optimize for either performance or capacity. Some example configurations include:
    
    | Performance Tier| Capacity Tier |
    |---|---|
    |Mirrored SSD|Mirrored HDD|
    |Mirrored SSD|Parity SSD|
    |Mirrored SSD|Parity HDD|
    
    Once these tiers are configured, ReFS uses them to deliver fast storage for hot data and capacity-efficient storage for cold data:
    
    - All writes occur in the performance tier, and large chunks of data that remain in the performance tier are efficiently moved to the capacity tier in real time.
        
    - If using a hybrid deployment (mixing flash and HDD drives), [the cache in Storage Spaces Direct](https://learn.microsoft.com/en-us/azure/azure-local/concepts/cache?context=/windows-server/context/windows-server-storage) helps accelerate reads, reducing the effect of data fragmentation characteristic of virtualized workloads. Otherwise, if using an all-flash deployment, reads also occur in the performance tier.
        
    - For Windows Server deployments, mirror-accelerated parity is only supported on [Storage Spaces Direct](https://learn.microsoft.com/en-us/windows-server/storage/storage-spaces/storage-spaces-direct-overview). We recommend using mirror-accelerated parity with archival and backup workloads only. For virtualized and other high performance random workloads, we recommend using three-way mirrors for better performance.
        
- **Accelerated VM operations** - ReFS improves the performance of virtualized workloads:
    
    - [Block cloning](https://learn.microsoft.com/en-us/windows-server/storage/refs/block-cloning) - Block cloning accelerates copy operations, enabling quick, low-impact VM checkpoint merge operations.
    - Sparse VDL - Sparse VDL allows ReFS to zero files rapidly, reducing the time needed to create fixed VHDs from 10s of minutes to mere seconds.
- **Variable cluster sizes** - ReFS supports both 4K and 64K cluster sizes. 4K is the recommended cluster size for most deployments, but 64K clusters are appropriate for large, sequential IO workloads.

### Scalability

ReFS is designed to support extremely large data sets - millions of terabytes - without negatively impacting performance, achieving greater scale than prior file systems.

## Resources

- [Cluster size recommendations for ReFS and NTFS](https://techcommunity.microsoft.com/t5/Storage-at-Microsoft/Cluster-size-recommendations-for-ReFS-and-NTFS/ba-p/425960)
- [Storage Spaces Direct overview](https://learn.microsoft.com/en-us/windows-server/storage/storage-spaces/storage-spaces-direct-overview)
- [ReFS block cloning](https://learn.microsoft.com/en-us/windows-server/storage/refs/block-cloning)
- [ReFS integrity streams](https://learn.microsoft.com/en-us/windows-server/storage/refs/integrity-streams)
- [Troubleshoot ReFS with ReFSUtil](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/refsutil)
- [Use of ReFS with Cluster-Shared Volumes](https://learn.microsoft.com/en-us/windows-server/failover-clustering/failover-cluster-csvs)
- [ReFS versions and compatibility matrix](https://gist.github.com/XenoPanther/15d8fad49fbd51c6bd946f2974084ef8)

***

## Appendix

*Note created on [[2026-05-31]] and last modified on [[2026-05-31]].*

### See Also

- [[MOC - Development]]
- [[MOC - Windows]]
- [[Windows DevDrive]]
- [[PowerShell - Migrate Modules to DevDrive]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
