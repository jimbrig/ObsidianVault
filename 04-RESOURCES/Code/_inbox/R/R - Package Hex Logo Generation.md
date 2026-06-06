---
creation_date: 2025-12-24
modification_date: 2025-12-24
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
description: Code for generating hexagonal package stickers using hexSticker package
tags:
  - Type/Code
  - Topic/Development
  - Topic/R
  - Status/Complete
aliases:
  - Generate Package HexSticker R Code
  - R Package Hex Logo
  - hexSticker Tutorial
---


# Package HexSticker Generation

> [!info] Code Properties
> - **Language**: R
> - **Packages**: `hexSticker`, `sysfonts`, `showtext`, `magick`

```table-of-contents
title: ## Contents 
style: nestedList
minLevel: 1
maxLevel: 4
includeLinks: true
debugInConsole: false
```

## Overview

Generate professional hexagonal sticker logos for R packages using the `hexSticker` package with custom fonts, images, and styling.

## Code

### Basic HexSticker Generation

```r
library(sysfonts)
library(showtext)
library(magick)
library(hexSticker)

# add custom Google font
sysfonts::font_add_google("Montserrat", "montserrat")
showtext::showtext_auto()

# preprocess image (optional - adjust brightness/contrast)
magick::image_read("inst/assets/logo-base.png") |>
  magick::image_modulate(brightness = 40) |>
  magick::image_write("inst/assets/logo-processed.png")

# generate hex sticker
hexSticker::sticker(
  # image settings
  subplot = "inst/assets/logo-processed.png",
  s_x = 1,
  s_y = 1,
  s_width = 2,
  s_height = 2,
  
  # package name settings
  package = "mypackage",
  p_size = 20,
  p_y = 0.55,
  p_x = 1,
  p_color = "#d6ccc2",
  p_fontface = "bold",
  p_family = "montserrat",
  
  # hexagon settings
  h_color = "#d6ccc2",
  h_fill = "#1a1a2e",
  h_size = 2,
  
  # output
  filename = "man/figures/hex.png",
  dpi = 300
)
```

### Helper Function

```r
#' Generate Package Hex Sticker
#'
#' @param pkg_name Package name to display
#' @param image_path Path to logo image
#' @param output_path Output file path
#' @param font_family Google font family name
#' @param pkg_color Color for package name
#' @param hex_color Hexagon border color
#' @param hex_fill Hexagon fill color
#' @param image_brightness Brightness adjustment (100 = original)
#'
#' @return Path to generated sticker
#' @export
generate_hex_sticker <- function(
  pkg_name,
  image_path,
  output_path = "man/figures/hex.png",
  font_family = "Montserrat",
  pkg_color = "#ffffff",
  hex_color = "#1e88e5",
  hex_fill = "#0d47a1",
  image_brightness = 100
) {
  # setup font
  sysfonts::font_add_google(font_family, tolower(font_family))
  showtext::showtext_auto()
  
  # process image if brightness adjustment needed
  if (image_brightness != 100) {
    processed_path <- tempfile(fileext = ".png")
    magick::image_read(image_path) |>
      magick::image_modulate(brightness = image_brightness) |>
      magick::image_write(processed_path)
    image_path <- processed_path
  }
  
  # generate sticker
  hexSticker::sticker(
    subplot = image_path,
    s_x = 1, s_y = 1,
    s_width = 1.5, s_height = 1.5,
    package = pkg_name,
    p_size = 18,
    p_y = 1.5,
    p_color = pkg_color,
    p_fontface = "bold",
    p_family = tolower(font_family),
    h_color = hex_color,
    h_fill = hex_fill,
    h_size = 1.5,
    filename = output_path,
    dpi = 300
  )
  
  cli::cli_alert_success("Hex sticker saved to {.path {output_path}}")
  invisible(output_path)
}
```

## Usage

```r
# basic usage
generate_hex_sticker(
  pkg_name = "mypackage",
  image_path = "inst/logo.png",
  output_path = "man/figures/logo.png"
)

# with custom styling
generate_hex_sticker(
  pkg_name = "tidydata",
  image_path = "inst/assets/icon.png",
  font_family = "Fira Sans",
  pkg_color = "#2c3e50",
  hex_color = "#3498db",
  hex_fill = "#ecf0f1",
  image_brightness = 80
)
```

### Adding to Package

Add to `DESCRIPTION`:

```
Suggests:
    hexSticker,
    magick,
    sysfonts,
    showtext
```

Add sticker generation script to `data-raw/hex-sticker.R` for reproducibility.

***

## Appendix

*Note created on [[2025-12-24]] and last modified on [[2025-12-24]].*

### See Also

- [[04-RESOURCES/Code/R/_README|R Code]]

### Backlinks

```dataview
LIST FROM [[R - Package Hex Logo Generation]] 
WHERE file.name != "_README" AND file.name != this.file.name AND file.name != "CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025

