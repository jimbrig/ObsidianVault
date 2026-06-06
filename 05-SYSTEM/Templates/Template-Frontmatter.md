<%*
const noteType = await tp.user.utils.promptForTag(tp, "type", { fallbackValue: "Note" });
const noteStatus = await tp.user.utils.promptForTag(tp, "status", { fallbackValue: "NA" });
const noteTopics = await tp.user.utils.promptForTopics(tp, { fallbackValue: "NA" });
const topicTagLines = tp.user.utils.toYamlTagLines("Topic", noteTopics, "NA");
-%>
---
creation_date: <% tp.file.creation_date("YYYY-MM-DD") %>
modification_date: <% tp.file.last_modified_date("YYYY-MM-DD") %>
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: '<% tp.file.title %>'
tags:
  - Type/<% noteType %>
  - Status/<% noteStatus %>
<% topicTagLines %>
aliases:
  - <% tp.file.title %>
---
