---
name: Obsidian Clipper Template Skill
overview: Create a project Cursor skill, customized to this vault's conventions, that crafts importable Obsidian Web Clipper JSON templates from a content type + example URL, then use it to generate a Perplexity-chat template as the first test case.
todos:
  - id: skill-md
    content: Write .cursor/skills/obsidian-webclipper-templates/SKILL.md with the customized workflow
    status: completed
  - id: ref-vault-conventions
    content: Write references/vault-conventions.md covering frontmatter, tags, paths, naming
    status: completed
  - id: ref-analysis
    content: Write references/analysis-workflow.md using the browser tool for DOM/selector verification
    status: completed
  - id: ref-schema-vars-filters
    content: Write condensed references/json-schema.md, variables.md, filters-logic.md cheat sheets
    status: completed
  - id: ref-interpreter
    content: Write references/interpreter.md covering prompt variables and this vault's Interpreter setup
    status: completed
  - id: browser-inspect-perplexity
    content: Use the browser tool to open the sample Perplexity URL and identify real selectors
    status: completed
  - id: generate-perplexity-template
    content: Refine the existing 05-SYSTEM/Templates/WebClipper/perplexity-clipper.json scaffold in place using the new skill's workflow
    status: completed
isProject: false
---

# Obsidian Clipper Template Skill

## Background

The referenced [obsidian-clipper-template-creator](https://github.com/GuppyTheCat/obsidian-clipper-template-creator) skill assumes:
- Content schemas live in `Bases/*.base` files (this vault doesn't use `.base` schema files this way; it only has [05-SYSTEM/Templates/Bases/Template-Folder.base](05-SYSTEM/Templates/Bases/Template-Folder.base) as a generic base template).
- `WebFetch` can retrieve raw HTML for CSS-selector analysis. In practice `WebFetch` here returns cleaned Markdown (verified against the sample Perplexity URL), so real selector verification needs the in-IDE browser tool (`cursor-ide-browser` MCP) instead.

Instead, this vault's real conventions come from:
- [AGENTS.md](AGENTS.md) frontmatter/tag rules (`creation_date`, `modification_date`, `author`, `description`, `tags` using `Status/`, `Type/`, `Topic/` scheme, `aliases`).
- [05-SYSTEM/Meta/TYPES.md](05-SYSTEM/Meta/TYPES.md) note-type vocabulary (Web Clips, Web Highlights, YouTube Videos, etc.)
- Existing exported templates in [05-SYSTEM/Templates/WebClipper/](05-SYSTEM/Templates/WebClipper) (`default-clipper.json`, `github-repo-clipper.json`, `github-issue-clipper.json`, `daily-link-clipper.json`).
- Additional in-progress templates only currently living in `.obsidian/obsidian-web-clipper-settings.json` (ChatGPT, YouTube, GitHub Daily) - the **ChatGPT** template is the best existing precedent for an AI-chat-transcript template's *content* structure (turn-based `selectorHtml` + `replace` + `markdown` filter chain), though its `path` (`04-RESOURCES/Integrations/Chats/ChatGPT`) is stale (see path correction below).

**Path correction (per user):** the real target root is `04-RESOURCES/WebClips/` (already used by `github-issue-clipper.json` as `04-RESOURCES/WebClips/GitHub`), not `04-RESOURCES/Integrations/...` - that folder doesn't exist on disk and only appears in `default-clipper.json`, `github-repo-clipper.json` (which instead uses yet another stale path, `clippings/github`), and the settings-only ChatGPT/YouTube templates. `04-RESOURCES/Chats/` is a **separate, distinct** folder reserved for manually exported chat transcripts (not Web Clipper output) and should not be targeted by generated templates. So platform-specific Web Clipper templates (GitHub, ChatGPT, Perplexity, YouTube, etc.) should all save under `04-RESOURCES/WebClips/<Platform>`.

`.obsidian/obsidian-web-clipper-settings.json` will **not** be edited directly - it's live plugin state (contains generated IDs, vault names, and plaintext API keys). The skill will only ever write/output standalone importable JSON template files, which the user imports manually via the Clipper's template editor.

**Interpreter (AI) is already enabled** in this vault's Web Clipper setup (`interpreter_settings.interpreterEnabled: true`, `interpreterAutoRun: false`), with OpenAI, Anthropic, Google Gemini, and Perplexity providers configured. This means [prompt variables](https://help.obsidian.md/web-clipper/interpreter) (`{{"a summary of the page"}}`) are a legitimate, already-in-use tool in this vault - `daily-link-clipper.json` and the settings-only "GitHub (Daily)" template already use them for one-line summaries. The skill should treat prompt variables as a first-class option for deriving content (summaries, extracted structured data) or classifying free-form properties, not just an afterthought.

**Existing gap to account for:** several exported templates set the `Topic/` tag with a bare `{{topic}}` (e.g. `"tags": "[\"Type/WebClip\", \"Status/NA\", \"Topic/{{topic}}\"]"` in `default-clipper.json`), but `topic` is not a real preset/meta/selector variable - it resolves to nothing. The new skill will use a proper **prompt variable** for this instead (e.g. `{{"the single best-matching topic for this content"}}`), and flag this pattern in `references/vault-conventions.md` so future templates don't repeat the mistake.

**Defuddle compatibility matters and must be checked per-site.** Obsidian Web Clipper's preset variables (`{{content}}`, `{{contentHtml}}`, `{{description}}`, and often `{{title}}`/`{{author}}`/`{{image}}`) are derived by [Defuddle](https://github.com/kepano/defuddle), a Readability-style extractor with a registry of site-specific extractors plus a generic heuristic fallback. The user confirmed Defuddle fails to extract anything useful for Perplexity (verified via the `defuddle.md/<url-without-protocol>` debug tool, e.g. `defuddle.md/www.perplexity.ai/search/...`) - unsurprising for a JS-heavy chat SPA with no registered site-specific extractor. This is the same reason the existing **ChatGPT** template already avoids `{{content}}` entirely and builds the note body purely from `{{selectorHtml:...}}` + filters. The skill must therefore treat "does Defuddle work on this site?" as an explicit diagnostic step, not an assumption - and default to selector-based (or prompt-based, since Interpreter uses full page HTML independent of Defuddle) extraction for any chat/SPA-style platform, reserving preset content variables for sites where Defuddle is confirmed to work.

## 1. Create the skill

New project skill at `.cursor/skills/obsidian-webclipper-templates/`:

```
.cursor/skills/obsidian-webclipper-templates/
├── SKILL.md
└── references/
    ├── vault-conventions.md   # replaces bases-workflow.md
    ├── analysis-workflow.md   # adapted for browser-based DOM verification
    ├── json-schema.md
    ├── variables.md
    ├── filters-logic.md
    └── interpreter.md         # prompt variables / AI-derived content
```

`SKILL.md` frontmatter:
```yaml
---
name: obsidian-webclipper-templates
description: Create importable JSON templates for the Obsidian Web Clipper, aligned with this vault's frontmatter, tag, path, and naming conventions. Use when the user asks to create, adjust, or test a Web Clipper template for a specific site or content type.
disable-model-invocation: true
---
```

Workflow encoded in `SKILL.md` (concise, links to references for detail):

1. **Identify intent** - platform/content type (e.g. "Perplexity chat", "recipe site") and a representative sample URL.
2. **Check prior art** - read [05-SYSTEM/Templates/WebClipper/*.json](05-SYSTEM/Templates/WebClipper) for an existing template of a similar shape to reuse structure/behavior/tags from, rather than starting blank.
3. **Consult vault conventions** - `references/vault-conventions.md` for the required frontmatter properties, tag vocabulary (`Type/`, `Status/`, `Topic/`), path conventions (e.g. `04-RESOURCES/Integrations/Chats/<Platform>`), and note-naming patterns.
4. **Check Defuddle compatibility, then verify against the live page** - check whether Defuddle can extract the site's content (via `https://defuddle.md/<url-without-protocol>`, noting it may hit a Cloudflare bot-check; fall back to reasoning about whether the site is a known JS-heavy chat/SPA app). If Defuddle fails or is unverified, avoid `{{content}}`/`{{contentHtml}}`/`{{description}}`/other Defuddle-derived presets and rely on selector or prompt variables instead. Then navigate to the sample URL with the `cursor-ide-browser` MCP tool, take a snapshot / use CDP `Runtime.evaluate`/`DOM` queries to confirm real CSS selectors, Schema.org JSON-LD, and meta tags. Never guess a selector - if it can't be verified, say so and ask for another URL or a DOM excerpt.
5. **Draft the JSON** per `references/json-schema.md`, using `references/filters-logic.md` for filters/conditionals/loops only where they add value, and `references/interpreter.md` when a property or content section is better derived by AI than by a selector (summaries, topic classification, translation, normalizing inconsistent site structures).
6. **Write the file** to `05-SYSTEM/Templates/WebClipper/<slug>-clipper.json` (matching existing naming pattern) and show it as a JSON code block for review/manual import.

`references/vault-conventions.md` will capture (condensed, not a copy of AGENTS.md):
- Standard property block used across templates (`creation_date`/`modification_date` wikilinked to daily notes via `[[{{date|date:\"YYYY-MM-DD\"}}]]`, `publication_date`, `author`, `title`, `description`, `tags` as a literal array string, `aliases`, `source`, `image`).
- Tag vocabulary reminder (`Status/{NA|WIP|Ongoing|Complete}`, `Type/{WebClip|Chat|Video|...}`, `Topic/{Name}`), pointing to [05-SYSTEM/Meta/TYPES.md](05-SYSTEM/Meta/TYPES.md) for the full type list.
- Path table: `04-RESOURCES/WebClips/<Platform-or-Category>` is the canonical root for **anything captured via the Web Clipper** - generic clippings, GitHub, chat platforms (ChatGPT, Perplexity, etc.), YouTube - following the `github-issue-clipper.json` precedent (`04-RESOURCES/WebClips/GitHub`). `04-RESOURCES/Chats/<Platform>` is a **separate** folder for manually exported chats and must not be used by generated templates. `04-RESOURCES/Integrations/...` is stale/to-be-corrected, not a target.
- Note-naming patterns: existing examples vary (`WebClip - {{date|date:\"YYYY-MM-DD\"}} - {{title}}` vs. `{{date}} WEB {{title|safe_name|replace:...}}` in `github-issue-clipper.json`) - the skill should follow whichever pattern the closest prior-art template in `05-SYSTEM/Templates/WebClipper/` uses, defaulting to `<Platform> - {{date|date:\"YYYY-MM-DD\"}} - {{title}}` when there's no closer precedent.
- Pointer to the ChatGPT template in `.obsidian/obsidian-web-clipper-settings.json` as the reference pattern for chat-style clip *content*, and to `github-issue-clipper.json` as the reference pattern for *path*/*naming* conventions.

`references/analysis-workflow.md` will replace WebFetch-based DOM analysis with: (1) Defuddle compatibility check via `defuddle.md/<url-without-protocol>` to decide whether preset content variables are usable at all, then (2) browser_navigate → browser_snapshot / browser_cdp (`DOM.getDocument`, `Runtime.evaluate` with `document.querySelector`) → confirm selector existence and stability before use.

`references/json-schema.md`, `references/variables.md`, `references/filters-logic.md` will be condensed cheat-sheets (schema fields, preset/meta/selector/schema variables, common filters, conditional/loop/set syntax) distilled from the official docs so the skill is usable offline, kept short per skill-authoring conciseness rules.

`references/interpreter.md` will cover: prompt-variable syntax (`{{"prompt"}}`), when to prefer a prompt over a selector (inconsistent structure across sites, summarization, translation, classification), scoping context with `{{selectorHtml:...}}` + HTML-stripping filters to keep prompts fast/cheap, the fact that Interpreter is manual (`interpreterAutoRun: false` - user clicks **interpret**) rather than automatic, and the corrected pattern for topic classification: `{{"the single best-matching topic for this content"}}` in place of the non-existent bare `{{topic}}` variable seen in older templates.

## 2. Test the skill: refine the Perplexity chat template

The user already exported a bare-bones starting scaffold to [05-SYSTEM/Templates/WebClipper/perplexity-clipper.json](05-SYSTEM/Templates/WebClipper/perplexity-clipper.json) (also currently registered live in the Clipper's Settings UI, confirming `path: 04-RESOURCES/WebClips/Perplexity`):

```json
{
	"schemaVersion": "0.1.0",
	"name": "Perplexity",
	"behavior": "create",
	"noteContentFormat": "{{content}}",
	"properties": [
		{ "name": "source", "value": "{{url}}", "type": "text" }
	],
	"triggers": ["https://perplexity.ai/"],
	"noteNameFormat": "{{title}}",
	"path": "04-RESOURCES/WebClips/Perplexity"
}
```

This confirms `name`, `behavior`, and `path` - the skill will **refine this file in place** (not replace it with an unrelated draft) against the sample chat (`https://www.perplexity.ai/search/091225fd-d81a-4a12-afaa-c5da315aeca4`):

1. Treat Defuddle as non-functional for Perplexity (confirmed by the user via `defuddle.md`) - replace the scaffold's `noteContentFormat: "{{content}}"` since it depends on Defuddle and will not work.
2. Open the URL with the browser tool and snapshot the DOM to find real selectors for: question/prompt turn, answer turn(s), any model/author label, code blocks, tables, and attachment indicators.
3. Rebuild `noteContentFormat` from the existing ChatGPT template's pattern (verified `{{selectorHtml:...}}` + filters), adapted to Perplexity's actual DOM, and derive `title` from a selector or prompt variable rather than the Defuddle-backed preset.
4. Expand `properties` from just `source` to the full vault frontmatter set: `creation_date`/`modification_date` (wikilinked), `title`, `description` (via `{{"a 1-2 sentence summary of the question and answer"}}`), `tags` (`[\"Type/WebClip\", \"Type/Chat\", \"Status/NA\", \"Topic/{{\"the single best-matching topic for this content\"}}\"]`, using a prompt variable rather than the broken bare `{{topic}}`), `aliases`, keep `source`, add `image` if available.
5. Verify/tighten `triggers` against the real URL pattern (the scaffold's `https://perplexity.ai/` may not match `www.perplexity.ai/search/...` URLs - confirm during browser verification and adjust, e.g. to `https://www.perplexity.ai/search`).
6. Decide `noteNameFormat`: scaffold currently uses bare `{{title}}`; confirm with the user whether to keep it bare or apply the vault's dated convention (e.g. `Perplexity - {{date|date:\"YYYY-MM-DD\"}} - {{title}}`) before finalizing.
7. Update the file in place and show the diff/final JSON for review. Note that because this template is also live in the Clipper's Settings UI (per screenshot), the user will need to re-import the refined JSON there (via **Import**) for it to take effect in the extension - editing the exported file alone doesn't update the plugin's live state.

## Out of scope (follow-up work, not done now)

- Auditing/fixing the misaligned existing templates (`default-clipper.json`, `github-repo-clipper.json`, `github-issue-clipper.json`, `daily-link-clipper.json`) - the user flagged these need adjustment but asked to start with the skill first. Natural next step once the Perplexity template is validated.
- Editing `.obsidian/obsidian-web-clipper-settings.json` (live plugin state, contains plaintext API keys).
