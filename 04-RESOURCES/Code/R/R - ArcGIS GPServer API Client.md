---
creation_date: 2026-05-17
modification_date: 2026-05-25
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - ArcGIS GPServer API Client
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Development
  - Topic/Geospatial
  - Topic/API
aliases:
  - R - ArcGIS GPServer API Client
  - ArcGIS GPServer API with R
---


```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE]

Demonstration of incorporating a best practice, robust API workflow for [[ArcGIS]] GPServer jobs using [[httr2]] and [[R]].



## Code

First, I will define some basic class checking functions to check the inputs for request and response functions:

```R
check_inherits <- function(x, cls, arg = rlang::caller_arg(x), call = rlang::caller_env()) {
  if (!inherits(x, cls)) {
    cli::cli_abort("{.arg {arg}} must inherit from class {.cls {cls}}, not {.obj_type_friendly {obj}}.", call = call)
  }
  invisible(x)
}

check_request <- function(x, arg = rlang::caller_arg(x), call = rlang::caller_env()) {
  check_inherits(x, "httr2_request", arg = arg, call = call)
  invisible(x)
}

check_response <- function(x, arg = rlang::caller_arg(x), call = rlang::caller_env()) {
  check_inherits(x, "httr2_response", arg = arg, call = call)
  invisible(x)
}
```

Next, we will need to define some enumerations and constants:

```R
# arcgis gpserver statuses ---------------------------------------------------
.gp_transient_statuses <- c("esriJobSubmitted", "esriJobWaiting", "esriJobExecuting", "esriJobNew")
.gp_error_statuses <- c("esriJobFailed", "esriJobCancelled", "esriJobTimedOut", "esriJobDeleted")
.gp_success_status <- "esriJobSucceeded"
```

Next, we we setup the core `httr2` callback handling functions. These functions are used as arguments to `httr2::req_retry()` and `httr2::req_error()` etc. to detect when a response is *transient* or an error:

```R
# retry callbacks -------------------------------------------------------------
gp_resp_is_transient <- function(resp) {
  check_response(resp)
  httr2::resp_check_content_type(resp, valid_types = c("application/json"))
  resp_data <- httr2::resp_body_json(resp)
  job_status <- purrr::pluck(resp_data, "jobStatus", .default = NULL)
  !is.null(job_status) && job_status %in% .gp_transient_statuses
}

gp_resp_is_error <- function(resp) {
  check_response(resp)
  httr2::resp_check_content_type(resp, valid_types = c("application/json"))
  resp_data <- httr2::resp_body_json(resp)
  job_status <- purrr::pluck(resp_data, "jobStatus", .default = NULL)
  is.null(job_status) || job_status %in% .gp_error_statuses
}

gp_resp_error_body <- function(resp) {
  check_response(resp)
  httr2::resp_check_content_type(resp, valid_types = c("application/json"))
  resp_data <- httr2::resp_body_json(resp)
  job_status <- purrr::pluck(resp_data, "jobStatus", .default = "Unknown")
  resp_messages <- purrr::pluck(resp_data, "messages", .default = NULL)

  if (is.null(resp_messages) || length(resp_messages) == 0) {
    return(paste0("GPServer job failed with status '", job_status, "'"))
  }

  message_text <- purrr::map_chr(
    resp_messages,
    function(msg) paste0("[", or_else(msg$type, "INFO"), "] ", or_else(msg$description, ""))
  ) |>
    paste0(collapse = "\n")

  paste0("GPServer job failed with status '", job_status, "' and messages:\n", message_text)
}

gp_backoff <- function(attempt) {
  base_delay <- 1
  max_delay <- 30
  delay <- min(base_delay * (2^(attempt - 1)), max_delay)
  delay + stats::runif(1, 0, 1)
}
```

request constructors:

```R

```