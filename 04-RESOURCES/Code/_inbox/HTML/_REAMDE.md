---
creation_date: 2026-01-10
modification_date: 2026-01-10
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Readme
  - Type/Code
  - Topic/Meta
  - Topic/HTML
  - Status/Ongoing
aliases:
  - HTML Code
  - HTML Code Snippets
  - HTML Code Index
publish: true
permalink:
description: Index of all HTML code snippets and resources
cssclasses:
  - readme
  - code
---

# HTML Code

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!NOTE] About
> This note serves as an index for all notes under the `04-RESOURCES/Code/HTML` directory.

## Index

> [!tip] Note Count
> *Currently, there are **`$= dv.pages('"' + dv.current().file.folder + '"').length - 1`** individual notes in this folder.*

```dataview
TABLE WITHOUT ID
  file.link AS "Note",
  file.mday AS "Modified"
FROM "04-RESOURCES/Code/HTML"
WHERE file.name != this.file.name
SORT file.name ASC
```

***

## Appendix

*Note created on [[2026-01-10]] and last modified on [[2026-01-10]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]
- [[03-AREAS/MOC - HTML|HTML Map of Content]]

### Backlinks

```dataview
LIST FROM [[_README]] AND -"CHANGELOG" AND -"04-RESOURCES/Code/HTML/_README"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
