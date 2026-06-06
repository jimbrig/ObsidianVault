---
creation_date: 2025-12-23
modification_date: 2025-12-23
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
tags:
  - Type/Readme
  - Type/Code
  - Topic/Meta
  - Topic/Development
  - Topic/Bash
  - Status/Ongoing
aliases:
  - Bash Code
  - Bash Code Snippets
  - Bash Code Readme
  - Bash Code Index
publish: true
permalink:
description: Index of all Bash code snippets and resources
cssclasses:
  - readme
  - code
---

# Bash Code

```table-of-contents
title: ## Contents 
style: nestedList # TOC style (nestedList|inlineFirstLevel)
minLevel: 1 # Include headings from the specified level
maxLevel: 4 # Include headings up to the specified level
includeLinks: true # Make headings clickable
debugInConsole: false # Print debug info in Obsidian console
```

## Overview

> [!NOTE] About
> This note serves as an index for all notes under the `04-RESOURCES/Code/Bash` directory.

## Index

> [!tip] Note Count
> *Currently, there are **`$= dv.pages('"' + dv.current().file.folder + '"').length - 1`** individual notes in this folder.*

```dataview
TABLE WITHOUT ID
  file.link AS "Note",
  file.mday AS "Modified"
FROM "04-RESOURCES/Code/Bash"
WHERE file.name != this.file.name
SORT file.name ASC
```

***

## Appendix

*Note created on [[2025-12-23]] and last modified on [[2025-12-23]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]
- [[MOC - Linux]] - Linux and Bash scripting
- [[MOC - Development]] - Development practices

### Backlinks

```dataview
LIST FROM [[_README]] AND -"CHANGELOG" AND -"04-RESOURCES/Code/Bash/_README"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

