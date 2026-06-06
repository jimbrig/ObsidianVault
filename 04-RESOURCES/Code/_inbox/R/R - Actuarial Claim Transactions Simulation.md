---
creation_date: 2024-12-13
modification_date: 2024-12-13
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
tags:
  - Type/Code
  - Topic/Development
  - Topic/R
  - Topic/Actuarial
  - Topic/Statistics
  - Status/Complete
aliases:
  - Actuarial Claim Transactions Simulation R Code
  - Claims Simulation
  - Loss Data Generator
description: Function to simulate transactional actuarial claims data for Property Casualty Insurance
cssclasses:
  - code
---

# Actuarial Claim Transactions Simulation

> [!info] Code Properties
> - **Language**: R
> - **Packages**: `tibble`, `dplyr`, `lubridate`, `randomNames`, `checkmate`, `rlang`

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

A function to simulate transactional actuarial claims/loss data for Property Casualty Insurance. Generates realistic claim transaction histories with configurable loss distributions.

## Code

```r
#' Simulate Claims Transactions
#'
#' @description
#' Simulates transactional actuarial claims data for Property Casualty Insurance.
#'
#' @param n_claims Numeric - Number of claims to simulate
#' @param start_date,end_date Character/Date - Experience period boundaries
#' @param seed Numeric - Random seed for reproducibility
#' @param loss_distribution Character - Distribution for losses (see details)
#' @param params List - Parameters for the specified distribution
#' @param status_prob_open Numeric - Probability a claim is open (0 < x < 1)
#' @param cache Boolean - Save output to RDS file
#' @param ... Additional arguments
#'
#' @details
#' Supported Loss Distributions:
#' - Normal: `norm` - Parameters: `mean`, `sd`
#' - Lognormal: `lnorm` - Parameters: `meanlog`, `sdlog`
#' - Gamma: `gamma` - Parameters: `shape`, `rate`, `scale`
#' - LogGamma: `lgamma` - Parameters: `shapelog`, `ratelog`
#' - Pareto: `pareto` - Parameters: `shape`, `scale`
#' - Weibull: `weibull` - Parameters: `shape`, `scale`
#' - Generalized Beta: `genbeta` - Parameters: `shape1`, `shape2`, `shape3`, `rate`, `scale`
#'
#' @return A tibble with simulated claim transactions
#' @export
simulate_claims <- function(
  n_claims = 1000,
  start_date = "2015-01-01",
  end_date = Sys.Date(),
  seed = 12345,
  loss_distribution = "lnorm",
  params = list(mean_log = 7.5, sd_log = 1.5),
  status_prob_open = 0.96,
  cache = FALSE,
  ...
) {
  checkmate::assert(
    checkmate::check_integer(n_claims),
    checkmate::check_date(start_date),
    checkmate::check_date(end_date, upper = Sys.Date()),
    checkmate::check_integer(seed),
    checkmate::check_choice(
      loss_distribution,
      choices = c("normal", "norm", "lognorm", "lnorm", "lognormal",
                  "gamma", "lgamma", "pareto", "weibull", "genbeta"),
      null.ok = TRUE
    ),
    checkmate::check_list(params, c("numeric", "numeric"), any.missing = FALSE)
  )

  stopifnot(
    is.numeric(n_claims) && n_claims > 0,
    class(as.Date(start_date)) == "Date",
    class(as.Date(end_date)) == "Date" && as.Date(end_date) > as.Date(start_date),
    is.numeric(seed),
    is.numeric(status_prob_open),
    status_prob_open > 0 && status_prob_open < 1
  )

  beg_date <- as.Date(start_date)
  end_date <- as.Date(end_date)
  accident_range <- as.numeric(end_date - beg_date)
  set.seed(seed)
  accident_date <- sample(0:accident_range, size = n_claims, replace = TRUE)

  payment_fun <- function(n) stats::rlnorm(n, params$mean_log, params$sd_log)

  claims <- tibble::tibble(
    claim_num = paste0("claim-", seq_len(n_claims)),
    accident_date = beg_date + lubridate::days(accident_date),
    state = sample(c("TX", "CA", "GA", "FL"), size = n_claims, replace = TRUE),
    claimant = randomNames::randomNames(n_claims),
    report_lag = stats::rnbinom(n_claims, 5, .25),
    status = stats::rbinom(n_claims, 1, 0.96),
    payment = payment_fun(n_claims)
  ) |>
    dplyr::mutate(
      report_date = .data$accident_date + .data$report_lag,
      payment = ifelse(.data$status == 0, 0, .data$payment),
      case = .data$payment + stats::runif(.env$n_claims, 0.25, 8.0),
      transaction_date = .data$report_date
    ) |>
    dplyr::arrange(.data$accident_date)

  n_trans <- stats::rnbinom(n_claims, 3, 0.25)
  trans_lag <- lapply(n_trans, function(x) stats::rnbinom(x, 7, 0.1)) |>
    lapply(function(x) if (length(x) == 0) 0 else x)

  for (i in seq_len(n_claims)) {
    trans_lag[[i]] <- tibble::tibble(
      trans_lag = trans_lag[[i]],
      claim_num = paste0("claim-", i)
    )
  }

  trans_tbl <- dplyr::bind_rows(trans_lag) |>
    dplyr::group_by(.data$claim_num) |>
    dplyr::mutate(trans_lag = cumsum(.data$trans_lag)) |>
    dplyr::ungroup()

  zero_claims <- dplyr::filter(claims, .data$status == 0)
  first_trans <- dplyr::filter(claims, .data$status == 1)

  subsequent_trans <- dplyr::left_join(trans_tbl, first_trans, by = "claim_num") |>
    dplyr::filter(!is.na(.data$accident_date))

  n_trans <- nrow(subsequent_trans)

  subsequent_trans <- subsequent_trans |>
    dplyr::mutate(
      payment = payment_fun(.env$n_trans),
      case = pmax(.data$case * stats::rnorm(.env$n_trans, 1.5, 0.1) - .data$payment, 500),
      transaction_date = .data$report_date + .data$trans_lag
    ) |>
    dplyr::select(-"trans_lag")

  trans <- dplyr::bind_rows(zero_claims, first_trans, subsequent_trans) |>
    dplyr::arrange(.data$transaction_date)

  trans$trans_num <- seq_len(nrow(trans))

  trans <- trans |>
    dplyr::arrange(.data$trans_num) |>
    dplyr::group_by(.data$claim_num) |>
    dplyr::mutate(
      final_trans = ifelse(.data$trans_num == max(.data$trans_num), TRUE, FALSE),
      status = ifelse(.data$final_trans, 0, 1),
      case = ifelse(.data$final_trans, 0, .data$case),
      status = ifelse(.data$status == 0, "Closed", "Open"),
      paid = round(cumsum(.data$payment), 0),
      case = round(.data$case, 0),
      payment = round(.data$payment, 0)
    ) |>
    dplyr::select(-"final_trans") |>
    dplyr::arrange(.data$accident_date) |>
    dplyr::ungroup() |>
    dplyr::arrange(.data$claim_num, dplyr::desc(.data$transaction_date))

  if (cache) saveRDS(trans, file = "trans.RDS")

  trans
}
```

## Usage

```r
# simulate 500 claims over 3 years
claims_data <- simulate_claims(
  n_claims = 500,
  start_date = "2020-01-01",
  end_date = "2023-12-31",
  seed = 42,
  loss_distribution = "lnorm",
  params = list(mean_log = 8.0, sd_log = 1.2)
)

# view summary
claims_data |>
  dplyr::group_by(claim_num) |>
  dplyr::summarise(
    total_paid = max(paid),
    n_transactions = dplyr::n(),
    final_status = dplyr::last(status)
  )
```

***

## Appendix

*Note created on [[2024-12-13]] and last modified on [[2024-12-13]].*

### See Also

- [[04-RESOURCES/Code/R/_README|R Code Index]]

### Backlinks

```dataview
LIST FROM [[R - Actuarial Claim Transactions Simulation]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2024
