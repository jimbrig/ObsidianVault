<%*
const dateToday = (tp.date.now("YYYY-MM-DD"));
const dateTodayTitle = (tp.date.now("dddd - MMMM Do, YYYY"));
const dateTodayAlt = (tp.date.now("MMMM Do, YYYY"));
const dateYesterday = (tp.date.yesterday());
const dateTomorrow = (tp.date.tomorrow());
-%>
---
creation_date: <% tp.file.creation_date("YYYY-MM-DD") %>
modification_date: <% tp.file.last_modified_date("YYYY-MM-DD") %>
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: 'Daily note for <% tp.date.now("MMMM D, YYYY") %>'
tags:
  - Type/Daily
  - Status/Ongoing
aliases:
  - <% dateToday %>
  - <% dateToday %> Daily Note
  - <% dateTodayTitle %>
---

<< [[<% dateYesterday %>]] | [[<% dateTomorrow %>]] >>

# <% dateTodayTitle %>

<% tp.file.include("[[Template-TOC]]") %>

## Top of Mind

> [!TIP] Anything top of mind. 

## Tasks

> [!TODO] Tasks to accomplish today.

***

## Appendix

*Note created on [[<% tp.file.creation_date("YYYY-MM-DD") %>]] and last modified on [[<% tp.file.last_modified_date("YYYY-MM-DD") %>]].*

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | <% tp.date.now("YYYY") %>
