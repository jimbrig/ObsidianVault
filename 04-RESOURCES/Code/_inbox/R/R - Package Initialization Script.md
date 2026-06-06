---
creation_date: 2025-12-24
modification_date: 2025-12-24
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
description: "Comprehensive R Package Initialization Script with production-grade patterns"
tags:
  - Type/Code
  - Topic/R
  - Status/Complete
aliases:
  - R Package Initialization Script
  - R Package Init Script
  - R Package Setup
---


# R Package Initialization Script

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

This code example showcases my personal, opinionated, typical R package setup routine(s) via a consolidated `pkg_init.R` script. This script is part of a wider approach I take towards R package development and documents the `dev/scripts/pkg_init.R` specific code and features.

> [!NOTE] See Also:
> - [[R Package Development - Advanced Patterns]]
> - [[Guide - R httr2 API Client Package]]
> - [[Guide - R Shiny App Package]]

This script provides a comprehensive template for initializing a production-grade R package with all standard configurations, testing infrastructure, linting, documentation, and GitHub integration.

## Code

```R

#  ------------------------------------------------------------------------
#
# Title : Package Initialization Script
#    By : Jimmy Briggs
#  Date : YYYY-MM-DD
#
#  ------------------------------------------------------------------------

# libraries ---------------------------------------------------------------

require(devtools)
require(usethis)
require(roxygen2)
require(testthat)
require(rmarkdown)
require(knitr)
require(attachment)
require(pak)
require(purrr)
require(lifecycle)
require(rlang)
require(cli)
require(pkgload)
require(pkgbuild)
require(rcmdcheck)
require(fs)

# parameters --------------------------------------------------------------
pkg_name <- "mypackage"
pkg_title <- "My Awesome Package"
pkg_desc <- "Does cool stuff."
pkg_repo_spec <- paste0("noclocks/", pkg_name)

# initialize --------------------------------------------------------------
if (FALSE) {
  usethis::create_package(pkg_name)
  usethis::use_namespace()
  usethis::use_roxygen_md()
  usethis::use_package_doc(open = FALSE)
  usethis::use_import_from("rlang", ".data")
  usethis::use_import_from("rlang", ".env")
  usethis::use_import_from("rlang", "%||%")
}

# setup dev directory -----------------------------------------------------
if (FALSE) {
  usethis::use_directory("dev", ignore = TRUE)
  fs::dir_create("dev/R")
  fs::dir_create("dev/scripts")
  fs::dir_create("dev/check")
  usethis::use_git_ignore(ignores = c("*", "!.gitignore"), directory = "dev/check")
  fs::file_create("dev/scripts/README.md")
  # package check script
  fs::file_create("dev/scripts/pkg_check.R")  
  cat(
    "# Package Check Script",
    "",
    "pkg_path <- here::here()",
    "pkg_check_path <- file.path(pkg_path, 'dev', 'check')",
    "if (dir.exists(pkg_check_path)) fs::dir_delete(pkg_check_path)",
    "dir.create(pkg_check_path, recursive = TRUE, showWarnings = FALSE)",
    "attachment::att_amend_desc()",
    "check <- rcmdcheck::rcmdcheck(path = pkg_path, check_dir = check_path, error_on = 'never', args = c('--no-examples', '--no-tests'))",
    "details <- rcmdcheck_results <- rcmdcheck::check_details(check)",
    "saveRDS(check, file = file.path(check_path, 'rcmdcheck.rds'))",
    "saveRDS(details, file = file.path(check_path, 'check_details.rds'))",
    "check",
    "",
    file = "dev/scripts/pkg_check.R",
    sep = "\n",
    append = FALSE
  )
}

# initialize NAMESPACE and man/ folder
attachment::att_amend_desc()
devtools::document()

# initial check
source("dev/scripts/pkg_check.R")

# description -------------------------------------------------------------
if (FALSE) {
  usethis::use_description(
    fields = list(
      Title = pkg_title,
      Description = pkg_desc,
      Language =  "en-US"
    )
  )

  # authors
  usethis::use_author(
    "Jimmy",
    "Briggs",
    email = "jimmy.briggs@noclocks.dev",
    role = c("aut", "cre"),
    comment = c(ORCID = "0000-0002-7489-8787")
  )
}

# initial docs ------------------------------------------------------------
if (FALSE) {
  usethis::use_readme_md(open = FALSE)
  usethis::use_proprietary_license("No Clocks, LLC")
  usethis::use_vignette("noclocksai")
}

# logo --------------------------------------------------------------------
if (FALSE) {
  logo_url <- "https://raw.githubusercontent.com/jimbrig/noclocksr/refs/heads/main/man/figures/noclocks-logo.png"
  fs::dir_create("man/figures")
  download.file(logo_url, destfile = "man/figures/logo.png", mode = "wb")
  usethis::use_logo("man/figures/logo.png")
}

# git & github ------------------------------------------------------------
if (FALSE) {
  usethis::use_git()
  usethis::use_github(organisation = "noclocks", private = FALSE, visibility = "public")
  usethis::use_github_links(overwrite = TRUE)
  
  # github labels
  gh_labels <- tibble::tribble(
    ~name,      ~description,                                              ~color,
    "feature",  "New feature or request",                                  "0e8a16",
    "release",  "Release related tasks",                                   "fbca04",
    "refactor", "Code change that neither fixes a bug nor adds a feature", "1d76db",
    "tests",    "Adding or updating tests",                                "bfe5bf",
    "data",     "Data related tasks",                                      "5319e7",
    "infra",    "Infrastructure related tasks",                            "f9d0c4",
    "database", "Database Schemas and DDL",                                "c2e0c6",
  )

  usethis::use_github_labels(labels = gh_labels$name, colours = gh_labels$color, descriptions = gh_labels$description, delete_default = FALSE)
}

# testing ----------------------------------------------------------------
if (FALSE) {
  usethis::use_testthat(edition = 3)
  
  # initialize a test file
  usethis::use_test(pkg_name, open = FALSE)

  # initial helper and setup
  file.create("tests/testthat/helpers.R")
  file.create("tests/testthat/setup.R")

  # httptest2
  httptest2::use_httptest2()

  # shinytest2
  shinytest2::use_shinytest2()

  # playwright
  pw::pw_init(getwd())

  # dittodb
  dittodb::use_dittodb()

  # spellcheck
  usethis::use_spell_check()
  cat(
    "if (requireNamespace(\"spelling\", quietly = TRUE)) {",
    "  spelling::spell_check_test(",
    "    vignettes = TRUE,",
    "    error = FALSE,",
    "    skip_on_cran = TRUE",
    "  )",
    "}",
    "",
    file = "tests/spelling.R",
    sep = "\n",
    append = FALSE
  )
  spelling::update_wordlist()

    # code coverage
  usethis::use_coverage(type = "codecov", repo_spec = pkg_repo_spec)
  usethis::use_covr_ignore("dev/")
  usethis::use_covr_ignore("inst/")
  usethis::use_covr_ignore("data-raw/")
  usethis::use_build_ignore("codecov.yml")
  usethis::use_build_ignore(".covrignore")
  usethis::use_build_ignore("~\\$.*", escape = FALSE)
}

# run tests
devtools::test()

# linting -----------------------------------------------------------------
if (FALSE) {
  # air
  usethis::use_air()
  cat(
    "[format]",
    "line-width = 120",
    "indent-width = 2",
    "indent-style = 'space'",
    "line-ending = 'auto'",
    "persistent-line-breaks = true",
    "skip = ['tryCatch', 'tribble', 'if']",
    "",
    file = "air.toml",
    sep = "\n",
    append = FALSE
  )
  
  # lintr
  lintr::use_lintr()
  cat(
    "linters: linters_with_defaults(",
    "    line_length_linter(120),",
    "    commented_code_linter = NULL,",
    "    trailing_blank_lines_linter = NULL",
    "  )",
    "exclusions: list()",
    "encoding: \"UTF-8\"",
    "",
    file = ".lintr",
    sep = "\n",
    append = FALSE
  )
  usethis::use_build_ignore(".lintr")
  lintr::lint_package()
}

# gitignore, gitattributes, editorconfig ----------------------------------
if (FALSE) {
  gitattributes <- c(
    "# Global",
    "# -------------",
    "* text=auto",
    "tests/fixtures/**/* -diff", # Ignore diff for fixtures
    "",
    "# R Files",
    "# -------------",
    "*.{R,Rmd,Rd,Rproj,[Rr]environ,[Rr]profile,[Rr]history} text",
    "",
    "# Binary Files",
    "# -------------",
    "*.{R[Dd]ata,R[Dd][Ss],rda,rdb,rds,Rdx} binary", # R data files
    "*.zip binary", # Zip files
    "*.{pdf,png,jpg,jpeg,gif} binary", # Image files
    "",
    "# Linguist",
    "# -------------",
    ".[Rr]md linguist-detectable",
    "*.{md,markdown,txt} linguist-documentation",
    "docs/** linguist-documentation",
    "vignettes/** linguist-documentation",
    "*.{js,css,scss,less} linguist-vendored",
    "*.{min.js,min.css} linguist-generated",
    ""
  )

  writeLines(gitattributes, ".gitattributes")

  editorconfig <- c(
    "[*]",
    "indent_style = space",
    "indent_size = 2",
    "end_of_line = lf",
    "charset = utf-8",
    "trim_trailing_whitespace = true",
    "insert_final_newline = true",
    "",
    "[*.R]",
    "indent_size = 2",
    "max_line_length = 120",
    "",
    "[*.md]",
    "trim_trailing_whitespace = false",
    "",
    "[*.json]",
    "insert_final_newline = ignore",
    "",
    "[Makefile]",
    "indent_style = tab",
    "",
    "[*.bat]",
    "indent_style = tab"
  )

  writeLines(editorconfig, ".editorconfig")

  gitignore <- c(
    ".Rproj.user"
    ".Rhistory",
    ".Rdata",
    ".DS_Store",
    ".quarto/",
    "*.code-workspace",
    ".Renviron",
    ".Rprofile",
    ".env",
    "config.yml",
    "*temp/",
    "*repomix*",
    ".cursor/"
  )

  writeLines(gitignore, ".gitignore")

  usethis::use_build_ignore(".gitattributes")
  usethis::use_build_ignore(".editorconfig")
  usethis::use_build_ignore(".gitignore")
}

# codemeta ----------------------------------------------------------------
if (FALSE) {
  # codemetar::write_codemeta()
  codemeta::write_codemeta()
  usethis::use_build_ignore("codemeta.json")
}

# news --------------------------------------------------------------------
if (FALSE) {
  usethis::use_news_md()
}

# inst --------------------------------------------------------------------
if (FALSE) {
  c(
    "inst",
    "inst/config",
    "inst/extdata",
    "inst/templates",
    "inst/www",
    "inst/www/images",
    "inst/www/scripts",
    "inst/www/styles"
  ) |>
    purrr::walk(fs::dir_create)
}

# config ------------------------------------------------------------------
if (FALSE) {
  require(noclocksr)
  cfg <- list(
    default = list(
      # define various configurations relevant to package, i.e. database connection
      db = list(
        dbname = "postgres",
        host = "localhost",
        port = 5432,
        user = "postgres",
        password = "postgres",
        uri = "postgresql://postgres:postgres@localhost:5432/postgres"
      )
    )
  )
  noclocksr::cfg_init(cfg = cfg)
  noclocksr::cfg_hooks_init()
  usethis::use_build_ignore("config.yml")
}

# data --------------------------------------------------------------------
if (FALSE) {
  usethis::use_data_raw("internal")
  usethis::use_data_raw("exported")
  fs::dir_create("data-raw/cache")
  fs::dir_create("data-raw/raw")
  fs::dir_create("data-raw/processed")
  fs::dir_create("data-raw/scripts")
  fs::file_create("data-raw/README.md")
}

# vignettes ----------------------------------------------------------------
if (FALSE) {
  usethis::use_vignette(name = "introduction", title = "Introduction")
  fs::file_create("vignettes/compile.R")
  usethis::use_git_ignore(ignores = c("*.html", "*.R"), directory = "vignettes")
}

# github actions -----------------------------------------------------------
if (FALSE) {
  usethis::use_build_ignore(".github/")
  usethis::use_github_action(name = "document", save_as = "roxygen.yml", badge = TRUE)
  usethis::use_github_action(name = "lint", save_as = "lint.yml", badge = TRUE)
  usethis::use_github_action(name = "pr-commands", save_as = "pull-requests.yml", badge = TRUE)
  usethis::use_github_action(name = "style", save_as = "style.yml", badge = TRUE)
  usethis::use_github_action(name = "test-coverage", save_as = "coverage.yml", badge = TRUE)
  usethis::use_github_action(name = "check-standard", save_as = "check.yml", badge = TRUE)
  # changelog
  fs::file_create(".github/workflows/changelog.yml")
  fs::file_create("CHANGELOG.md")
  usethis::use_build_ignore("CHANGELOG.md")
  # pkgdown
  usethis::use_pkgdown_github_pages()
}

# docker ------------------------------------------------------------------
if (FALSE) {
  usethis::use_build_ignore(".dockerignore")
  usethis::use_build_ignore("Dockerfile")
}

# R/ ----------------------------------------------------------------------
if (FALSE) {
  c("aaa", "zzz") |> purrr::walk(usethis::use_r, open = FALSE)
}

# man/fragments -----------------------------------------------------------
if (FALSE) {
  fs::dir_create("man/fragments")
  fs::file_create("man/fragments/README.md")
  fs::file_create("man/fragments/header.Rmd")
  fs::file_create("man/fragments/footer.Rmd")
  fs::file_create("man/fragments/badges.Rmd")
  fs::file_create("man/fragments/installation.Rmd")
}

# refresh -----------------------------------------------------------------
attachment::att_amend_desc()
devtools::document()
devtools::load_all()
devtools::check()
devtools::test()
devtools::install()
devtools::build()
```

## Details

The script is a comprehensive example showcasing all of the various components needing initialization and setup when developing a new,
robust, production-grade R package. 



***

## Appendix

*Note created on [[2025-12-24]] and last modified on [[2025-12-24]].*

### See Also

- [[R - Package Environment and Initialization]]
- [[R - Shared Roxygen2 Parameter Templates]]
- [[R - Argument Validation Check Utilities]]
- [[R Package Development - Advanced Patterns]]
- [[Guide - R httr2 API Client Package]]
- [[Guide - R Shiny App Package]]

### Backlinks

```dataview
LIST FROM [[R - Package Initialization Script]] 
WHERE file.name != "_README" AND file.name != this.file.name AND file.name != "CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025
