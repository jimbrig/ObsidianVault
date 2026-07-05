# Variables

Web Clipper variables can be used in note names, note paths, properties, content, and Interpreter context.

## Preset Variables

Common preset variables:

- `{{title}}`
- `{{url}}`
- `{{domain}}`
- `{{date}}`
- `{{time}}`
- `{{published}}`
- `{{author}}`
- `{{description}}`
- `{{content}}`
- `{{contentHtml}}`
- `{{selection}}`
- `{{selectionHtml}}`
- `{{highlights}}`
- `{{image}}`
- `{{site}}`
- `{{words}}`

Many content-oriented presets depend on Defuddle. If Defuddle fails for a site, avoid `{{content}}`, `{{contentHtml}}`, and `{{description}}` for important fields.

## Prompt Variables

Prompt variables use Interpreter:

```text
{{"a 1-2 sentence summary of the page"}}
```

Use prompts for summaries, topic classification, translation, and normalizing inconsistent site structures. See `interpreter.md`.

## Meta Variables

Meta variables read page `<meta>` tags:

```text
{{meta:name:description}}
{{meta:property:og:title}}
{{meta:property:og:image}}
```

## Selector Variables

Selector variables read live DOM elements:

```text
{{selector:h1}}
{{selector:.author}}
{{selector:a.main-link?href}}
{{selectorHtml:main|markdown}}
```

Use `selectorHtml` when preserving nested formatting matters.

If a selector matches multiple elements, it returns an array that can be processed with filters like `first`, `join`, `slice`, or `template`.

## Schema.org Variables

Schema variables read JSON-LD structured data:

```text
{{schema:name}}
{{schema:author.name}}
{{schema:Recipe:recipeIngredient}}
{{schema:Article:datePublished}}
```

Schema triggers can select templates automatically:

```json
"triggers": ["schema:Recipe"]
```
