---
name: vault-notes
description: Use when creating, editing, moving, or normalizing notes in this Obsidian vault — frontmatter contract, tag vocabulary (Status/Type/Topic), file naming, folder placement, body skeleton, backmatter, wikilink style, and Templater handling. Not needed for read-only lookups.
---

# Vault Note Authoring

Conventions for writing notes in this vault (`D:/obsidian/ObsidianVault`). The vault root is the working directory, so `read`/`write`/`edit`/`search` operate on notes directly.

## Folder placement

| Folder | Purpose | Note types |
|---|---|---|
| `00-INBOX/` | Quick capture; unprocessed | anything, triaged later |
| `01-SLIPBOX/` | Atomic permanent notes | `Type/Note` |
| `02-JOURNAL/<YYYY>/<MM-MMM>/` | Periodic notes (e.g. `2026/06-June/`) | `Type/Daily`, `Type/Weekly`, ... |
| `03-AREAS/` | Maps of Content — global indices | `Type/MOC` |
| `04-RESOURCES/Definitions/` | Terms, acronyms | `Type/Definition` |
| `04-RESOURCES/Guides/` | How-to guides | `Type/Guide` |
| `04-RESOURCES/Lists/` | Curated lists | `Type/List` |
| `04-RESOURCES/Tools/` | Tool notes | `Type/Tool` |
| `04-RESOURCES/Code/<Language>/` | Code snippets/reference | `Type/Code` |
| `05-SYSTEM/Templates/` | Templater templates | meta only — do not add content notes |
| `99-ARCHIVES/` | Deprecated content | unchanged tags + archived status |

## File naming

- MOCs: `MOC - <Topic>.md` (e.g. `MOC - Geospatial.md`)
- Guides: `Guide - <Subject>.md`; Lists: `List - <Subject>.md`; Tools: `Tool - <Name>.md`
- Definitions: `<Full Name> (<ABBR>).md` (e.g. `FlatGeoBuf (FGB).md`) — abbreviation goes in `aliases`
- Daily notes: `<YYYY-MM-DD>.md`
- Templates: `Template-<Name>.md`
- People: `Person - <Full Name>.md`

## Frontmatter contract

Every note gets YAML frontmatter exactly in this shape:

```yaml
---
creation_date: YYYY-MM-DD
modification_date: YYYY-MM-DD
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: 'Short description'
tags:
  - Type/<Type>
  - Status/<Status>
  - Topic/<Topic>
aliases:
  - <Alias>
---
```

- `modification_date` is auto-managed by the `frontmatter-modified-date` plugin; set it equal to `creation_date` on new notes.
- `description` single-quoted, brief.
- At least one alias (typically the title, or the abbreviation for definitions).

## Tag vocabulary

Authoritative source: `05-SYSTEM/Meta/TAGS.md`.

- **`Status/`** — exactly one per note: `NA` (default/unknown — placeholder, revisited at review), `WIP`, `Ongoing` (living docs, MOCs), `Complete` (evergreen/referential), `Todo` (sparingly).
- **`Type/`** — one or more: `Note`, `Definition`, `Code`, `Guide`, `List`, `Quote`, `Person`, `Tool`, `MOC`, `Meta`, `Readme`, `Project`, `Daily`, `Weekly`, `Monthly`. Tied to folder + template + naming systems.
- **`Topic/`** — one or more, **flat over nested**: prefer `Topic/R` + `Topic/Shiny` over `Topic/Dev/Lang/R/Shiny`. Reuse existing topics — check with vault search before minting a new one.

## Body skeleton

Standard content note (after frontmatter):

````markdown
```table-of-contents
title: ## Contents
style: nestedList
minLevel: 2
maxLevel: 4
includeLinks: true
```

## Overview

> [!SOURCE]
> - [Source Name](https://example.com)

<content sections at H2/H3...>

***

## Appendix

*Note created on [[YYYY-MM-DD]] and last modified on [[YYYY-MM-DD]].*

### See Also

- [[Related Note]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | YYYY
````

- TOC block only for notes long enough to need it (3+ H2 sections).
- Cite sources with `> [!SOURCE]` callouts.
- Appendix dates are wikilinks to daily notes.

## Wikilinks

- Link liberally to existing notes: `[[FlatGeoBuf (FGB)|FGB]]`, `[[MOC - R|R]]`.
- Definitions are linked by full filename with display alias: `[[Yet Another Markup Language (YAML)|YAML]]`.
- Dates always as `[[YYYY-MM-DD]]`.
- Before linking, verify the target note exists (`find`/vault search); broken links are acceptable only for genuinely planned notes.

## Templater handling — critical

Templates in `05-SYSTEM/Templates/` use Templater syntax (`<% ... %>`), which only executes inside Obsidian. When creating notes via filesystem or REST API:

- **Expand templates manually** — compute dates, titles, nav links yourself.
- **NEVER write `<% ... %>` placeholders into a note.**
- Use the template as the structural spec, not as literal content.
