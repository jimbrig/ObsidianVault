---
creation_date: 2026-05-21
modification_date: 2026-05-21
author: Jimmy Briggs <jimmy.briggs@jimbrig.com>
description: Tool - Obsidian Web Clipper
tags:
  - Type/Tool
  - Status/WIP
  - Topic/Obsidian
aliases:
  - Obsidian Web Clipper
---

> [!SOURCE]
> [Introduction to Obsidian Web Clipper - Obsidian Help](https://obsidian.md/help/web-clipper)

- [Web Clipper Documentation](https://help.obsidian.md/web-clipper)
- [Variables](https://help.obsidian.md/web-clipper/variables)
- [Filters](https://help.obsidian.md/web-clipper/filters)
- [Logic](https://help.obsidian.md/web-clipper/logic)
- [Templates](https://help.obsidian.md/web-clipper/templates)

## Configuration

I try to keep my extension's [[JavaScript Object Notation (JSON)|JSON]] exported settings synchronized with this vault's [`.obsidian/obsidian-web-clipper-settings.json`](../../.obsidian/obsidian-web-clipper-settings.json) updated.

## JSON Schema

The Obsidian Web Clipper imports templates via JSON files.

## Root Structure

```json
{
	"schemaVersion": "0.1.0",
	"name": "Template Name",
	"behavior": "create",
	"noteContentFormat": "Markdown content here...",
	"properties": [],
	"triggers": [],
	"noteNameFormat": "{{title}}",
	"path": "Inbox/"
}
```

### Fields

*   **`schemaVersion`**: Always "0.1.0".
*   **`name`**: The display name of the template in the Clipper.
*   **`behavior`**: How the note is created.
    *   `create`: Create a new note.
    *   `append-specific`: Append to a specific note (requires `path` to be a full file path).
    *   `append-daily`: Append to the daily note.
*   **`noteContentFormat`**: The body of the note.
    *   Use `\n` for newlines.
    *   Can use all variables (e.g., `{{content}}`, `{{selection}}`).
    *   Supports **template logic** (conditionals, loops, variable assignment)
*   **`noteNameFormat`**: The filename pattern (e.g., `{{date}} - {{title}}`).
*   **`path`**: The location to save the note.
    *   For `create` behavior: The *folder* to save the note in (e.g., `Clippings/` or `Recipes/`).
    *   For `append-specific` behavior: The *full file path* of the note to append to (e.g., `Databases/Recipes.md`).
*   **`triggers`**: Array of strings to automatically select this template.
    *   **URL Patterns**: `["https://www.youtube.com/watch"]` (Simple string or Regex).
    *   **Schema Types**: `["schema:Recipe"]` (Triggers if the page contains this Schema.org type).

## Properties

The `properties` array defines the YAML frontmatter of the note.

```json
"properties": [
    {
        "name": "category",
        "value": "Recipes",
        "type": "text"
    },
    {
        "name": "published",
        "value": "{{published}}",
        "type": "datetime"
    }
]
```

### Property Types

*   **`text`**: Simple text string.
*   **`multitext`**: List of text strings (for tags/aliases).
*   **`number`**: Numeric value.
*   **`checkbox`**: Boolean true/false.
*   **`date`**: Date string (YYYY-MM-DD).
*   **`datetime`**: Date and time string.

### Property Object Structure

*   **`name`**: The key in the YAML frontmatter.
*   **`value`**: The value to populate. Can contain variables and the same **template logic** (conditionals, loops, variable assignment) as `noteContentFormat`; see [logic.md](logic.md).
*   **`type`**: One of the types listed above.

## Template validation

The Clipper template editor checks template syntax. 
Invalid logic in `noteContentFormat` or property `value` fields will be reported in the editor; use valid syntax as described in the [Logic](https://help.obsidian.md/web-clipper/logic) documentation.