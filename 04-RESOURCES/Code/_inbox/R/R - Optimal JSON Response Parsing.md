---
creation_date: 2026-01-29
modification_date: 2026-01-29
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags: [Type/Code, Status/Complete, Topic/R, Topic/API, Topic/Web]
aliases:
  - Optimal JSON Response Parsing in R
description:
cssclasses:
  - code
---

# R - Optimal JSON Response Parsing

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - [Josiah: "@adamhsparks @cedric@mapstodon…" - Fosstodon](https://fosstodon.org/@josi/113918076058184715)

Perform API response parsing from raw [[JavaScript Object Notation (JSON)|JSON]] in a more performant manner than the typical `httr2::resp_body_json()` which leverages `jsonlite::fromJSON()`.

## Code

```R
require(httr2)
require(yyjsonr)

# format request
req <- httr2::request("https://jsonplaceholder.typicode.com/users")

# send request and get response
resp <- httr2::req_perform(req)

# translate binary to json
resp_json <- httr2::resp_body_raw(resp) |> yyjsonr::read_json_raw()
```

## Notes

- [[yyjsonr]]
- [[jsonify]]

***

## Appendix

*Note created on [[2026-01-29]] and last modified on [[2026-01-29]].*

### See Also

- [[04-RESOURCES/Code/_README|Code Index]]

### Backlinks

```dataview
LIST FROM [[R - Optimal JSON Response Parsing]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2026
