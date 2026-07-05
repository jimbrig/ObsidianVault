---
name: obsidian-webclipper-templates
description: Create importable JSON templates for the Obsidian Web Clipper, aligned with this vault's frontmatter, tag, path, and naming conventions. Use when the user asks to create, adjust, or test a Web Clipper template for a specific site or content type.
disable-model-invocation: true
---

# Obsidian Web Clipper Templates

Use this skill to create or refine importable Obsidian Web Clipper JSON templates for this vault.

## Workflow

1. Identify the target content type, site, and at least one representative URL.
2. Read similar prior templates in `05-SYSTEM/Templates/WebClipper/` before drafting anything new.
3. Read `references/vault-conventions.md` and apply the vault's frontmatter, tag, path, and note naming conventions.
4. Check whether Defuddle can extract the target site. If Defuddle fails or is unverified, do not rely on `{{content}}`, `{{contentHtml}}`, `{{description}}`, or other Defuddle-derived presets for core capture.
5. Verify live page data before using selectors. Use the browser MCP workflow in `references/analysis-workflow.md`; never guess CSS selectors.
6. Draft valid Web Clipper JSON using `references/json-schema.md`, `references/variables.md`, and `references/filters-logic.md`.
7. Use Interpreter prompt variables when AI-derived content is the right tool; see `references/interpreter.md`.
8. Save exported template JSON under `05-SYSTEM/Templates/WebClipper/<slug>-clipper.json`, or refine an existing exported scaffold in place when one exists.
9. Show the final JSON or a concise summary of the important changes and remind the user to import the exported JSON into the Web Clipper extension if they want the live template updated.

## Defaults For This Vault

- Web Clipper outputs belong under `04-RESOURCES/WebClips/<Platform-or-Category>`.
- Do not target `04-RESOURCES/Integrations/...`; that path is stale carryover from a previous vault.
- Do not target `04-RESOURCES/Chats/...`; that folder is reserved for manually exported chats.
- Prefer the standard properties: `creation_date`, `modification_date`, `title`, `description`, `tags`, `aliases`, `source`, and `image` when available.
- For AI chat captures, use `Type/WebClip`, `Type/Chat`, `Status/NA`, and a topic tag derived by Interpreter rather than the non-existent bare `{{topic}}` variable.
- AI chat templates should curate and synthesize the durable insight from the session. Do not save raw transcripts by default; use the transcript DOM as Interpreter context and include only minimal provenance such as the original question and source URL.

## Key References

- Vault conventions: `references/vault-conventions.md`
- Live page and selector analysis: `references/analysis-workflow.md`
- JSON shape: `references/json-schema.md`
- Variables: `references/variables.md`
- Filters and logic: `references/filters-logic.md`
- Interpreter prompt variables: `references/interpreter.md`
