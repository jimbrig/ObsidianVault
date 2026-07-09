---
creation_date: 2026-06-02
modification_date: 2026-06-02
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - Proxying HTTP Requests & Responses
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Development
aliases:
  - R - Proxying HTTP Requests & Responses
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

### Setup & Configuration

```R
require(httr2)

proxy_url <- "http://localhost:8080"
api_config_file <- "config.yml"
api_flow_file <- "openapi.flow"
api_log_file <- "openapi.log"
api_spec_file <- "openapi.yml"

api_config <- config::get("api", file = api_config_file)
```

### `mitmproxy`, `mitmdump`, &  `mitmweb`

There are two approaches here, i.e. system commands via [[processx]] or using the [[MOC - Python|Python]] libraries directly via [[reticulate]].

If using `reticulate`, setup the virtual environment and install the packages:

```R
init_venv <- function(venv = ".venv", libs = c("mitmproxy", "mitmproxy2swagger"), ...) {
  cmd_python <- Sys.which("python") |> normalizePath(winslash = "/")
  if (!reticulate::virtualenv_exists()) {
    fs::dir_create(venv)
    processx::run(command = cmd_python, args = c("-m", "venv", venv), echo = TRUE)
    reticulate::use_virtualenv(fs::path(getwd(), venv))
    reticulate::py_install(libs)
    cli::cli_alert_success("Setup virtual environment {.field {venv}} with the packages: {.field {libs}}.")
  } else {
    cli::cli_alert_info("Virtual environment {.field {venv}} already exists...")
    reticulate::use_virtualenv(fs::path(getwd(), venv))
    reticulate::py_install(libs)
  }
  invisible(0)
}

mitmdump <- function(host = "127.0.0.1", port = 8080, out_file = "openapi.flow") {
  main <-  
}



```

***

## Appendix

*Note created on [[2026-06-02]] and last modified on [[2026-06-02]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
