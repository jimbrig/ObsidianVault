---
creation_date: 2025-12-20
modification_date: 2025-12-20
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Readme
  - Topic/Meta
  - Type/Code
  - Topic/Development
  - Topic/R
  - Status/Ongoing
aliases:
  - R Code
  - R Code Index
publish: true
permalink:
description: Index of all notes under the R directory
cssclasses:
  - readme
---

# R Code

```table-of-contents
title: Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!NOTE] About
> This note serves as an index for all notes under the `04-RESOURCES/Code/R` directory.

## Index

> [!tip] Note Count
> *Currently, there are **`$= dv.pages('"' + dv.current().file.folder + '"').length - 1`** individual notes in this folder.*

```dataview
TABLE WITHOUT ID
  file.link AS "Note",
  file.mday AS "Modified"
FROM "04-RESOURCES/Code/R"
WHERE file.name != this.file.name
SORT file.name ASC
```

***

## Appendix

*Note created on [[2025-12-20]] and last modified on [[2025-12-20]].*

### See Also

- [[04-RESOURCES/Code/_README|Code]]
- [[MOC - R|R Map of Content]]

### Backlinks

```dataview
LIST FROM [[_README]] AND -"CHANGELOG" AND -"04-RESOURCES/Code/R/_README"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
