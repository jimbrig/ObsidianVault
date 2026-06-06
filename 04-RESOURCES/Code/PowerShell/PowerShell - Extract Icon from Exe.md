```powershell
Function Get-ExeIcon {

	<#
    .SYNOPSIS
    Get-ExeIcon extracts the icon image from an exe file and saves it as an Icon (.ico)
    file in the defined `-OutputDir`.

    .DESCRIPTION
    Get-DiskInventory will run on the .exe file and then save the .ico file for and images discovered.

    .PARAMETER ExePath
    Path to the .exe file
    
    .PARAMETER OutputDir
    Directory to output the extracted ico.
    
    .EXAMPLE
    # Extract Google Chrome's Icon and Save under ~/Pictures/Icons:
    Get-ExeIcon -ExePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -OutputDir "$env:USERPROFILE\Pictures\Icons"
	#>

    Param ( 
    [Parameter(Mandatory=$true)]
    [string]$ExePath,
    [Parameter(Mandatory=$true)]
    [string]$OutputDir
    )

    [System.Reflection.Assembly]::LoadWithPartialName('System.Drawing')  | Out-Null

    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($ExePath)

    $outputFile = Join-Path $OutputDir "$baseName.ico"

    [System.Drawing.Icon]::ExtractAssociatedIcon($ExePath).ToBitmap().Save("$outputFile")

}
```
