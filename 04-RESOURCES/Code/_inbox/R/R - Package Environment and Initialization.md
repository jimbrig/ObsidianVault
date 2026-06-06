---
creation_date: 2025-12-24
modification_date: 2025-12-24
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
description: "Production-grade R package environment initialization pattern using R/zzz.R"
tags:
  - Type/Code
  - Topic/R
  - Status/Complete
aliases:
  - R Package zzz.R
  - R Package Initialization
  - R Package Environment
---


# R Package Environment and Initialization

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

This note documents the production-grade pattern for `R/zzz.R` used to initialize package environments, configurations, logging, caching, and startup messaging.

The pattern leverages:
- `rlang::new_environment()` for internal state management
- `rlang::on_load()` for declarative initializers
- `rlang::run_on_load()` in `.onLoad()` for execution
- `base::packageStartupMessage()` with `crayon` for rich startup feedback

## Complete Implementation

### `R/zzz.R`

```R
#  ------------------------------------------------------------------------
#
# Title : Package Environment and Start up
#    By : Jimmy Briggs
#  Date : 2025-05-27
#
#  ------------------------------------------------------------------------

# internal package environment --------------------------------------------

#' Internal Package Environment
#'
#' @description
#' An internal environment to store package-wide variables and states.
#'
#' @keywords internal
#' @noRd
#'
#' @returns
#' An [rlang::new_environment()] object containing package state variables.
#'
#' @importFrom rlang new_environment
.pkg_env <- rlang::new_environment(parent = emptyenv())
.pkg_env$config <- NULL
.pkg_env$config_file <- NULL
.pkg_env$logger <- NULL
.pkg_env$cache <- NULL
.pkg_env$cache_req_perform <- NULL
.pkg_env$cache_req_perform_iterative <- NULL
.pkg_env$default_params <- NULL
.pkg_env$last_request <- NULL
.pkg_env$last_response <- NULL

# global variables -------------------------------------------------------

# package data objects and NSE column names
utils::globalVariables(c(
  # exported data objects
  "my_exported_dataset",
  # internal sysdata objects
  "internal_config",
  # NSE column names from dplyr/tidyverse operations
  "property_id",
  "comp_id",
  "distance",
  "data"
))

# initializers ------------------------------------------------------------

#' @importFrom rlang on_load local_use_cli
rlang::on_load({ rlang::local_use_cli() })

# custom initializers for package-specific components
rlang::on_load({ pkg_config_init() })
rlang::on_load({ pkg_options_init() })
rlang::on_load({ pkg_logger_init() })
rlang::on_load({ pkg_cache_init() })

# onLoad ------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom rlang run_on_load
.onLoad <- function(libname, pkgname) rlang::run_on_load()

# onAttach ----------------------------------------------------------------

#' @keywords internal
#' @noRd
.onAttach <- function(libname, pkgname) packageStartupMessage(pkg_startup_msg())
```

## Initializer Functions

Each initializer function sets up its corresponding component in the package environment.

### Configuration Initializer

```R
#' @keywords internal
#' @noRd
pkg_config_init <- function() {
  if (file.exists(".Renviron")) readRenviron(".Renviron")
  cfg_file <- Sys.getenv("R_CONFIG_FILE", unset = NA)
  if (!is.na(cfg_file) && file.exists(cfg_file)) {
    cfg <- config::get(file = cfg_file)
    rlang::env_bind(.pkg_env, config = cfg, config_file = cfg_file)
  }
  invisible(NULL)
}
```

### Options Initializer

```R
#' @keywords internal
#' @noRd
pkg_options_init <- function() {
  default_opts <- list(
    "logging" = FALSE,
    "log_level" = "info",
    "log_file" = NULL,
    "caching" = FALSE,
    "cache_dir" = NULL,
    "verbosity" = 0L,
    "quiet" = FALSE,
    "progress" = TRUE
  )
  
  # check for environment variable overrides
  env_overrides <- list(
    "log_level" = Sys.getenv("LOG_LEVEL", ""),
    "log_file" = Sys.getenv("LOG_FILE", ""),
    "caching" = Sys.getenv("CACHING", ""),
    "cache_dir" = Sys.getenv("CACHE_DIR", "")
  )
  
  # apply env overrides where they exist
  for (opt_name in names(env_overrides)) {
    if (nzchar(env_overrides[[opt_name]])) {
      default_opts[[opt_name]] <- .coerce_option_type(opt_name, env_overrides[[opt_name]])
    }
  }
  
  # then check existing options (don't override user-set options)
  to_set <- purrr::imap(default_opts, function(v, k) {
    if (!is.null(getOption(k, NULL))) getOption(k) else v
  }) |>
    stats::setNames(names(default_opts))
  
  options(to_set)
  invisible(NULL)
}
```

### Logger Initializer

```R
#' @keywords internal
#' @noRd
pkg_logger_init <- function(log_level = NULL, log_file = NULL, ...) {
  if (!is_logging_enabled()) return(invisible(NULL))
  
  if (is.null(log_level)) log_level <- Sys.getenv("LOG_LEVEL", "info")
  
  logger <- lgr::get_logger(pkg_name())
  logger$config(NULL)
  logger$set_threshold(tolower(log_level))
  logger$set_propagate(FALSE)
  
  if (!is.null(log_file)) {
    log_dir <- dirname(log_file)
    if (!dir.exists(log_dir)) {
      dir.create(log_dir, recursive = TRUE, showWarnings = FALSE)
    }
    json_appender <- lgr::AppenderJson$new(file = log_file, threshold = "debug")
    logger$set_appenders(list(json = json_appender))
  }
  
  rlang::env_bind(.pkg_env, logger = logger)
  options(log_level = log_level, log_file = log_file)
  cli::cli_alert_info("Logger initialized with log level {.field {toupper(log_level)}}")
  
  return(invisible(logger))
}
```

### Cache Initializer

```R
#' @keywords internal
#' @noRd
pkg_cache_init <- function(cache = NULL, ...) {
  if (!is_caching_enabled()) return(invisible(NULL))
  
  if (is.null(cache)) cache <- cachem::cache_mem(...)
  rlang::env_bind(.pkg_env, cache = cache)
  
  return(invisible(cache))
}
```

## Package Utilities (`R/utils_pkg.R`)

```R
#  ------------------------------------------------------------------------
#
# Title : Package Utilities
#    By : Jimmy Briggs
#  Date : 2025-05-27
#
#  ------------------------------------------------------------------------

# meta ---------------------------------------------------------------------------

#' @keywords internal
#' @noRd
pkg_name <- function() "mypackage"

#' @keywords internal
#' @noRd
#' @importFrom utils packageVersion
pkg_version <- function() {
  as.character(utils::packageVersion(pkg_name()))
}

# pkg_sys ------------------------------------------------------------------------

#' @keywords internal
#' @noRd
pkg_sys <- function(...) {
  system.file(..., package = pkg_name())
}

#' @keywords internal
#' @noRd
pkg_sys_config <- function(...) {
  pkg_sys("config", ...)
}

#' @keywords internal
#' @noRd
pkg_sys_schemas <- function(...) {
  pkg_sys("schemas", ...)
}

#' @keywords internal
#' @noRd
pkg_sys_extdata <- function(...) {
  pkg_sys("extdata", ...)
}

# start up -----------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom crayon green cyan yellow red blue bold underline italic
#' @importFrom rlang env_get
pkg_startup_msg <- function() {
  unicode_success <- crayon::green("\u2705")
  unicode_info <- crayon::cyan("\u2139")
  unicode_warning <- crayon::yellow("\u26a0")
  unicode_error <- crayon::red("\ud83d\udea8")
  
  pkg_name <- pkg_name()
  pkg_version <- paste0("v", pkg_version())
  docs_url <- crayon::blue(crayon::bold(crayon::underline("https://docs.mypackage.com")))
  
  msg_title <- paste0(crayon::bold(crayon::cyan(pkg_name, pkg_version)))
  msg_desc <- crayon::italic(crayon::cyan("<Package description>"))
  msg_docs <- crayon::italic(unicode_info, "Visit", docs_url, "for documentation.")
  
  # configuration status
  cfg <- .pkg_env$config
  cfg_file <- .pkg_env$config_file
  
  msg_config_file <- if (!is.null(cfg_file)) {
    paste0(unicode_success, " Configuration File: ", crayon::underline(basename(cfg_file)))
  } else {
    paste0(unicode_warning, " No configuration file found. Using default settings.")
  }
  
  # validate configuration if present
  msg_config <- if (!is.null(cfg)) {
    cfg_valid <- validate_config(cfg, quiet = TRUE)
    if (!isTRUE(cfg_valid)) {
      paste0(
        unicode_error, " Invalid Configuration: Found ", length(cfg_valid), " issues.\n",
        paste0(unicode_warning, "   - ", cfg_valid, collapse = "\n")
      )
    } else {
      paste0(unicode_success, " Configuration is valid.")
    }
  } else {
    ""
  }
  
  paste0(msg_title, " - ", msg_desc, "\n", msg_docs, "\n", msg_config_file, "\n", msg_config)
}

# helper predicates --------------------------------------------------------------

#' @keywords internal
#' @noRd
is_logging_enabled <- function() {
  isTRUE(getOption("logging", FALSE)) || 
    tolower(Sys.getenv("LOGGING", "false")) %in% c("true", "1", "yes")
}

#' @keywords internal
#' @noRd
is_caching_enabled <- function() {
  isTRUE(getOption("caching", FALSE)) || 
    tolower(Sys.getenv("CACHING", "false")) %in% c("true", "1", "yes")
}
```

## Shiny Package Variant

For Shiny application packages, use a simplified version:

```R
.onLoad <- function(libname, pkgname) {
  shiny::addResourcePath("www", system.file("www", package = pkgname))
}

.onAttach <- function(libname, pkgname) {
  msg <- glue::glue("{pkgname} v{pkg_version()}")
  packageStartupMessage(msg)
}

.onUnload <- function(libname, pkgname) {
  shiny::removeResourcePath("www")
}
```

## Usage

When loading a package with this pattern:

```R
> devtools::load_all(".")
i Loading mypackage
mypackage v0.2.4 - My Package Description
i Visit https://docs.mypackage.com for documentation.
[check] Found Configuration File: config.yml
[check] Configuration is valid.
```

Or with configuration issues:

```R
> devtools::load_all(".")
i Loading mypackage
mypackage v0.2.4 - My Package Description
i Visit https://docs.mypackage.com for documentation.
[check] Found Configuration File: config.yml
[error] Invalid Configuration: Found 2 issues.
[warn]   - API key is missing or invalid.
[warn]   - User ID is missing or invalid.
```

***

## Appendix

*Note created on [[2025-12-24]] and last modified on [[2025-12-24]].*

### See Also

- [[R - Package Initialization Script]]
- [[R Package Development - Advanced Patterns]]
- [[R - Console Message Feedback Utilities]]

### Backlinks

```dataview
LIST FROM [[R - Package Environment and Initialization]] 
WHERE file.name != "_README" AND file.name != this.file.name AND file.name != "CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

