---
creation_date: 2026-01-10
modification_date: 2026-01-10
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Status/WIP
aliases:
  - JavaScript - AddToReadWise (Bookmarklet)
publish: true
permalink:
description:
cssclasses:
  - code
---

# JavaScript - AddToReadWise (Bookmarklet)

> [!info] Code Properties
> - **Language**: 
> - **Packages**: 

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

```javascript
/**
* Bookmarklet to add the current page to ReadWise
*/
javascript: (
  function () {
    /**
    * Open the ReadWise page with the current page's title and URL
    * @function open
    * @param {string} url
    * @returns {string} Encoded URL for ReadWise
    */
    open(
      "https://readwise.io/save?title=" +
        encodeURIComponent(document.title) +
        "&url=" +
        encodeURIComponent(location.href)
    );
  }
)();
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

*Note created on [[2026-01-10]] and last modified on [[2026-01-10]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]

### Backlinks

```dataview
LIST FROM [[JavaScript - AddToReadWise (Bookmarklet)]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
