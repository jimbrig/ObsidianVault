---
creation_date: 2025-12-24
modification_date: 2025-12-24
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
description: "R package argument validation check utilities using rlang and cli"
tags:
  - Type/Code
  - Topic/R
  - Status/Complete
aliases:
  - R Check Functions
  - R Argument Validation
  - R utils_checks.R
---


# R Argument Validation Check Utilities

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

This note documents the pattern for creating robust argument validation functions using `rlang` and `cli`. These functions follow the `check_*` naming convention and provide informative error messages with proper call stack attribution.

Key features:
- Use `rlang::caller_arg()` to capture the argument name
- Use `rlang::caller_env()` to attribute errors to the calling function
- Use `cli::cli_abort()` with glue syntax for rich error messages
- Return the input invisibly on success for pipe-friendly usage

## Core Check Functions

### Basic Type Checks

```R
#' @keywords internal
#' @noRd
check_string <- function(obj, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  if (!is.character(obj) || length(obj) != 1) {
    cli::cli_abort(
      "{.arg {arg}} must be a single string, not {.obj_type_friendly {obj}}.",
      call = call
    )
  }
  invisible(obj)
}

#' @keywords internal
#' @noRd
check_logical <- function(obj, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  if (!is.logical(obj) || length(obj) != 1) {
    cli::cli_abort(
      "{.arg {arg}} must be a single logical value, not {.obj_type_friendly {obj}}.",
      call = call
    )
  }
  invisible(obj)
}

#' @keywords internal
#' @noRd
check_number <- function(obj, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  if (!is.numeric(obj) || length(obj) != 1) {
    cli::cli_abort(
      "{.arg {arg}} must be a single numeric value, not {.obj_type_friendly {obj}}.",
      call = call
    )
  }
  invisible(obj)
}

#' @keywords internal
#' @noRd
check_integer <- function(obj, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  if (is.integer(obj) || is_wholenumber(obj)) return(invisible(obj))
  if (!is.numeric(obj) || obj %% 1 != 0) {
    cli::cli_abort(
      "{.arg {arg}} must be a single integer value, not {.obj_type_friendly {obj}}.",
      call = call
    )
  }
  invisible(obj)
}

#' @keywords internal
#' @noRd
check_function <- function(func, arg = rlang::caller_arg(func), call = rlang::caller_env()) {
  if (!is.function(func)) {
    cli::cli_abort(
      "{.arg {arg}} must be a function, not {.obj_type_friendly {func}}.",
      call = call
    )
  }
  invisible(func)
}
```

### Range and Constraint Checks

```R
#' @keywords internal
#' @noRd
check_number_minmax <- function(obj, min = -Inf, max = Inf, 
                                 arg = rlang::caller_arg(obj), 
                                 call = rlang::caller_env()) {
  check_number(obj, arg = arg, call = call)
  if (obj < min || obj > max) {
    cli::cli_abort(
      "{.arg {arg}} must be between {.val {min}} and {.val {max}}, not {.val {obj}}.",
      call = call
    )
  }
  invisible(obj)
}

#' @keywords internal
#' @noRd
check_regex <- function(obj, pattern, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  if (!is.character(obj) || length(obj) != 1 || !grepl(pattern, obj)) {
    cli::cli_abort(
      "{.arg {arg}} must be a single string matching the pattern {.val {pattern}}, not {.obj_type_friendly {obj}}.",
      call = call
    )
  }
  invisible(obj)
}

#' @keywords internal
#' @noRd
check_url <- function(obj, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  check_regex(obj, "^https?://", arg = arg, call = call)
  invisible(obj)
}
```

### Data Frame Checks

```R
#' @keywords internal
#' @noRd
check_data_frame <- function(dat, arg = rlang::caller_arg(dat), call = rlang::caller_env()) {
  if (!is.data.frame(dat)) {
    cli::cli_abort(
      "{.arg {arg}} must be a data frame, not {.obj_type_friendly {dat}}.",
      call = call
    )
  }
  invisible(dat)
}

#' @keywords internal
#' @noRd
check_tibble <- function(dat, arg = rlang::caller_arg(dat), call = rlang::caller_env()) {
  check_inherits(dat, "tbl_df", arg = arg, call = call)
  invisible(dat)
}

#' @keywords internal
#' @noRd
check_row <- function(row, arg = rlang::caller_arg(row), call = rlang::caller_env()) {
  check_data_frame(row, arg = arg, call = call)
  if (nrow(row) != 1) {
    cli::cli_abort(
      "{.arg {arg}} must be a single row data frame, not {.obj_type_friendly {row}}.",
      call = call
    )
  }
  invisible(row)
}

#' @keywords internal
#' @noRd
check_col_names <- function(dat, req_cols, arg = rlang::caller_arg(dat), call = rlang::caller_env()) {
  check_data_frame(dat, arg = arg, call = call)
  missing_cols <- setdiff(req_cols, colnames(dat))
  if (length(missing_cols) > 0) {
    cli::cli_abort(
      "{.arg {arg}} must contain the following columns: {.field {missing_cols}}.",
      call = call
    )
  }
  invisible(dat)
}

#' @keywords internal
#' @noRd
check_col_types <- function(dat, req_types, arg = rlang::caller_arg(dat), call = rlang::caller_env()) {
  check_data_frame(dat, arg = arg, call = call)
  data_types <- sapply(dat, class)
  missing_types <- setdiff(req_types, data_types)
  if (length(missing_types) > 0) {
    cli::cli_abort(
      "{.arg {arg}} must contain the following column types: {.field {missing_types}}.",
      call = call
    )
  }
  invisible(dat)
}
```

### Named Object Checks

```R
#' @keywords internal
#' @noRd
check_named <- function(obj, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  if (is.null(names(obj)) || any(names(obj) == "")) {
    cli::cli_abort(
      "{.arg {arg}} must be a named object.",
      call = call
    )
  }
  invisible(obj)
}

#' @keywords internal
#' @noRd
check_names <- function(obj, req_names, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  check_named(obj, arg = arg, call = call)
  missing_names <- setdiff(req_names, names(obj))
  if (length(missing_names) > 0) {
    cli::cli_abort(
      "{.arg {arg}} must contain the following names: {.field {missing_names}}.",
      call = call
    )
  }
  invisible(obj)
}
```

### Class Inheritance Checks

```R
#' @keywords internal
#' @noRd
check_inherits <- function(obj, class, arg = rlang::caller_arg(obj), call = rlang::caller_env()) {
  if (!inherits(obj, class)) {
    cli::cli_abort(
      "{.arg {arg}} must inherit from class {.cls {class}}, not {.obj_type_friendly {obj}}.",
      call = call
    )
  }
  invisible(obj)
}

#' @keywords internal
#' @noRd
check_request <- function(req, arg = rlang::caller_arg(req), call = rlang::caller_env()) {
  check_inherits(req, "httr2_request", arg = arg, call = call)
  invisible(req)
}

#' @keywords internal
#' @noRd
check_response <- function(resp, arg = rlang::caller_arg(resp), call = rlang::caller_env()) {
  check_inherits(resp, "httr2_response", arg = arg, call = call)
  invisible(resp)
}

#' @keywords internal
#' @noRd
check_cache <- function(cache, arg = rlang::caller_arg(cache), call = rlang::caller_env()) {
  if (!is.null(cache)) {
    check_inherits(cache, "cachem", arg = arg, call = call)
  }
  invisible(cache)
}

#' @keywords internal
#' @noRd
check_logger <- function(logger, arg = rlang::caller_arg(logger), call = rlang::caller_env()) {
  if (!is.null(logger)) {
    check_inherits(logger, "Logger", arg = arg, call = call)
  }
  invisible(logger)
}
```

### Dots and Parameter Checks

```R
#' @keywords internal
#' @noRd
check_dots_not_empty <- function(..., arg = rlang::caller_arg(...), call = rlang::caller_env()) {
  dots <- rlang::list2(...)
  if (length(dots) == 0) {
    cli::cli_abort(
      "{.arg ...} must not be empty. Please specify at least one parameter to use.",
      call = call
    )
  }
  invisible(dots)
}

#' @keywords internal
#' @noRd
check_http_method <- function(method, arg = rlang::caller_arg(method), call = rlang::caller_env()) {
  rlang::arg_match(method, c("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"))
  invisible(method)
}

#' @keywords internal
#' @noRd
check_http_status_code <- function(status_code, arg = rlang::caller_arg(status_code), call = rlang::caller_env()) {
  if (!is.numeric(status_code) || status_code < 100 || status_code > 599) {
    cli::cli_abort(
      "Invalid HTTP status code: {.val {status_code}}",
      call = call
    )
  }
  invisible(status_code)
}
```

### Package Environment Check

```R
#' @keywords internal
#' @noRd
check_pkg_env <- function() {
  if (!exists(".pkg_env")) {
    cli::cli_abort(
      "Internal Package Environment {.code .pkg_env} does not exist. Please load the package first."
    )
  }
}
```

## Helper Predicates

```R
#' @keywords internal
#' @noRd
is_wholenumber <- function(x, tol = NULL) {
  if (is.null(tol)) tol <- .Machine$double.eps^0.5
  abs(x - round(x)) < tol
}
```

## Usage Examples

### In a Function

```R
#' My API Function
#'
#' @param endpoint The API endpoint path.
#' @param data A data frame with required columns.
#' @param timeout Timeout in seconds (1-300).
#'
#' @export
my_api_function <- function(endpoint, data, timeout = 30) {
  # validate all arguments upfront
  check_string(endpoint)
  check_col_names(data, c("id", "name", "value"))
  check_number_minmax(timeout, min = 1, max = 300)
  
  # function implementation...
}
```

### Error Message Output

When validation fails, users see informative messages:

```R
> my_api_function(endpoint = 123, data = df, timeout = 30)
Error in `my_api_function()`:
! `endpoint` must be a single string, not a double vector.

> my_api_function(endpoint = "/api/v1", data = df, timeout = 500)
Error in `my_api_function()`:
! `timeout` must be between 1 and 300, not 500.
```

***

## Appendix

*Note created on [[2025-12-24]] and last modified on [[2025-12-24]].*

### See Also

- [[R - Package Environment and Initialization]]
- [[R - Console Message Feedback Utilities]]
- [[R Package Development - Advanced Patterns]]

### Backlinks

```dataview
LIST FROM [[R - Argument Validation Check Utilities]] 
WHERE file.name != "_README" AND file.name != this.file.name AND file.name != "CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

