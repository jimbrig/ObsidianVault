---
creation_date: 2026-04-27
modification_date: 2026-04-27
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/R
  - Topic/Development
  - Status/WIP
aliases:
  - plumber2 Shiny App Serving
publish: true
permalink:
description:
cssclasses:
  - code
---

# R - plumber2 Shiny App Serving

> [!info] Code Properties
> - **Language**:  [[04-RESOURCES/Code/R/_README|R]]
> - **Packages**: `plumber2`, `shiny`

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - *Source URL or reference*

Description of this code snippet/script/module.

## Code

```R
library(plumber2)
api() |> 
  api_shiny(
      "/ui", 
      shiny::shinyAppDir(
          system.file("examples-shiny", "01_hello", package = "shiny")
      )
  ) |> 
  api_run()
```

## Usage

How to use this code:

```
# usage example
```

## Notes

Additional notes about the code.

***

## Appendix

*Note created on [[2026-04-27]] and last modified on [[2026-04-27]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]

### Backlinks

```dataview
LIST FROM [[R - plumber2 Shiny App Serving]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
