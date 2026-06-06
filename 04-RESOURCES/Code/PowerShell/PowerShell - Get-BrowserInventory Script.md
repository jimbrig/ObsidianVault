---
creation_date: 2026-05-31
modification_date: 2026-05-31
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: PowerShell - GetBrowserInventory Script
tags:
  - Type/Code
  - Status/Complete
  - Topic/PowerShell
  - Topic/Windows
  - Topic/Development
aliases:
  - Get-BrowserInventory PowerShell Script
  - Get-BrowserInventory.ps1
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

This [[MOC - PowerShell|PowerShell]] script ...

## Code

`Get-BrowserInventory.ps1`:

```powershell
#requires -Version 5.1
<#
    Read-only inventory of installed Chromium browser channels, profiles, and extensions.
    Emits a structured object graph -> JSON (to TEMP) + console summary.
#>

[CmdletBinding()]
param(
    [string]$JsonOut = "$env:TEMP\BrowserInventory.json"
)

$ErrorActionPreference = 'Stop'

# channel -> (vendor, productDirName, blbeaconKey)
$Channels = @(
    [pscustomobject]@{ Browser = 'Edge'; Channel = 'Stable'; Dir = 'Microsoft\Edge'; Reg = 'HKCU:\Software\Microsoft\Edge\BLBeacon' }
    [pscustomobject]@{ Browser = 'Edge'; Channel = 'Beta'; Dir = 'Microsoft\Edge Beta'; Reg = 'HKCU:\Software\Microsoft\Edge Beta\BLBeacon' }
    [pscustomobject]@{ Browser = 'Edge'; Channel = 'Dev'; Dir = 'Microsoft\Edge Dev'; Reg = 'HKCU:\Software\Microsoft\Edge Dev\BLBeacon' }
    [pscustomobject]@{ Browser = 'Edge'; Channel = 'Canary'; Dir = 'Microsoft\Edge SxS'; Reg = 'HKCU:\Software\Microsoft\Edge SxS\BLBeacon' }
    [pscustomobject]@{ Browser = 'Chrome'; Channel = 'Stable'; Dir = 'Google\Chrome'; Reg = 'HKCU:\Software\Google\Chrome\BLBeacon' }
    [pscustomobject]@{ Browser = 'Chrome'; Channel = 'Beta'; Dir = 'Google\Chrome Beta'; Reg = 'HKCU:\Software\Google\Chrome Beta\BLBeacon' }
    [pscustomobject]@{ Browser = 'Chrome'; Channel = 'Dev'; Dir = 'Google\Chrome Dev'; Reg = 'HKCU:\Software\Google\Chrome Dev\BLBeacon' }
    [pscustomobject]@{ Browser = 'Chrome'; Channel = 'Canary'; Dir = 'Google\Chrome SxS'; Reg = 'HKCU:\Software\Google\Chrome SxS\BLBeacon' }
)

function Get-ChannelVersion {
    param([string]$RegPath)
    try {
        if (Test-Path $RegPath) { return (Get-ItemProperty -Path $RegPath -Name version -ErrorAction Stop).version }
    }
    catch { }
    return $null
}

function Resolve-ExtensionName {
    param([string]$RawName, [string]$ExtRootDir)
    if ($RawName -notmatch '^__MSG_') { return $RawName }
    $token = $RawName -replace '^__MSG_', '' -replace '__$', ''
    if (-not (Test-Path $ExtRootDir)) { return $RawName }
    $verDir = Get-ChildItem -Path $ExtRootDir -Directory -ErrorAction SilentlyContinue |
    Sort-Object CreationTime -Descending | Select-Object -First 1
    if (-not $verDir) { return $RawName }
    foreach ($loc in @('en_US', 'en')) {
        $msgFile = Join-Path $verDir.FullName "_locales\$loc\messages.json"
        if (Test-Path $msgFile) {
            try {
                $msgs = Get-Content -Path $msgFile -Raw -Encoding UTF8 | ConvertFrom-Json
                $val = $msgs.$token.message
                if ($val) { return $val }
            }
            catch { }
        }
    }
    return $RawName
}

function Get-Profiles {
    param([string]$UserDataPath)
    $out = @{}
    $ls = Join-Path $UserDataPath 'Local State'
    if (-not (Test-Path $ls)) { return $out }
    try {
        $json = Get-Content -Path $ls -Raw -Encoding UTF8 | ConvertFrom-Json
        $cache = $json.profile.info_cache
        foreach ($p in $cache.psobject.properties.name) {
            $out[$p] = [pscustomobject]@{
                ProfileName = $cache.$p.name
                GaiaName    = $cache.$p.gaia_name
                Email       = $cache.$p.user_name
            }
        }
    }
    catch { }
    return $out
}

function Get-ProfileExtensions {
    param([string]$ProfilePath)
    $results = @()
    $prefFile = Join-Path $ProfilePath 'Secure Preferences'
    if (-not (Test-Path $prefFile)) { $prefFile = Join-Path $ProfilePath 'Preferences' }
    if (-not (Test-Path $prefFile)) { return $results }

    try {
        $prefs = Get-Content -Path $prefFile -Raw -Encoding UTF8 | ConvertFrom-Json
    }
    catch { return $results }

    $settings = $prefs.extensions.settings
    if (-not $settings) { return $results }

    foreach ($id in $settings.psobject.properties.name) {
        $e = $settings.$id
        # skip component/program-bundled (location 5); keep user (1), external registry (4), unpacked (10)
        if ($e.location -eq 5) { continue }
        $extRoot = Join-Path $ProfilePath "Extensions\$id"
        if (-not (Test-Path $extRoot)) { continue }   # skip themes/orphans with no on-disk payload
        $manifest = $e.manifest
        if (-not $manifest) { continue }
        $name = Resolve-ExtensionName -RawName $manifest.name -ExtRootDir $extRoot

        # modern Chromium (no more integer 'state'): an extension is enabled iff its
        # disable_reasons bitmask is empty. active_bit is unreliable (Chrome writes it
        # false wholesale), so it is recorded but not used. reason codes: 1=user action,
        # 2=permissions increase, 4=reload, etc.
        $reasons = @($e.disable_reasons)
        $enabled = ($reasons.Count -eq 0)

        $results += [pscustomobject]@{
            Id             = $id
            Name           = $name
            Version        = $manifest.version
            Enabled        = $enabled
            DisableReasons = ($reasons -join ',')
            FromWebstore   = [bool]$e.from_webstore
            Location       = $e.location
        }
    }
    return $results
}

$inventory = @()

foreach ($c in $Channels) {
    $userData = Join-Path $env:LOCALAPPDATA "$($c.Dir)\User Data"
    $installed = Test-Path $userData
    $obj = [pscustomobject]@{
        Browser      = $c.Browser
        Channel      = $c.Channel
        Installed    = $installed
        Version      = Get-ChannelVersion -RegPath $c.Reg
        UserDataPath = $userData
        Profiles     = @()
    }
    if ($installed) {
        $profiles = Get-Profiles -UserDataPath $userData
        foreach ($pdir in ($profiles.Keys | Sort-Object)) {
            $ppath = Join-Path $userData $pdir
            if (-not (Test-Path $ppath)) { continue }
            $exts = @(Get-ProfileExtensions -ProfilePath $ppath)
            $obj.Profiles += [pscustomobject]@{
                Dir         = $pdir
                ProfileName = $profiles[$pdir].ProfileName
                Email       = $profiles[$pdir].Email
                Extensions  = $exts
            }
        }
    }
    $inventory += $obj
}

$inventory | ConvertTo-Json -Depth 8 | Out-File -FilePath $JsonOut -Encoding UTF8 -Force

# ---- console summary ----
Write-Host ""
Write-Host "=== CHANNEL SUMMARY ===" -ForegroundColor Cyan
$inventory | Where-Object Installed | ForEach-Object {
    $extCount = ($_.Profiles.Extensions | Select-Object -ExpandProperty Id -Unique | Measure-Object).Count
    [pscustomobject]@{
        Browser    = $_.Browser
        Channel    = $_.Channel
        Version    = $_.Version
        Profiles   = $_.Profiles.Count
        UniqueExts = $extCount
    }
} | Format-Table -AutoSize

Write-Host "=== NOT INSTALLED ===" -ForegroundColor DarkGray
($inventory | Where-Object { -not $_.Installed } | ForEach-Object { "$($_.Browser) $($_.Channel)" }) -join ', '

Write-Host ""
Write-Host "=== EXTENSIONS BY PROFILE ===" -ForegroundColor Cyan
foreach ($ch in ($inventory | Where-Object Installed)) {
    foreach ($p in $ch.Profiles) {
        if ($p.Extensions.Count -eq 0) { continue }
        Write-Host ""
        Write-Host ("{0} {1}  ->  {2} [{3}]  ({4} ext)" -f $ch.Browser, $ch.Channel, $p.ProfileName, $p.Email, $p.Extensions.Count) -ForegroundColor Yellow
        $p.Extensions | Sort-Object Name | Format-Table -AutoSize Name, Version, Enabled, FromWebstore, Id
    }
}

Write-Host ""
Write-Host "JSON written to: $JsonOut" -ForegroundColor Green
```


***

## Appendix

*Note created on [[2026-05-31]] and last modified on [[2026-05-31]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026