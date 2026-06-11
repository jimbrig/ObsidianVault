<%*
const noteTopic = tp.file.title.split("Guide - ")[1];
const noteDescription = `Guide for ${noteTopic}`;
const noteTopics = await tp.user.utils.promptForTopics(tp, { fallbackValue: "NA" });
const topicTagLines = tp.user.utils.toYamlTagLines("Topic", noteTopics, "NA");
-%>
---
creation_date: <% tp.file.creation_date("YYYY-MM-DD") %>
modification_date: <% tp.file.last_modified_date("YYYY-MM-DD") %>
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: '<% noteDescription %>'
tags:
  - Type/Guide
  - Status/WIP
<% topicTagLines %>
aliases:
  - <% noteTopic %> Guide
  - <% noteTopic %>
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

This is a guide for **<% noteTopic %>**.

<% tp.file.include("[[Template-Backmatter]]") %>
