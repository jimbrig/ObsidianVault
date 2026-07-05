---
creation_date: 2026-06-12
modification_date: 2026-06-14T21:38:39-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - cli Package Best Practices
tags:
  - Type/Guide
  - Status/WIP
  - Topic/R
  - Topic/Development
aliases:
  - cli Package Best Practices
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## `{cli}` Package [[Domain-Specific Language (DSL)|DSL]]

The [`{cli}` package](https://github.com/r-lib/cli) is the de-facto standard for building attractive [[Command Line Interface (CLI)|command-line interface]]s in [[MOC - R|R]], acting as a [[Domain-Specific Language (DSL)|domain-specific language (DSL)]] for [[Command Line Interface (CLI)|CLI]] output in the same way the `{tidyverse}` does for data pipelines. 

Rather than fighting with base R `cat()`, `message()`, and manual [[American National Standards Institute (ANSI)|ANSI]] codes, you work with **semantic elements**, i.e. *headings, alerts, lists, rules, code spans*, and let `{cli}` handle all formatting details like terminal width wrapping, color adaptation, and [[Unicode]]/[[American Standard Code for Information Interchange (ASCII)|ASCII]] fallbacks.

```R
cli::cli_alert()
cli::cli_alert_success()
cli::cli_alert_info()
cli::cli_alert_warning()
cli::cli_alert_danger()
```

All text is a `{glue}` template, so `{expr}` is evaluated and interpolated automatically. You never need `paste0()` glue-plumbing in your messages.

## Inline Markup

```R
local({
  cli::cli_ul()
  cli::cli_li("{.emph Emphasized} text")
  cli::cli_li("{.strong Strong} importance")
  cli::cli_li("A piece of code: {.code sum(a) / length(a)}")
  cli::cli_li("A package name: {.pkg cli}")
  cli::cli_li("A function name: {.fn cli_text}")
  cli::cli_li("A keyboard key: press {.kbd ENTER}")
  cli::cli_li("A file name: {.file /usr/bin/env}")
  cli::cli_li("An email address: {.email bugs.bunny@acme.com}")
  cli::cli_li("A URL: {.url https://acme.com}")
  cli::cli_li("An environment variable: {.envvar R_LIBS}")
  cli::cli_li("Some {.field field}")
})
```

```R
  • Emphasized text
  • Strong importance
  • A piece of code: `sum(a) / length(a)`
  • A package name: cli
  • A function name: `cli_text()`
  • A keyboard key: press [ENTER]
  • A file name: /usr/bin/env
  • An email address: bugs.bunny@acme.com
  • A URL: <https://acme.com>
  • An environment variable: `R_LIBS`
  • Some field
```

Some of the lesser known or utilized classes are:

- `{.run ...}`: makes the code in the message **clickable** in [[RStudio]], executing it on click.
- `{.obj_type_friendly ...}`: i.e., `{.obj_type_friendly {mtcars}}` prints the object type as a human-readable string like `"a data frame"`.
- `{.val ...}`:  calls `cli::cli_format()` to tailor value-to-string conversion, which is themeable (see [Theming Section](#Themes))

## Themes

`{cli}` uses a CSS-like theming system where element nodes (tags, ids, classes) receive style declarations as named lists. This is how you brand your package's output and define reusable custom classes.



## `format` & `print`

- Separate `format()` from `print()`, where `format()` produces the character vector and `print()` emits it to the console. This allows other tools to capture the formatted output.
- Use `cli::cli_format_method()` in `format` method
- Use `...` in both signatures to allow for downstream `NextMethod()` calls
- Invisibly return `x` in `print()` so assignments don't re-print.
 
```R
#' @keywords internal
#' @noRd
#' @export
format.gdalg <- function(x, ...) {

  cmd_display <- if (nchar(x$command_line) > 70L) {
    paste0(strtrim(x$command_line, 67), "...")
  } else {
    x$command_line
  }

  cli::cli_format_method({
    cli::cli_rule(left = "{.cls {class(x)[[1]]}}", right = "GDAL Streamed Algorithm (GDALG)")
    cli::cli_ul(
      c(
        "Type: {.strong {x$type}}",
        "GDAL Version: {.field {x$gdal_version}}",
        "Relative Paths: {.field {x$relative_paths_relative_to_this_file}}",
        "Command: {.code {cmd_display}}"
      )
    )
  })

}

#' @keywords internal
#' @noRd
#' @export
print.gdalg <- function(x, ...) {
  cat(format(x, ...), sep = "\n")
  invisible(x)
}
```

## Verbosity

> [!TIP]
> Use positive logic. Check `if (verbose)` not `if (!quiet)`; negative logic is harder to read and error-prone.

One of the most impactful design decisions is **where to control verbosity**. Putting a `verbose = TRUE/FALSE` argument on every function is an anti-pattern; it clutters every call site and makes it hard for downstream packages to control.

Define a central message wrapper that respects a package-level option:

```R
#' @keywords internal
```

> [!TIP]
> The `.frequency = "once"` argument from `rlang::inform()` is a lesser-known gem that emits a message **only once per R session** and are ideal for deprecation warnings and one-time setup hints.






***

## Appendix

*Note created on [[2026-06-12]] and last modified on [[2026-06-12]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026