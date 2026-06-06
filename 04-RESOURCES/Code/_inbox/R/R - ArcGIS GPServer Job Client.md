---
creation_date: 2026-04-29
modification_date: 2026-04-29
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/R
  - Topic/Development
  - Topic/Geospatial
  - Status/WIP
aliases:
  - ArcGIS GPServer API Client
publish: true
permalink:
description:
cssclasses:
  - code
---

# R - ArcGIS GPServer Job Client

> [!info] Code Properties
> - **Language**: `R`
> - **Packages**: `httr2`

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - *Source URL or reference*

Description of this code snippet/script/module.

## Code

```
# ---------------------------------------------------------------------------
# Title : GPServer workflow reference (httr2-first)
#    By : Jimmy Briggs
#  Date : 2026-04-23
# ---------------------------------------------------------------------------
#
# design notes
# - protocol is centered on httr2 request/response objects and retry callbacks
# - submission/status/result/download are thin wrappers around those objects
# - query vs form params is configurable in protocol, fixed to query for fema
# - fema wrappers expose only domain knobs; transport knobs stay internal
#
# arcgisutils comparison
# - arcgisutils gp support (R6 + coro async) is solid for tokened arcgis flows
# - this workflow targets public fema endpoints with query params + custom
#   origin/referer and provider-specific retry semantics
# - for ogc api processes proxy implementations, stateless httr2 requests are
#   simpler to inspect, serialize, and compose than R6 lifecycle objects

pkg_name <- function() "landrise.geo"
pkg_version <- function() as.character(utils::packageVersion("landrise.geo"))
pkg_user_agent <- function() paste0(pkg_name(), "/", pkg_version())

or_else <- function(x, y) {
  if (is.null(x)) y else x
}

# gpserver status constants ---------------------------------------------------

.gp_job_transient_statuses <- c("esriJobSubmitted", "esriJobWaiting", "esriJobExecuting", "esriJobNew")
.gp_job_error_statuses <- c("esriJobFailed", "esriJobCancelled", "esriJobTimedOut", "esriJobDeleted")
.gp_job_success_status <- "esriJobSucceeded"

# retry callbacks -------------------------------------------------------------

gp_resp_is_transient <- function(resp) {
  if (!inherits(resp, "httr2_response")) return(FALSE)
  resp_data <- rlang::try_fetch(httr2::resp_body_json(resp), error = function(cnd) list())
  job_status <- purrr::pluck(resp_data, "jobStatus", .default = NULL)
  !is.null(job_status) && job_status %in% .gp_job_transient_statuses
}

gp_resp_is_error <- function(resp) {
  if (!inherits(resp, "httr2_response")) return(TRUE)
  resp_data <- rlang::try_fetch(httr2::resp_body_json(resp), error = function(cnd) list())
  job_status <- purrr::pluck(resp_data, "jobStatus", .default = NULL)
  is.null(job_status) || job_status %in% .gp_job_error_statuses
}

gp_resp_error_body <- function(resp) {
  if (!inherits(resp, "httr2_response")) return("Unknown error")

  resp_data <- rlang::try_fetch(httr2::resp_body_json(resp), error = function(cnd) list())
  job_status <- purrr::pluck(resp_data, "jobStatus", .default = "Unknown")
  resp_messages <- purrr::pluck(resp_data, "messages", .default = NULL)

  if (is.null(resp_messages) || length(resp_messages) == 0) {
    return(paste0("GPServer job failed with status '", job_status, "'"))
  }

  message_text <- purrr::map_chr(
    resp_messages,
    function(msg) paste0("[", or_else(msg$type, "INFO"), "] ", or_else(msg$description, ""))
  ) |> paste0(collapse = "\n")

  paste0(
    "GPServer job failed with status '",
    job_status,
    "' and messages:\n",
    message_text
  )
}

gp_backoff <- function(attempt) {
  base_delay <- 1
  max_delay <- 30
  delay <- min(base_delay * (2^(attempt - 1)), max_delay)
  delay + stats::runif(1, 0, 1)
}

# request builders ------------------------------------------------------------

gp_submit_request <- function(
    task_url,
    params = list(),
    headers = NULL,
    timeout = 30,
    param_encoding = c("query", "form"),
    call = rlang::caller_env()
) {
  param_encoding <- rlang::arg_match(param_encoding, call = call)
  headers <- c(list(Accept = "*/*"), headers)
  params <- c(list(f = "json"), params)

  req <- httr2::request(task_url) |>
    httr2::req_url_path_append("submitJob") |>
    httr2::req_headers(!!!headers) |>
    httr2::req_timeout(timeout) |>
    httr2::req_user_agent(pkg_user_agent())

  if (param_encoding == "query") {
    req <- httr2::req_url_query(req, !!!params)
  } else {
    req <- httr2::req_body_form(req, !!!params)
  }

  req
}

gp_status_request <- function(
    job_url,
    headers = NULL,
    timeout = 30,
    max_tries = 60L,
    max_seconds = NULL,
    resp_is_transient = gp_resp_is_transient,
    resp_is_error = gp_resp_is_error,
    resp_error_body = gp_resp_error_body,
    backoff = gp_backoff
) {
  headers <- c(list(Accept = "*/*"), headers)

  httr2::request(job_url) |>
    httr2::req_url_query(f = "json") |>
    httr2::req_timeout(timeout) |>
    httr2::req_retry(
      max_tries = max_tries,
      max_seconds = max_seconds,
      is_transient = resp_is_transient,
      backoff = backoff
    ) |>
    httr2::req_error(is_error = resp_is_error, body = resp_error_body) |>
    httr2::req_headers(!!!headers) |>
    httr2::req_user_agent(pkg_user_agent())
}

gp_result_request <- function(
    job_url,
    result_param = "OutputFile",
    headers = NULL,
    timeout = 30
) {
  headers <- c(list(Accept = "*/*"), headers)
  result_url <- paste0(job_url, "/results/", result_param)

  httr2::request(result_url) |>
    httr2::req_url_query(f = "json") |>
    httr2::req_headers(!!!headers) |>
    httr2::req_timeout(timeout) |>
    httr2::req_user_agent(pkg_user_agent())
}

gp_download_request <- function(
    download_url,
    headers = NULL,
    timeout = 60,
    progress = TRUE
) {
  headers <- c(list(Accept = "*/*"), headers)

  req <- httr2::request(download_url) |>
    httr2::req_headers(!!!headers) |>
    httr2::req_timeout(timeout) |>
    httr2::req_user_agent(pkg_user_agent())

  if (progress) req <- httr2::req_progress(req)
  req
}

# response parsers ------------------------------------------------------------

gp_submit_response <- function(resp, task_url, params, call = rlang::caller_env()) {
  httr2::resp_check_status(resp)
  resp_data <- httr2::resp_body_json(resp)
  job_id <- purrr::pluck(resp_data, "jobId", .default = NULL)

  if (is.null(job_id)) {
    error_msg <- purrr::pluck(resp_data, "error", "message", .default = "Unknown error")
    cli::cli_abort(c("GPServer submit failed.", "x" = "{error_msg}"), call = call)
  }

  structure(
    list(
      task_url = task_url,
      job_id = job_id,
      job_url = file.path(task_url, "jobs", job_id),
      status = purrr::pluck(resp_data, "jobStatus", .default = NA_character_),
      params = params,
      response = resp,
      submitted_at = Sys.time()
    ),
    class = c("gp_submit_response", "list")
  )
}

gp_status_response <- function(resp, call = rlang::caller_env()) {
  httr2::resp_check_status(resp)
  resp_data <- httr2::resp_body_json(resp)
  job_status <- purrr::pluck(resp_data, "jobStatus", .default = NA_character_)

  if (!identical(job_status, .gp_job_success_status)) {
    cli::cli_abort(
      c(
        "GPServer job did not complete successfully.",
        "x" = "Status: {.field {job_status}}"
      ),
      call = call
    )
  }

  structure(
    list(
      status = job_status,
      results = purrr::pluck(resp_data, "results", .default = NULL),
      messages = purrr::pluck(resp_data, "messages", .default = NULL),
      response = resp,
      completed_at = Sys.time()
    ),
    class = c("gp_status_response", "list")
  )
}

gp_result_response <- function(resp, result_param = "OutputFile", call = rlang::caller_env()) {
  httr2::resp_check_status(resp)
  resp_data <- httr2::resp_body_json(resp)
  download_url <- purrr::pluck(resp_data, "value", "url", .default = NULL)

  if (is.null(download_url)) {
    cli::cli_abort(
      c(
        "Failed to extract download URL from GPServer result.",
        "i" = "Result parameter: {.field {result_param}}"
      ),
      call = call
    )
  }

  structure(
    list(
      result_param = result_param,
      download_url = download_url,
      response = resp
    ),
    class = c("gp_result_response", "list")
  )
}

# thin workflow wrappers ------------------------------------------------------

gp_submit <- function(
    task_url,
    params,
    headers = NULL,
    timeout = 30,
    param_encoding = c("query", "form"),
    call = rlang::caller_env()
) {
  req <- gp_submit_request(
    task_url = task_url,
    params = params,
    headers = headers,
    timeout = timeout,
    param_encoding = param_encoding,
    call = call
  )

  resp <- rlang::try_fetch(
    httr2::req_perform(req),
    error = function(cnd) {
      cli::cli_abort(
        c("Failed to perform GPServer submit request.", "x" = "{conditionMessage(cnd)}"),
        call = call
      )
    }
  )

  gp_submit_response(resp = resp, task_url = task_url, params = params, call = call)
}

gp_status <- function(
    job_url,
    headers = NULL,
    timeout = 30,
    max_tries = 60L,
    max_seconds = NULL,
    resp_is_transient = gp_resp_is_transient,
    resp_is_error = gp_resp_is_error,
    resp_error_body = gp_resp_error_body,
    backoff = gp_backoff,
    call = rlang::caller_env()
) {
  req <- gp_status_request(
    job_url = job_url,
    headers = headers,
    timeout = timeout,
    max_tries = max_tries,
    max_seconds = max_seconds,
    resp_is_transient = resp_is_transient,
    resp_is_error = resp_is_error,
    resp_error_body = resp_error_body,
    backoff = backoff
  )

  resp <- rlang::try_fetch(
    httr2::req_perform(req),
    error = function(cnd) {
      cli::cli_abort(
        c("Failed to perform GPServer status request.", "x" = "{conditionMessage(cnd)}"),
        call = call
      )
    }
  )

  gp_status_response(resp = resp, call = call)
}

gp_result_url <- function(
    job_url,
    result_param = "OutputFile",
    headers = NULL,
    timeout = 30,
    call = rlang::caller_env()
) {
  req <- gp_result_request(
    job_url = job_url,
    result_param = result_param,
    headers = headers,
    timeout = timeout
  )

  resp <- rlang::try_fetch(
    httr2::req_perform(req),
    error = function(cnd) {
      cli::cli_abort(
        c("Failed to perform GPServer result request.", "x" = "{conditionMessage(cnd)}"),
        call = call
      )
    }
  )

  gp_result_response(resp = resp, result_param = result_param, call = call)
}

gp_download <- function(
    download_url,
    output_path,
    overwrite = TRUE,
    headers = NULL,
    timeout = 60,
    progress = TRUE,
    call = rlang::caller_env()
) {
  if (is.null(output_path)) {
    ext <- tools::file_ext(download_url)
    if (!nzchar(ext)) ext <- "bin"
    output_path <- tempfile(pattern = "gp_result_", fileext = paste0(".", ext))
  }

  dir.create(dirname(output_path), recursive = TRUE, showWarnings = FALSE)

  if (file.exists(output_path) && !overwrite) {
    cli::cli_abort(
      "File exists at {.path {output_path}} and {.code overwrite = FALSE}.",
      call = call
    )
  }

  req <- gp_download_request(
    download_url = download_url,
    headers = headers,
    timeout = timeout,
    progress = progress
  )

  resp <- rlang::try_fetch(
    httr2::req_perform(req, path = output_path),
    error = function(cnd) {
      cli::cli_abort(
        c("Failed to perform GPServer download request.", "x" = "{conditionMessage(cnd)}"),
        call = call
      )
    }
  )

  httr2::resp_check_status(resp)

  structure(
    list(
      output_path = output_path,
      bytes = file.size(output_path),
      response = resp,
      downloaded_at = Sys.time()
    ),
    class = c("gp_download_response", "list")
  )
}

# print methods ---------------------------------------------------------------

print.gp_submit_response <- function(x, ...) {
  cli::cli_h3("GPServer submit response")
  cli::cli_text("job_id: {.field {x$job_id}}")
  cli::cli_text("status: {.field {x$status}}")
  cli::cli_text("job_url: {.url {x$job_url}}")
  invisible(x)
}

print.gp_status_response <- function(x, ...) {
  cli::cli_h3("GPServer status response")
  cli::cli_text("status: {.field {x$status}}")
  cli::cli_text("results: {.field {length(or_else(x$results, list()))}} parameter(s)")
  invisible(x)
}

print.gp_result_response <- function(x, ...) {
  cli::cli_h3("GPServer result response")
  cli::cli_text("param: {.field {x$result_param}}")
  cli::cli_text("download_url: {.url {x$download_url}}")
  invisible(x)
}

print.gp_download_response <- function(x, ...) {
  cli::cli_h3("GPServer download response")
  cli::cli_text("file: {.path {x$output_path}}")
  cli::cli_text("size: {.field {prettyunits::pretty_bytes(x$bytes)}}")
  invisible(x)
}

# fema provider layer ---------------------------------------------------------

.fema_msc_task_url <- "https://msc.fema.gov/arcgis/rest/services/NFHL_Print/AGOLPrintB/GPServer/Print%20FIRM%20or%20FIRMette"

fema_msc_headers <- function() {
  list(
    Accept = "*/*",
    Origin = "https://hazards-fema.maps.arcgis.com",
    Referer = "https://hazards-fema.maps.arcgis.com/"
  )
}

fema_coords_to_webmerc <- function(latitude, longitude) {
  point_wgs84 <- sf::st_sfc(sf::st_point(c(longitude, latitude)), crs = 4326)
  point_webmerc <- sf::st_transform(point_wgs84, 3857)
  sf::st_coordinates(point_webmerc)
}

fema_msc_build_firmette_params <- function(latitude, longitude, report_type, format) {
  xy <- fema_coords_to_webmerc(latitude, longitude)

  feature_collection <- list(
    geometryType = "esriGeometryPoint",
    features = list(
      list(
        geometry = list(
          x = xy[1, "X"],
          y = xy[1, "Y"],
          spatialReference = list(wkid = 102100L, latestWkid = 3857L)
        )
      )
    ),
    sr = list(wkid = 102100L, latestWkid = 3857L)
  )

  list(
    `env:outSR` = 102100,
    FC = jsonlite::toJSON(feature_collection, auto_unbox = TRUE),
    Print_Type = if (report_type == "firm") "Full FIRM" else "FIRMETTE",
    graphic = format,
    input_lat = round(latitude, 4),
    input_lon = round(longitude, 4)
  )
}

# orchestrator ---------------------------------------------------------------
# intentionally exposes domain knobs only; transport internals are fixed
# (query params, headers, retry callbacks) for endpoint stability.

fema_msc_firmette <- function(
    latitude,
    longitude,
    report_type = c("firmette", "firm"),
    format = c("pdf", "png"),
    output_path = NULL,
    overwrite = TRUE,
    open = interactive(),
    timeout = 30,
    max_tries = 60L,
    call = rlang::caller_env()
) {
  report_type <- rlang::arg_match(report_type, call = call)
  format <- rlang::arg_match(format, call = call)

  params <- fema_msc_build_firmette_params(
    latitude = latitude,
    longitude = longitude,
    report_type = report_type,
    format = format
  )

  headers <- fema_msc_headers()

  submit <- gp_submit(
    task_url = .fema_msc_task_url,
    params = params,
    headers = headers,
    timeout = timeout,
    param_encoding = "query",
    call = call
  )

  status <- gp_status(
    job_url = submit$job_url,
    headers = headers,
    timeout = timeout,
    max_tries = max_tries,
    call = call
  )

  result <- gp_result_url(
    job_url = submit$job_url,
    result_param = "OutputFile",
    headers = headers,
    timeout = timeout,
    call = call
  )

  download <- gp_download(
    download_url = result$download_url,
    output_path = output_path,
    overwrite = overwrite,
    headers = headers,
    timeout = max(timeout, 60),
    progress = TRUE,
    call = call
  )

  if (open && interactive()) utils::browseURL(download$output_path)

  structure(
    list(
      file = download$output_path,
      submit = submit,
      status = status,
      result = result,
      download = download
    ),
    class = c("fema_msc_firmette_response", "list")
  )
}

print.fema_msc_firmette_response <- function(x, ...) {
  cli::cli_h3("FEMA MSC FIRMette response")
  cli::cli_text("file: {.path {x$file}}")
  cli::cli_text("job_id: {.field {x$submit$job_id}}")
  cli::cli_text("status: {.field {x$status$status}}")
  invisible(x)
}

# demo -----------------------------------------------------------------------

if (FALSE) {
  response <- fema_msc_firmette(
    latitude = 33.749,
    longitude = -84.388,
    report_type = "firmette",
    format = "png"
  )
  print(response)
}

```

## Usage

How to use this code:

```
# usage example
```

## Notes

Additional notes about the code.

***

## Appendix

*Note created on [[2026-04-29]] and last modified on [[2026-04-29]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]

### Backlinks

```dataview
LIST FROM [[R - ArcGIS GPServer Job Client]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
