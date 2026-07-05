# Web Clipper JSON Schema

Exported templates are JSON objects with this shape:

```json
{
  "schemaVersion": "0.1.0",
  "name": "Template Name",
  "behavior": "create",
  "noteContentFormat": "Markdown body with {{variables}}",
  "properties": [],
  "triggers": [],
  "noteNameFormat": "{{title}}",
  "path": "04-RESOURCES/WebClips/Example"
}
```

## Root Fields

- `schemaVersion`: use `"0.1.0"`.
- `name`: display name in the Web Clipper template list.
- `behavior`: usually `"create"`. Other behaviors include `"append-daily"` and `"append-specific"`.
- `noteContentFormat`: Markdown body, with variables, filters, and template logic.
- `properties`: frontmatter fields.
- `triggers`: URL strings, regex strings, or schema triggers such as `"schema:Recipe"`.
- `noteNameFormat`: filename format.
- `path`: target folder for `create`, full note path for `append-specific`.

## Property Objects

Each property object has:

```json
{
  "name": "source",
  "value": "{{url}}",
  "type": "text"
}
```

Common types:

- `text`
- `multitext`
- `number`
- `checkbox`
- `date`
- `datetime`

For `multitext`, this vault usually uses a stringified array:

```json
"[\\\"Type/WebClip\\\", \\\"Status/NA\\\"]"
```

## Validation Rules

- Keep JSON valid first; escape quotes inside template strings.
- Verify selectors before using them.
- Avoid Defuddle-derived variables for sites where Defuddle fails.
- If adding prompt variables, remember the user must run Interpreter in the Clipper UI before saving.
