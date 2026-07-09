---
creation_date: 2026-07-07
modification_date: 2026-07-07
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - plumber2 Shiny App Serving
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Development
  - Topic/API
  - Topic/Web
aliases:
  - plumber2 Shiny App Serving
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
> **Dependencies**: `plumber2`, `shiny`

> [!SOURCE] Sources
> - [Serve a Shiny app from a plumber2 api — api_shiny • plumber2](https://plumber2.posit.co/reference/api_shiny.html)

## Code

```R
require(plumber2)
require(shiny)

plumber2::api() |>
  plumber2::api_shiny(path = "/app/", shiny::shinyAppDir(system.file("examples-shiny", "01_hello", package = "shiny"))) |>
  plumber2::api_run()

# in browser: http://127.0.0.1:8080/app/
```

![](https://i.imgur.com/jaqOqBs.png)

## Enhance OpenAPI

This is a slightly enhanced version that updates the OpenAPI specification to show the `/app/` route:

```R
require(plumber2)
require(shiny)

shiny_doc <- plumber2::openapi(
  openapi = "3.0.0",
  info = plumber2::openapi_info(
    title = "Plumber2 Shiny API",
    description = "An example of a Plumber2 API that serves a Shiny app.",
    version = "1.0.0"
  ),
  paths = list(
    "/app/" = plumber2::openapi_path(
      get = plumber2::openapi_operation(
        summary = "Interactive Shiny Application",
        description = "This endpoint serves an interactive Shiny application.",
        operation_id = "getShinyApp",
        parameters = list(),
        request_body = plumber2::openapi_request_body(),
        responses = list(
          "200" = plumber2::openapi_response(
            description = "Rendered Shiny App",
            content = plumber2::openapi_content("text/html" = plumber2::openapi_schema(character()))
          )
        )
      )
    )
  )
)

api <- plumber2::api() |>
  plumber2::api_shiny(path = "/app/", shiny::shinyAppDir(system.file("examples-shiny", "01_hello", package = "shiny"))) |>
  plumber2::api_doc_add(shiny_doc) |>
  plumber2::api_run()

api |> plumber2::api_stop()
```

## Notes

- Must include  trailing `/` in URL (no automatic redirection)

***

## Appendix

*Note created on [[2026-07-07]] and last modified on [[2026-07-07]].*

### See Also

- [[MOC - R]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
