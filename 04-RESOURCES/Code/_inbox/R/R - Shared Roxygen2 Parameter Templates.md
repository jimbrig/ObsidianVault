---
creation_date: 2025-12-24
modification_date: 2025-12-24
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
description: "Pattern for R/aaa.R with shared roxygen2 parameter and return value documentation"
tags:
  - Type/Code
  - Topic/R
  - Status/Complete
aliases:
  - R Package aaa.R
  - R Shared Parameters
  - Roxygen2 Inherited Parameters
---


# R Shared Roxygen2 Parameter Templates

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

The `R/aaa.R` file serves as a central location for shared roxygen2 documentation blocks that can be inherited across multiple functions. This reduces documentation duplication and ensures consistency.

Key uses:
- Shared parameter definitions using `@inheritParams`
- Shared return value definitions using `@inherit`
- Topic documentation for function families
- Inheriting from external packages like `rlang`

## API Client Package Example

For httr2-based API client packages:

```R
#  ------------------------------------------------------------------------
#
# Title : Shared Package Resources
#    By : Jimmy Briggs
#  Date : 2025-08-07
#
#  ------------------------------------------------------------------------

# params ------------------------------------------------------------------

#' Shared Package Parameters
#'
#' @name .shared_params
#'
#' @description
#' Common, shared parameters that can be inherited by other functions in the package.
#'
#' Use `@inheritParams .shared_params` in a function's roxygen2 block to import 
#' these parameter descriptions.
#'
#' @param req An [httr2::request()] object.
#'
#' @param resp An [httr2::response()] object.
#'
#' @param config A configuration object containing client configuration values.
#'   Should include `base_url`, `api_key`, `user_id`, and other required credentials.
#'   Defaults to the result of [get_config()].
#'
#' @param cache A `cachem::cache_*()` object for caching responses. Defaults to
#'   the result of [get_cache()] which will return `NULL` if no cache is set.
#'   If `NULL`, caching is disabled.
#'
#' @param logger An [lgr::Logger] object used for structured logging. Defaults to 
#'   the result of [get_logger()] which will return `NULL` if no logger is set.
#'   If `NULL`, logging is disabled.
#'
#' @param validate Logical. Should the request be validated before sending? 
#'   Defaults to `TRUE`. This uses [req_validate()] to ensure the request body 
#'   passes JSON schema validation.
#'
#' @param tidy Logical. Should the response be tidied before returning? 
#'   Defaults to `TRUE`. This converts the response to a rectangular, 
#'   flattened [tibble::tibble()].
#'
#' @param endpoint Character. The API endpoint path or name.
#'
#' @param ... Additional arguments passed to downstream functions.
#'
#' @keywords internal
NULL

# request modifiers -------------------------------------------------------

#' API Request Modifiers
#'
#' @name request_modifiers
#'
#' @description
#' These functions modify the [httr2::request()] object to add various features
#' such as endpoints, authentication, user agent, body, error handling, retry logic,
#' throttling, logging, caching, and file saving.
#'
#' Functions:
#'
#' - `req_auth()`: Adds authentication headers to the request.
#' - `req_user_agent()`: Sets the user agent for the request.
#' - `req_endpoint()`: Adds an endpoint to the request URL.
#' - `req_body()`: Sets the body of the request to a JSON object.
#' - `req_validate()`: Validates the request body against the specified endpoint's parameters.
#' - `req_error()`: Sets up API-specific error handling for the request.
#' - `req_retry()`: Retries the request if it fails due to transient errors.
#' - `req_throttle()`: Applies throttling to the request.
#' - `req_logger()`: Attaches a logger to the request object for logging request details.
#' - `req_cache()`: Attaches a custom cache feature to the request object.
#'
#' @seealso [httr2::request()]
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
#' An [httr2::request()] object configured for the API.
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
#' An [httr2::response()] object containing the response from the API.
#'
#' @keywords internal
NULL

#' Tibble Returns
#'
#' @name .shared_returns_tibble
#'
#' @description
#' Returns for functions that return a [tibble::tibble()].
#'
#' @returns
#' A [tibble::tibble()] containing the processed data.
#'
#' @keywords internal
NULL
```

## Shiny Module Package Example

For Shiny application packages:

```R
#  ------------------------------------------------------------------------
#
# Title : aaa.R - Package Initialization & Roxygen2 Templates
#    By : Jimmy Briggs
#  Date : 2025-05-08
#
#  ------------------------------------------------------------------------

# parameters --------------------------------------------------------------

#' Shared Parameters
#'
#' @name .shared-params
#' @keywords internal
#'
#' @description
#' These parameters are used in multiple functions throughout the package.
#' They are defined here to make it easier to update them in one place.
#'
#' To use these parameters in a function, simply include the following
#' in the function's documentation:
#'
#' ```
#' #' @inheritParams .shared-params
#' ```
#'
#' @param conn,pool Database connection or pool object.
#' @param id Module's namespace identifier.
#' @param input,output,session Shiny input, output, and session objects.
#' @param ns Namespace function from [shiny::NS()].
#' @param req,resp `httr2` request and response objects.
NULL

# rlang inheritance -------------------------------------------------------

#' @inheritParams rlang::args_error_context
#' @inheritParams rlang::args_dots_empty
#' @inheritParams rlang::args_data_masking
NULL

# returns -----------------------------------------------------------------

#' Shiny App Return
#'
#' @name .shared-return-app
#' @keywords internal
#' @noRd
#'
#' @returns
#' A [shiny::shinyApp()] object.
NULL

#' Reactive List Return
#'
#' @name .shared-return-reactive-list
#' @keywords internal
#' @noRd
#'
#' @returns
#' A list of [shiny::reactive()] expressions.
NULL

#' Shiny Tag Return
#'
#' @name .shared-return-tag
#' @keywords internal
#' @noRd
#'
#' @returns
#' A [shiny::tag()] object.
NULL

#' Shiny Tag List Return
#'
#' @name .shared-return-taglist
#' @keywords internal
#' @noRd
#'
#' @returns
#' A [shiny::tagList()] object.
NULL
```

## Usage in Functions

### Inheriting Parameters

```R
#' My API Function
#'
#' @description
#' Performs an API request with the given parameters.
#'
#' @inheritParams .shared_params
#' @param additional_param An additional function-specific parameter.
#'
#' @inherit .shared_returns_tibble return
#'
#' @export
my_api_function <- function(req, config = get_config(), tidy = TRUE, additional_param = NULL) {
  # function implementation
}
```

### Inheriting from rlang

```R
#' My Check Function
#'
#' @param x Object to check.
#' @inheritParams rlang::args_error_context
#'
#' @returns The input `x` invisibly.
#'
#' @keywords internal
check_something <- function(x, arg = rlang::caller_arg(x), call = rlang::caller_env()) {
  # validation logic
  invisible(x)
}
```

### Topic Documentation

```R
#' API Endpoints
#'
#' @name api_endpoints
#'
#' @description
#' Functions for interacting with various API endpoints.
#'
#' @section Available Endpoints:
#' - `/v2/Search` - Search for resources
#' - `/v2/Detail` - Get resource details
#' - `/v2/AutoComplete` - Auto-complete suggestions
#'
#' @seealso [api_request()], [api_response()]
NULL
```

## Best Practices

1. **Centralize common parameters** in `R/aaa.R` to ensure consistency
2. **Use meaningful names** like `.shared_params` with leading dot for internal objects
3. **Include `@keywords internal`** for documentation that shouldn't appear in the package index
4. **Use `NULL`** at the end of documentation-only blocks (no actual function)
5. **Leverage `@inherit`** for return values and other sections
6. **Inherit from `rlang`** for standard argument patterns like error context

***

## Appendix

*Note created on [[2025-12-24]] and last modified on [[2025-12-24]].*

### See Also

- [[R - Package Environment and Initialization]]
- [[R - Package Initialization Script]]
- [[R Package Development - Advanced Patterns]]

### Backlinks

```dataview
LIST FROM [[R - Shared Roxygen2 Parameter Templates]] 
WHERE file.name != "_README" AND file.name != this.file.name AND file.name != "CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

