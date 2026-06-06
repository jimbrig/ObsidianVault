---
creation_date: 2026-05-31
modification_date: 2026-05-31
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Registry - Custom Mouse Cursor
tags:
  - Type/Code
  - Status/Complete
  - Topic/Development
  - Topic/Windows
aliases:
  - Custom Mouse Cursor
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

I like to use a slightly customized mouse cursor on Windows that is a Light Green color scheme:

![](https://i.imgur.com/lGiPxrp.png)


## File System

Cursors can be saved to disk using the `.cur` or `.ani` (animated) file extensions.

Cursors are also stored on the file system at the paths:

System:
- `C:\Windows\Cursors` (It should be noted that these are typically all [[Hardlinks]] referencing the full path below)
- `C:\Windows\WinSxS\amd64_microsoft-windows-shell-acccursors_31bf3856ad364e35_10.0.29599.1000_none_7e180918ecb34b2b`

User:
- `%LOCALAPPDATA%\Microsoft\Windows\Cursors`

Additionally, the current user's Theme & WinX folders are also relevant:

- `%LOCALAPPDATA%\Microsoft\Windows\Themes`
- `%LOCALAPPDATA%\Microsoft\Windows\WinX\{Group1,Group2, Group3}`

## Registry

```registry

```

***

## Appendix

*Note created on [[2026-05-31]] and last modified on [[2026-05-31]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
