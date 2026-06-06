---
creation_date: 2026-05-31
modification_date: 2026-05-31
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Registry - Browser Extensions
tags:
  - Type/Code
  - Status/Complete
  - Topic/Development
  - Topic/Windows
aliases:
  - Browser Extensions Registry
---

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

TODO: figure out if this is relevant/necessary or not.

```registry
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Edge\Extensions]

[HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Edge\Extensions\{{ExtensionID}}]
"update_url"="https://edge.microsoft.com/extensionwebstorebase/v1/crx"
```


