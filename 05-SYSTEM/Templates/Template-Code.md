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

**<% code.name %>** ...

```<% code.fence %>

```

## See Also

- <% code.mocLink %>
