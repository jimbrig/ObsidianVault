# Vault Conventions

Use these conventions when creating or refining Web Clipper templates for this vault.

## Paths

Web Clipper output goes under:

```text
04-RESOURCES/WebClips/<Platform-or-Category>
```

Examples:

- `04-RESOURCES/WebClips/GitHub`
- `04-RESOURCES/WebClips/Perplexity`
- `04-RESOURCES/WebClips/YouTube`

Do not use:

- `04-RESOURCES/Integrations/...` - stale carryover from a previous vault.
- `clippings/...` - stale carryover from earlier exported templates.
- `04-RESOURCES/Chats/...` - reserved for manually exported chat transcripts, not Web Clipper output.

## Standard Properties

Prefer this property set unless the content type has a strong reason to differ:

```json
[
  {
    "name": "creation_date",
    "value": "[[{{date|date:\\\"YYYY-MM-DD\\\"}}]]",
    "type": "date"
  },
  {
    "name": "modification_date",
    "value": "[[{{date|date:\\\"YYYY-MM-DD\\\"}}]]",
    "type": "date"
  },
  {
    "name": "title",
    "value": "{{title}}",
    "type": "text"
  },
  {
    "name": "description",
    "value": "{{description}}",
    "type": "text"
  },
  {
    "name": "tags",
    "value": "[\\\"Type/WebClip\\\", \\\"Status/NA\\\", \\\"Topic/{{\\\"the single best-matching topic for this content\\\"}}\\\"]",
    "type": "multitext"
  },
  {
    "name": "aliases",
    "value": "[\\\"{{title}}\\\"]",
    "type": "multitext"
  },
  {
    "name": "source",
    "value": "{{url}}",
    "type": "text"
  },
  {
    "name": "image",
    "value": "{{image}}",
    "type": "text"
  }
]
```

Adjust `title`, `description`, and `image` when Defuddle is not reliable for the site. For chat/SPAs, prefer verified selectors or Interpreter prompt variables.

## Tags

Use the vault's constrained tag vocabulary:

- Status tags: `Status/NA`, `Status/WIP`, `Status/Ongoing`, `Status/Complete`
- Type tags: `Type/WebClip`, `Type/Chat`, `Type/Video`, `Type/Issue`, `Type/List`, `Type/Guide`, `Type/Definition`
- Topic tags: `Topic/<Name>`

For AI-chat clips, use:

```text
Type/WebClip
Type/Chat
Status/NA
Topic tags selected from the managed vault topic list
```

Do not use bare `{{topic}}`; it is not a built-in Web Clipper variable.

Do not let Interpreter invent ad hoc topic tags such as `Topic/GeoParquetR`. Prompt it to choose exact tags from a managed allowlist. Common managed topics include:

- `Topic/R`
- `Topic/Geospatial`
- `Topic/Development`
- `Topic/DataEngineering`
- `Topic/DataScience`
- `Topic/API`
- `Topic/GDAL`
- `Topic/Tools`
- `Topic/AI`
- `Topic/Obsidian`
- `Topic/PKM`
- `Topic/Windows`
- `Topic/PowerShell`
- `Topic/Python`
- `Topic/JavaScript`
- `Topic/Rust`
- `Topic/SQL`
- `Topic/Cloud`
- `Topic/Azure`

For Web Clipper `multitext` tag properties, prefer a prompt that returns the complete JSON array of exact tags, including static `Type/` and `Status/` tags plus selected managed `Topic/` tags.

## Naming

Follow the closest existing template when there is a clear precedent. Otherwise default to:

```text
<Platform> - {{date|date:"YYYY-MM-DD"}} - {{title}}
```

For templates where `{{title}}` is Defuddle-derived and unreliable, derive the property and note name from a verified selector or from an Interpreter prompt. For AI chat templates, prefer an Interpreter-derived concise title over the raw first prompt when the raw prompt is long or not filename-friendly.

## AI Chat Notes

AI chat clips should be curated notes, not raw archives. Use verified selectors to provide Interpreter context, then save synthesized sections that capture the useful outcome of the session.

Recommended sections:

- `## Original Question` - short quoted prompt or user question for provenance.
- `## Synthesis` - polished explanation of the durable insight.
- `## Key Takeaways` - final corrected conclusions only.
- `## Implementation Notes` - practical details, APIs, package names, gotchas.
- `## Corrections And Caveats` - what changed during the conversation and what needs verification.
- `## Reusable Artifacts` - concise snippets, helper patterns, or checklists.
- `## Follow Up` - actionable next steps.

Avoid saving full raw transcripts unless the user explicitly asks for an archive.

## Note Body Sections

Follow the reusable vault template sections where possible:

- Use the source callout pattern from the existing Web Clipper templates.
- Use the table of contents block from existing clipped notes when the body has multiple sections.
- Adapt `05-SYSTEM/Templates/Template-Backmatter.md` for Web Clipper output. Templater expressions such as `<% tp.file.creation_date("YYYY-MM-DD") %>` must be converted to Web Clipper variables such as `{{date|date:"YYYY-MM-DD"}}`.

Recommended Web Clipper backmatter:

```markdown
***

## Appendix

*Note created via [[Obsidian Web Clipper]] on [[{{date|date:"YYYY-MM-DD"}}]] and last modified on [[{{date|date:"YYYY-MM-DD"}}]].*

### See Also

***

(c) Jimmy Briggs <jimmy.briggs@jimbrig.com> | {{date|date:"YYYY"}}
```

## Prior Art

- Use `05-SYSTEM/Templates/WebClipper/github-issue-clipper.json` as the best path precedent.
- Use the settings-only ChatGPT template in `.obsidian/obsidian-web-clipper-settings.json` as a content-shape precedent for AI chat transcripts.
- Treat old `04-RESOURCES/Integrations/...` paths as stale and correct them when touching those templates later.
