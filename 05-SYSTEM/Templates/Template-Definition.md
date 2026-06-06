<%*
const noteTopics = await tp.user.utils.promptForTopics(tp, { fallbackValue: "NA" });
const topicTagLines = tp.user.utils.toYamlTagLines("Topic", noteTopics, "NA");
-%>
---
creation_date: <% tp.file.creation_date("YYYY-MM-DD") %>
modification_date: <% tp.file.last_modified_date("YYYY-MM-DD") %>
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: '<% tp.file.title %>'
tags:
  - Type/Definition
  - Status/WIP
<% topicTagLines %>
aliases:
<%* if (tp.file.title.includes(" (")) { -%>
  - <% (tp.file.title.split(" (")[1]).replace(")", "") %>
  - <% (tp.file.title.split(" (")[0]) %>
<%* } -%>
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

**<% tp.file.title %>** ...

<% tp.file.include("[[Template-Backmatter]]") %>