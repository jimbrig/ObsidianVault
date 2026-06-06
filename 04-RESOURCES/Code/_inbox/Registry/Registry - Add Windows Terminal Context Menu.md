---
creation_date: 2024-05-17
modification_date: 2024-12-31
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/Windows
  - Topic/Registry
  - Status/Complete
aliases:
  - Add Windows Terminal Context Menu
  - Windows Terminal Registry
description: Registry entries to add or remove Windows Terminal from the Windows 11 context menu
cssclasses:
  - code
---

# Add Windows Terminal Context Menu

> [!info] Code Properties
> - **Language**: Windows Registry
> - **OS**: Windows 11

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - *[MajorGeeks - Open in Windows Terminal](https://www.majorgeeks.com/content/page/open_in_windows_terminal.html)*

Registry entries to add or remove the "Open in Windows Terminal" option from the Windows 11 context menu.

## Code

### Add for All Users

```registry
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked]
"{9F156763-7844-4DC4-B2B1-901F640F5155}"=-
```

### Remove for All Users

```registry
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked]
"{9F156763-7844-4DC4-B2B1-901F640F5155}"=""
```

### Add for Current User

```registry
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked]
"{9F156763-7844-4DC4-B2B1-901F640F5155}"=-
```

### Remove for Current User

```registry
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked]
"{9F156763-7844-4DC4-B2B1-901F640F5155}"=""
```

## Usage

1. Save the desired registry content to a `.reg` file
2. Double-click to import, or right-click and select "Merge"
3. Confirm the UAC prompt

***

## Appendix

*Note created on [[2024-05-17]] and last modified on [[2024-12-31]].*

### See Also

- [[04-RESOURCES/Code/Registry/_README|Registry Code Index]]

### Backlinks

```dataview
LIST FROM [[Registry - Add Windows Terminal Context Menu]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024
