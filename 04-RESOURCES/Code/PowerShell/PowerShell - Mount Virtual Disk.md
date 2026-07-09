Mount a virtual disk via the [Mount-VHD](https://learn.microsoft.com/powershell/module/hyper-v/mount-vhd?view=windowsserver2025-ps&wt.mc_id=ps-gethelp) function from the `Hyper-V` module:

```powershell
Mount-VHD
    [-Path] <String[]>
    [-NoDriveLetter]
    [-ReadOnly]
    [-SnapshotId <Guid>]
    [-Passthru]
    [-CimSession <CimSession[]>]
    [-ComputerName <String[]>]
    [-Credential <PSCredential[]>]
    [-WhatIf]
    [-Confirm]
    [<CommonParameters>]
```

***

## Appendix

*Note created on [[2026-05-31]] and last modified on [[2026-05-31]].*

### See Also

- [Mount-VHD (Hyper-V) | Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/hyper-v/mount-vhd?view=windowsserver2025-ps&wt.mc_id=ps-gethelp)

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026