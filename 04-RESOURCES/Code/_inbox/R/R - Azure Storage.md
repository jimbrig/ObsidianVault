---
creation_date: 2026-01-05
modification_date: 2026-01-05
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Azure
  - Topic/DataEngineering
  - Topic/Cloud
aliases:
  - Working with Azure Storage with R
  - AzureStor
description: 'Code examples showcasing how to interact and manage Azure storage from R'
cssclasses:
  - code
---

# Azure Storage in R

> [!info] Code Properties
> - **Language**: [[04-RESOURCES/Code/R/_README|R]]
> - **Packages**: [[AzureStor]] and [[AzureRMR]]

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

### [[Azure CLI]] Wrapper

```R
# azure cli ----------------------------------------------------------------------

#' @export
#' @importFrom sys exec_internal as_text
#' @importFrom cli cli_abort
az <- function(cmd, ..., .timeout = 60, .echo = TRUE) {

  az_path <- Sys.which("az")
  if (az_path == "") {
    cli::cli_abort(
    "{.code az} is not installed or not found in the system {.envvar PATH}."
    )
  }

  args <- c(cmd, ...)

  res <- sys::exec_internal(
    cmd = az_path,
    args = args,
    timeout = .timeout,
    error = FALSE
  )

  if (res$status != 0) {
    cli::cli_abort(
      c(
        "Failed to run {.code az {cmd}} command (exit code: {res$status}).",
        "x" = sys::as_text(res$stderr)
      )
    )
  }

  output <- sys::as_text(res$stdout)
  if (.echo) cat(output)
  invisible(
    list(
      stdout = output,
      stderr = sys::as_text(res$stderr),
      status = res$status
    )
  )

}
```

### Login

```R
# login
az_login <- function() {
  res <- az("account", "show", "--output", "json", .echo = FALSE)
  if (res$status != 0) {
    cli::cli_abort("Failed to retrieve Azure account information. Please ensure you are logged in to Azure CLI.")
  } else {
    account_info <- jsonlite::fromJSON(res$stdout)
    cli::cli_alert_success("Logged in to Azure as {.field {account_info$user$name}} (Subscription: {.field {account_info$name}}).")
  }
  az <- AzureRMR::create_azure_login()
  if (is.null(az)) {
    cli::cli_abort("Failed to create Azure login object. Please check your Azure CLI configuration.")
  }
  return(az)
}
```

### Subscription

```R
az_get_subscription <- function(az) {
  subs <- az$list_subscriptions()
  sub_names <- names(subs)
  if (length(subs) > 1L) {
    cli::cli_alert_info("Multiple Azure subscriptions found: {.field {sub_names}}.")
    res <- utils::menu(choices = sub_names, title = "Select an Azure subscription to use:")
    if (res == 0) {
      cli::cli_abort("No subscription selected. Exiting.")
    }
    selected_sub <- subs[[res]]
  } else {
    selected_sub <- subs[[1L]]
    cli::cli_alert_info("Using Azure subscription: {.field {selected_sub$name}}.")
  }
  return(selected_sub)
}
```

### Resource Group

```R
az_get_resource_group <- function(az, sub = az_get_subscription(az)) {
  rgs <- sub$list_resource_groups()
  rg_names <- names(rgs)
  if (length(rgs) > 1L) {
    cli::cli_alert_info("Multiple resource groups found: {.field {rg_names}}.")
    res <- utils::menu(choices = rg_names, title = "Select a resource group to use:")
    if (res == 0) {
      cli::cli_abort("No resource group selected. Exiting.")
    }
    selected_rg <- rgs[[res]]
  } else {
    selected_rg <- rgs[[1L]]
    cli::cli_alert_info("Using resource group: {.field {selected_rg$name}}.")
  }
  return(selected_rg)
}
```

### Resource

```R
az_get_resource <- function(az, rg = az_get_resource_group(az)) {
  resources <- rg$list_resources()
  res_names <- names(resources)
  if (length(resources) > 1L) {
    cli::cli_alert_info("Multiple resources found: {.field {res_names}}.")
    res <- utils::menu(choices = res_names, title = "Select a resource to use:")
    if (res == 0) {
      cli::cli_abort("No resource selected. Exiting.")
    }
    selected_res <- resources[[res]]
  } else {
    selected_res <- resources[[1L]]
    cli::cli_alert_info("Using resource: {.field {selected_res$name}}.")
  }
  return(selected_res)
}
```

### Blob Storage Endpoint

```R
#' Get Azure Blob Storage Endpoint
#'
#' Creates an authenticated connection to Azure Blob Storage using cached configuration.
#'
#' @param .config Azure config object. If NULL, uses cached config from package environment.
#' @param cache Logical. Cache the endpoint in package environment? Default: TRUE
#'
#' @return An Azure blob endpoint object
#' @export
az_storage_endpoint <- function(.config = NULL, cache = TRUE) {

  if (is.null(.config)) {
    .config <- get_az_config()
  }

  check_az_config(require_gdal = FALSE)

  # Check for cached endpoint
  endpoint_key <- .config$storage_account

  if (cache && rlang::env_has(.pkg_env$azure$endpoints, endpoint_key)) {
    return(rlang::env_get(.pkg_env$azure$endpoints, endpoint_key))
  }

  # Create new endpoint
  endpoint <- tryCatch(
    AzureStor::blob_endpoint(.config$endpoint_url, key = .config$account_key),
    error = function(e) {
      cli::cli_abort(
        c(
          "x" = "Failed to connect to Azure Storage",
          "i" = "Storage Account: {.val {.config$storage_account}}",
          "i" = "Error: {e$message}"
        )
      )
    }
  )

  # Cache if requested
  if (cache) {
    rlang::env_bind(.pkg_env$azure$endpoints, !!endpoint_key := endpoint)
    cli::cli_alert_info("Cached Azure endpoint for {.val {.config$storage_account}}")
  }

  endpoint
}
```

### Blob Storage Container

```R
#' Get Azure Blob Container
#'
#' Returns a reference to a specific blob container, with session caching.
#'
#' @param container_name Container name. If NULL, uses default from config.
#' @param .endpoint Azure blob endpoint. If NULL, creates using cached config.
#' @param cache Logical. Cache the container reference? Default: TRUE
#'
#' @return An Azure blob container object
#' @export
az_storage_container <- function(container_name = NULL, .endpoint = NULL, cache = TRUE) {

  if (is.null(container_name)) {
    container_name <- get_az_config("default_container")
  }

  # Check for cached container
  if (cache && rlang::env_has(.pkg_env$azure$containers, container_name)) {
    return(rlang::env_get(.pkg_env$azure$containers, container_name))
  }

  if (is.null(.endpoint)) {
    .endpoint <- az_storage_endpoint()
  }

  container <- tryCatch(
    AzureStor::blob_container(.endpoint, container_name),
    error = function(e) {
      cli::cli_abort(
        c(
          "x" = "Failed to access container {.val {container_name}}",
          "i" = "Ensure the container exists and you have appropriate permissions",
          "i" = "Error: {e$message}"
        )
      )
    }
  )

  # Cache if requested
  if (cache) {
    rlang::env_bind(.pkg_env$azure$containers, !!container_name := container)
  }

  container
}
```

### Blob Storage Smart Transfer

```R
#' Smart Transfer from URL to Azure Blob
#'
#' Intelligently transfers files from HTTP/HTTPS/FTP URLs to Azure Blob Storage.
#'
#' @param urls Character vector of source URLs
#' @param blob_paths Character vector of destination blob paths. If NULL, uses basename of URLs.
#' @param .container Azure container object. If NULL, uses default container.
#' @param overwrite Logical. Overwrite existing blobs? Default: FALSE
#' @param progress Logical. Show progress? Default: TRUE
#'
#' @return Invisible tibble with transfer results
#' @export
az_smart_transfer <- function(
    urls,
    blob_paths = NULL,
    .container = NULL,
    overwrite = FALSE,
    progress = TRUE
) {

  if (is.null(.container)) {
    .container <- az_storage_container()
  }

  check_az_container(.container)

  if (is.null(blob_paths)) {
    blob_paths <- basename(urls)
  }

  if (length(urls) != length(blob_paths)) {
    cli::cli_abort(
      c(
        "x" = "{.arg urls} and {.arg blob_paths} must have same length",
        "i" = "urls: {length(urls)}, blob_paths: {length(blob_paths)}"
      )
    )
  }

  results <- purrr::map2_dfr(urls, blob_paths, function(url, dest_path) {

    cli::cli_h2("Processing: {basename(url)}")

    # Check if already exists
    if (!overwrite) {
      exists <- tryCatch(
        AzureStor::blob_exists(.container, dest_path),
        error = function(e) FALSE
      )

      if (exists) {
        cli::cli_alert_info("Blob {.file {dest_path}} already exists, skipping")
        return(tibble::tibble(
          url = url,
          blob_path = dest_path,
          status = "skipped",
          size_mb = NA_real_,
          method = NA_character_
        ))
      }
    }

    # Get file size
    size_mb <- tryCatch({
      req <- httr2::request(url) |>
        httr2::req_method("HEAD") |>
        httr2::req_retry(max_tries = 3) |>
        httr2::req_timeout(30)

      resp <- httr2::req_perform(req)
      as.numeric(httr2::resp_header(resp, "Content-Length")) / (1024^2)
    }, error = function(e) {
      cli::cli_alert_warning("Could not determine file size, assuming > 256MB")
      999999
    })

    cli::cli_alert_info("File size: {round(size_mb, 2)} MB")

    result <- tryCatch({
      if (size_mb < 256) {
        # Fast path: Server-side copy
        cli::cli_alert_info("Using server-side copy...")
        AzureStor::copy_url_to_blob(.container, url, dest_path)

        tibble::tibble(
          url = url,
          blob_path = dest_path,
          status = "success",
          size_mb = size_mb,
          method = "server_copy"
        )

      } else {
        # Slow path: Download then upload
        cli::cli_alert_warning("File exceeds 256MB, using download-upload method...")

        tmp <- tempfile(fileext = paste0(".", tools::file_ext(url)))
        on.exit(unlink(tmp), add = TRUE)

        old_timeout <- getOption("timeout")
        on.exit(options(timeout = old_timeout), add = TRUE)
        options(timeout = max(3600, old_timeout))

        cli::cli_progress_step("Downloading...")
        utils::download.file(url, tmp, mode = "wb", quiet = !progress)
        cli::cli_progress_done()

        cli::cli_progress_step("Uploading to Azure...")
        AzureStor::upload_blob(.container, tmp, dest_path)
        cli::cli_progress_done()

        tibble::tibble(
          url = url,
          blob_path = dest_path,
          status = "success",
          size_mb = size_mb,
          method = "download_upload"
        )
      }
    }, error = function(e) {
      cli::cli_alert_danger("Transfer failed: {e$message}")
      tibble::tibble(
        url = url,
        blob_path = dest_path,
        status = "failed",
        size_mb = size_mb,
        method = NA_character_
      )
    })

    if (result$status == "success") {
      cli::cli_alert_success("Transferred: {.file {dest_path}}")
    }

    result
  })

  # Summary
  cli::cli_rule()
  cli::cli_alert_success("Completed {sum(results$status == 'success')}/{nrow(results)} transfers")

  if (any(results$status == "failed")) {
    cli::cli_alert_warning("{sum(results$status == 'failed')} transfers failed")
  }

  if (any(results$status == "skipped")) {
    cli::cli_alert_info("{sum(results$status == 'skipped')} transfers skipped")
  }

  invisible(results)
}
```

### Pins Example

```R
az_storage_container <- function(name) {
  storage_endpoint <- AzureStor::blob_endpoint("https://landrisestorage.blob.core.windows.net/", key = Sys.getenv("AZURE_STORAGE_KEY"))
  containers <- AzureStor::list_blob_containers(storage_endpoint)
  rlang::arg_match(name, names(containers))
  AzureStor::blob_container(storage_endpoint, name)
}

az_board <- pins::board_azure(
  container = az_storage_container("landrise-geospatial"),
  path = "temp",
  cache = "data-raw/cache"
)

pins::pin_write(
  board = az_board,
  x = tiger_field_dictionary,
  name = "tiger_field_dictionary",
  description = "Field dictionary for TIGER/Line shapefiles from the US Census Bureau",
  type = "csv"
)

az_board |> pins::pin_list()

az_board |> pins::write_board_manifest()


tiger_data <- pins::board_url(
  urls = c(
    "cb_2024_us_all_20m_gpkg" = "https://www2.census.gov/geo/tiger/GENZ2024/gpkg/cb_2024_us_all_20m.zip",
    "cb_2024_us_tract_5m_shp" = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_tract_5m.zip"
  ),
  cache = "data-raw/cache/tiger",
  use_cache_on_failure = TRUE,
  headers = NULL
)

pins::write_board_manifest(tiger_data)

tiger_data |>
  pins::pin_download("cb_2024_us_all_20m_gpkg")

Sys.setenv("R_USER_DATA_DIR" = "data-raw/cache/tiger")
dpkg::stow(uri = "https://www2.census.gov/geo/tiger/GENZ2024/gpkg/cb_2024_us_all_20m.zip")

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

*Note created on [[2026-01-05]] and last modified on [[2026-01-05]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]

### Backlinks

```dataview
LIST FROM [[Untitled]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
