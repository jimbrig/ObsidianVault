---
creation_date: 2024-09-18
modification_date: 2024-12-31
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/Windows
  - Topic/Registry
  - Status/Complete
aliases:
  - Set Dark Theme
  - Windows Dark Mode Registry
description: Registry entries to enable Windows dark theme for apps and system
cssclasses:
  - code
---

# Set Dark Theme

> [!info] Code Properties
> - **Language**: Windows Registry / CMD
> - **OS**: Windows 10/11

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

Registry entries to enable dark theme for Windows applications and system UI.

## Code

### Registry File

```registry
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize]
"ColorPrevalence"=dword:00000000
"EnableTransparency"=dword:00000001
"AppsUseLightTheme"=dword:00000000
"SystemUsesLightTheme"=dword:00000000
```

### CMD Commands

```cmd
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 0 /f
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v SystemUsesLightTheme /t REG_DWORD /d 0 /f
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" /v EnableTransparency /t REG_DWORD /d 1 /f
```

## Usage

Save the registry content to a `.reg` file and import it, or run the CMD commands in an elevated prompt.

| Value | Setting |
|-------|---------|
| `AppsUseLightTheme=0` | Dark theme for apps |
| `SystemUsesLightTheme=0` | Dark theme for system |
| `EnableTransparency=1` | Enable transparency effects |

***

## Appendix

*Note created on [[2024-09-18]] and last modified on [[2024-12-31]].*

### See Also

- [[04-RESOURCES/Code/Registry/_README|Registry Code Index]]

### Backlinks

```dataview
LIST FROM [[Registry - Set Dark Theme]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024
