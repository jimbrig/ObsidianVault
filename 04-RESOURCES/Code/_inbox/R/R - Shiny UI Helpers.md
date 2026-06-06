---
creation_date: 2024-06-23
modification_date: 2024-12-13
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
tags:
  - Type/Code
  - Topic/Development
  - Topic/R
  - Status/Complete
aliases:
  - Shiny User Interface Helpers R Code
  - Shiny UI Functions
  - R Shiny Helpers
description: Utility functions for building Shiny application user interfaces
cssclasses:
  - code
---

# Shiny UI Helpers

> [!info] Code Properties
> - **Language**: R
> - **Packages**: `shiny`, `htmltools`, `bslib`

```table-of-contents
title: ## Contents 
style: nestedList
minLevel: 1
maxLevel: 4
includeLinks: true
debugInConsole: false
```

## Overview

Collection of helper functions for building consistent and professional Shiny application user interfaces.

> [!SOURCE] Sources
> - [EDA/R/ui_helpers.R](https://github.com/jimbrig/EDA/blob/master/R/ui_helpers.R)

## Code

### Insert Logo

```r
#' Insert Logo
#'
#' @description
#' Inserts a customized HTML div element with an anchor and embedded image
#' representing a logo element.
#'
#' @param file Path to the logo image file
#' @param style CSS styles. Defaults to white background, full width/height
#' @param width Width to use
#' @param href Link destination. Defaults to "#"
#'
#' @return HTML div element
#' @export
insert_logo <- function(
  file,
  style = "background-color: #FFF; width: 100%; height: 100%;",
  width = NULL,
  href = "#"
) {
  htmltools::tags$div(
    style = style,
    htmltools::tags$a(
      href = href,
      htmltools::tags$img(
        src = file,
        width = width
      )
    )
  )
}
```

### Icon with Text

```r
#' Icon with Text
#'
#' @description
#' Creates a span element with an icon and text.
#'
#' @param icon Icon name (Font Awesome)
#' @param text Text to display
#' @param lib Icon library. Defaults to "font-awesome"
#'
#' @return HTML span element
#' @export
icon_text <- function(icon, text, lib = "font-awesome") {
  htmltools::tags$span(
    shiny::icon(icon, lib = lib),
    " ",
    text
  )
}
```

### Repeat Line Breaks

```r
#' Repeat Break Tags
#'
#' @description
#' Creates multiple HTML break tags.
#'
#' @param n Number of breaks to create. Defaults to 1
#'
#' @return HTML tag list
#' @export
br_repeat <- function(n = 1) {
  htmltools::tagList(
    lapply(seq_len(n), function(x) htmltools::tags$br())
  )
}
```

### Fluid Column

```r
#' Fluid Column
#'
#' @description
#' Creates a responsive Bootstrap column with fluid width.
#'
#' @param width Column width (1-12)
#' @param ... Column contents
#' @param offset Column offset (0-11)
#'
#' @return HTML column element
#' @export
flucol <- function(width, ..., offset = 0) {
  htmltools::tags$div(
    class = paste0(
      "col-sm-", width,
      if (offset > 0) paste0(" offset-sm-", offset) else ""
    ),
    ...
  )
}
```

### Bundle External Assets

```r
#' Bundle External Assets
#'
#' @description
#' Bundles CSS and JavaScript assets for the application.
#'
#' @param app_name Application name for asset paths
#'
#' @return HTML dependencies
#' @export
bundle_assets <- function(app_name = "app") {
  htmltools::tagList(
    htmltools::tags$head(
      htmltools::tags$link(
        rel = "stylesheet",
        type = "text/css",
        href = paste0(app_name, "/css/styles.css")
      ),
      htmltools::tags$script(
        src = paste0(app_name, "/js/scripts.js")
      )
    )
  )
}
```

### Use Favicon

```r
#' Use Favicon
#'
#' @description
#' Adds favicon link tags to the application head.
#'
#' @param path Path to favicon file
#' @param type MIME type. Defaults to "image/x-icon"
#'
#' @return HTML link tag
#' @export
use_favicon <- function(path = "favicon.ico", type = "image/x-icon") {
  htmltools::tags$head(
    htmltools::tags$link(
      rel = "icon",
      type = type,
      href = path
    ),
    htmltools::tags$link(
      rel = "shortcut icon",
      type = type,
      href = path
    )
  )
}
```

### Add External Resources

```r
#' Add External Resources
#'
#' @description
#' Comprehensive function to add all external resources to a Shiny app.
#'
#' @param app_title Application title for meta tags
#' @param css_files Vector of CSS file paths
#' @param js_files Vector of JavaScript file paths
#' @param favicon_path Path to favicon
#'
#' @return HTML tag list for head section
#' @export
add_external_resources <- function(
  app_title = "Shiny App",
  css_files = NULL,
  js_files = NULL,
  favicon_path = NULL
) {
  head_tags <- list(
    htmltools::tags$meta(charset = "UTF-8"),
    htmltools::tags$meta(
      name = "viewport",
      content = "width=device-width, initial-scale=1.0"
    ),
    htmltools::tags$title(app_title)
  )
  
  if (!is.null(css_files)) {
    css_tags <- lapply(css_files, function(f) {
      htmltools::tags$link(rel = "stylesheet", type = "text/css", href = f)
    })
    head_tags <- c(head_tags, css_tags)
  }
  
  if (!is.null(js_files)) {
    js_tags <- lapply(js_files, function(f) {
      htmltools::tags$script(src = f)
    })
    head_tags <- c(head_tags, js_tags)
  }
  
  if (!is.null(favicon_path)) {
    head_tags <- c(head_tags, list(
      htmltools::tags$link(rel = "icon", href = favicon_path)
    ))
  }
  
  htmltools::tags$head(head_tags)
}
```

## Usage

```r
ui <- bslib::page_fluid(
  add_external_resources(
    app_title = "My Shiny App",
    css_files = c("www/css/custom.css"),
    js_files = c("www/js/app.js"),
    favicon_path = "www/favicon.ico"
  ),
  
  bslib::card(
    bslib::card_header(
      insert_logo("www/logo.png", width = "120px")
    ),
    bslib::card_body(
      icon_text("chart-bar", "Analytics Dashboard"),
      br_repeat(2),
      flucol(6, "Left Column"),
      flucol(6, "Right Column")
    )
  )
)
```

***

## Appendix

*Note created on [[2024-06-23]] and last modified on [[2024-12-13]].*

### See Also

- [[04-RESOURCES/Code/R/_README|R Code Index]]
- [[R - Shiny DT Table Helpers]]

### Backlinks

```dataview
LIST FROM [[R - Shiny UI Helpers]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024

