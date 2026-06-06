---
creation_date: 2025-12-23
modification_date: 2025-12-23
author: Jimmy Briggs <jimmy.briggs@noclocks.dev>
tags:
  - Type/Code
  - Topic/Bash
  - Topic/Networking
  - Topic/Email
  - Status/Complete
aliases:
  - Using dig for Email DNS Analysis
  - Email DNS Record Analysis
publish: true
permalink:
description: "Bash script for analyzing email-related DNS records (MX, SPF, DKIM, DMARC)."
cssclasses:
  - code
---

# Using dig for Email DNS Analysis

```table-of-contents
title: ## Contents 
style: nestedList
minLevel: 1
maxLevel: 4
includeLinks: true
```

## Overview

A script to analyze email-related DNS records including MX, SPF, DKIM, and DMARC for a given domain.

## Code

```bash
#!/usr/bin/env bash

# email dns record analysis

DOMAIN="${1:-noclocks.dev}"

log() {
    echo -e "\n\n$1\n\n"
}

log "DNS Records for $DOMAIN"

# mx records
log "MX Record(s):"
dig +short MX "$DOMAIN"

# spf records
log "SPF Record(s):"
dig +short txt "$DOMAIN" | grep -i "spf"

# dkim - google default selector
log "DKIM Keys - Google:"
dig +short txt "google._domainkey.$DOMAIN"

# dkim - common selectors
log "DKIM Keys - Other Common Selectors:"
dig +short txt "s1._domainkey.$DOMAIN"
dig +short txt "s2._domainkey.$DOMAIN"
dig +short txt "k1._domainkey.$DOMAIN"
dig +short txt "k2._domainkey.$DOMAIN"
dig +short txt "selector1._domainkey.$DOMAIN"  # microsoft
dig +short txt "selector2._domainkey.$DOMAIN"  # microsoft

# dmarc policy
log "DMARC Policy:"
dig +short txt "_dmarc.$DOMAIN"

# useful online tools
log "Useful Online Tools:"
echo "https://dmarcian.com/domain-checker/?domain=$DOMAIN"
echo "https://domain-checker.valimail.com/dmarc/$DOMAIN"
echo "https://mxtoolbox.com/SuperTool.aspx?action=mx:$DOMAIN"
```

## Usage

```bash
# analyze default domain
./email-dns-check.sh

# analyze specific domain
./email-dns-check.sh example.com
```

## Details

### Record Types

| Record | Purpose                                         |
| ------ | ----------------------------------------------- |
| MX     | Mail exchanger - where to deliver email         |
| SPF    | Sender Policy Framework - authorized senders    |
| DKIM   | DomainKeys - cryptographic email authentication |
| DMARC  | Domain-based Message Authentication             |

### Common DKIM Selectors

- `google` - Google Workspace
- `selector1`, `selector2` - Microsoft 365
- `s1`, `s2` - Various providers
- `k1`, `k2` - Various providers

***

## Appendix

*Note created on [[2025-12-23]] and last modified on [[2025-12-23]].*

### See Also

- [[Bash - DNS Commands]]
- [[04-RESOURCES/Code/Bash/_README|Bash Code]]
- [[Linux]]
- [[Windows Subsystem for Linux (WSL)]]

### Backlinks

```dataview
LIST FROM [[Bash - Using dig for Email DNS Analysis]] AND -"CHANGELOG"
```

***

(c) [No Clocks, LLC](https://github.com/noclocks) | 2025




