<%*
const noteName = (tp.file.title).replace("List - ", "");
const noteDescription = `List for ${noteName}`;
-%>
---
creation_date: <% tp.file.creation_date("YYYY-MM-DD") %>
modification_date: <% tp.file.last_modified_date("YYYY-MM-DD") %>
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: '<% noteDescription %>'
tags:
  - Type/List
  - Status/WIP
  - Topic/NA
aliases:
  - <% noteName %>
  - <% noteName %> List
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

**<% noteName %>** ...

## List

<% tp.file.include("[[Template-Backmatter]]") %>
