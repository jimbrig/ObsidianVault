---
creation_date: 2025-12-28
modification_date: 2025-12-28
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Status/Complete
  - Topic/R
  - Topic/DataEngineering
aliases:
  - Interactive Data Dictionary Wizard GUI with R
description: 'Interactive Data Dictionary Genrator using R'
cssclasses:
  - code
---

# Interactive Data Dictionary Wizard GUI with R

> [!info] Code Properties
> - **Language**: [[04-RESOURCES/Code/R/_README|R]]
> - **Packages**: `shiny`, `miniUI`

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

Description of this code snippet/script/module.

## Code

```R
library(shiny)
library(miniUI)

create_data_dictionary <- function(df, dataset_name = NULL) {

  col_names <- names(df)

  ui <- miniPage(
    gadgetTitleBar("Data Dictionary Creator"),
    miniContentPanel(
      padding = 15,
      scrollable = TRUE,

      # Dataset-level metadata section
      h3("Dataset Metadata"),
      hr(),
      textInput("dataset_title", "Dataset Title:", value = dataset_name %||% ""),
      textInput("dataset_creator", "Creator/Author:", placeholder = "Your Name"),
      textInput("dataset_source", "Source URL:", placeholder = "https://..."),
      textInput("dataset_publisher", "Publisher:", placeholder = "Organization name"),
      textAreaInput("dataset_description", "Dataset Description:",
                    placeholder = "Describe the dataset purpose and contents",
                    rows = 3),
      textInput("dataset_subject", "Subject/Keywords:",
                placeholder = "Comma-separated keywords"),
      textInput("dataset_rights", "Rights/License:",
                placeholder = "e.g., CC-BY-4.0, MIT"),
      selectInput("metadata_standard", "Metadata Standard:",
                  choices = c("Dublin Core" = "dc",
                              "ISO 19115" = "iso",
                              "DataCite" = "datacite",
                              "None" = "none"),
                  selected = "dc"),
      checkboxInput("generate_roxygen", "Generate roxygen2 documentation", TRUE),
      hr(),

      # Column-level metadata section
      h3("Column Metadata"),
      hr(),

      lapply(seq_along(col_names), function(i) {
        col_name <- col_names[i]
        col_type <- class(df[[col_name]])[1]

        tagList(
          h5(strong(paste0("Column ", i, ": ", col_name, " (", col_type, ")"))),
          textInput(
            inputId = paste0("desc_", i),
            label = "Description:",
            placeholder = "Enter column description"
          ),
          textInput(
            inputId = paste0("mapped_", i),
            label = "Mapped Name:",
            value = col_name,
            placeholder = "Enter mapped column name"
          ),
          textInput(
            inputId = paste0("unit_", i),
            label = "Unit/Format:",
            placeholder = "e.g., USD, meters, YYYY-MM-DD"
          ),
          hr()
        )
      })
    )
  )

  server <- function(input, output, session) {

    observeEvent(input$done, {

      # Collect column metadata
      descriptions <- sapply(seq_along(col_names), function(i) {
        input[[paste0("desc_", i)]] %||% ""
      })

      mapped_names <- sapply(seq_along(col_names), function(i) {
        input[[paste0("mapped_", i)]] %||% col_names[i]
      })

      units <- sapply(seq_along(col_names), function(i) {
        input[[paste0("unit_", i)]] %||% ""
      })

      # Create metadata data frame
      column_metadata <- data.frame(
        original_name = col_names,
        mapped_name = mapped_names,
        description = descriptions,
        unit = units,
        data_type = sapply(df, function(x) class(x)[1]),
        stringsAsFactors = FALSE
      )

      # Collect dataset-level metadata
      dataset_metadata <- list(
        title = input$dataset_title %||% "",
        creator = input$dataset_creator %||% "",
        source = input$dataset_source %||% "",
        publisher = input$dataset_publisher %||% "",
        description = input$dataset_description %||% "",
        subject = input$dataset_subject %||% "",
        rights = input$dataset_rights %||% "",
        standard = input$metadata_standard,
        date_created = Sys.Date(),
        n_rows = nrow(df),
        n_cols = ncol(df)
      )

      # Generate roxygen2 documentation if requested
      roxygen_doc <- NULL
      if (input$generate_roxygen) {
        roxygen_doc <- generate_roxygen_skeleton(
          dataset_name = dataset_name %||% "dataset",
          dataset_metadata = dataset_metadata,
          column_metadata = column_metadata
        )
      }

      # Generate standard metadata if requested
      standard_metadata <- NULL
      if (input$metadata_standard != "none") {
        standard_metadata <- generate_standard_metadata(
          standard = input$metadata_standard,
          dataset_metadata = dataset_metadata,
          column_metadata = column_metadata
        )
      }

      result <- list(
        column_metadata = column_metadata,
        dataset_metadata = dataset_metadata,
        roxygen_doc = roxygen_doc,
        standard_metadata = standard_metadata
      )

      stopApp(result)
    })

    observeEvent(input$cancel, {
      stopApp(NULL)
    })
  }

  runGadget(ui, server, viewer = dialogViewer("Data Dictionary", width = 700, height = 900))
}

# Helper: Generate roxygen2 skeleton
generate_roxygen_skeleton <- function(dataset_name, dataset_metadata, column_metadata) {

  # Format column descriptions as definition list
  format_str <- paste(
    "\\describe{",
    paste(sprintf("  \\item{%s}{%s%s}",
                  column_metadata$original_name,
                  column_metadata$description,
                  ifelse(column_metadata$unit != "",
                         paste0(" (", column_metadata$unit, ")"), "")),
          collapse = "\n"),
    "}",
    sep = "\n"
  )

  roxygen <- sprintf(
    "#' %s\n#'\n#' %s\n#'\n#' @format A data frame with %d rows and %d variables:\n%s\n#'\n#' @source %s\n#'\n#' @examples\n#' data(%s)\n#' head(%s)\n\"%s\"",
    dataset_metadata$title,
    dataset_metadata$description,
    dataset_metadata$n_rows,
    dataset_metadata$n_cols,
    format_str,
    dataset_metadata$source,
    dataset_name,
    dataset_name,
    dataset_name
  )

  return(roxygen)
}

# Helper: Generate standard metadata formats
generate_standard_metadata <- function(standard, dataset_metadata, column_metadata) {

  if (standard == "dc") {
    # Dublin Core format
    metadata <- list(
      "dc:title" = dataset_metadata$title,
      "dc:creator" = dataset_metadata$creator,
      "dc:source" = dataset_metadata$source,
      "dc:publisher" = dataset_metadata$publisher,
      "dc:description" = dataset_metadata$description,
      "dc:subject" = dataset_metadata$subject,
      "dc:rights" = dataset_metadata$rights,
      "dc:date" = as.character(dataset_metadata$date_created),
      "dc:type" = "Dataset",
      "dc:format" = "application/r-rds"
    )
  } else if (standard == "iso") {
    # ISO 19115 simplified format
    metadata <- list(
      identificationInfo = list(
        citation = list(
          title = dataset_metadata$title,
          date = dataset_metadata$date_created
        ),
        abstract = dataset_metadata$description,
        purpose = dataset_metadata$subject
      ),
      distributionInfo = list(
        distributor = dataset_metadata$publisher,
        transferOptions = list(
          onLine = dataset_metadata$source
        )
      ),
      contentInfo = list(
        attributes = column_metadata[, c("original_name", "description", "data_type", "unit")]
      )
    )
  } else if (standard == "datacite") {
    # DataCite format
    metadata <- list(
      identifier = list(identifierType = "URL", value = dataset_metadata$source),
      creators = list(list(creatorName = dataset_metadata$creator)),
      titles = list(list(title = dataset_metadata$title)),
      publisher = dataset_metadata$publisher,
      publicationYear = format(dataset_metadata$date_created, "%Y"),
      resourceType = list(resourceTypeGeneral = "Dataset"),
      descriptions = list(list(
        description = dataset_metadata$description,
        descriptionType = "Abstract"
      )),
      rightsList = list(list(rights = dataset_metadata$rights))
    )
  }

  return(metadata)
}
```

## Usage

How to use this code:

```R
create_data_dictionary(mtcars)
```

this, in turn, will launch the interactive GUI to craft the data dictionary:

Dataset Metadata:

![[Pasted image 20251228132245.png]]

Column Metadata:

![[Pasted image 20251228132306.png]]

Example output:

```R
$column_metadata
     original_name      mapped_name      description unit data_type
mpg            mpg miles_per_gallon Miles per Gallon        numeric
cyl            cyl              cyl                         numeric
disp          disp             disp                         numeric
hp              hp               hp                         numeric
drat          drat             drat                         numeric
wt              wt               wt                         numeric
qsec          qsec             qsec                         numeric
vs              vs               vs                         numeric
am              am               am                         numeric
gear          gear             gear                         numeric
carb          carb             carb                         numeric

$dataset_metadata
$dataset_metadata$title
[1] "mtcars"

$dataset_metadata$creator
[1] "Jimmy Briggs <jimmy.briggs@noclocks.dev>"

$dataset_metadata$source
[1] "https://example.com"

$dataset_metadata$publisher
[1] ""

$dataset_metadata$description
[1] "Amazing Cars"

$dataset_metadata$subject
[1] ""

$dataset_metadata$rights
[1] ""

$dataset_metadata$standard
[1] "dc"

$dataset_metadata$date_created
[1] "2025-12-28"

$dataset_metadata$n_rows
[1] 32

$dataset_metadata$n_cols
[1] 11


$roxygen_doc
[1] "#' mtcars\n#'\n#' Amazing Cars\n#'\n#' @format A data frame with 32 rows and 11 variables:\n\\describe{\n  \\item{mpg}{Miles per Gallon}\n  \\item{cyl}{}\n  \\item{disp}{}\n  \\item{hp}{}\n  \\item{drat}{}\n  \\item{wt}{}\n  \\item{qsec}{}\n  \\item{vs}{}\n  \\item{am}{}\n  \\item{gear}{}\n  \\item{carb}{}\n}\n#'\n#' @source https://example.com\n#'\n#' @examples\n#' data(dataset)\n#' head(dataset)\n\"dataset\""

$standard_metadata
$standard_metadata$`dc:title`
[1] "mtcars"

$standard_metadata$`dc:creator`
[1] "Jimmy Briggs <jimmy.briggs@noclocks.dev>"

$standard_metadata$`dc:source`
[1] "https://example.com"

$standard_metadata$`dc:publisher`
[1] ""

$standard_metadata$`dc:description`
[1] "Amazing Cars"

$standard_metadata$`dc:subject`
[1] ""

$standard_metadata$`dc:rights`
[1] ""

$standard_metadata$`dc:date`
[1] "2025-12-28"

$standard_metadata$`dc:type`
[1] "Dataset"

$standard_metadata$`dc:format`
[1] "application/r-rds"
```

## Notes

Additional notes about the code.

***

## Appendix

*Note created on [[2025-12-28]] and last modified on [[2025-12-28]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]

### Backlinks

```dataview
LIST FROM [[R - Interactive Data Dictionary Wizard GUI]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
