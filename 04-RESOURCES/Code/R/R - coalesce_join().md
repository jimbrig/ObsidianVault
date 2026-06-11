---
creation_date: 2026-06-07
modification_date: 2026-06-07
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - coalesce_join()
tags:
  - Type/Code
  - Status/Complete
  - Topic/R
  - Topic/Development
aliases:
  - coalesce_join()
  - coalesce_join
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

```R
#' Coalesce Join
#'
#' @description
#' Join two data frames and coalesce the values of common columns. This function
#' performs a join operation and then coalesces values from both data frames
#' according to the specified priority.
#'
#' @param x,y The data frames to join.
#' @param by Variables to join by. See \code{dplyr::join} for more details on
#'   allowed formats.
#' @param suffix Common variable suffixes to use for duplicate column names.
#' @param join Type of join to perform. Default is `dplyr::full_join`. Other
#'   options include `dplyr::left_join`, `dplyr::right_join`, and
#'   `dplyr::inner_join`.
#' @param keep Which data frame to keep the values from. Default is `left`.
#'   When set to `right`, the values from `y` will overwrite the values from `x`
#'   for matching rows.
#' @param ... Additional arguments passed to the join function
#'
#' @returns
#' The joined, coalesced data.frame with values replaced
#'
#' @export
#'
#' @importFrom dplyr mutate row_number union coalesce select arrange bind_cols
#'   left_join right_join inner_join anti_join semi_join full_join
#' @importFrom purrr map_dfc
#' @importFrom rlang .data
#' @importFrom tibble as_tibble
#'
#' @examples
#' # Example 1: Coalesce Join Replacing NA's
#' dat1 <- tibble::tibble(
#'   id = 1:5,
#'   value = c(1, 2, 3, NA_integer_, NA_integer_)
#' )
#'
#' dat2 <- tibble::tibble(
#'   id = 3:5,
#'   value = c(6, 7, 8)
#' )
#'
#' # coalesce join (will replace NA's in dat1 with values from dat2)
#' coalesce_join(dat1, dat2, by = "id")
#'
#' # Example 2: Coalesce Join Overwriting Values
#' dat1 <- tibble::tibble(
#'   id = 1:5,
#'   value = c(1, 2, 3, 4, 5)
#' )
#'
#' dat2 <- tibble::tibble(
#'   id = 3:5,
#'   value = c(6, 7, 8),
#' )
#'
#' # coalesce join (replacing values in dat1 with values from dat2 since keep = "right")
#' coalesce_join(dat1, dat2, by = "id", keep = "right")
#'
#' # Example 3: Different Join Types
#' dat1 <- tibble::tibble(
#'   id = 1:5,
#'   value = letters[1:5]
#' )
#'
#' dat2 <- tibble::tibble(
#'   id = 3:7,
#'   value = LETTERS[3:7]
#' )
#'
#' # Inner join (only keeps matching rows)
#' coalesce_join(dat1, dat2, by = "id", join = dplyr::inner_join)
#'
#' # Left join (keeps all rows from dat1)
#' coalesce_join(dat1, dat2, by = "id", join = dplyr::left_join)
coalesce_join <- function(
    x,
    y,
    by = NULL,
    suffix = c(".x", ".y"),
    join = dplyr::full_join,
    keep = c("left", "right"),
    ...
) {
  # Validate inputs
  keep <- match.arg(keep)

  # Add row order to track original order
  x <- x |> dplyr::mutate(.orig_row_order = dplyr::row_number())

  # Perform join with message suppression
  old <- options(dplyr.summarise.inform = FALSE)
  on.exit(options(old), add = TRUE)

  # Globally suppress messages
  suppressMessages({
    # Perform the appropriate join
    if (keep == "left") {
      joined <- join(x, y, by = by, suffix = suffix, ...)
    } else {
      joined <- join(y, x, by = by, suffix = rev(suffix), ...)
    }

    # Get columns to coalesce
    cols <- dplyr::union(names(x), names(y))
    to_coalesce <- names(joined)[!names(joined) %in% cols]
    suffix_used <- suffix[ifelse(endsWith(to_coalesce, suffix[1]), 1, 2)]

    # Extract base column names by removing suffixes
    to_coalesce <- unique(substr(
      to_coalesce,
      1,
      nchar(to_coalesce) - nchar(suffix_used)
    ))

    # Early return if no columns to coalesce
    if (length(to_coalesce) == 0) {
      return(joined |>
               dplyr::arrange(.data$.orig_row_order) |>
               dplyr::select(-".orig_row_order"))
    }

    # Coalesce columns according to priority
    for (col in to_coalesce) {
      col1 <- paste0(col, suffix[1])
      col2 <- paste0(col, suffix[2])

      # Only process if both columns exist
      if (col1 %in% names(joined) && col2 %in% names(joined)) {
        if (keep == "left") {
          joined[[col]] <- dplyr::coalesce(joined[[col1]], joined[[col2]])
        } else {
          joined[[col]] <- dplyr::coalesce(joined[[col2]], joined[[col1]])
        }
      }
    }

    # Select only the final columns we want to keep
    result <- joined |>
      dplyr::select(dplyr::all_of(c(cols, ".orig_row_order"))) |>
      dplyr::arrange(.data$.orig_row_order) |>
      dplyr::select(-".orig_row_order")

    # Return as tibble to ensure clean printing
    tibble::as_tibble(result)
  })
}

```
