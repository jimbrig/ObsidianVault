---
creation_date: 2026-05-04
modification_date: 2026-06-11T15:50:24-04:00
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: AGENTS.md for the Vault
tags:
  - Type/Meta
  - Status/Ongoing
  - Topic/AI
  - Topic/Meta
  - Topic/Obsidian
aliases:
  - AGENTS.md
  - AGENTS
  - Agents
---

# Vault AGENTS.md


> [!NOTE]
> *This is the vault's [AGENTS.md](https://agents.md/). The purpose is to provide a dedicated, predictable place to provide context and instructions to help agentic assistants.*

```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

This is an [Obsidian Vault](https://obsidian.md) with curated knowledge and interlinked notes.

## Structure

The vault follows a structure similar to [[Projects, Areas, Resources, and Archives (PARA)|PARA]], but opinionated with slight alterations:

- `00-INBOX/`: Quick capture entry point for incoming information and unstructured notes
- `01-SLIPBOX/`: Atomic permanent notes
- `02-JOURNAL/`: Temporal journal notes (daily, weekly, monthly, quarterly, annual)
- `03-AREAS/`: Maps of Content (MOCs) serving as the vault's canonical, global indices
- `04-RESOURCES/`: Typed referential knowledge (code, definitions, lists, guides, etc.)
- `05-SYSTEM/`: Vault "systems", i.e. templates, attachments, etc.
- `99-ARCHIVES/`: Archived or deprecated content.

## Knowledge Flow

## Frontmatter Conventions

All notes should include [[Yet Another Markup Language (YAML)|YAML]] frontmatter with the following core properties:

```yaml
---
creation_date: YYYY-MM-DD
modification_date: YYYY-MM-DD
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: 'Brief description...'
tags:
  - Status/{NA|WIP|Ongoing|Complete}
  - Type/{Note|Definition|Code|Project|MOC|Readme|...}
  - Topic/{TopicName}
aliases:
  - Alias1
  - Alias2
---
```

and additional commonly used properties like the following may be used in certain situations as well:

```yaml

```

## Tag Conventions

Tags in the vault follow a specific, semantic, and constrained vocabulary:

- `Status/`
	- `NA`: Default for scenarios where the status is meant to be filled in by the user manually. Should only be used as a last resort placeholder and revisted.
	- `WIP`: Work in Progress
	- `Ongoing`: Continuously updated
	- `Complete`: Finished
- `Type/`:
	- `MOC`: Maps of Content
	- `Code`: Code
	- `Definition`: Definitions, acronyms, terms, etc.
	- `List`: Curated lists
	- `Guide`: Guides
	- `Quote`: Quotations
	- `Person`: People
	- `Readme`: Readme notes
	- `Note`: Generic notes
	- `Daily`: Daily notes
	- `Weekly`: Weekly notes
	- `Monthly`: Monthly notes
- `Topic/`:

## Templates

## Links

## Naming Conventions

## Content Guidance

## Workflows

## References

