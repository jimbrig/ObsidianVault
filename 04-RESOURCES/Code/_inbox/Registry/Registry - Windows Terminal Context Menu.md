---
creation_date: 2025-12-31
modification_date: 2025-12-31
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Status/WIP
  - Topic/Registry
aliases:
  - Untitled
  - Registry - Windows Terminal Context Menu
  - Windows Terminal Context Menu
publish: true
permalink:
description:
cssclasses:
  - code
---

# Add Windows Terminal Context Menu Registry Code

```table-of-contents
title: ## Contents 
style: nestedList # TOC style (nestedList|inlineFirstLevel)
minLevel: 1 # Include headings from the specified level
maxLevel: 4 # Include headings up to the specified level
includeLinks: true # Make headings clickable
debugInConsole: false # Print debug info in Obsidian console
```

## Overview

> [!SOURCE] Sources:
> - *https://www.majorgeeks.com/content/page/open_in_windows_terminal.html*

## Code Snippet

- **Add**: Context Menu to open Windows Terminal for **All Users**:

```registry
Windows Registry Editor Version 5.00

; MajorGeeks.Com
; Add or Remove 'Open in Windows Terminal' in Windows 11
; https://www.majorgeeks.com/content/page/open_in_windows_terminal.html

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked]
"{9F156763-7844-4DC4-B2B1-901F640F5155}"=-
```

- **Remove**: Context Menu to open Windows Terminal for **All Users**:

```registry
Windows Registry Editor Version 5.00

; MajorGeeks.Com
; Add or Remove 'Open in Windows Terminal' in Windows 11
; https://www.majorgeeks.com/content/page/open_in_windows_terminal.html

[HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked]
"{9F156763-7844-4DC4-B2B1-901F640F5155}"=""
```

- **Add**: Context Menu to open Windows Terminal for **Current User**:

```registry
Windows Registry Editor Version 5.00

; MajorGeeks.Com
; Add or Remove 'Open in Windows Terminal' in Windows 11
; https://www.majorgeeks.com/content/page/open_in_windows_terminal.html

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked]
"{9F156763-7844-4DC4-B2B1-901F640F5155}"=-
```

- **Remove**: Context Menu to open Windows Terminal for **Current User**:

```registry
Windows Registry Editor Version 5.00

; MajorGeeks.Com
; Add or Remove 'Open in Windows Terminal' in Windows 11
; https://www.majorgeeks.com/content/page/open_in_windows_terminal.html

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Shell Extensions\Blocked]
"{9F156763-7844-4DC4-B2B1-901F640F5155}"=""
```

## See Also

- [[04-RESOURCES/Code/Registry/_README|Windows Registry Code Index]]
- [[MOC - Development]]
- [[MOC - Computer Science]]
- [[MOC - Windows]]