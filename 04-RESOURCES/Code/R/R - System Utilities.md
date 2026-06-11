---
creation_date: 2026-06-06
modification_date: 2026-06-06
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R System Utilities
tags:
  - Type/Code
  - Status/WIP
  - Topic/Development
  - Topic/R
aliases:
  - System Utilities
  - utils_system.R
  - R System Utilities
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

This code provides a set of utility functions for working with the system.

## Code

`R/utils_system.R`:

```R
#  ------------------------------------------------------------------------
#
# Title : System Utilities
#    By : Jimmy Briggs
#  Date : 2026-06-02
#
#  ------------------------------------------------------------------------

#' `sys_num_cpus` - System Number of CPUs
#'
#' @description
#' Get the number of CPU cores available on the current machine using [gdalraster::get_num_cpus()],
#' which calls the internal GDAL C++ library function `GDALGetCPUs()`.
#'
#' @details
#' This method is more robust than `parallel::detectCores()` because it accounts for CPU
#' affinity, container limits, and other environmental restrictions that may cap the processing
#' pools actually available to the R session.
#'
#' However, on a standard unconstrained desktop machine, it will return the same value as
#' `parallel::detectCores(logical = TRUE)` because both report the total logical processing channels.
#'
#' - **Number of CPUs (GDAL):** `gdalraster::get_num_cpus()` queries the C++ backend to see how many logical
#'   execution slots (hardware threads) are exposed by the operating system.
#'
#' - **Number of Cores (parallel):** `parallel::detectCores(logical = TRUE)` targets the virtual threads generated
#'   by Hyper-Threading (Intel) or SMT (AMD). Conversely, running `parallel::detectCores(logical = FALSE)` attempts
#'   to return only the count of independent physical cores on the processor.
#'
#' @returns
#' Integer representing the number of CPU cores available to the R session.
#'
#' @importFrom gdalraster get_num_cpus
#'
#' @export
#'
#' @examples
#' \dontrun{
#' sys_num_cpus()
#' }
sys_num_cpus <- function() {
  gdalraster::get_num_cpus()
}

#' `sys_which` - System `which`
#'
#' @description
#' Lightweight, convenience wrapper around [base::Sys.which()] and [base::normalizePath()].
#'
#' @param x Passed to `Sys.which()` `names` argument.
#' @inheritParams base::normalizePath winslash
#' @inheritDotParams base::normalizePath
#'
#' @returns
#' Character vector of paths, if found. If not found returns `NULL` instead of `""`.
#'
#' @export
#'
#' @examples
#' \dontrun{
#' sys_which("gdal")
#' }
sys_which <- function(x, winslash = "/", ...) {
  hold <- Sys.which(x)
  if (!nzchar(hold)) return(NULL)
  normalize_path(hold, winslash = winslash, ...)
}

#' `sys_platform` - System Platform
#'
#' @description
#' Get the current machine's platform (operating system "family")
#'
#' @returns
#' Character string resulting from `.Platform$OS.type`
#'
#' @export
#'
#' @examples
#' \dontrun{
#' sys_platform()
#' }
sys_platform <- function() {
  .Platform$OS.type
}

#' `sys_path` - System PATH
#'
#' @description
#' Get the Current Machine's PATH Environment Variable as a Character Vector
#'
#' @param filter Optional character string. If provided, only paths containing this string will be returned.
#'
#' @returns
#' Character vector of paths from the system's `PATH` environment variable, split by the appropriate path separator
#' for the operating system. If `filter` is provided, only paths containing the filter string are included in the
#' returned vector. If no paths match the filter, an empty character vector is returned: `character(0)`.
#'
#' @export
#'
#' @importFrom stringr str_split
#'
#' @examples
#' \dontrun{
#' sys_path()
#' }
sys_path <- function(filter = NULL) {
  hold <- Sys.getenv("PATH") |> stringr::str_split(";") |> unlist() |> normalize_path()
  if (is.null(filter)) return(hold)
  hold[stringr::str_detect(hold, filter)]
}

#' `sys_pid` - System Process ID
#'
#' @description
#' Get the current process ID of the R session.
#'
#' @returns
#' Integer representing the current process ID.
#'
#' @export
#'
#' @examples
#' \dontrun{
#' sys_pid()
#' }
sys_pid <- function() {
  Sys.getpid()
}

#' `sys_error_code` - System Error Codes
#'
#' @description
#' Get system error codes and their descriptions. If a specific code is provided, returns the
#' name, value, and description for that code. If no code is provided, returns a tibble of all system error codes.
#'
#' @param code (Optional) Integer or character string representing the system error code to look up.
#'   If `NULL` (the default), returns all system error codes. Can be one or more codes to filter by.
#'
#' @returns
#' A [tibble::tibble()] with the `name`, `value`, and `description` of the system error code(s).
#' If one or more codes are provided, returns only the matching code(s). If no codes are found, returns `NULL` invisibly.
#'
#' @export
#'
#' @seealso [ps::errno()] for the underlying system error codes data.
#'
#' @importFrom ps errno
#' @importFrom tibble as_tibble
#' @importFrom dplyr filter
#' @importFrom cli cli_alert_warning
#'
#' @examples
#' \dontrun{
#' # Get all system error codes
#' sys_error_code()
#'
#' # Get specific error code information
#' sys_error_code(2)  # Example: ENOENT (No such file or directory)
sys_error_code <- function(code = NULL) {
  errs <- ps::errno() |> tibble::as_tibble()
  if (is.null(code)) return(errs)
  code <- as.integer(code)
  if (!code %in% errs$value) {
    cli::cli_alert_warning("Error code {.val {code}} not found in system error codes.")
    return(invisible(NULL))
  }
  errs |> dplyr::filter(.data$value %in% .env$code)
}

# internal --------------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
normalize_path <- function(path, winslash = "/", ...) {
  normalizePath(path, winslash = winslash, mustWork = FALSE, ...)
}
```

## Functions

The following functions are available in the `utils_sys.R` file:

- `sys_num_cpus`
- `sys_which`
- `sys_platform`
- `sys_path`
- `sys_pid`
- `sys_error_code`

### `sys_num_cpus()`

This function returns the number of CPU cores available on the current machine using the `gdalraster::get_num_cpus()` function.

```R
sys_num_cpus()
```

Note that this function returns the number of CPU cores available to the R session, not the number of physical CPU cores. See [[Clarification of CPU Processors Threads and Cores]] for more details.

### `sys_which()`

This function returns the path to the executable file for the given program.

```R
sys_which("gdal")
```

### `sys_platform()`

This function returns the platform of the current machine.

```R
sys_platform()
```

### `sys_path()`

This function returns the system's PATH environment variable as a character vector, optionally filtered by a given string.

```R
sys_path()
sys_path("AppData")
```

### `sys_pid()`

This function returns the process ID of the current R session.

```R
sys_pid()
```

### `sys_error_code()`

This function returns the system error codes and their descriptions.

```R
sys_error_code()
sys_error_code(2)
```

### `normalize_path()` (Internal Function)

```R
#' @keywords internal
#' @noRd
normalize_path <- function(path, winslash = "/", ...) {
  normalizePath(path, winslash = winslash, mustWork = FALSE, ...)
}
```

This is an internal function that normalizes a path string.

***

## Appendix

*Note created on [[2026-06-06]] and last modified on [[2026-06-06]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026

