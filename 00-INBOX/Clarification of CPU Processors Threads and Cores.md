---
creation_date: 2026-06-06
modification_date: 2026-06-06
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Clarification of CPU Processors Threads and Cores
tags:
  - Type/Reference
  - Status/WIP
  - Topic/ComputerScience
  - Topic/Windows
  - Topic/R
  - Topic/PowerShell
aliases:
  - Clarification of CPU Processors Threads and Cores
---

## Introduction

Given the following information from both R and PowerShell:

From [[MOC - R|R]]:

```R
> parallel::detectCores(logical = TRUE)
[1] 12
> gdalraster::get_num_cpus()
[1] 12
```

From [[MOC - PowerShell|PowerShell]]:

```powershell
➜ [Environment]::ProcessorCount
12

➜ Get-CimInstance -ClassName Win32_Processor | Select-Object Name, DeviceID, NumberOfCores, NumberOfLogicalProcessors

Name                                      DeviceID NumberOfCores NumberOfLogicalProcessors
----                                      -------- ------------- -------------------------
Intel(R) Core(TM) i7-10750H CPU @ 2.60GHz CPU0                 6                        12

➜ (Get-CimInstance -ClassName Win32_Processor | Measure-Object -Property NumberOfCores -Sum).Sum
6

➜ (Get-CimInstance -ClassName Win32_Processor | Measure-Object -Property NumberOfLogicalProcessors -Sum).Sum
12
```

## Overview

how can we make use of these details?

The difference boils down to **physical hardware components vs. software execution channels**, which explains why all three programming environments report `12` units even though the machine *only has 1 physical chip with 6 physical engines*. 

The `parallel::detectCores(logical = TRUE)`, `gdalraster::get_num_cpus()`, and `[Environment]::ProcessorCount` commands are all reporting **Logical Processors (Threads)**, not physical CPU chips or physical cores.

## Number of [[Central Processing Unit (CPU)]]s

This is the number of **physical silicon chips** plugged into the motherboard. 

The system has: **1 CPU**

The `Get-CimInstance` output shows a single row (`CPU0`), indicating a single *Intel Core i7-10750H* processor package sits on its motherboard.

## Number of CPU Cores (Physical)

These are the independent **physical processing units** inside that single CPU chip. 

Each core has its own hardware execution pipeline and cache.

The system has **6 Cores**.

The [[MOC - PowerShell|PowerShell]] command `NumberOfCores` returned `6`. 

This means the single CPU chip is *physically divided into 6 distinct mini-processors*.

## Number of Logical Processors (Threads & Virtual Cores)

These are the **software execution channels** that the operating system can pass instructions to. 

This number is a result of Hyper-Threading (Intel) or SMT (AMD), a technology that allows a single physical core to masquerade as two cores to the operating system by duplicating the architectural state (like registers) but sharing the main execution engines.

The system has: **12 Logical Processors**

Because Hyper-Threading is enabled on the `i7-10750H`, *each of the 6 physical cores handles 2 threads at once*:

$$6 \text{ cores} \times 2 = 12 \text{ threads}$$

## Terminology Comparison

| Term              | Also Known As         | Meaning                                          | Value |
| ----------------- | --------------------- | ------------------------------------------------ | ----- |
| CPU               | Socket / Package      | The physical chip in the motherboard socket      | 1     |
| CPU Core          | Physical Core         | The real, distinct hardware processing engine.   | 6     |
| Logical Processor | Thread / Virtual Core | The virtual pipeline the OS schedules work onto. | 12    |

## Summary

So circling back to the original code examples:

- **`parallel::detectCores(logical = TRUE)`**: The `logical = TRUE` flag specifically tells [[MOC - R|R]] to count the virtual threads (12) instead of the physical cores (6). If you run `parallel::detectCores(logical = FALSE)`, it will return `6`.
- **`gdalraster::get_num_cpus()`**: GDAL counts the processing slots exposed by the operating system. Because Windows tells GDAL there are 12 logical processing pools available, GDAL reports 12.
- **`[Environment]::ProcessorCount`**: This .NET property natively counts the total logical processors available to the current process.

The number of CPU cores refers to the actual physical hardware engines on your chip (you have 6), while the number of CPUs reported by these functions represents the virtual processing channels (logical processors) created by Hyper-Threading (you have 12).Are you looking to optimize your R parallel cluster configuration or GDAL environment variables to match these 6 physical vs. 12 logical cores? I can show you how to set up workers so your system doesn't experience bottlenecks.

***

## Appendix

*Note created on [[2026-06-06]] and last modified on [[2026-06-06]].*

### See Also

- [[MOC - Computer Science|Computer Science]]
- [[MOC - Geospatial|Geospatial]]
- [[MOC - Windows|Windows]]
- [[MOC - PowerShell|PowerShell]]
- [[MOC - R|R]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026