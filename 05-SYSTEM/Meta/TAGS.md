---
creation_date: 2026-06-06
modification_date: 2026-06-06
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: 'Vault tags system documentation'
tags:
  - Status/Ongoing
  - Type/Meta  
  - Topic/Obsidian
  - Topic/PKM
aliases:
  - Tags
  - Tag System
  - Tag Conventions
  - Tag Taxonomy
---

# Vault Tag Taxonomy

> [!NOTE]
> *This note defines the tag taxonomy for this [[MOC - Obsidian|Obsidian]] Vault.  
> Tags are organized into three root-level categories: **`#Status/`**, **`#Type/`**, and **`#Topic/`**.*

The tagging system for this vault relies on three foundational root tag categories:

- **`#Status/{Status}`**: Define the note's current state from a set of pre-defined statuses. 
	- Only one status tag per note. 
	- Status tags applied consistently help provide an overview of the state of things and what needs to be processed and reviewed, what is in progress and needs a decision to be made or more work to be done, and what is established as complete and permanent.
	- Defined in the frontmatter. 
- **`#Type/{Type}`**: Define the note's "Type" from a pre-defined, managed set of possible note types. 
	- A note can have multiple types defined when applicable. 
	- Note types are not as rigid as Statuses, but also not as flexible as Topics
	- Current set of types is managed and curated over time as new note types emerge
	- Generally note types are tied to underlying vault template, folder, and file naming convention systems in place. 
	- For example, daily notes are assigned a specific tag of `Type/Daily` are saved in the `02-JOURNAL/**` folder, and have dedicated templates to use for them.
	- Type tags applied consistently help organize the vault by providing separation of concerns and allow easier downstream decisions and systems to know what goes where or where to look for something depending on the type.
	- Defined in the frontmatter.
- **`#Topic/{Topic}`**: Define the note's associated topic(s). 
	- Can be multiple topics as separate `Topic/` tags 
	- When necessary, nested & layered topics can be used as applicable. 
	- It becomes increasingly important to manage and groom the nested tag taxonomy over time consistently.
	- Rich topic tags applied consistently help curate the general content categorization over time in the vault across many domains and should be applied appropriately.
	- Defined in the frontmatter.

## Design Principles  

1. **Flat over nested** - Avoid deep nesting like `Topic/Dev/Lang/R/Framework/Shiny`
2. **Combinable** - Use multiple flat tags: `#Topic/R` + `#Topic/Shiny`
3. **Consistent** - Every note gets Status + Type + Topic tags
4. **Purposeful** - Tags enable filtering and discovery

## Implementation

Tags in Obsidian are defined in the note's [[YAML Ain't Markup Language (YAML)|YAML]] Frontmatter (Metadata) like so:  

```yaml
tags:
  - Status/{Status}
  - Type/{Type}
  - Topic/{Topic}  
```

or alternatively,  

```yaml
tags: [Status/{Status}, Type/{Type}, Topic/{Topic}]
```

For example, this note's frontmatter declares the following tags:

```yaml
tags:
  - Status/Ongoing
  - Type/Meta  
  - Topic/Obsidian
  - Topic/PKM
```

Notes:
- The status is set to "Ongoing", meaning the content in this note is an ongoing area of responsibility that is never "complete" as it must be maintained over time consistently.
- The note type is "Meta" and that is also the name of the folder this note is stored in. "Meta" notes are specifically meant to provide details about how this vault is managed and the systems and practices it incorporates.
- Multiple topic tags are included, #Topic/Obsidian and #Topic/PKM ([[Personal Knowledge Management (PKM)]]) which allows the note to be associated with other notes throughout the vault related to [[MOC - Obsidian|Obsidian]] and [[Personal Knowledge Management (PKM)]].  

## Status Tags

> [!NOTE] Rule:
> Every note gets exactly one Status tag.

The note status tag is an essential piece of metadata describing the current state of the note or its active phase in the generalized note lifecycle.

It should be applied to every note in the vault, and by default new notes should typically use a status tag of `#Status/NA` if the status is more or less unknown initially. This establishes the difference between something truly in progress (i.e. `#Status/WIP`) vs. an unknown or scaffolded/placeholder state (i.e. `#Status/NA`). `#Status/NA` (and all `NA` tags for the other tag types as well) are dealt with during regular reviews.

Currently, the defined possible note status tags are as follows:

| Order | Tag               | Description                                    | Use When                                                                                     |
| ----- | ----------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 0     | `Status/NA`       | Default fallback for initial or unknown states | On creation, or when not wanting to decide what the status should be until a deferred review |
| 1     | `Status/Ongoing`  | Continuously updated, evolving, or managed.    | Living, evolving documents and structural indexes/navigation MOCs, etc.                      |
| 2     | `Status/WIP`      | Works in progress                              | In progress content needing further development or processing.                               |
| 3     | `Status/Complete` | Permanent, evergreen, polished content.        | A note is is a complete state or the content is referenctial only.                           |
| 4     | `Status/Todo`     | Similar to `Status/WIP` and `Status/NA` but more explicit. | Use sparingly. Indicates an actual task that needs to be revisited with a priority beyond this vault. |

## Type Tags

> [!NOTE]
> Type tags provide the "static type system" of the vault's content.

TODO

## Topic Tags

> [!NOTE]
> Topic tags are the fabric of the categorization and coverage across multiple interrelated domains across the vault.

TODO


***

## Appendix

*Note created on [[2026-06-06]] and last modified on [[2026-06-06]].*

### See Also

- [[MOC - Obsidian|Obsidian MOC]]
- [[Personal Knowledge Management (PKM)]]

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | 2026