---
creation_date: 2026-07-03
modification_date: 2026-07-03T19:18:56-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: R - Async JSON API with plumber2 mirai and S7
tags:
  - Type/Code
  - Status/WIP
  - Topic/R
  - Topic/API
  - Topic/Web
  - Topic/Development
aliases:
  - Async JSON API with plumber2 mirai and S7
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!INFO] R
> **Language**: R
> **Dependencies**: *None*

> [!SOURCE] Sources
> - *Source URL or reference*

**Async JSON API with plumber2 mirai and S7** ...

## Server

```R
# server ----------------------------------------------------------------------------------------------------------

User <- S7::new_class(
  "User",
  properties = list(
    id = S7::class_character,
    name = S7::class_character,
    age = S7::class_integer
  )
)

class_dump_df <- \(object) {
  unclass(object) |>
    attributes() |>
    as.list() |>
    purrr::list_modify(S7_class = purrr::zap()) |>
    as.data.frame()
}

user_cols <- User() |> class_dump_df()
example_user <- User(id = "1", name = "example_user", age = 20L)
example_user_df <- class_dump_df(example_user)
example_user2 <- User(id = "2", name = "example_user2", age = 20L)
example_user2_df <- class_dump_df(example_user2)

file <- tempfile()
con <- DBI::dbConnect(RSQLite::SQLite(), file)
DBI::dbWriteTable(
  con,
  name = "users",
  value = user_cols
)
DBI::dbListTables(con)
DBI::dbGetQuery(con, "SELECT * FROM users", n = 0) |> names()
library(dbplyr)
users_tbl <- dplyr::tbl(con, "users")

# Creating some example data
dplyr::rows_insert(
  users_tbl,
  dbplyr::copy_inline(con, example_user_df),
  conflict = "ignore",
  in_place = TRUE,
  by = "id"
)
DBI::dbGetQuery(con, "SELECT * FROM users")
dplyr::rows_insert(
  users_tbl,
  dbplyr::copy_inline(con, example_user2_df),
  conflict = "ignore",
  in_place = TRUE,
  by = "id"
)

dplyr::tbl(con, "users") |>
  dplyr::collect() |>
  purrr::pmap(function(...) list(...))

DBI::dbDisconnect(con)

mirai::mirai::daemons(5)

mirai::mirai::everywhere(file = file, {
  library(DBI)
  library(dbplyr)
  library(purrr)
  library(uuid)
  library(glue)
  con <<- DBI::dbConnect(RSQLite::SQLite(), file)
})

if (exists("app")) {
  app |> plumber2::api_stop()
}

app <- plumber2::api() |>
  plumber2::api_get(
    "/users",
    serializers = plumber2::get_serializers("unboxedJSON"),
    handler = function(request, response, body) {
      mirai::mirai(
        {
          dplyr::tbl(con, "users") |>
            dplyr::collect() |>
            purrr::pmap(function(...) list(...))
        }
      )
    }
  ) |>
  plumber2::api_post(
    path = "/users",
    parsers = plumber2::get_parsers("json"),
    serializers = plumber2::get_serializers("unboxedJSON"),
    handler = function(request, response, body) {
      mirai::mirai(
        {
          result_list <- tryCatch(
            {
              if ("id" %in% names(body)) {
                return(list(
                  error = TRUE,
                  message = "Don't send an ID."
                ))
              }
              body$id <- uuid::UUIDgenerate()
              user <- rlang::exec(User, !!!body)
              user_df <- class_dump_df(user)
              dplyr::rows_insert(
                dplyr::tbl(con, "users"),
                dbplyr::copy_inline(con, user_df),
                conflict = "ignore",
                in_place = TRUE,
                by = "id"
              )
              updated_user_df <- dplyr::tbl(con, "users") |>
                dplyr::filter(id == body$id) |>
                dplyr::collect()
              if (nrow(updated_user_df) == 0) {
                return(list(
                  error = TRUE,
                  message = "The new user is not found in the database after insertion."
                ))
              }
              updated_user_df |> as.list()
            },
            error = \(e) {
              list(
                error = TRUE,
                message = conditionMessage(e)
              )
            }
          )
          result_list
        },
        User = User,
        class_dump_df = class_dump_df,
        body = body
      )
    }
  ) |>
  plumber2::api_run(showcase = FALSE, block = TRUE)
```

## Client

```R
# Client side code -----

library(httr2)

res <- request("http://127.0.0.1:8080/users") |>
  req_perform() |>
  resp_body_json()
res
# [[1]]
# [[1]]$id
# [1] "1"
# [[1]]$name
# [1] "example_user"
# [[1]]$age
# [1] 20
# [[2]]
# [[2]]$id
# [1] "2"
# [[2]]$name
# [1] "example_user2"
# [[2]]$age
# [1] 20

str(res)
# List of 2
#  $ :List of 3
#   ..$ id  : chr "1"
#   ..$ name: chr "example_user"
#   ..$ age : int 20
#  $ :List of 3
#   ..$ id  : chr "2"
#   ..$ name: chr "example_user2"
#   ..$ age : int 20

dplyr::bind_rows(res)
# # A tibble: 2 × 3
#   id    name            age
#   <chr> <chr>         <int>
# 1 1     example_user     20
# 2 2     example_user2    20

request("http://127.0.0.1:8080/users") |>
  req_body_json(list(
    id = "3",
    name = "Alice",
    age = 30L
  )) |>
  req_perform() |>
  resp_body_json()
# $error
# [1] TRUE
# $message
# [1] "Don't send an ID."

request("http://127.0.0.1:8080/users") |>
  req_body_json(list(
    name = "Alice2",
    age = "20"
  )) |>
  req_perform() |>
  resp_body_json()
# $error
# [1] TRUE
# $message
# [1] "<User> object properties are invalid:\n- @age must be <integer>, not <character>"

request("http://127.0.0.1:8080/users") |>
  req_body_json(list(
    name = "Alice3",
    age = 20L
  )) |>
  req_perform() |>
  resp_body_json()
# $id
# [1] "173c3215-119d-40b7-8731-4925ec397baf"
# $name
# [1] "Alice3"
# $age
# [1] 20

request("http://127.0.0.1:8080/users") |>
  req_perform() |>
  resp_body_json() |>
  dplyr::bind_rows()
# # A tibble: 3 × 3
#   id                                   name            age
#   <chr>                                <chr>         <int>
# 1 1                                    example_user     20
# 2 2                                    example_user2    20
# 3 9ddf91ee-48ed-4d15-8232-d9e61a23db07 Alice3           20

library(httr2)
seq_time <- system.time(
  resps <-
    1:10 |>
    lapply(
      \(x) {
        request("http://127.0.0.1:8080/users") |>
          req_body_json(list(
            name = "Multiple Secuential",
            age = 30L
          )) |>
          req_perform()
      }
    )
) |>
  purrr::pluck("elapsed")

# Parallel
one_request <- request("http://127.0.0.1:8080/users") |>
  req_body_json(list(
    name = "Multiple Paralel",
    age = 30L
  )) |>
  req_throttle(capacity = 100, fill_time_s = 60)
reqs <- rep(list(one_request), 10)
par_time <-
  system.time(resps <- req_perform_parallel(reqs)) |>
  purrr::pluck("elapsed")

# Results
cat(paste0("Sequential: ", round(seq_time, 2), "s\n"))
cat(paste0("Parallel: ", round(par_time, 2), "s\n"))
cat(paste0(
  "Parallel is x",
  round(seq_time / par_time, 2),
  " faster than sequential\n"
))
# Sequential: 2.26s
# Parallel: 0.43s
# Parallel is x5.3 faster than sequential
```

## Notes

***

## Appendix

*Note created on [[2026-07-03]] and last modified on [[2026-07-03]].*

### See Also

- [[MOC - R]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026
