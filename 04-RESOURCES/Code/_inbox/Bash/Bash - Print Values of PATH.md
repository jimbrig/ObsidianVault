---
creation_date: 2025-12-23
modification_date: 2025-12-23
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/Bash
  - Status/Complete
aliases:
  - Print Values of PATH
  - Display PATH in Readable Format
publish: true
permalink:
description: "One-liner to print the PATH environment variable in a readable format."
cssclasses:
  - code
---

# Print Values of PATH

```table-of-contents
title: ## Contents 
style: nestedList
minLevel: 1
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE] Sources:
> - *[Print value of $PATH in readable format | Today I Learned](https://til.bhupesh.me/shell/print-value-of-path-readable-format)*

Display the `$PATH` environment variable with each directory on its own line for easier reading.

## Code

### Bash

```bash
echo "${PATH//:/$'\n'}"
```

### Zsh

```bash
# for zsh, omit the $ character
echo "${PATH//:/'\n'}"
```

### Alternative Methods

```bash
# using tr
echo "$PATH" | tr ':' '\n'

# using sed
echo "$PATH" | sed 's/:/\n/g'

# using awk
echo "$PATH" | awk -F: '{for(i=1;i<=NF;i++) print $i}'
```

## Details

The Bash syntax `${PATH//:/$'\n'}`:

- `${variable//pattern/replacement}` - Replace all occurrences
- `::` - Match colon (the PATH separator)
- `$'\n'` - ANSI-C quoting for newline character

Example output:

```
/usr/local/bin
/usr/bin
/bin
/usr/sbin
/sbin
/home/user/.local/bin
```

***

## Appendix

*Note created on [[2025-12-23]] and last modified on [[2025-12-23]].*

### See Also

- [[04-RESOURCES/Code/Bash/_README|Bash Code]]
- [[Linux]]
- [[Windows Subsystem for Linux (WSL)]]

### Backlinks

```dataview
LIST FROM [[Bash - Print Values of PATH]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025




