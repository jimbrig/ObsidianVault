---
creation_date: 2025-12-27
modification_date: 2025-12-27
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
description: 'PowerShell code demonstrating how to add the "God Mode" shortcut to the desktop.'
tags: [Type/Code, Topic/PowerShell, Topic/Windows, Status/Complete]
aliases: 
  - Add God Mode Shortcut to Desktop with PowerShell
  - Add-GodModeShortcut.ps1
  - Add-GodModeShortcut
cssclasses:
  - code
---

# Add God Mode Shortcut to Windows Desktop with PowerShell

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - [PSScripts/src/Add-GodModeShortcut at main · jimbrig/PSScripts](https://github.com/jimbrig/PSScripts/tree/main/src/Add-GodModeShortcut)
> - [PowerShell Gallery | Add-GodModeShortcut 1.0.2](https://www.powershellgallery.com/packages/Add-GodModeShortcut/1.0.2)

Adds the [God Mode]() shortcut (`.lnk`) to Windows Desktop.

## Code

```powershell
<# 
    .SYNOPSIS
        Adds a desktop shortcut for the `GodMode` Windows Advanced Options.
    .DESCRIPTION
        Adds a desktop shortcut for the `GodMode` Windows Advanced Options.
    .EXAMPLE
        Add-GodModeShortcut
        
        # Now Desktop has a shortcut.
#>
[CmdletBinding()]
Param()

$ErrorActionPreference = 'Stop'

$Desktop = [Environment]::GetFolderPath("Desktop")

If (!(Test-Path "$Desktop\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}")) { 
    New-Item -Path "$Desktop\GodMode.{ED7BA470-8E54-465E-825C-99712043E01C}" -ItemType Directory | Out-Null
}
```

## Output

The resulting output from the script is the link on the desktop per below image:

![[Pasted image 20251227174414.png]]

when opened:

![[Pasted image 20251227174621.png]]

***

## Appendix

*Note created on [[2025-12-27]] and last modified on [[2025-12-27]].*

### See Also

- [[04-RESOURCES/Code/PowerShell/_README|PowerShell Code]]

### Backlinks

```dataview
LIST FROM [[PowerShell - Add GodMode Shortcut to Desktop]] 
WHERE file.name != "_README" AND file.name != this.file.name AND file.name != "CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

