---
creation_date: 2025-12-24
modification_date: 2025-12-24
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
description: "R function for analyzing loaded R package functions"
tags: [Type/Code, Status/Complete, Topic/R]
aliases: ["Analyze Package Functions in R"]
---


# Analyze Package Functions in R

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - **

## Code

```R
#' Analyze Loaded Package Functions and Visualize by File Structure
#'
#' @description Analyzes the loaded package environment to identify all
#' functions and ties them back to the files where they were defined,
#' classifying them as exported or internal. Outputs a collapsible tree visualization.
#'
#' @param package_path The path to the package root directory (default: ".").
#' @return A collapsible tree HTML widget visualizing the directory and function structure.
#' @export
#' @importFrom pkgload load_all ns_env pkg_name
#' @importFrom purrr map
#' @importFrom dplyr bind_rows filter mutate group_by n ungroup
#' @importFrom tibble tibble
#' @importFrom collapsibleTree collapsibleTree
analyze_loaded_package_functions <- function(package_path = ".") {

  pkgload::load_all(
    package_path,
    export_all = TRUE
  )

  pkg_name <- pkgload::pkg_name(package_path)
  ns <- pkgload::ns_env(pkg_name)

  all_functions <- ls(envir = ns)
  exported_functions <- getNamespaceExports(ns)

  # Map functions to their source files and classifications
  function_info <- purrr::map(
    all_functions,
    function(func_name) {
      tibble::tibble(
        file = .get_function_source_file(func_name, ns),
        function_name = func_name,
        type = .classify_function(func_name, exported_functions)
      )
    }
  ) |>
    dplyr::bind_rows() |>
    dplyr::filter(!is.na(file)) |>
    dplyr::mutate(file = basename(file)) |>
    dplyr::group_by(file) |>
    dplyr::mutate(function_count = dplyr::n()) |>
    dplyr::ungroup()

  # Generate a collapsible tree visualization
  collapsibleTree::collapsibleTree(
    function_info,
    hierarchy = c("file", "type", "function_name"),
    root = pkg_name,
    attribute = "function_count"
  )
}

# Helper function to classify functions
.classify_function <- function(func_name, exported_functions) {
  if (func_name %in% exported_functions) {
    return("exported")
  } else {
    return("internal")
  }
}

# Helper function to extract the source file from the function's attributes
.get_function_source_file <- function(func_name, ns) {
  func <- ns[[func_name]]

  # Check if the function has a "srcref" attribute to get its source file
  src_ref <- attr(func, "srcref")

  if (!is.null(src_ref)) {
    # Extract the source file path from the "srcfile" attribute within srcref
    src_file <- attr(src_ref, "srcfile")
    if (!is.null(src_file) && !is.null(src_file$filename)) {
      return(as.character(src_file$filename))  # Return the source file path
    }
  }

  return(NA)  # Return NA if the function's source file cannot be determined
}
```

## Example

```R
# Example usage
analyze_loaded_package_functions(package_path = ".")
```

Result:

![[demo-analyze-r-package-functions.png]]

***

## Appendix

*Note created on [[2025-12-24]] and last modified on [[2025-12-24]].*

### See Also

- [[04-RESOURCES/Code/R/_README|R Code]]

### Backlinks

```dataview
LIST FROM [[R - Analyze Package Functions]] 
WHERE file.name != "_README" AND file.name != this.file.name AND file.name != "CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025