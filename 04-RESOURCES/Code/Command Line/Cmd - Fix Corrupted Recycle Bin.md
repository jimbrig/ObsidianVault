---
creation_date: 2026-05-31
modification_date: 2026-05-31
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Cmd - Fix Corrupted Recycle Bin
tags:
  - Type/Code
  - Status/WIP
  - Topic/Windows
  - Topic/Development
aliases:
  - Fix Corrupted Recycle Bin
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Code

> [!SOURCE] Sources:
> - *[Recycle bin not emptying - Microsoft Community](https://answers.microsoft.com/en-us/windows/forum/all/recycle-bin-not-emptying/404e6fbc-3647-403e-84a1-b53821b119a6)*

```cmd
REM run as administrator
rd /s /q "C:\$Recycle.bin"
```

## Usage

1. Open Command Prompt as Administrator
2. Run the command above
3. The Recycle Bin will be recreated automatically by Windows

> [!warning]
> This permanently deletes all items in the Recycle Bin.

***

## Appendix

*Note created on [[2026-05-31]] and last modified on [[2026-05-31]].*

### See Also

- [[PowerShell - Clear Recycle Bin]]
- [[MOC - Windows]]
- [[MOC - Development]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026