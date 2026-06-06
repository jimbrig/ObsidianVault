---
creation_date: 2026-05-08
modification_date: 2026-05-08
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Readme
  - Topic/Meta
  - Type/Code
  - Topic/Development
  - Status/Ongoing
aliases:
  - Tools Code
  - Tools Code Index
publish: true
description: Index of all code notes for various CLI tools
cssclasses:
  - readme
---

# CLI Tools Code

```table-of-contents
title: Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!NOTE] About
> This note serves as an index for all notes under the `04-RESOURCES/Code/Tools` directory and houses code snippets that are not in a particular coding language or shell, but rather are for various CLI tools.

## Index

> [!tip] Note Count
> *Currently, there are **`$= dv.pages('"' + dv.current().file.folder + '"').length - 1`** individual notes in this folder.*

```dataview
TABLE WITHOUT ID
  file.link AS "Note",
  file.mday AS "Modified"
FROM "04-RESOURCES/Code/Tools"
WHERE file.name != this.file.name
SORT file.name ASC
```

***

## Appendix

*Note created on [[2026-05-08]] and last modified on [[2026-05-08]].*

### See Also

- [[04-RESOURCES/Code/_README|Parent Folder]]

### Backlinks

```dataview
LIST FROM [[_README]] AND -"CHANGELOG" AND -"04-RESOURCES/Code/Tools/_README"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
