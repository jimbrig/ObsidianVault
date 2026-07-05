---
creation_date: 2026-06-02
modification_date: 2026-06-02
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - Package Development
tags:
  - Type/Guide
  - Status/WIP
  - Topic/R
  - Topic/Development
  - Topic/API
  - Topic/ComputerScience
aliases:
  - R - Package Development
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

> [!NOTE]
> *This note is an attempt to consolidate and document various more advanced and opinionated tactics, strategies, and design patterns to leverage for robust, production-grade R package development.*

## Best Practices

### General Development Practices

1. 

### Functional Core Imperative Shell

> [!NOTE]
> *See [[Functional Core Imperative Shell (FCIS)]]*

### Thematic vs. Arbitrary Function Organization

> [!NOTE]
> ***Group related functions thematically rather than arbitrarily.** This means organizing R functions based on **functional purpose and logical relationships** rather than random or convenience-based criteria.*

For example, organize functions into "modules" (files) by their **purpose, domain, or workflow**:

```plaintext
R/

```

Benefits:

- Intuitive Navigation
- Ea


### Prefer "Deep" Modules



## Scratch Notes

- You can leverage a build-ignore'd root `examples/` folder to house more comprehensive R function `#' examples` as actual R code instead of having to deal with the nuances around [[roxygen2]] specifics. From the `roxygen2` block simply use `@examples examples/ex_<name>.R`.
- Leverage the root `exec/` folder for executable scripts or to include native [[Command Line Interface (CLI)|CLI]]s within the package. The [r-lib/Rapp](https://github.com/r-lib/Rapp) package is an exemplary demonstration of this.
- For packages that include data, treat the data preparation and processing tasks performed in `data-raw/` similar to the build process. It should be idempotent and runnable. Separate and consolidate internal vs. "exported" (documented) data via `data-raw/internal.R` and `data-raw/exported.R` scripts, where internal data is saved to `R/sysdata.rda` and "exported" data gets saved to `data/*.rda` and documented via `roxygen2` in an `R/data.R` or separate `R/data-<name>.R` files. Layer the scripts and include hashing and caching and sourcing to perform data preparations in a DAG like fashion and avoid repeated unnecessary remote network calls, etc.
- Leverage internal package environments and initializer functions and the standard `.onLoad()` function for initializing internal singletons or configurations such as caches, credentials, database connections, loggers, options, etc.
- Pre-compute vignette artifacts before rendering and manage vignette builds and rendering via a `vignettes/compile.R` script    
- Leverage `man/figures` for standard images and readme level assets and the package logo/hex. Additionally if using an `.Rmd` for readme and vignettes you can consolidate commonly used fragments or chunks to use as children under `man/fragments/` or `man/chunks/` (i.e. `man/fragments/{header.Rmd,footer.Rmd,installation.Rmd,badges.Rmd,contributing.Rmd`, etc.)
- Store programmatic traceable steps performed during initialization and development or for automation purposes using a build ignored `dev/` folder.
- Leverage customizable groupings of dependencies or configurations via the `DESCRIPTION`’s `config/needs/<name>` feature. The `Config/Needs/*` convention is handy because it allows a developer to use `DESCRIPTION` as their definitive record of package dependencies, while maintaining a clean distinction between true runtime dependencies versus those that are only needed for specialized development tasks. This allows us to emulate things like [[python]] or [[npm]]’s [[pyproject.toml]] and [[package.json]] with custom dependency groups such as for documentation, testing, etc.

## Cross Cutting Concerns

- Logging
- User Feedback & Console Output
- S3 Classes and Methods
- Documentation
- Debugging
- Configuration & Secrets
- R Options
- Database Connections
- Assertions and Validations
- Naming Conventions & Taxonomy
- Testing
- DevOps CI/CD
- Deployment
- Building

## "Special" Folder Conventions

- `inst/`
	- `config/`
	- `extdata/`
	- `schemas/`
	- `scripts/`
	- `database/`
- `exec/`
- `dev/`
	- `scripts/`
		- `pkg_init.R`
		- `pkg_devt.R`
		- `...`
	- `docs/`
	- `R/`
	- `scratch/`
	- `check/`
	- `README.md`
- `data-raw/`
	- `cache/`
		- `.gitignore`
	- `scripts/`
		- `*.R`
	- `internal.R`
	- `exported.R`
	- `README.md`
- `examples/`
	- `ex-<name>.R`
- `man/`
	- `figures/`
		- `logo.png`
	- `fragments/`
		- `<name>.md`
- `tests/testthat/`
- etc.

## `R/` Folder Standards

```plaintext
aaa.R

data.R
data_<name>.R

<name>-conditions.R
<name>-config.R
<name>-options.R
<name>-package.R

utils_*.R
utils_checks.R
utils_predicates.R
utils_pkg.R

sysdata.rda

zzz.R
```

### `aaa.R`

`aaa.R` contains *shared package resources* or *initialization logic*, i.e. shared constants, enumerations, or reference data not bundled into `sysdata.rda`, shared `roxygen2` parameters, shared `roxygen2` returns, and/or shared `roxygen2` general blocks or documentation.

A typical `aaa.R` for me looks like this:

```R

#  ------------------------------------------------------------------------
#
# Title : aaa.R - shared pacakge resources
#    By : Jimmy Briggs
#  Date : YYYY-MM-DD
#
#  ------------------------------------------------------------------------

# constants -------------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
SOME_CONSTANT <- "<something>"

#' @keywords internal
#' @noRd
MYAPI_BASE_URL <- "https://myapi.com"

#' @keywords internal
#' @noRd
SOME_LOOKUP_TABLE <- tibble::as_tibble()

# shared params ---------------------------------------------------------------------------------------------------

#' Shared Package Parameters
#'
#' @name .shared_params 
#'
#' @description
#' Common, shared parameters that can be inherited by other functions in the package. 
#' Use `@inheritParams .shared_params` in a function's roxygen2 block to import these parameter descriptions.
#' 
#' @param conn Database connection
#' 
#' @param config Global configuration
#'
#' @keywords internal
NULL

#' Shared Condition Parameters
#'
#' @name .shared_condition_params
#'
#' @description
#' Inheritable parameter definitions for condition constructor functions.
#' Use `@inheritParams .shared_condition_params` to import these.
#'
#' @param msg Character vector of messages. Supports [cli::`inline-markup`] syntax.
#'
#' @param cls Character vector of additional condition classes prepended to
#'   the base hierarchy. Passed as-is (no automatic prefix).
#'
#' @param parent Parent condition for error chaining via [rlang::try_fetch()].
#'   Produces "Caused by" messages in the error display. See [rlang::topic-error-chaining].
#'
#' @param call Calling environment for error attribution. Determines which function name 
#'   appears in the error message. See [rlang::topic-error-call]. Defaults to [rlang::caller_env()].
#'
#' @param .envir Environment for `cli` glue interpolation. Use `environment()` when the function 
#'   modifies `message` locally, `parent.frame()` when passing `message` through unmodified.
#'
#' @param ... Additional named fields to attach to the condition object. Available for
#'   programmatic inspection via `cnd$field_name`.
#'
#' @keywords internal
NULL

# shared returns --------------------------------------------------------------------------------------------------

#' Check Returns
#'
#' @name .shared_returns_check
#'
#' @description
#' Returns for check_*() functions.
#' Use `@inheritParams .shared_returns_check` in a functino's roxygen2 block to import this consistent return.
#'
#' @returns
#' If checks pass, invisibly returns to initially provided object `x`, otherwise a condition of class `check_error`
#' is thrown.
#'
#' @keywords internal
NULL

# shared docs -----------------------------------------------------------------------------------------------------

#' Links
#'
#' @name documentation_links
#'
#' @description
#' Links to the official documentation...
#'
#' ```{r child = "man/fragments/links.md"}
#' ```
#'
#' @seealso [pkg_docs()]
NULL
```

Notes:

For a real-world example, here is the `aaa.R` for a package of mine that's an API client library package:

```R

#  ------------------------------------------------------------------------
#
# Title : Shared Package Resources
#    By : Jimmy Briggs
#  Date : 2025-08-07
#
#  ------------------------------------------------------------------------

# policy field constants --------------------------------------------------

#' @noRd
#' @keywords internal
.error_policy_fields <- c("error_is_error", "error_body")

#' @noRd
#' @keywords internal
.retry_policy_fields <- c(
  "retry_max_tries",
  "retry_max_wait",
  "retry_on_failure",
  "retry_is_transient",
  "retry_backoff",
  "retry_failure_threshold",
  "retry_failure_timeout",
  "retry_realm"
)

#' @noRd
#' @keywords internal
.throttle_policy_fields <- c("throttle_realm")

# request policy defaults -------------------------------------------------

#' Default maximum seconds for exponential backoff
#' @noRd
.max_backoff_seconds <- 60L

#' Default throttle capacity (requests per fill period)
#' @noRd
.default_throttle_capacity <- 30L

#' Default throttle fill time in seconds
#' @noRd
.default_throttle_fill_time <- 60L

# params ------------------------------------------------------------------

#' Shared Package Parameters
#'
#' @name .shared_params
#'
#' @description
#' Use `@inheritParams .shared_params` in a function's roxygen2 block to import these parameter descriptions.
#'
#' @description
#' Common, shared parameters that can be inherited by other functions in the package.
#'
#' @param req An [httr2::request()] object.
#'
#' @param resp An [httr2::response()] object.
#'
#' @param config A [reapi_config()] object containing client configuration values for the Real Estate API client.
#'   Should include `base_url`, `api_key`, `user_id`, and optionally `openai_api_key` for PropGPT requests.
#'   Defaults to the result of [get_reapi_config()].
#'
#' @param cache A `cachem::cache_*()` object for caching responses. Defaults to
#'   the result of [get_reapi_cache()] which will return `NULL` if no cache is set
#'   (i.e. `get_reapi_option("cache")`). If `NULL`, caching is disabled.
#'
#' @param logger An [lgr::Logger] object used for structured logging. Defaults to the result of
#'   [get_reapi_logger()] which will return `NULL` if no logger is set (i.e. `get_reapi_option("logger")`).
#'   If `NULL`, logging is disabled.
#'
#' @param validate Logical. Should the request be validated before sending? Defaults to `TRUE`.
#'   This uses [reapi_req_validate()] to ensure the request body passes JSON schema validation.
#'
#' @param tidy Logical. Should the response be tidied before returning? Defaults to `TRUE`.
#'   This uses [reapi_resp_tidy()] to convert the response to a rectangular, flattened [tibble::tibble()].
#'
#' @param perform_opts Additional arguments passed to [reapi_req_perform()]. Defaults to
#'   [get_reapi_perform_opts()] which returns the active request perform configured options.
#'
#' @param config A configuration object for the Real Estate API client. Defaults to
#'   [get_reapi_config()] which returns the active configuration.
#'
#' @keywords internal
NULL

# request modifiers -----------------------------------------------------------------------------------------------

#' Real Estate API Request Modifiers
#'
#' @name reapi_request_modifiers
#'
#' @description
#' These functions modify the [httr2::request()] object to add various features
#' such as endpoints, authentication, user agent, body, error handling, retry logic,
#' throttling, logging, caching, and file saving.
#'
#' Functions:
#'
#' - `reapi_req_auth()`: Adds authentication headers to the request.
#' - `reapi_req_user_agent()`: Sets the user agent for the request.
#' - `reapi_req_endpoint()`: Adds an endpoint to the request URL.
#' - `reapi_req_body()`: Sets the body of the request to a JSON object.
#' - `reapi_req_validate()`: Validates the request body against the specified endpoint's parameters.
#' - `reapi_req_error()`: Sets up ReAPI-specific error handling for the request.
#' - `reapi_req_retry()`: Retries the request if it fails due to transient errors.
#' - `reapi_req_throttle()`: Applies throttling to the request.
#' - `reapi_req_logger()`: Attaches a logger to the request object for logging request details.
#' - `reapi_req_cache()`: Attaches a custom cache feature to the request object for caching responses.
#' - `reapi_req_cache_key()`: Derives a cache key for the request based on its hash and endpoint that is
#' - `reapi_req_hash()`: Generates a hash for the request based on its components.
#' - `reapi_req_file()`: Generates a file name for saving the request to disk.
#' - `reapi_req_resp_file()`: Generates a file name for saving the response to disk.
#'
#' @seealso
#' [reapi_request()], [httr2::request()],
#' [reapi_req_endpoint()], [reapi_req_auth()], [reapi_req_user_agent()], [reapi_req_body()], [reapi_req_validate()],
#' [reapi_req_error()], [reapi_req_retry()], [reapi_req_throttle()], [reapi_req_logger()], [reapi_req_cache()],
#' [reapi_req_cache_key()], [reapi_req_hash()], [reapi_req_file()], [reapi_req_resp_file()]
NULL

# returns -----------------------------------------------------------------

#' Request Returns
#'
#' @name .shared_returns_request
#'
#' @description
#' Returns for functions that return an [httr2::request()].
#'
#' @returns
#' An [httr2::request()] object configured for the Real Estate API.
#'
#' @keywords internal
NULL

#' Response Returns
#'
#' @name .shared_returns_response
#'
#' @description
#' Returns for functions that return an [httr2::response()].
#'
#' @returns
#' An [httr2::response()] object containing the response from the Real Estate API.
#'
#' @keywords internal
NULL

# docs --------------------------------------------------------------------

#' Real Estate API Links
#'
#' @name reapi_links
#'
#' @description
#' A collection of useful links related to the Real Estate API.
#'
#' ```{r child = "man/fragments/reapi_links.Rmd"}
#' ```
#'
#' @seealso [reapi_docs()]
NULL

```

### `R/zzz.R`

`zzz.R` contains the package initialization and cleanup functions. A typical `zzz.R` for me looks like this:

```R

#  ------------------------------------------------------------------------
#
# Title : zzz.R - environment, initializers, & onLoad/onAttach
#    By : Jimmy Briggs
#  Date : YYYY-MM-DD
#
#  ------------------------------------------------------------------------

# environment -----------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom rlang new_environment
.pkg_env <- rlang::new_environment()

# initializers ----------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom rlang on_load local_use_cli
rlang::on_load({
  pkg_env_init()
  pkg_config_init()
  pkg_options_init()
  # other initializers...
  rlang::local_use_cli()
})

# onLoad ----------------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom rlang run_on_load
.onLoad <- function(libname, pkgname) {
  rlang::run_on_load()
}

# onAttach --------------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
.onAttach <- function(libname, pkgname) {
  packageStartupMessage(pkg_startup_msg())
}

# onUnload --------------------------------------------------------------------------------------------------------

.onUnload <- function(libpath) {
  # reg.finalizer()
  # rlang::try_fetch({ DBI::dbDisconnect(db_store$get("conn")) }, error = function(e) NULL)
}

```

Notes:

- `pkg_env_init()` and `pkg_startup_msg()` come from the `R/utils_pkg.R` source.

### `<name>-package.R`

`R/<name>-package.R` contains the main package's roxygen2 block and houses package level documentation, imports, and the `_PACKAGE` sentinel for automatic documentation generation. Can be generated automatically via `usethis::use_package_doc()`.

```R

```

Notes:

For a real-world example, here's the same API client library's `reapi-package.R`:

```R

#  ------------------------------------------------------------------------
#
# Title : Package
#    By : Jimmy Briggs
#  Date : 2025-08-03
#
#  ------------------------------------------------------------------------

# package docs ------------------------------------------------------------

#' reapi: R Wrapper for RealEstateAPI
#'
#' @description
#' This package provides a convenient R interface to the RealEstateAPI APIs.
#'
#' @seealso
#' [reapi_links] for links to the RealEstateAPI documentation and other resources.
#' [reapi_docs()] for accessing the RealEstateAPI documentation directly from R.
#' [reapi_request()] and [reapi_response()] for making API requests and handling responses.
#' [reapi_req_perform()] for performing API requests.
#'
#' @keywords internal
"_PACKAGE"

# imports -----------------------------------------------------------------

## usethis namespace: start
#' @importFrom rlang caller_arg caller_env .data .env `%||%` `!!` `:=` `!!!`
#' @importFrom cli cli_abort
#' @importFrom stats setNames
## usethis namespace: end
NULL

# global variables -------------------------------------------------------

#' @noRd
utils::globalVariables(
  c(
    "reapi_endpoints",
    "reapi_endpoints_tbl",
    "reapi_endpoint_ids",
    "reapi_enums",
    "reapi_fields",
    "reapi_tspecs",
    "reapi_ptypes",
    "reapi_params",
    "comp_id",
    "comp_order",
    "distance",
    "property_id",
    "result_order",
    "data"
  )
)

```

Notes:

### `<name>-conditions.R`

`R/<name>-conditions.R` provides a more formal location for the package's custom condition class definitions and wrappers, i.e.:

```R
#  ------------------------------------------------------------------------
#
# Title : Package Conditions
#    By : Jimmy Briggs
#  Date : 2026-04-26
#
#  ------------------------------------------------------------------------

# topic -------------------------------------------------------------------

#' Errors & Conditions
#' 
#' @name
#' @family Conditions
#'
#' @description
#' 
#' @section Condition Classes:
#' ```
#' <{name}_condition>
#'   ├── <check_error>
#'   ├── <{name}_error>
#'   │   └── <{name}_*_error>
#'   ├── <{name}_warning>
#'   │   └── <{name}_*_warning>
#'   └── <{name}_message>
#' ```
#' 
#' @seealso ... 
#'
#' @keywords internal
NULL

# conditions --------------------------------------------------------------

#' Signal an Error
#' 
#' @family Conditions
#' 
#' @description
#' Core error calling function for the package. Wraps [cli::cli_abort()].
#'
#' @inheritParams .shared_condition_params
#'
#' @returns
#' Signals an error condition as a side-effect.
#' 
#' @export
#'
#' @importFrom cli cli_abort
#' @importFrom rlang caller_env
{name}_abort <- function(msg, cls = NULL, ..., parent = NULL, call = rlang::caller_env(), .envir = parent.frame()) {
  classes <- c(cls, "{name}_error", "{name}_condition")
  cli::cli_abort(message = msg, class = classes, parent = parent, call = call, .envir = .envir, ...)
}

#' Signal a Warning
#' 
#' @family Conditions
#' 
#' @description
#' Core warning signaling function for the package. Wraps [cli::cli_warn()].
#'
#' @inheritParams .shared_condition_params
#'
#' @returns
#' Signals an warning condition and returns invisibly.
#' 
#' @export
#'
#' @importFrom cli cli_warn
#' @importFrom rlang caller_env
{name}_warn <- function(msg, cls = NULL, ..., call = rlang::caller_env(), .envir = parent.frame()) {
  classes <- c(cls, "{name}_warning", "{name}_condition")
  cli::cli_warn(message = msg, class = classes, call = call, .envir = .envir, ...)
}

#' Signal a Message
#' 
#' @family Conditions
#' 
#' @description
#' Core information message signaling function for the package. Wraps [cli::cli_inform()].
#' Messages are suppressed when `quiet` mode is active via the `options("<name>.quiet")` option.
#'
#' @inheritParams .shared_condition_params
#'
#' @returns
#' Signals a message condition, or returns invisibly.
#' 
#' @export
#'
#' @importFrom cli cli_inform
{name}_inform <- function(msg, cls = NULL, ..., .envir = parent.frame()) {
  if (getOption("{name}.quiet")) return(invisible())
  classes <- c(cls, "{name}_message", "{name}_condition")
  cli::cli_inform(message = msg, class = classes, .envir = .envir, ...)
}

# checks ----------------------------------------------------------------------------------------------------------

#' Check Conditions
#' 
#' @family Conditions
#' 
#' @description
#' Functions for creating conditions related to check assertions. Used by `check_` functions internally.
#' 
#' - `check_abort()`: 
#'
#' - `check_warn()`: 
#'
#' - `check_inform()`:
#'  
#' @inheritParams .shared_condition_params
#'
#' @keywords internal
check_abort <- function(msg, ..., call = rlang::caller_env(), .envir = parent.frame()) {
  {name}_abort(msg = msg, cls = "check_error", ..., call = call, .envir = .envir)
}

#' @rdname check_abort
#' @keywords internal
check_warn <- function(msg, ..., call = rlang::caller_env(), .envir = parent.frame()) {
  {name}_warn(msg = msg, ..., call = call, .envir = .envir)
}

#' @rdname check_abort
#' @keywords internal
check_inform <- function(msg, ..., call = rlang::caller_env(), .envir = parent.frame()) {
  {name}_inform(msg = msg, ..., .envir = .envir)
}
```

### `<name>-config.R` & `<name>-options.R`

### `utils_pkg.R`

```R

#  ------------------------------------------------------------------------
#
# Title : Package Utilities
#    By : Jimmy Briggs
#  Date : YYYY-MM-DD
#
#  ------------------------------------------------------------------------

# meta ------------------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
pkg_name <- function() {
  pkg_env_meta("name")
}

#' @keywords internal
#' @noRd
#' @importFrom utils packageVersion
pkg_version <- function() {
  pkg_env_meta("version")
}

# user agent ------------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
pkg_user_agent <- function() {
  paste0(pkg_name(), "/", pkg_version())
}

# system file -----------------------------------------------------------------------------------------------------

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
pkg_sys_extdata <- function(...) {
  pkg_sys("extdata", ...)
}

#' @keywords internal
#' @noRd
pkg_sys_schemas <- function(...) {
  pkg_sys("schemas", ...)
}

# startup message -------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom crayon green cyan yellow bold italic
pkg_startup_msg <- function() {
  msg_title <- paste0(crayon::bold(crayon::cyan(pkg_name(), paste0("v", pkg_version()))))
  msg_desc <- crayon::italic(crayon::cyan("Modern Package for GDAL Vector Data"))
  paste0(msg_title, " - ", msg_desc)
}

# environment -----------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom rlang new_environment
pkg_env_init <- function() {
  if (!exists(".pkg_env")) { return() }
  
  # package metadata
  .pkg_env$name <- "{name}"
  .pkg_env$version <- utils::packageVersion("{name}")

  # package config
  .pkg_env$config <- rlang::new_environment()
  .pkg_env$config$path <- Sys.getenv("R_CONFIG_FILE", pkg_sys_config("config.yml"))
  .pkg_env$config$active <- Sys.getenv("R_CONFIG_ACTIVE", "default")
  
  # credentials
  .pkg_env$credentials <- rlang::new_environment()
  
  # options
  .pkg_env$options <- rlang::new_environment()
  
  # caching
  .pkg_env$cache <- rlang::new_environment()
  
  # logger
  .pkg_env$loggers <- rlang::new_environment()
  
  # database
  .pkg_env$db <- rlang::new_environment()
  .pkg_env$db$config <- list()
  .pkg_env$db$pool <- NULL
  .pkg_env$db$conn <- NULL
  .pkg_env$db$user <- NULL
  
  # shiny
  .pkg_env$shiny <- rlang::new_environment()
  .pkg_env$shiny$sessions <- rlang::new_environment()
   
}

#' @keywords internal
#' @noRd
#' @importFrom rlang env_get
pkg_env_get <- function(key, default = NULL) {
  rlang::env_get(env = .pkg_env, nm = key, default = default)
}

#' @keywords internal
#' @noRd
#' @importFrom rlang env_poke
pkg_env_set <- function(key, value, create = FALSE) {
  rlang::env_poke(env = .pkg_env, nm = key, value = value, create = create)
}

#' @keywords internal
#' @noRd
#' @importFrom rlang env_cache
pkg_env_cache <- function(key, default) {
  rlang::env_cache(env = .pkg_env, nm = key, default = default)
}

```

## Internal Package Environment

From the best practice above about `zzz.R` and initializers, we have this scaffolding in `zzz.R`:

```R
# environment -----------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom rlang new_environment
.pkg_env <- rlang::new_environment()

# initializers ----------------------------------------------------------------------------------------------------

#' @keywords internal
#' @noRd
#' @importFrom rlang on_load local_use_cli
rlang::on_load({
  pkg_env_init()
  pkg_config_init()
  pkg_options_init()
  # other initializers...
  rlang::local_use_cli()
})
```

While the `.pkg_env` is initialized here, its populated via `pkg_env_init()` which is an internal initializer defined in `utils_pkg.R` alongside other internal `.pkg_env` related utilities:

`R/utils_pkg.R`:

```R

```

***

## Appendix

*Note created on [[2026-06-02]] and last modified on [[2026-06-02]].*

### See Also

- [[R - Shiny App Package Development]]
- [[R - Package Initialization Script]]
- [[R - HTTP Testing]]
- [[R - Databases]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026