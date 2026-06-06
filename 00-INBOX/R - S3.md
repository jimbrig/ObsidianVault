---
creation_date: 2026-06-06
modification_date: 2026-06-06
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - S3
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/Development
aliases:
  - R - S3
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```


> [!source]
> - [13 S3 | Advanced R](https://adv-r.hadley.nz/s3.html)
> - [10. S3 classes - Deep R Programming](https://deepr.gagolewski.com/chapter/220-s3.html)
> - [10 S3 | Hands-On Programming with R](https://rstudio-education.github.io/hopr/s3.html)
> - [S3 Classes in R: Build a Custom Object System in Under 20 Lines of Code](https://r-statistics.co/S3-Classes-in-R.html#What-are-best-practices-for-production-S3-code)
> - [S3 Method Dispatch: Exactly How R Finds the Right Function for Your Object](https://r-statistics.co/S3-Method-Dispatch-in-R.html)
> - [R OOP Systems Explained: S3, S4, R5, R6, Pick the Right One in 3 Questions](https://r-statistics.co/OOP-in-R.html)
> - [Write Better R Functions: Arguments, Defaults, Scope & When to Vectorise](https://r-statistics.co/R-Functions.html)

## S3 Best Practices

### Constructor Validator Helper

![](https://r-statistics.co/screenshots/S3-Classes-in-R-constructor-pattern.webp)

Use the **[constructor-validator-helper]()** pattern:

```R
# internal constructor, no validation
new_pet <- function(name, species, age) {
  structure(
    list(name = name, species = species, age = age),
    class = "pet"
  )
}

# validator, enforce business logic
validate_pet <- function(x) {
  if (!is.character(x$name) || nchar(x$name) == 0L) {
    cli::cli_abort("{.arg x$name} must be a non-empty string")
  }
  # ...
  invisible(x)
}

# user-facing wrapper
pet <- function(name, species, age) {
  age <- as.numeric(age)
  obj <- new_pet(name, species, age)
  validate_pet(obj)
}
```

> [!TIP]
> **Validate in the user-facing wrapper, not the constructor**
> *The constructor assumes correct input so it stays fast, useful when you're creating objects internally. The helper is the public API where users pass messy input that needs checking.*

### Coercion `as_` Methods

`#TODO`

## Useful S3 Packages

- [r-lib/sloop: S language OOP ⛵️](https://github.com/r-lib/sloop/)
- [r-lib/vctrs: Generic programming with typed R vectors](https://github.com/r-lib/vctrs/)
- [r-lib/scales: Tools for ggplot2 scales](https://github.com/r-lib/scales)

- [tidyverse/blob: A simple S3 class for representing BLOBs](https://github.com/tidyverse/blob)
- [r-lib/bit64: An R package with an S3 Class for Vectors of 64bit Integers](https://github.com/r-lib/bit64)
- [zeileis/distributions3: Probability Distributions as S3 Objects](https://github.com/zeileis/distributions3)
- 
- [jessesadler/debvctrs: Tutorial for building S3 vectors with vctrs](https://github.com/jessesadler/debvctrs)

### Sloop Package

- Use the [sloop](https://github.com/r-lib/sloop/) package to inspect various S3 aspects

- S3 objects behave differently from their underlying base types whenever they get passed to a **generic**. Use `[sloop::ftype()](https://sloop.r-lib.org/reference/ftype.html)` and look for “generic” in the output to determine if a function is generic or not:

```R
sloop::ftype(print)
sloop::ftype(str)
sloop::ftype(format)
sloop::ftype(unclass)
```


***

## Appendix

*Note created on [[2026-06-06]] and last modified on [[2026-06-06]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026


