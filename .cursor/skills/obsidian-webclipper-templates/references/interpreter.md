# Interpreter

Interpreter lets Web Clipper templates use prompt variables:

```text
{{"a 1-2 sentence summary of the page"}}
```

This vault already has Interpreter enabled in Web Clipper settings. It is manual, not automatic: when a template contains prompt variables, the user must click **interpret** in the Clipper UI before adding the note.

## When To Use Prompt Variables

Use prompt variables for:

- Summaries.
- Human-readable titles for chat sessions or pages where the DOM title is just a raw prompt.
- Synthesis-first notes that curate the durable insight from a chat session instead of preserving the transcript verbatim.
- Topic classification.
- Translating or rephrasing content.
- Extracting structured fields from inconsistent pages.
- Normalizing chat transcripts when the DOM is hard to parse.

Prefer selectors or schema variables when the data is consistently present in the page DOM or JSON-LD.

## Vault Patterns

Topic tags should use Interpreter instead of the non-existent bare `{{topic}}` variable, but the prompt must choose from managed vault topics rather than inventing ad hoc tags:

```text
{{"return a JSON array of exact vault tags for this content. Always include Type/WebClip and Status/NA. Then choose Topic tags only from this managed allowlist: Topic/R, Topic/Geospatial, Topic/Development, Topic/DataEngineering, Topic/DataScience, Topic/API, Topic/GDAL, Topic/Tools, Topic/AI, Topic/Obsidian, Topic/PKM. Do not invent new tags. Return only the JSON array, no markdown."}}
```

Descriptions can be prompt-derived when Defuddle is unreliable:

```text
{{"a 1-2 sentence summary of the question and answer"}}
```

Titles can be prompt-derived when the page title or chat heading is too long:

```text
{{"a concise, human-readable title for this chat, 6-10 words, title case, no ending punctuation"}}
```

For filenames, apply a safe-name filter to the prompt result:

```text
{{"a concise, human-readable title for this chat, 6-10 words, title case, no ending punctuation"|safe_name:windows}}
```

For AI chat sessions, prefer synthesis sections over raw transcript sections:

```text
{{"synthesize this chat into a polished vault note. Do not reproduce the transcript verbatim. Focus on durable insight, final corrected conclusions, and practical takeaways. Ignore UI text, source badges, follow-up suggestions, repeated drafts, and superseded assumptions."}}
```

Useful synthesis sections:

- Original Question
- Synthesis
- Key Takeaways
- Implementation Notes
- Corrections And Caveats
- Reusable Artifacts
- Follow Up

For daily links:

```text
- [{{title}}]({{url}}): {{"1-2 sentence summary of the current web page content"}}
```

## Context Scoping

Interpreter uses page context. Smaller context is faster and cheaper.

If the page has a reliable content container, set template `context` to a selector variable such as:

```text
{{selectorHtml:main}}
```

For noisy pages, trim or clean context:

```text
{{selectorHtml:main|remove_html:"nav,footer,button"|strip_attr}}
```

If the target site is a chat/SPA where Defuddle fails, context scoped to the verified transcript container is often better than the full page HTML.

## Privacy And Reliability

- Prompt variables send page context to the selected model provider.
- Prompt output is not available to template conditionals because prompt variables run after template logic.
- Keep prompts short and specific.
- Do not ask a prompt to do what a verified selector can do deterministically.
