---
creation_date: 2026-05-17
modification_date: 2026-06-08T13:48:50-04:00
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

> [!INFO]
> Language: [[MOC - R|R]]
> Packages: [[httr2]], [[arcgisutils]], [[arcgislayers]], [[yyjsonr]], [[sf]]

Demonstration of incorporating a best practice, robust API workflow for [[ArcGIS]] GPServer jobs using [[httr2]] and [[MOC - R|R]].

## Design Notes

- Architecture is centered around the functional, layered abstractions around core `httr2` request and response objects with *integrated transient retry callbacks registered.*
- Submission, Status, Result, and Download are thin wrappers around performing requests
- Query vs. Form parameters configurable, default to query?

## Code

Skip to [...]() to see the entire code snippet without stepping through each layer.

### Setup

To get started, we first need to setup various helper functions and constants/enumerations.

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

check_gp_response <- function(x, arg = rlang::caller_arg(x), call = rlang::caller_env()) {
  check_response(x, arg = arg, call = call)
  httr2::resp_check_content_type(resp, valid_types = c("application/json"), call = call)
  
  invisible(x)
}
```

Next, we will need to define some enumerations and constants:

```R
# arcgis gpserver statuses ---------------------------------------------------
GP_STATUS_TRANSIENT <- c("esriJobNew", "esriJobSubmitted", "esriJobWaiting", "esriJobExecuting")
GP_STATUS_ERROR <- c("esriJobFailed", "esriJobCancelled", "esriJobTimedOut", "esriJobDeleted")
GP_STATUS_SUCCESS <- "esriJobSucceeded"
```

Next, we we setup the core `httr2` callback handling functions. These functions are used as arguments to `httr2::req_retry()` and `httr2::req_error()` etc. to detect when a response is *transient* or an error:

```R

gp_resp_body <- function(resp) {
  check_gp_response(resp)
  httr2::resp_body_raw(resp) |> yyjsonr::read_json_raw()
}

gp_resp_job_status <- function(resp) {
  check_gp_response(resp)
  gp_resp_body(resp) |> purrr::pluck(resp_data, "jobStatus", .default = NULL)
}

# retry callbacks -------------------------------------------------------------
gp_resp_is_transient <- function(resp) {
  check_gp_response(resp)
  job_status <- gp_resp_job_status(reso)
  !is.null(job_status) && job_status %in% GP_STATUS_TRANSIENT
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

## Full Code

```R
# =============================================================================
# arcgis_gp.R
# ArcGIS GPServer — Service-Agnostic Async Job Workflow
# Author : Jimmy Briggs <jimmy.briggs@noclocks.dev>
# License: MIT
# =============================================================================
#
# Naming Convention (mirrors httr2 itself):
#
#   gp_request()            — base request constructor (sets base URL + UA)
#   gp_*_request()          — stage-specific request constructors
#                             (submit, status, result, download)
#   gp_req_*()              — request *modifiers* (pure; return req)
#                             (gp_req_token, gp_req_headers, gp_req_retry, ...)
#   gp_resp_*()             — response predicates / extractors
#                             (gp_resp_is_transient, gp_resp_is_error,
#                              gp_resp_error_body, gp_resp_body_safe,
#                              gp_resp_backoff)
#   gp_*_response()         — response parsers → typed S3 objects
#                             (gp_submit_response, gp_status_response,
#                              gp_result_response, gp_download_response)
#   gp_submit/wait/result/download/run()
#                           — public verbs (build → perform → parse)
#
# Layer map:
#   0 │ Constants       — esri job status sets
#   1 │ gp_resp_*()     — retry predicates & extractors
#   2 │ gp_request()
#       gp_req_*()      — base request + request modifiers
#       gp_*_request()  — stage request constructors
#   3 │ gp_*_response() — response parsers → typed S3 lists
#   4 │ .gp_perform*()  — private I/O performers (single call-site for httr2)
#   5 │ gp_submit()     — public verbs
#       gp_wait()
#       gp_result()
#       gp_download()
#       gp_run()
#   6 │ print.*()       — S3 print methods
#
# Provider extensions live in separate files and call only Layer-5 verbs.
# =============================================================================

# ── Suggested Imports (use pkg:: prefix throughout; list for DESCRIPTION) ────
# httr2, rlang, purrr, cli, tools, stats, utils

# =============================================================================
# Layer 0 · Constants
# =============================================================================

.gp_status_transient <- c(
  "esriJobNew",
  "esriJobSubmitted",
  "esriJobWaiting",
  "esriJobExecuting"
)

.gp_status_error <- c(
  "esriJobFailed",
  "esriJobCancelled",
  "esriJobTimedOut",
  "esriJobDeleted"
)

.gp_status_success <- "esriJobSucceeded"

# =============================================================================
# Layer 1 · gp_resp_*()  — Response predicates, extractors, and backoff
#
# These are the injectable callbacks consumed by gp_req_retry() and
# gp_req_error(). Naming mirrors httr2's own resp_* namespace.
# =============================================================================

#' Safely parse a GPServer response body as JSON.
#'
#' Returns an empty list on any parse failure rather than throwing.
#' Used internally by all `gp_resp_*` predicates.
#'
#' @param resp An `httr2_response`.
#' @returns A list (empty on failure).
#' @keywords internal
gp_resp_body_safe <- function(resp) {
  rlang::try_fetch(
    httr2::resp_body_json(resp),
    error = function(cnd) list()
  )
}

#' Is the GPServer job response still transient (i.e. still running)?
#'
#' Designed for `httr2::req_retry(is_transient = gp_resp_is_transient)`.
#' Returns `TRUE` while the job status is in `.gp_status_transient`, which
#' causes `httr2` to keep retrying the status poll.
#'
#' @param resp An `httr2_response`.
#' @returns Logical scalar.
#' @export
gp_resp_is_transient <- function(resp) {
  if (!inherits(resp, "httr2_response")) return(FALSE)
  status <- purrr::pluck(gp_resp_body_safe(resp), "jobStatus", .default = NULL)
  !is.null(status) && status %in% .gp_status_transient
}

#' Should the GPServer response be treated as a terminal error?
#'
#' Designed for `httr2::req_error(is_error = gp_resp_is_error)`.
#' Returns `TRUE` when the job has entered a failed/cancelled/timed-out state
#' or when the body contains no `jobStatus` field at all.
#'
#' @param resp An `httr2_response`.
#' @returns Logical scalar.
#' @export
gp_resp_is_error <- function(resp) {
  if (!inherits(resp, "httr2_response")) return(TRUE)
  status <- purrr::pluck(gp_resp_body_safe(resp), "jobStatus", .default = NULL)
  is.null(status) || status %in% .gp_status_error
}

#' Extract a human-readable error message from a GPServer response body.
#'
#' Designed for `httr2::req_error(body = gp_resp_error_body)`.
#' Concatenates the server's `messages` array (type + description) into a
#' single string so `httr2` can surface it in the condition message.
#'
#' @param resp An `httr2_response`.
#' @returns Character scalar.
#' @export
gp_resp_error_body <- function(resp) {
  if (!inherits(resp, "httr2_response")) return("Unknown GPServer error.")

  data   <- gp_resp_body_safe(resp)
  status <- purrr::pluck(data, "jobStatus",  .default = "unknown")
  msgs   <- purrr::pluck(data, "messages",   .default = NULL)

  if (is.null(msgs) || length(msgs) == 0L) {
    return(paste0("GPServer job failed with status '", status, "'."))
  }

  detail <- purrr::map_chr(msgs, function(m) {
    paste0("[", m$type %||% "INFO", "] ", m$description %||% "")
  })

  paste0(
    "GPServer job failed with status '", status, "'.\n",
    paste(detail, collapse = "\n")
  )
}

#' Jittered exponential backoff for GPServer status polling.
#'
#' Designed for `httr2::req_retry(backoff = gp_resp_backoff)`.
#' Doubles the delay each attempt (1 s, 2 s, 4 s … capped at 30 s) and adds
#' uniform jitter in [0, 1) to avoid thundering-herd retries.
#'
#' @param attempt Integer attempt number (1-indexed).
#' @returns Numeric delay in seconds.
#' @export
gp_resp_backoff <- function(attempt) {
  min(2^(attempt - 1L), 30L) + stats::runif(1, 0, 1)
}

# =============================================================================
# Layer 2 · gp_request(), gp_req_*(), gp_*_request()
#
#   gp_request()        — base constructor; stamps URL, timeout, user-agent
#   gp_req_*()          — pure modifiers that accept + return an httr2_request
#   gp_*_request()      — stage constructors (compose base + modifiers)
# =============================================================================

# ── Base constructor ──────────────────────────────────────────────────────────

#' Construct a base ArcGIS GPServer request.
#'
#' All stage-specific constructors (`gp_submit_request`, etc.) start from
#' this base. It stamps the base URL, default timeout, and user-agent.
#' Headers and parameters are applied by the caller via `gp_req_*` modifiers.
#'
#' @param url        Full request URL (string).
#' @param timeout    Per-request timeout in seconds.
#' @param user_agent HTTP User-Agent string.
#' @returns An `httr2_request`.
#' @export
gp_request <- function(
    url,
    timeout    = 30L,
    user_agent = "arcgis-gp-r/1.0.0"
) {
  httr2::request(url) |>
    httr2::req_timeout(timeout) |>
    httr2::req_user_agent(user_agent)
}

# ── Request modifiers (gp_req_*) ─────────────────────────────────────────────

#' Attach HTTP headers to a GPServer request.
#'
#' Merges `Accept: */*` as a baseline and splices any caller-supplied headers
#' on top. Safe to call with `headers = NULL`.
#'
#' @param req     An `httr2_request`.
#' @param headers Named list of additional headers, or `NULL`.
#' @returns The modified `httr2_request`.
#' @export
gp_req_headers <- function(req, headers = NULL) {
  all_headers <- c(list(Accept = "*/*"), headers)
  httr2::req_headers(req, !!!all_headers)
}

#' Attach an ArcGIS token to a GPServer request.
#'
#' Adds `token` as a query parameter (the standard ArcGIS REST auth mechanism).
#' A no-op when `token` is `NULL`, so provider wrappers can always call this
#' without needing to branch.
#'
#' @param req   An `httr2_request`.
#' @param token Character ArcGIS token, or `NULL` for unauthenticated services.
#' @returns The modified `httr2_request` (unchanged if `token` is `NULL`).
#' @export
gp_req_token <- function(req, token = NULL) {
  if (is.null(token)) return(req)
  httr2::req_url_query(req, token = token)
}

#' Attach the GPServer status-polling retry policy to a request.
#'
#' Wraps `httr2::req_retry()` and `httr2::req_error()` with injectable
#' callback functions so individual providers can override predicates without
#' changing the transport layer.
#'
#' @param req          An `httr2_request`.
#' @param max_tries    Maximum polling attempts.
#' @param max_seconds  Maximum total wall-clock polling seconds (`NULL` = none).
#' @param is_transient Retry predicate; defaults to `gp_resp_is_transient`.
#' @param is_error     Error predicate; defaults to `gp_resp_is_error`.
#' @param error_body   Error body extractor; defaults to `gp_resp_error_body`.
#' @param backoff      Backoff function; defaults to `gp_resp_backoff`.
#' @returns The modified `httr2_request`.
#' @export
gp_req_retry <- function(
    req,
    max_tries    = 60L,
    max_seconds  = NULL,
    is_transient = gp_resp_is_transient,
    is_error     = gp_resp_is_error,
    error_body   = gp_resp_error_body,
    backoff      = gp_resp_backoff
) {
  req |>
    httr2::req_retry(
      max_tries    = max_tries,
      max_seconds  = max_seconds,
      is_transient = is_transient,
      backoff      = backoff
    ) |>
    httr2::req_error(is_error = is_error, body = error_body)
}

#' Encode task parameters onto a GPServer request.
#'
#' Always injects `f = "json"` as the ArcGIS REST format parameter, then
#' attaches the caller's params either as query-string or form-body.
#'
#' @param req      An `httr2_request`.
#' @param params   Named list of task parameters.
#' @param encoding `"query"` (GET) or `"form"` (POST).
#' @param call     Caller environment for error attribution.
#' @returns The modified `httr2_request`.
#' @export
gp_req_params <- function(
    req,
    params   = list(),
    encoding = c("query", "form"),
    call     = rlang::caller_env()
) {
  encoding <- rlang::arg_match(encoding, call = call)
  params   <- c(list(f = "json"), params)

  if (identical(encoding, "query")) {
    httr2::req_url_query(req, !!!params)
  } else {
    httr2::req_body_form(req, !!!params)
  }
}

# ── Stage constructors (gp_*_request) ────────────────────────────────────────

#' Build a GPServer job-submission request.
#'
#' Constructs the full `<task_url>/submitJob` request by composing the base
#' constructor with `gp_req_headers`, `gp_req_token`, and `gp_req_params`.
#'
#' @param task_url   Full URL to the GPServer task (no trailing slash).
#' @param params     Named list of task-specific parameters (excluding `f`).
#' @param headers    Named list of additional HTTP headers, or `NULL`.
#' @param token      ArcGIS token string, or `NULL` for public services.
#' @param timeout    Per-request timeout in seconds.
#' @param encoding   `"query"` (default) or `"form"`.
#' @param user_agent HTTP User-Agent string.
#' @param call       Caller environment for error attribution.
#' @returns An `httr2_request` ready for `httr2::req_perform()`.
#' @export
gp_submit_request <- function(
    task_url,
    params     = list(),
    headers    = NULL,
    token      = NULL,
    timeout    = 30L,
    encoding   = c("query", "form"),
    user_agent = "arcgis-gp-r/1.0.0",
    call       = rlang::caller_env()
) {
  gp_request(task_url, timeout = timeout, user_agent = user_agent) |>
    httr2::req_url_path_append("submitJob") |>
    gp_req_headers(headers) |>
    gp_req_token(token) |>
    gp_req_params(params, encoding = encoding, call = call)
}

#' Build a GPServer job-status polling request.
#'
#' Constructs the `<job_url>?f=json` request and attaches the full retry +
#' error policy via `gp_req_retry()`. The retry policy is baked in here
#' (not in the verb) so the request object is self-contained and inspectable.
#'
#' @param job_url      Full URL to the job resource (`.../jobs/<jobId>`).
#' @param headers      Named list of additional HTTP headers, or `NULL`.
#' @param token        ArcGIS token string, or `NULL`.
#' @param timeout      Per-attempt timeout in seconds.
#' @param max_tries    Maximum polling attempts.
#' @param max_seconds  Maximum total polling seconds (`NULL` = unlimited).
#' @param is_transient Retry predicate (injectable; default `gp_resp_is_transient`).
#' @param is_error     Error predicate (injectable; default `gp_resp_is_error`).
#' @param error_body   Error body extractor (injectable; default `gp_resp_error_body`).
#' @param backoff      Backoff function (injectable; default `gp_resp_backoff`).
#' @param user_agent   HTTP User-Agent string.
#' @returns An `httr2_request` with retry policy attached.
#' @export
gp_status_request <- function(
    job_url,
    headers      = NULL,
    token        = NULL,
    timeout      = 30L,
    max_tries    = 60L,
    max_seconds  = NULL,
    is_transient = gp_resp_is_transient,
    is_error     = gp_resp_is_error,
    error_body   = gp_resp_error_body,
    backoff      = gp_resp_backoff,
    user_agent   = "arcgis-gp-r/1.0.0"
) {
  gp_request(job_url, timeout = timeout, user_agent = user_agent) |>
    httr2::req_url_query(f = "json") |>
    gp_req_headers(headers) |>
    gp_req_token(token) |>
    gp_req_retry(
      max_tries    = max_tries,
      max_seconds  = max_seconds,
      is_transient = is_transient,
      is_error     = is_error,
      error_body   = error_body,
      backoff      = backoff
    )
}

#' Build a GPServer result-metadata request.
#'
#' Fetches `<job_url>/results/<result_param>?f=json` to retrieve the output
#' parameter metadata (most importantly the file download URL).
#'
#' @param job_url      Full URL to the job resource (`.../jobs/<jobId>`).
#' @param result_param Output parameter name (e.g. `"OutputFile"`).
#' @param headers      Named list of additional HTTP headers, or `NULL`.
#' @param token        ArcGIS token string, or `NULL`.
#' @param timeout      Per-request timeout in seconds.
#' @param user_agent   HTTP User-Agent string.
#' @returns An `httr2_request`.
#' @export
gp_result_request <- function(
    job_url,
    result_param = "OutputFile",
    headers      = NULL,
    token        = NULL,
    timeout      = 30L,
    user_agent   = "arcgis-gp-r/1.0.0"
) {
  result_url <- paste0(
    job_url, "/results/",
    utils::URLencode(result_param, reserved = TRUE)
  )

  gp_request(result_url, timeout = timeout, user_agent = user_agent) |>
    httr2::req_url_query(f = "json") |>
    gp_req_headers(headers) |>
    gp_req_token(token)
}

#' Build a GPServer file-download request.
#'
#' Constructs a plain binary-download request for the URL surfaced by
#' `gp_result_request()`. Optionally attaches a CLI progress bar.
#'
#' @param download_url URL of the output file to download.
#' @param headers      Named list of additional HTTP headers, or `NULL`.
#' @param token        ArcGIS token string, or `NULL`.
#' @param timeout      Download timeout in seconds.
#' @param progress     Whether to show a `cli`-powered progress bar.
#' @param user_agent   HTTP User-Agent string.
#' @returns An `httr2_request`.
#' @export
gp_download_request <- function(
    download_url,
    headers    = NULL,
    token      = NULL,
    timeout    = 120L,
    progress   = TRUE,
    user_agent = "arcgis-gp-r/1.0.0"
) {
  req <- gp_request(download_url, timeout = timeout, user_agent = user_agent) |>
    gp_req_headers(headers) |>
    gp_req_token(token)

  if (progress) req <- httr2::req_progress(req)
  req
}

# =============================================================================
# Layer 3 · gp_*_response()  — Response parsers → typed S3 list objects
#
# Each parser accepts an httr2_response plus context and returns a classed
# list. No I/O occurs here. The parent class "arcgis_gp_response" allows
# generic dispatch across all GP response types.
# =============================================================================

#' Parse a GPServer job-submission response.
#'
#' Extracts `jobId` and assembles the full job URL. Errors cleanly when the
#' server returns an error payload instead of a job ID.
#'
#' @param resp     An `httr2_response` from `gp_submit_request`.
#' @param task_url The task URL used during submission (for URL assembly).
#' @param params   The parameter list sent (echoed back for traceability).
#' @param call     Caller environment for error attribution.
#' @returns An `arcgis_gp_job` S3 object.
#' @export
gp_submit_response <- function(
    resp,
    task_url,
    params = list(),
    call   = rlang::caller_env()
) {
  httr2::resp_check_status(resp)
  data   <- httr2::resp_body_json(resp)
  job_id <- purrr::pluck(data, "jobId", .default = NULL)

  if (is.null(job_id) || !nzchar(job_id)) {
    err <- purrr::pluck(data, "error", "message", .default = "Unknown submit error.")
    cli::cli_abort(c("GPServer job submission failed.", "x" = "{err}"), call = call)
  }

  structure(
    list(
      task_url     = task_url,
      job_id       = job_id,
      job_url      = paste0(task_url, "/jobs/", job_id),
      status       = purrr::pluck(data, "jobStatus", .default = NA_character_),
      params       = params,
      response     = resp,
      submitted_at = Sys.time()
    ),
    class = c("arcgis_gp_job", "arcgis_gp_response", "list")
  )
}

#' Parse a GPServer job-status response.
#'
#' Called after the retry loop in `gp_wait()` resolves. Errors if the final
#' status is not `esriJobSucceeded` (which should rarely occur because
#' `gp_req_retry()` already intercepts error statuses, but guards against edge
#' cases such as a custom `is_error` predicate).
#'
#' @param resp An `httr2_response` from `gp_status_request`.
#' @param call Caller environment for error attribution.
#' @returns An `arcgis_gp_status` S3 object.
#' @export
gp_status_response <- function(resp, call = rlang::caller_env()) {
  httr2::resp_check_status(resp)
  data   <- httr2::resp_body_json(resp)
  status <- purrr::pluck(data, "jobStatus", .default = NA_character_)

  if (!identical(status, .gp_status_success)) {
    cli::cli_abort(
      c(
        "GPServer job did not complete successfully.",
        "x" = "Status: {.field {status}}"
      ),
      call = call
    )
  }

  structure(
    list(
      status       = status,
      results      = purrr::pluck(data, "results",  .default = NULL),
      messages     = purrr::pluck(data, "messages", .default = NULL),
      response     = resp,
      completed_at = Sys.time()
    ),
    class = c("arcgis_gp_status", "arcgis_gp_response", "list")
  )
}

#' Parse a GPServer result-metadata response.
#'
#' Extracts the file download URL from `value.url`. Also captures `paramName`
#' and `dataType` for media-type inference by the caller.
#'
#' @param resp         An `httr2_response` from `gp_result_request`.
#' @param result_param The output parameter name requested.
#' @param call         Caller environment for error attribution.
#' @returns An `arcgis_gp_result` S3 object.
#' @export
gp_result_response <- function(
    resp,
    result_param = "OutputFile",
    call         = rlang::caller_env()
) {
  httr2::resp_check_status(resp)
  data         <- httr2::resp_body_json(resp)
  download_url <- purrr::pluck(data, "value", "url", .default = NULL)

  if (is.null(download_url) || !nzchar(download_url)) {
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
      param_name   = purrr::pluck(data, "paramName",  .default = result_param),
      data_type    = purrr::pluck(data, "dataType",   .default = NA_character_),
      download_url = download_url,
      response     = resp,
      retrieved_at = Sys.time()
    ),
    class = c("arcgis_gp_result", "arcgis_gp_response", "list")
  )
}

#' Construct a GPServer download response object.
#'
#' Unlike the other `gp_*_response()` parsers, this is called *after*
#' `httr2::req_perform(req, path = output_path)` writes the file to disk,
#' so it wraps the file metadata rather than parsing a JSON body.
#'
#' @param resp        An `httr2_response` from the download perform step.
#' @param output_path The local path the file was written to.
#' @returns An `arcgis_gp_download` S3 object.
#' @export
gp_download_response <- function(resp, output_path) {
  structure(
    list(
      output_path   = output_path,
      bytes         = file.size(output_path),
      response      = resp,
      downloaded_at = Sys.time()
    ),
    class = c("arcgis_gp_download", "arcgis_gp_response", "list")
  )
}

# =============================================================================
# Layer 4 · Private performers  (.gp_perform, .gp_perform_download)
#
# The only place httr2::req_perform() is called. All I/O errors are funnelled
# through rlang::try_fetch → cli::cli_abort with parent = cnd so the original
# httr2 condition is preserved in the error chain.
# =============================================================================

#' @keywords internal
.gp_perform <- function(req, on_error, call = rlang::caller_env()) {
  rlang::try_fetch(
    {
      resp <- httr2::req_perform(req)
      httr2::resp_check_status(resp)
      resp
    },
    error = function(cnd) {
      cli::cli_abort(
        c(on_error, "x" = "{conditionMessage(cnd)}"),
        parent = cnd,
        call   = call
      )
    }
  )
}

#' @keywords internal
.gp_perform_download <- function(req, output_path, call = rlang::caller_env()) {
  rlang::try_fetch(
    {
      resp <- httr2::req_perform(req, path = output_path)
      httr2::resp_check_status(resp)
      resp
    },
    error = function(cnd) {
      cli::cli_abort(
        c("Failed to download GPServer result file.", "x" = "{conditionMessage(cnd)}"),
        parent = cnd,
        call   = call
      )
    }
  )
}

# =============================================================================
# Layer 5 · Public verbs
#
# Each verb follows the same three-step pattern:
#   1. Call the stage request constructor   (Layer 2)
#   2. Perform via the private performer    (Layer 4)
#   3. Parse via the stage response parser  (Layer 3)
#
# gp_run() is the pipeline orchestrator — the only function provider wrappers
# should need to call.
# =============================================================================

#' Submit a job to an ArcGIS GPServer task.
#'
#' @inheritParams gp_submit_request
#' @returns An `arcgis_gp_job` S3 object.
#' @export
gp_submit <- function(
    task_url,
    params     = list(),
    headers    = NULL,
    token      = NULL,
    timeout    = 30L,
    encoding   = c("query", "form"),
    user_agent = "arcgis-gp-r/1.0.0",
    call       = rlang::caller_env()
) {
  req  <- gp_submit_request(
    task_url   = task_url,
    params     = params,
    headers    = headers,
    token      = token,
    timeout    = timeout,
    encoding   = encoding,
    user_agent = user_agent,
    call       = call
  )
  resp <- .gp_perform(req, "Failed to submit GPServer job.", call = call)
  gp_submit_response(resp, task_url = task_url, params = params, call = call)
}

#' Poll a GPServer job until it completes (or fails).
#'
#' Delegates the entire retry loop to `gp_status_request()`, which bakes the
#' `httr2::req_retry()` + `httr2::req_error()` policy into the request object.
#' The name "wait" signals the blocking polling nature of this verb.
#'
#' @param job_url Full job URL from `gp_submit()$job_url`.
#' @inheritParams gp_status_request
#' @returns An `arcgis_gp_status` S3 object.
#' @export
gp_wait <- function(
    job_url,
    headers      = NULL,
    token        = NULL,
    timeout      = 30L,
    max_tries    = 60L,
    max_seconds  = NULL,
    is_transient = gp_resp_is_transient,
    is_error     = gp_resp_is_error,
    error_body   = gp_resp_error_body,
    backoff      = gp_resp_backoff,
    user_agent   = "arcgis-gp-r/1.0.0",
    call         = rlang::caller_env()
) {
  req  <- gp_status_request(
    job_url      = job_url,
    headers      = headers,
    token        = token,
    timeout      = timeout,
    max_tries    = max_tries,
    max_seconds  = max_seconds,
    is_transient = is_transient,
    is_error     = is_error,
    error_body   = error_body,
    backoff      = backoff,
    user_agent   = user_agent
  )
  resp <- .gp_perform(req, "Failed while polling GPServer job.", call = call)
  gp_status_response(resp, call = call)
}

#' Fetch output-parameter metadata from a completed GPServer job.
#'
#' Returns the download URL (and auxiliary metadata) for a named output
#' parameter. Call this after `gp_wait()` succeeds.
#'
#' @param job_url Full job URL from `gp_submit()$job_url`.
#' @inheritParams gp_result_request
#' @returns An `arcgis_gp_result` S3 object.
#' @export
gp_result <- function(
    job_url,
    result_param = "OutputFile",
    headers      = NULL,
    token        = NULL,
    timeout      = 30L,
    user_agent   = "arcgis-gp-r/1.0.0",
    call         = rlang::caller_env()
) {
  req  <- gp_result_request(
    job_url      = job_url,
    result_param = result_param,
    headers      = headers,
    token        = token,
    timeout      = timeout,
    user_agent   = user_agent
  )
  resp <- .gp_perform(req, "Failed to fetch GPServer result metadata.", call = call)
  gp_result_response(resp, result_param = result_param, call = call)
}

#' Download a GPServer output file to disk.
#'
#' @param download_url URL from `gp_result()$download_url`.
#' @param output_path  Destination path. `NULL` auto-generates a temp file
#'   whose extension matches the download URL's file extension.
#' @param overwrite    Whether to overwrite an existing file at `output_path`.
#' @inheritParams gp_download_request
#' @returns An `arcgis_gp_download` S3 object.
#' @export
gp_download <- function(
    download_url,
    output_path = NULL,
    overwrite   = TRUE,
    headers     = NULL,
    token       = NULL,
    timeout     = 120L,
    progress    = TRUE,
    user_agent  = "arcgis-gp-r/1.0.0",
    call        = rlang::caller_env()
) {
  if (is.null(output_path)) {
    ext <- tools::file_ext(utils::URLdecode(download_url))
    if (!nzchar(ext)) ext <- "bin"
    output_path <- tempfile(pattern = "arcgis_gp_", fileext = paste0(".", ext))
  }

  dir.create(dirname(output_path), recursive = TRUE, showWarnings = FALSE)

  if (file.exists(output_path) && !overwrite) {
    cli::cli_abort(
      "File already exists at {.path {output_path}} and {.code overwrite = FALSE}.",
      call = call
    )
  }

  req  <- gp_download_request(
    download_url = download_url,
    headers      = headers,
    token        = token,
    timeout      = timeout,
    progress     = progress,
    user_agent   = user_agent
  )
  resp <- .gp_perform_download(req, output_path = output_path, call = call)
  gp_download_response(resp, output_path = output_path)
}

#' Run a complete GPServer submit → wait → result → download pipeline.
#'
#' This is the high-level orchestrator that chains all four verbs. Provider
#' wrappers should call this rather than assembling the stages manually.
#' Set `skip_download = TRUE` to stop after obtaining the result metadata
#' (e.g. when you only need the download URL).
#'
#' @inheritParams gp_submit
#' @param result_param    Output parameter name (default `"OutputFile"`).
#' @param output_path     Destination file path; `NULL` for a temp file.
#' @param overwrite       Whether to overwrite an existing file.
#' @param skip_download   If `TRUE`, skip the download step entirely.
#' @param download_timeout Timeout for the binary download step (seconds).
#' @param max_tries       Maximum polling attempts passed to `gp_wait`.
#' @param max_seconds     Maximum total polling seconds passed to `gp_wait`.
#' @param progress        Whether to show a download progress bar.
#' @returns An `arcgis_gp_run` S3 object containing all stage results.
#' @export
gp_run <- function(
    task_url,
    params           = list(),
    result_param     = "OutputFile",
    output_path      = NULL,
    overwrite        = TRUE,
    skip_download    = FALSE,
    headers          = NULL,
    token            = NULL,
    timeout          = 30L,
    download_timeout = max(timeout, 120L),
    max_tries        = 60L,
    max_seconds      = NULL,
    encoding         = c("query", "form"),
    progress         = TRUE,
    user_agent       = "arcgis-gp-r/1.0.0",
    call             = rlang::caller_env()
) {
  job <- gp_submit(
    task_url   = task_url,
    params     = params,
    headers    = headers,
    token      = token,
    timeout    = timeout,
    encoding   = encoding,
    user_agent = user_agent,
    call       = call
  )

  status <- gp_wait(
    job_url    = job$job_url,
    headers    = headers,
    token      = token,
    timeout    = timeout,
    max_tries  = max_tries,
    max_seconds = max_seconds,
    user_agent = user_agent,
    call       = call
  )

  result <- gp_result(
    job_url      = job$job_url,
    result_param = result_param,
    headers      = headers,
    token        = token,
    timeout      = timeout,
    user_agent   = user_agent,
    call         = call
  )

  downloaded <- if (!skip_download) {
    gp_download(
      download_url = result$download_url,
      output_path  = output_path,
      overwrite    = overwrite,
      headers      = headers,
      token        = token,
      timeout      = download_timeout,
      progress     = progress,
      user_agent   = user_agent,
      call         = call
    )
  } else {
    NULL
  }

  structure(
    list(
      job      = job,
      status   = status,
      result   = result,
      download = downloaded
    ),
    class = c("arcgis_gp_run", "arcgis_gp_response", "list")
  )
}

# =============================================================================
# Layer 6 · S3 Print Methods
# =============================================================================

#' @export
print.arcgis_gp_job <- function(x, ...) {
  cli::cli_h3("ArcGIS GPServer \u2014 Job Submitted")
  cli::cli_dl(c(
    "Job ID"   = "{.field {x$job_id}}",
    "Status"   = "{.field {x$status}}",
    "Job URL"  = "{.url {x$job_url}}",
    "Task URL" = "{.url {x$task_url}}"
  ))
  invisible(x)
}

#' @export
print.arcgis_gp_status <- function(x, ...) {
  n <- length(x$results %||% list())
  cli::cli_h3("ArcGIS GPServer \u2014 Job Completed")
  cli::cli_dl(c(
    "Status"      = "{.field {x$status}}",
    "Results"     = "{.field {n}} parameter(s)",
    "Completed"   = "{.field {format(x$completed_at)}}"
  ))
  invisible(x)
}

#' @export
print.arcgis_gp_result <- function(x, ...) {
  cli::cli_h3("ArcGIS GPServer \u2014 Result Metadata")
  cli::cli_dl(c(
    "Parameter"    = "{.field {x$result_param}}",
    "Data Type"    = "{.field {x$data_type %||% NA_character_}}",
    "Download URL" = "{.url {x$download_url}}"
  ))
  invisible(x)
}

#' @export
print.arcgis_gp_download <- function(x, ...) {
  size <- tryCatch(
    prettyunits::pretty_bytes(x$bytes),
    error = function(e) paste0(x$bytes, " B")
  )
  cli::cli_h3("ArcGIS GPServer \u2014 File Downloaded")
  cli::cli_dl(c(
    "Path"       = "{.path {x$output_path}}",
    "Size"       = "{.field {size}}",
    "Downloaded" = "{.field {format(x$downloaded_at)}}"
  ))
  invisible(x)
}

#' @export
print.arcgis_gp_run <- function(x, ...) {
  cli::cli_h3("ArcGIS GPServer \u2014 Run Complete")
  cli::cli_dl(c(
    "Job ID" = "{.field {x$job$job_id}}",
    "Status" = "{.field {x$status$status}}",
    "Result" = "{.field {x$result$result_param}}"
  ))
  if (!is.null(x$download)) {
    cli::cli_text("File: {.path {x$download$output_path}}")
  }
  invisible(x)
}

# =============================================================================
# Provider Extension Template
# =============================================================================
# Copy into a separate file (e.g. R/provider_fema_msc.R). Only call Layer-5
# verbs; never reach into Layers 1-4 directly from provider code.
#
# .fema_task_url <- "https://msc.fema.gov/arcgis/rest/services/..."
#
# .fema_headers <- function() {
#   list(
#     Accept  = "*/*",
#     Origin  = "https://hazards-fema.maps.arcgis.com",
#     Referer = "https://hazards-fema.maps.arcgis.com/"
#   )
# }
#
# .fema_build_params <- function(latitude, longitude, report_type, format) {
#   # ... coordinate transform + feature-collection JSON assembly ...
#   list(FC = fc_json, Print_Type = report_type, graphic = format, ...)
# }
#
# #' @export
# fema_firmette <- function(
#     latitude,
#     longitude,
#     report_type  = c("firmette", "firm"),
#     format       = c("pdf", "png"),
#     output_path  = NULL,
#     overwrite    = TRUE,
#     open         = interactive(),
#     timeout      = 30L,
#     max_tries    = 60L,
#     call         = rlang::caller_env()
# ) {
#   report_type <- rlang::arg_match(report_type, call = call)
#   format      <- rlang::arg_match(format,      call = call)
#
#   run <- gp_run(
#     task_url     = .fema_task_url,
#     params       = .fema_build_params(latitude, longitude, report_type, format),
#     headers      = .fema_headers(),
#     result_param = "OutputFile",
#     output_path  = output_path,
#     overwrite    = overwrite,
#     timeout      = timeout,
#     max_tries    = max_tries,
#     encoding     = "query",
#     call         = call
#   )
#
#   if (open && interactive()) utils::browseURL(run$download$output_path)
#   run
# }

```

***

## Appendix

*Note created on [[2026-05-17]] and last modified on [[2026-06-08]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026