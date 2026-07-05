---
creation_date: 2026-06-27
modification_date: 2026-06-30T16:24:39-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: RStudio
tags:
  - Type/Reference
  - Status/WIP
  - Topic/Development
  - Topic/R
aliases:
  - RStudio
---

- `%LOCALAPPDATA%/RStudio/monitored/lists/`:
	- `command_palette_mru` **
	- `file_mru`
	- `help_history_links`
	- `plot_publish_mru`
	- `project_mru` **
	- `project_name_mru` **
	- `user_dictionary` **

** = relevant ones

i.e. `project_mru` and `project_name_mru` are typically identical (from my experience at least) and simply list project paths:

```plaintext
D:/spatial/packages/gdalvector/gdalvector.Rproj
D:/sandbox/freestiler/freestiler.Rproj
D:/jimbrig/gdalvector/gdalvector.Rproj
D:/jimbrig/geospatial-work-prior/gisdata/gisdata.Rproj
D:/jimbrig/gdaltargets/gdaltargets.Rproj
X:/jimbrig/freestiler/freestiler.Rproj
D:/sandbox/gdalvector/gdalvector.Rproj
D:/jimbrig/geodata/geodata.fema/geodata.tiger.Rproj
D:/jimbrig/gdalraster.windows/gdalraster.windows.Rproj
D:/sandbox/gdalcli/gdalcli.Rproj
D:/jimbrig/gdalviz/gdalviz.Rproj
X:/sandbox/lazysf/lazysf.Rproj
D:/jimbrig/geodata/geodata.tiger/geodata.tiger.Rproj
N:/clients/gmh/gmhcommunities/gmhcommunities.Rproj
F:/geospatial/gisdata/gisdata.Rproj
```