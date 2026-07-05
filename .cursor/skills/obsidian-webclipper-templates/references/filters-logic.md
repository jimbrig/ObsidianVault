# Filters And Logic

Use filters to transform variables and template logic to include optional or repeated content.

## Common Filters

Dates:

```text
{{date|date:"YYYY-MM-DD"}}
{{published|date:"YYYY-MM-DD"}}
```

Text:

```text
{{title|safe_name}}
{{title|safe_name:windows}}
{{title|replace:"/":" - "}}
{{title|trim}}
{{title|lower}}
```

Markdown and HTML:

```text
{{selectorHtml:main|markdown}}
{{contentHtml|remove_html:"nav,footer"|markdown}}
{{fullHtml|strip_attr|markdown}}
```

Arrays:

```text
{{selector:.tag|join:", "}}
{{selector:.comment|first}}
{{selector:.comment|slice:1|first}}
{{schema:author[*].name|join:", "}}
```

Formatting:

```text
{{"a summary of the page"|blockquote}}
{{image|image:"cover image"}}
{{url|link:title}}
```

## Fallbacks

Use `??` for missing values:

```text
{{selector:h1|first ?? title ?? "Untitled"}}
```

## Conditionals

```text
{% if author %}
Author: {{author}}
{% endif %}
```

```text
{% if published %}
Published: {{published|date:"YYYY-MM-DD"}}
{% else %}
Published: unknown
{% endif %}
```

## Loops

```text
{% for item in selector:.result %}
- {{item}}
{% endfor %}
```

## Variables

```text
{% set turns = selectorHtml:article %}
{{turns|join:"\n\n"|markdown}}
```

## Guidance

- Prefer simple variables and filters when enough.
- Use logic when optional sections would otherwise leave blank headings.
- For chat transcripts, prefer one robust `selectorHtml` expression over many brittle slices when the DOM allows it.
- Always validate logic in the Web Clipper template editor after import.
