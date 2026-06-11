<%*
const code = await tp.user.utils.setupCodeNote(tp);
-%>
---
creation_date: <% tp.file.creation_date("YYYY-MM-DD") %>
modification_date: <% tp.file.last_modified_date("YYYY-MM-DD") %>
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: '<% code.description %>'
tags:
  - Type/Code
  - Status/<% code.status %>
<% code.topicTagLines %>
aliases:
<% code.aliasLines %>
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!INFO] <% code.language %>
> **Language**: <% code.language %>
> **Dependencies**: *None*

> [!SOURCE] Sources
> - *Source URL or reference*

**<% code.name %>** ...

## Code

```<% code.fence %>

```

## Usage

```<% code.fence %>

```

## Notes

***

## Appendix

*Note created on [[<% tp.file.creation_date("YYYY-MM-DD") %>]] and last modified on [[<% tp.file.last_modified_date("YYYY-MM-DD") %>]].*

### See Also

<% code.seeAlsoLines %>

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | <% tp.date.now("YYYY") %>
