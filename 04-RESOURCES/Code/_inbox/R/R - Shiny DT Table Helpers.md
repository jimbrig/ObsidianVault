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
  - Shiny DT Table Helpers R Code
  - DT Table Module
  - DataTables Shiny Helpers
description: Comprehensive DT (DataTables) helper functions for Shiny apps including modules, buttons, and inline actions
cssclasses:
  - code
---

# Shiny DT Table Helpers

> [!info] Code Properties
> - **Language**: R
> - **Packages**: `shiny`, `DT`, `htmltools`, `purrr`, `glue`, `dplyr`

```table-of-contents
title: ## Contents 
style: nestedList
minLevel: 1
maxLevel: 4
includeLinks: true
debugInConsole: false
```

## Overview

Collection of helper functions for creating feature-rich DataTables in Shiny applications, including download buttons, inline action buttons, and reusable table modules.

## Code

### DT Download Buttons

```r
#' DT Export Buttons Configuration
#'
#' @param data Data frame for export configuration
#' @param filename Base filename for exports
#' @param escape_cols Columns to exclude (HTML content)
#'
#' @return List of button configurations
#' @export
dt_buttons <- function(data, filename = "data", escape_cols = NULL) {
  export_cols <- seq_len(ncol(data))
  
  if (!is.null(escape_cols)) {
    export_cols <- setdiff(export_cols, escape_cols)
  }

  fileout <- paste0(filename, "-", Sys.Date())

  list(
    list(
      extend = "copy",
      text = '<i class="fa fa-copy"></i>',
      titleAttr = "Copy to Clipboard",
      exportOptions = list(
        columns = export_cols,
        modifier = list(selected = NULL)
      )
    ),
    list(
      extend = "print",
      text = '<i class="fa fa-print"></i>',
      titleAttr = "Print",
      autoPrint = FALSE,
      exportOptions = list(
        columns = export_cols,
        modifier = list(selected = NULL)
      )
    ),
    list(
      extend = "excel",
      text = '<i class="fa fa-file-excel"></i>',
      titleAttr = "Export to Excel",
      title = fileout,
      exportOptions = list(
        columns = export_cols,
        modifier = list(selected = NULL)
      )
    ),
    list(
      extend = "csv",
      text = '<i class="fa fa-file-csv"></i>',
      titleAttr = "Export to CSV",
      title = fileout,
      exportOptions = list(
        columns = export_cols,
        modifier = list(selected = NULL)
      )
    ),
    list(
      extend = "pdf",
      text = '<i class="fa fa-file-pdf"></i>',
      titleAttr = "Export to PDF",
      orientation = "landscape",
      pageSize = "LEGAL",
      download = "open",
      title = fileout,
      exportOptions = list(columns = ":visible"),
      modifier = list(selected = NULL)
    ),
    list(
      extend = "colvis",
      text = '<i class="fa fa-columns"></i>',
      titleAttr = "Column Visibility"
    ),
    list(
      extend = "pageLength",
      text = '<i class="fa fa-list"></i>',
      titleAttr = "Page Length"
    )
  )
}
```

### Inline Action Buttons

```r
#' Create Inline Action Buttons for DT Rows
#'
#' @param ids Vector of row IDs
#' @param edit Include edit button
#' @param delete Include delete button
#' @param view Include view button
#'
#' @return Character vector of HTML button groups
#' @export
dt_inline_buttons <- function(ids, edit = TRUE, delete = TRUE, view = FALSE) {
  purrr::map_chr(ids, function(id) {
    buttons <- c()
    
    if (view) {
      buttons <- c(buttons, glue::glue(
        '<button class="btn btn-info btn-sm view_btn" ',
        'data-toggle="tooltip" title="View" id="{id}">',
        '<i class="fa fa-eye"></i></button>'
      ))
    }
    
    if (edit) {
      buttons <- c(buttons, glue::glue(
        '<button class="btn btn-primary btn-sm edit_btn" ',
        'data-toggle="tooltip" title="Edit" id="{id}">',
        '<i class="fa fa-pencil"></i></button>'
      ))
    }
    
    if (delete) {
      buttons <- c(buttons, glue::glue(
        '<button class="btn btn-danger btn-sm delete_btn" ',
        'data-toggle="tooltip" title="Delete" id="{id}">',
        '<i class="fa fa-trash"></i></button>'
      ))
    }
    
    glue::glue(
      '<div class="btn-group" role="group">{paste(buttons, collapse = "")}</div>'
    )
  })
}
```

### DT Table Module

```r
#' DT Table Module UI
#'
#' @param id Module namespace ID
#'
#' @return Shiny UI element
#' @export
mod_datatable_ui <- function(id) {
  ns <- shiny::NS(id)
  
  htmltools::tagList(
    DT::DTOutput(ns("table"))
  )
}

#' DT Table Module Server
#'
#' @param id Module namespace ID
#' @param data Reactive data frame
#' @param filename Export filename base
#' @param caption Table caption
#' @param selection Row selection mode
#' @param actions Include action buttons column
#'
#' @return Reactive selected rows
#' @export
mod_datatable_server <- function(
  id,
  data,
  filename = "data",
  caption = NULL,
  selection = "none",
  actions = FALSE
) {
  shiny::moduleServer(id, function(input, output, session) {
    ns <- session$ns
    
    table_data <- shiny::reactive({
      shiny::req(data())
      dat <- data()
      
      if (actions && nrow(dat) > 0) {
        action_btns <- dt_inline_buttons(seq_len(nrow(dat)))
        dat <- cbind(Actions = action_btns, dat)
      }
      
      dat
    })
    
    output$table <- DT::renderDT({
      shiny::req(table_data())
      
      dat <- table_data()
      escape_col <- if (actions) 1 else NULL
      
      DT::datatable(
        dat,
        rownames = FALSE,
        caption = caption,
        selection = selection,
        class = "stripe row-border compact",
        escape = if (actions) -1 else TRUE,
        extensions = c("Buttons", "Scroller"),
        filter = "top",
        options = list(
          autoWidth = TRUE,
          scrollX = TRUE,
          scrollY = 500,
          dom = "Blfrtip",
          lengthMenu = list(
            c(25, 50, 100, -1),
            c("25", "50", "100", "All")
          ),
          buttons = dt_buttons(dat, filename, escape_col),
          columnDefs = list(
            list(className = "dt-center", targets = "_all")
          )
        )
      )
    })
    
    # return selected rows
    shiny::reactive({
      input$table_rows_selected
    })
  })
}
```

## Usage

```r
# in UI
mod_datatable_ui("my_table")

# in Server
selected <- mod_datatable_server(
  "my_table",
  data = reactive({ mtcars }),
  filename = "mtcars-export",
  caption = "Motor Trend Car Road Tests",
  actions = TRUE
)

# observe button clicks
shiny::observeEvent(input$`my_table-table_cell_clicked`, {
  info <- input$`my_table-table_cell_clicked`
  if (!is.null(info$value) && grepl("edit_btn", info$value)) {
    # handle edit action
  }
})
```

***

## Appendix

*Note created on [[2024-06-23]] and last modified on [[2024-12-13]].*

### See Also

- [[04-RESOURCES/Code/R/_README|R Code Index]]

### Backlinks

```dataview
LIST FROM [[R - Shiny DT Table Helpers]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024

