---
creation_date: 2025-12-22
modification_date: 2025-12-22
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags: [Type/Code, Topic/PowerShell, Status/Complete]
aliases:
  - Get-ObsidianVaultPlugins
  - Get-ObsidianVaultPlugins.ps1
description: "PowerShell Script to automate the documentation and listing of the vault's plugins"
cssclasses:
  - code
---

# PowerShell - Get-ObsidianVaultPlugins

```table-of-contents
title: ## Contents 
style: nestedList
minLevel: 1
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - *Source URL or reference*

Description of this code snippet/script/module.

## Code

```powershell
Function Get-ObsidianPluginInventory {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [string]$VaultPath,

        [string]$PluginsRelativePath = ".obsidian/plugins"
    )

    # Resolve plugins path
    $pluginsPath = Join-Path -Path (Resolve-Path $VaultPath) -ChildPath $PluginsRelativePath

    if (-not (Test-Path $pluginsPath)) {
        Write-Error "Plugins path not found: $pluginsPath"
        return
    }

    # Collect plugin metadata from manifest.json
    $plugins = Get-ChildItem -Path $pluginsPath -Directory | ForEach-Object {
        $manifestPath = Join-Path $_.FullName 'manifest.json'
        if (Test-Path $manifestPath) {
            try {
                $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
                [PSCustomObject]@{
                    Name        = $manifest.name
                    Id          = $manifest.id
                    Version     = $manifest.version
                    Description = $manifest.description
                    Author      = $manifest.author
                    AuthorUrl   = $manifest.authorUrl
                    Path        = $_.FullName
                }
            }
            catch {
                Write-Warning "Failed to parse manifest: $manifestPath. $_"
            }
        }
    } | Sort-Object Name

    if (-not $plugins) {
        Write-Warning "No plugin manifests found under $pluginsPath"
        return
    }

    # Build markdown table: Name | Version | Description
    $markdownLines = @()
    $markdownLines += "| Name | Version | Description |"
    $markdownLines += "| :---------------------------------: | :-----: | -------------------------------------------------------------------------------------------------------------------------------- |"

    foreach ($p in $plugins) {
        # Escape pipes in description
        $desc = ($p.Description -replace '\|', '\|')
        $markdownLines += "| $($p.Name) | $($p.Version) | $desc |"
    }

    # Return rich object
    [PSCustomObject]@{
        VaultPath     = (Resolve-Path $VaultPath).Path
        PluginsPath   = $pluginsPath
        Count         = $plugins.Count
        Plugins       = $plugins
        MarkdownLines = $markdownLines     # string[]
        MarkdownTable = $markdownLines -join [Environment]::NewLine
        Csv           = ($plugins | Select-Object Name, Version, Description | ConvertTo-Csv -NoTypeInformation | Out-String).Trim()
        Json          = ($plugins | Select-Object Name, Version, Description | ConvertTo-Json -Depth 5)
    }
}

```

## Usage

How to use this code:

1.
2.
3.

## Notes

Additional notes about the code.

***

## Appendix

*Note created on [[2025-12-22]] and last modified on [[2025-12-22]].*

### See Also

- [[03-AREAS/MOC - PowerShell|PowerShell Map of Content]]

### Backlinks

```dataview
LIST FROM [[PowerShell - Get-ObsidianVaultPlugins]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

