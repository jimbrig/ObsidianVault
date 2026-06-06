---
creation_date: 2024-06-23
modification_date: 2024-12-13
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
tags:
  - Type/Code
  - Topic/Development
  - Topic/R
  - Topic/Data
  - Status/Complete
aliases:
  - Data Dictionary Labelling R Code
  - Apply Labels R Function
  - Data Labelling Utilities
description: Functions for applying and reversing data dictionary labels to datasets
cssclasses:
  - code
---

# Data Dictionary Labelling

> [!info] Code Properties
> - **Language**: R
> - **Packages**: `dplyr`, `matchmaker`, `rlang`, `stringr`, `purrr`

```table-of-contents
title: ## Contents 
style: nestedList
minLevel: 1
maxLevel: 4
includeLinks: true
debugInConsole: false
```

## Overview

Functions for applying human-readable labels from a data dictionary to dataset columns and values, and reversing the process back to machine-readable format.

## Code

### Apply Labels

```r
#' Apply Labels
#'
#' @param data Dataset to apply labeling on
#' @param dict Dictionary to use for application of labeling
#' @param by Column in dict defining the columns in data. Defaults to "variable"
#' @param names_from Column defining where to match names from. Defaults to "variable"
#' @param names_to Column defining replacements for names(data). Defaults to "variable_label"
#' @param from Column with original values. Defaults to "value"
#' @param to Column with replacement values. Defaults to "value_label"
#' @param dataset_name Optional name of dataset to filter dict by
#' @param ... Passed to matchmaker::match_df
#'
#' @return A labelled, display-friendly tibble
#' @export
apply_labels <- function(
  data,
  dict,
  from = "value",
  to = "value_label",
  by = "variable",
  names_from = "variable",
  names_to = "variable_label",
  dataset_name = NULL,
  ...
) {
  if (!is.null(dataset_name)) {
    dict <- dict |>
      dplyr::filter(.data$dataset == dataset_name)
    globals <- dict |> 
      dplyr::filter(.data[[by]] == ".global")
  } else {
    globals <- NULL
  }

  suppressWarnings({
    hold <- matchmaker::match_df(
      data,
      dictionary = dict,
      from = from,
      to = to,
      by = by,
      ...
    )

    if (!is.null(globals) && nrow(globals) > 0) {
      purrr::walk2(globals$value, globals$value_label, function(x, y) {
        hold <<- hold |>
          dplyr::mutate(dplyr::across(
            dplyr::where(is.character),
            ~ stringr::str_replace_all(.x, pattern = x, replacement = y)
          ))
      })
    }
  })

  hold |>
    rlang::set_names(
      dict[[names_to]][match(names(hold), dict[[names_from]])]
    ) |>
    dplyr::mutate(dplyr::across(
      dplyr::where(is.character),
      ~ dplyr::na_if(.x, ".missing")
    ))
}
```

### Reverse Labels

```r
#' Reverse Labels
#'
#' Reverses apply_labels() back to machine-readable format
#'
#' @inheritParams apply_labels
#'
#' @return An un-labeled, R-friendly tibble
#' @export
reverse_labels <- function(
  data,
  dict,
  from = "value",
  to = "value_label",
  by = "variable",
  names_from = "variable",
  names_to = "variable_label",
  dataset_name = NULL,
  ...
) {
  if (!is.null(dataset_name)) {
    dict <- dict |>
      dplyr::filter(.data$dataset == dataset_name)
    globals <- dict |> 
      dplyr::filter(.data[[by]] == ".global")
  } else {
    globals <- NULL
  }

  suppressWarnings({
    hold <- matchmaker::match_df(
      data,
      dictionary = dict,
      from = to,
      to = from,
      by = "variable_label",
      ...
    )

    if (!is.null(globals) && nrow(globals) > 0) {
      purrr::walk2(globals$value_label, globals$value, function(x, y) {
        hold <<- hold |>
          dplyr::mutate(dplyr::across(
            dplyr::where(is.character),
            ~ stringr::str_replace_all(.x, pattern = x, replacement = y)
          ))
      })
    }
  })

  hold |>
    rlang::set_names(
      dict[[names_from]][match(names(hold), dict[[names_to]])]
    ) |>
    dplyr::mutate(dplyr::across(
      dplyr::where(is.character),
      ~ dplyr::na_if(.x, ".missing")
    ))
}
```

## Usage

```r
# create dictionary
dictionary <- data.frame(
  var = c(rep("x1", 2), rep("x2", 3), rep("x3", 5)),
  var_lab = c(rep("Column 1", 2), rep("Column 2", 3), rep("Column 3", 5)),
  val = c(c(TRUE, FALSE), c(1:3), letters[1:5]),
  val_lab = c(
    c("YES", "NO"),
    paste0("Group ", c(1:3)),
    paste0("Area ", LETTERS[1:5])
  )
)

# sample data
dat <- data.frame(
  "x1" = rep(c(TRUE, FALSE), 15),
  "x2" = rep(c(1:3), 10),
  "x3" = rep(letters[1:5], 6)
)

# apply labels for display
labeled_data <- apply_labels(
  dat,
  dictionary,
  from = "val",
  to = "val_lab",
  by = "var",
  names_from = "var",
  names_to = "var_lab"
)

# reverse back to machine format
original_data <- reverse_labels(
  labeled_data,
  dictionary,
  from = "val",
  to = "val_lab",
  by = "var",
  names_from = "var",
  names_to = "var_lab"
)
```

***

## Appendix

*Note created on [[2024-06-23]] and last modified on [[2024-12-13]].*

### See Also

- [[04-RESOURCES/Code/R/_README|R Code Index]]

### Backlinks

```dataview
LIST FROM [[R - Data Dictionary Labelling]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024

