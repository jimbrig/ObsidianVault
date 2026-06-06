---
creation_date: 2026-06-06
modification_date: 2026-06-06
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: JavaScript - Extract Links Bookmarklet
tags:
  - Type/Code
  - Type/Bookmarklet
  - Status/Complete
  - Topic/Development
  - Topic/Web
  - Topic/JavaScript
aliases:
  - Extract Links
  - Extract Links Bookmarklet
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview



## Code

### Extract & Copy to Clipboard

```javascript
const links = Array.from(document.querySelectorAll('a'))
  .map(a => a.href)
  .filter(href => href.trim() !== "");

const uniqueLinks = [...new Set(links)];
copy(uniqueLinks.join('\n'));
console.log(`Copied ${uniqueLinks.length} unique links to clipboard!`);
```

### Display as a Table

```javascript
const linkData = Array.from(document.querySelectorAll('a'))
  .map(a => ({ Text: a.innerText.trim(), URL: a.href }))
  .filter(item => item.URL !== "");

console.table(linkData);
```

### Target Specific Sections

```javascript
// Replace '.main-content' with the specific class or ID of your container element
const container = document.querySelector('.main-content'); 

if (container) {
  const customLinks = Array.from(container.querySelectorAll('a'))
    .map(a => a.href)
    .filter(href => href !== "");
  
  copy([...new Set(customLinks)].join('\n'));
  console.log("Section links copied!");
} else {
  console.error("Container element not found.");
}
```

***

## Appendix

*Note created on [[2026-06-06]] and last modified on [[2026-06-06]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026