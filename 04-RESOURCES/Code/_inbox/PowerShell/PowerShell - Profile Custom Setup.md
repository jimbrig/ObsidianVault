---
creation_date: 2025-12-25
modification_date: 2025-12-25
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
description:
tags:
aliases: PowerShell - Profile Custom Setup
---


# PowerShell - Profile Custom Setup

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - **

## Code

### $PROFILE

```powershell
# --------------------------------------------------------------
# PowerShell Core $PROFILE (Current User, All Hosts)
# --------------------------------------------------------------

# variables
$Global:Interactive = ($Host.Name -eq 'ConsoleHost')
$Global:ProfileRootPath = Split-Path -Path $PROFILE -Parent
$Global:ProfileSourcePath = Join-Path -Path $ProfileRootPath -ChildPath 'Source'
$Global:ProfileConfigPath = Join-Path -Path $ProfileSourcePath -ChildPath 'Profile.Configuration.psd1'

# remove "R" alias which by default is set to Invoke-History (for R.exe to work)
Remove-Alias -Name R -ErrorAction SilentlyContinue

# set ai alias
Set-Alias -Name ai -Value aichat.exe -ErrorAction SilentlyContinue

# import chocolatey profile
try {
    Import-Module $env:ChocolateyInstall\helpers\chocolateyProfile.psm1 -ErrorAction Stop
} catch {
    Write-Warning "Chocolatey profile not loaded: $_"
}

# azure-cli completion
if (Get-Command az -ErrorAction SilentlyContinue) {
    Register-ArgumentCompleter -Native -CommandName az -ScriptBlock {
        param($commandName, $wordToComplete, $cursorPosition)
        try {
            $completion_file = New-TemporaryFile
            $env:ARGCOMPLETE_USE_TEMPFILES = 1
            $env:_ARGCOMPLETE_STDOUT_FILENAME = $completion_file
            $env:COMP_LINE = $wordToComplete
            $env:COMP_POINT = $cursorPosition
            $env:_ARGCOMPLETE = 1
            $env:_ARGCOMPLETE_SUPPRESS_SPACE = 0
            $env:_ARGCOMPLETE_IFS = "`n"
            $env:_ARGCOMPLETE_SHELL = 'powershell'
            az 2>&1 | Out-Null
            Get-Content $completion_file | Sort-Object | ForEach-Object {
                [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
            }
            Remove-Item $completion_file -ErrorAction SilentlyContinue
            Remove-Item Env:\_ARGCOMPLETE_STDOUT_FILENAME, Env:\ARGCOMPLETE_USE_TEMPFILES, Env:\COMP_LINE, Env:\COMP_POINT, Env:\_ARGCOMPLETE, Env:\_ARGCOMPLETE_SUPPRESS_SPACE, Env:\_ARGCOMPLETE_IFS, Env:\_ARGCOMPLETE_SHELL -ErrorAction SilentlyContinue
        } catch {
            Write-Warning "Error in az completion: $_"
        }
    }
}

# gh-cli completion
if (Get-Command gh -ErrorAction SilentlyContinue) {
    try {
        Invoke-Expression -Command $(gh completion --shell powershell | Out-String)
        Write-Verbose 'GitHub CLI shell completion registered successfully.'
    } catch {
        Write-Warning "Failed to register GitHub CLI shell completion: $_"
    }
}

# aichat completion & shell integration
if (Get-Command aichat -ErrorAction SilentlyContinue) {
    try {
        . (Join-Path $ProfileSourcePath 'Completions\aichat.completion.ps1')
        Write-Verbose 'aichat shell completion registered successfully.'

        Set-PSReadLineKeyHandler -Chord 'alt+e' -ScriptBlock {
            $_old = $null
            [Microsoft.PowerShell.PSConsoleReadline]::GetBufferState([ref]$_old, [ref]$null)
            if ($_old) {
                [Microsoft.PowerShell.PSConsoleReadLine]::Insert('⌛')
                $_new = (aichat -e $_old)
                [Microsoft.PowerShell.PSConsoleReadLine]::DeleteLine()
                [Microsoft.PowerShell.PSConsoleReadline]::Insert($_new)
            }
        }
        Write-Verbose 'aichat shell integration registered successfully.'
    } catch {
        Write-Warning "Failed to register aichat shell completion: $_"
    }
}

# obsidian-cli completion & alias
if (Get-Command obsidian-cli -ErrorAction SilentlyContinue) {
    try {
        . (Join-Path $ProfileSourcePath 'Completions\obs.completion.ps1')
        Write-Verbose 'Obsidian CLI shell completion registered successfully.'
    } catch {
        Write-Warning "Failed to register Obsidian CLI shell completion: $_"
    }
    # obs_cd() {
    #     local result=$(obsidian-cli print-default --path-only)
    #     [ -n "$result" ] && cd -- "$result"
    # }
    Function obscd {
        $result = (obsidian-cli print-default --path-only)
        if ($result) {
            Set-Location $result
        } else {
            Write-Warning 'Failed to get Obsidian default path'
        }
    }
}

# zoxide initialization
try {
    if (Get-Command zoxide -ErrorAction SilentlyContinue) {
        Invoke-Expression (& { (zoxide init powershell --cmd z | Out-String) })
    }
} catch {
    Write-Warning "Zoxide not initialzied: $_"
}

# oh-my-posh initialization
try {
    if (Get-Command oh-my-posh -ErrorAction SilentlyContinue) {
        $themeFile = Join-Path "$Env:POSH_THEMES_PATH" 'wopian.omp.json' -ErrorAction SilentlyContinue
        if (Test-Path $themeFile -ErrorAction SilentlyContinue) {
            $Expression = (& oh-my-posh init pwsh --config=$themeFile --print) -join "`n"
            Invoke-Expression $Expression
        } else {
            Write-Warning "Theme file not found: $themeFile"
        }
    }
} catch {
    Write-Warning "Oh-My-Posh not initialized: $_"
}

# PSReadLine
Set-PSReadLineKeyHandler -Key Ctrl+Home -Function BeginningOfLine
Set-PSReadLineKeyHandler -Key Ctrl+End -Function EndOfLine
Set-PSReadLineKeyHandler -Key Ctrl+Shift+Home -Function SelectBackwardsLine
Set-PSReadLineKeyHandler -Key Ctrl+Shift+End -Function SelectLine

# Functions
. $PSScriptRoot\Source\Public\Update-WinGetPackages.ps1

# Import modules
@(
    'Microsoft.PowerShell.ConsoleGuiTools',
    'Terminal-Icons',
    'posh-git',
    'F7History',
    'tiPS'
) | ForEach-Object {
    Import-Module $_ -ErrorAction SilentlyContinue
}

```

## Components

> **Note**: This reference is generated from the PowerShell profile codebase as of June 11, 2025. Functions are organized by category for easy navigation and reference. Each function includes a brief description of its purpose and functionality.

For detailed usage information, parameter details, and examples, refer to the individual function definitions in the source code or use `Get-Help <FunctionName>` in PowerShell.

### Custom Functions

#### Profile Management Functions

- `Write-ProfileLog` - Logging functionality for profile operations
- `Initialize-DebugLog` - Sets up debug logging
- `Measure-ProfileBlock` - Performance measurement for profile components
- `Invoke-ProfileReload` - Reloads the PowerShell profile
- `Edit-PSProfile` - Opens profile for editing
- `Edit-PSProfileProject` - Opens profile project in editor

#### Lazy Loading & Performance

- `Register-LazyCompletion` - Registers lazy-loaded tab completions
- `Register-LazyModule` - Registers lazy-loaded modules
- `Global:TabExpansion2` - Custom tab expansion handler
- `Measure-ScriptBlock` - Measures script block execution time

#### Directory Navigation

- `Set-LocationParent` - Navigate to parent directory (`..`)
- `Set-LocationRoot` - Navigate to root directory
- `Set-LocationHome` - Navigate to home directory
- `Set-LocationBin` - Navigate to user's bin directory
- `Set-LocationTools` - Navigate to user's tools directory
- `Set-LocationTemp` - Navigate to temporary directory
- `Set-LocationConfig` - Navigate to configuration directory
- `Set-LocationOneDrive` - Navigate to OneDrive directory
- `Set-LocationDotFiles` - Navigate to dotfiles directory
- `Set-LocationDesktop` - Navigate to desktop
- `Set-LocationDownloads` - Navigate to downloads
- `Set-LocationDocuments` - Navigate to documents
- `Set-LocationPictures` - Navigate to pictures
- `Set-LocationMusic` - Navigate to music
- `Set-LocationVideos` - Navigate to videos
- `Set-LocationDevDrive` - Navigate to development drive

#### Navigation Aliases

- `Documents` - Quick navigation to Documents folder
- `Desktop` - Quick navigation to Desktop folder
- `Downloads` - Quick navigation to Downloads folder
- `Temp` - Quick navigation to temp folder
- `cd...` - Go up two directory levels
- `cd....` - Go up three directory levels
- `HKLM:` - Navigate to HKEY_LOCAL_MACHINE registry
- `HKCU:` - Navigate to HKEY_CURRENT_USER registry
- `Env:` - Navigate to environment variables

#### System Utilities

- `Get-PublicIP` - Retrieves public IP address
- `Get-Timestamp` - Gets current timestamp
- `Get-RandomPassword` - Generates random passwords
- `Get-SystemUptime` - Gets system uptime information
- `Get-PCUptime` - Gets PC uptime
- `Get-PCInfo` - Gets comprehensive PC information
- `Get-WindowsBuild` - Gets Windows build information
- `Get-IPv4NetworkInfo` - Gets IPv4 network information
- `Get-ProcessUsingPort` - Finds processes using specific ports
- `Get-Printers` - Lists available printers
- `Get-RebootLogs` - Gets system reboot logs

#### Environment Management

- `Get-EnvironmentVariables` - Gets environment variables with analysis
- `Get-EnvVarsFromScope` - Gets environment variables from specific scope
- `Expand-PathVariable` - Expands PATH variable entries
- `Compare-PathVariables` - Compares PATH variables across scopes
- `Update-Environment` - Updates entire environment
- `Update-SessionEnvironment` - Updates session environment variables

#### File Operations

- `Get-FolderSize` - Gets folder size information
- `Get-FileOwner` - Gets file ownership information
- `Get-ChildItemColor` - Enhanced directory listing with colors
- `Get-SourceCode` - Downloads source code from repositories

#### Hash Functions

- `Get-MD5Hash` - Calculates MD5 hash
- `Get-SHA1Hash` - Calculates SHA1 hash
- `Get-SHA256Hash` - Calculates SHA256 hash

#### Application Management Functions

- `Get-Applications` - Lists installed applications
- `Remove-Application` - Removes applications
- `Start-GitKraken` - Starts GitKraken application
- `Start-RStudio` - Starts RStudio application
- `Invoke-Notepad` - Opens Notepad

#### Package Management Functions

- `Update-Chocolatey` - Updates Chocolatey packages
- `Update-Scoop` - Updates Scoop packages
- `Update-Python` - Updates Python packages
- `Update-Node` - Updates Node.js packages
- `Update-R` - Updates R packages
- `Update-Pip` - Updates Pip packages
- `Update-Windows` - Updates Windows
- `Update-WinGet` - Updates WinGet
- `Update-PSModules` - Updates PowerShell modules
- `Update-AllPSResources` - Updates all PowerShell resources

#### Module Management Functions

- `Get-DuplicatePSModules` - Finds duplicate PowerShell modules
- `Uninstall-DuplicatePSModules` - Removes duplicate modules
- `Get-DynamicAboutHelp` - Gets dynamic help content

#### System Administration Functions

- `Test-AdminRights` - Tests for administrative privileges
- `Invoke-Admin` - Runs commands as administrator
- `Mount-DevDrive` - Mounts development drive
- `Reset-NetworkStack` - Resets network stack
- `Reset-NetworkAdapter` - Resets network adapter
- `Remove-TempFiles` - Removes temporary files
- `Set-PowerPlan` - Sets power plan
- `Stop-SelectedProcess` - Stops selected processes
- `Invoke-TakeOwnership` - Takes ownership of files/folders
- `Invoke-TakeOwnershipWindowsApps` - Takes ownership of Windows apps
- `Invoke-DISM` - Runs DISM operations
- `Invoke-SFC` - Runs System File Checker
- `Get-SFCLogs` - Gets SFC logs
- `Invoke-CheckDisk` - Runs check disk
- `Get-WinSAT` - Gets Windows System Assessment Tool results

#### Helper Functions

- `Import-Completion` - Imports tab completions
- `Import-AliasFile` - Imports alias files
- `Search-History` - Searches command history
- `Get-GitHubRateLimits` - Gets GitHub API rate limits
- `Remove-GitHubWorkflowRuns` - Removes GitHub workflow runs
- `Write-OperationStatus` - Writes operation status messages
- `Invoke-EnvVarAIAnalysis` - AI analysis of environment variables

#### Testing Utility Functions

- `Test-Internet` - Tests internet connectivity
- `Test-Admin` - Tests administrative privileges
- `Test-Command` - Tests if commands exist
- `Test-ServiceRunning` - Tests if services are running
- `Test-PSGallery` - Tests PowerShell Gallery connectivity
- `Test-SSHKey` - Tests SSH key functionality
- `Test-GPGKey` - Tests GPG key functionality
- `Test-Email` - Tests email functionality

#### System Optimization Functions

- `Optimize-DefenderExclusions` - Optimizes Windows Defender exclusions
- `Remove-OldDrivers` - Removes old drivers
- `Clean-ProfileRepository` - Cleans profile repository

#### Installation Functions

- `Install-OhMyPosh` - Installs Oh My Posh
- `Install-NerdFont` - Installs Nerd Fonts

### Aliases

#### Development Aliases

```powershell
@{
    'ib'          = 'Invoke-Build'
    'test'        = 'Invoke-Pester'
    'pester'      = 'Invoke-Pester'
    'psake'       = 'Invoke-PSake'
    'psdeploy'    = 'Invoke-PSDeploy'
    'deps'        = 'Invoke-PSDepend'
    'reqs'        = 'Invoke-PSDepend'
    'lint'        = 'Invoke-PSScriptAnalyzer'
    'lintfix'     = 'Invoke-PSScriptAnalyzerFix'
    'reload'      = 'Restart-PSSession'
    'editprof'    = 'Edit-PSProfile'
    'editprofdir' = 'Edit-PSProfileDirectory'
    'reloadprof'  = 'Reload-PSProfile'
    'help'        = 'Get-Help'
    'dynhelp'     = 'Get-DynamicAboutHelp'
}
```

#### Navigation Aliases

```powershell
@{
    'Home'      = 'Set-LocationHome'
    '~'         = 'Set-LocationHome'
    'Desktop'   = 'Set-LocationDesktop'
    'Downloads' = 'Set-LocationDownloads'
    'Documents' = 'Set-LocationDocuments'
    'Pictures'  = 'Set-LocationPictures'
    'Music'     = 'Set-LocationMusic'
    'Videos'    = 'Set-LocationVideos'
    'DevDrive'  = 'Set-LocationDevDrive'
    'Dotfiles'  = 'Set-LocationDotFiles'
    'OneDrive'  = 'Set-LocationOneDrive'
    'Tools'     = 'Set-LocationTools'
    'Bin'       = 'Set-LocationBin'
    'Config'    = 'Set-LocationConfig'
    'Ubuntu'    = 'Set-LocationWSL'
    'Dots'      = 'Set-LocationDotFiles'
}

```

#### Program Aliases

```powershell
@{
    'np'      = (Get-Command -Name 'notepad.exe').Source
    'expl'    = (Get-Command -Name 'explorer.exe').Source
    'calc'    = (Get-Command -Name 'calc.exe').Source
    'gkrak'   = (Get-Command -Name 'gitkraken.cmd').Source
    'codee'   = (Get-Command -Name 'code-insiders.cmd').Source
    'r'       = (Get-Command -Name 'R.bat').Source
    'rscript' = (Get-Command -Name 'R.bat').Source
    'rstudio' = 'Start-RStudio'
    'krak'    = 'Start-GitKraken'
}

``` 

#### System Aliases

```powershell
@{
    'reboot' = 'Restart-Computer'
}

```

### Completions

#### AWS CLI

```powershell
If (Get-Command aws -ErrorAction SilentlyContinue) {
    Register-ArgumentCompleter -Native -CommandName aws -ScriptBlock {
        param($commandName, $wordToComplete, $cursorPosition)
        $env:COMP_LINE = $wordToComplete
        $env:COMP_POINT = $cursorPosition
        aws_completer.exe | ForEach-Object {
            [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
        }
        Remove-Item Env:\COMP_LINE     
        Remove-Item Env:\COMP_POINT  
    }
}
```

### `bat`

```powershell
If (Get-Command bat -ErrorAction SilentlyContinue) {
    Invoke-Expression -Command $(bat --completion ps1 | Out-String)
}
```

### Configuration

### Default Parameters

### Modules

### PSReadLine

### Other

***

## Appendix

*Note created on [[2025-12-25]] and last modified on [[2025-12-25]].*

### See Also

- 

### Backlinks

```dataview
LIST FROM [[PowerShell - Profile Custom Setup]] 
WHERE file.name != "_README" AND file.name != this.file.name AND file.name != "CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025