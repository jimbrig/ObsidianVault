---
creation_date: 2026-07-03
modification_date: 2026-07-03T19:16:11-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - HTTP Streaming & Server-Sent Events (SSE) with nanonext
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Development
  - Topic/Web
aliases:
  - HTTP Streaming & Server-Sent Events (SSE) with nanonext
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!INFO] R
> **Language**: R
> **Dependencies**: *`{nanonext}`*

> [!SOURCE] Sources
> - [HTTP streaming and Server-Sent Events in R with nanonext](https://gist.github.com/jrosell/178ed4fab7189ed64f472b8e3bf3a068)

## Code

```R
library(nanonext)

conns <- list()
handlers <- list(
  handler_stream("/stream",
                 on_request = function(conn, req) {
                   conn$set_header("Content-Type", "application/x-ndjson")
                   conns[[as.character(conn$id)]] <<- conn
                   conn$send('{"status":"connected"}\n')
                 },
                 on_close = function(conn) {
                   conns[[as.character(conn$id)]] <<- NULL
                 }
  ),
  # POST endpoint triggers broadcast to all streaming clients
  handler("/broadcast", function(req) {
    msg <- paste0('{"msg":"', rawToChar(req$body), '"}\n')
    lapply(conns, function(c) c$send(msg))
    list(status = 200L, body = "sent")
  }, method = "POST")
)

server <- http_server(
  url = "http://127.0.0.1:8080",
  handlers = handlers
)
server$start()
server$url
```

then we need a total of **three** clients to test this, i.e.:

in one terminal:

```bash
curl -X GET http://127.0.0.1:8080/stream
```

in another terminal:

```bash
curl -X GET http://127.0.0.1:8080/stream
```

and in a third terminal, post the broadcast:

```bash
curl -X POST http://127.0.0.1:8080/broadcast -H "Content-Type: application/json" -d 'hello world'
```

both "client" terminals should receive this broadcasted message, i.e.:

```bash
➜ curl -X GET http://127.0.0.1:8080/stream
{"status":"connected"}
{"msg":"hello world"}
```

## Notes



***

## Appendix

*Note created on [[2026-07-03]] and last modified on [[2026-07-03]].*

### See Also

- [[MOC - R]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
