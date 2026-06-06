<%*
const topicName = (tp.file.title).replace("MOC - ", "");
const topicTag = (topicName.replace(" ", ""));
-%>
---
creation_date: <% tp.date.now("YYYY-MM-DD") %>
modification_date: <% tp.date.now("YYYY-MM-DD") %>
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: 'Map of content for <% topicName %>'
tags:
  - Type/MOC
  - Status/Ongoing
  - Topic/<% topicTag %>
aliases:
  - <% topicName %> Map of Content
  - <% topicName %> MOC
  - <% topicName %>
---

# <% topicName %> Map of Content

> [!NOTE] About
> This note serves as an index for all notes related to the topic: **<% topicName %>**.

<% tp.file.include("[[Template-TOC]]") %>

## Overview



## Notes



## Related



***

## Appendix

*Note created on [[<% tp.date.now("YYYY-MM-DD") %>]] and last modified on [[<% tp.date.now("YYYY-MM-DD") %>]].*

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | <% tp.date.now("YYYY") %>