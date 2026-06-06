---
creation_date: 2024-10-06
modification_date: 2024-12-31
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/PowerShell
  - Status/Complete
aliases:
  - Lazy Loading
  - PowerShell Lazy Loading
description: PowerShell patterns for implementing lazy loading of modules, scripts, and resources
cssclasses:
  - code
---

# Lazy Loading

> [!info] Code Properties
> - **Language**: PowerShell
> - **Concepts**: Deferred Loading, Proxy Functions

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

Lazy loading in PowerShell allows you to defer loading of resources, scripts, or modules until they are actually needed, optimizing performance and memory usage.

Common use cases:
- Lazy loading modules
- Lazy loading shell completion scripts
- Lazy loading custom PowerShell profile components

## Code

### Lazy Loading Modules

```powershell
function Get-ModuleCommand {
    <#
    .SYNOPSIS
    Use a script-scoped variable to track if the module is loaded
    #>
    if (-not $script:MyModuleLoaded) {
        Import-Module -Name MyModule
        $script:MyModuleLoaded = $true
    }

    # now call a command from the module
    MyModuleCommand
}
```

### Dynamic Script Block Execution

```powershell
# define a script block for lazy loading
$LazyCommand = {
    if (-not $script:MyModuleLoaded) {
        Import-Module -Name MyModule
        $script:MyModuleLoaded = $true
    }
    MyModuleCommand
}

# call the script block when needed
& $LazyCommand
```

### Conditional Module Loading

```powershell
function Get-LazyLoadedCommand {
    if (-not (Get-Module -Name MyModule -ListAvailable)) {
        Import-Module -Name MyModule
    }

    MyModuleCommand
}
```

### Proxy Functions

```powershell
function Invoke-MyLazyCommand {
    if (-not $script:MyModuleLoaded) {
        Import-Module -Name MyModule
        $script:MyModuleLoaded = $true
    }

    # replace this proxy function with the actual module command
    Set-Alias -Name Invoke-MyLazyCommand -Value Invoke-MyModuleCommand -Scope Script
    Invoke-MyLazyCommand
}
```

## Usage

Choose the pattern that best fits your use case:

- **Script-scoped variable**: Best for modules used multiple times in a session
- **Script blocks**: Good for one-off commands that may or may not be needed
- **Proxy functions**: Ideal for replacing commands after first use

***

## Appendix

*Note created on [[2024-10-06]] and last modified on [[2024-12-31]].*

### See Also

- [[04-RESOURCES/Code/PowerShell/_README|PowerShell Code Index]]

### Backlinks

```dataview
LIST FROM [[PowerShell - Lazy Loading]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024
