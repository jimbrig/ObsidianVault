# Analysis Workflow

Use this workflow before writing selector-based Web Clipper templates.

## 1. Check Defuddle Compatibility

Defuddle powers many preset variables, including `{{content}}`, `{{contentHtml}}`, `{{description}}`, and often useful metadata such as `{{title}}`, `{{author}}`, and `{{image}}`.

For a sample URL:

1. Try `https://defuddle.md/<url-without-protocol>`.
2. If the result is a bot check, empty content, or obviously wrong content, treat Defuddle as unverified or failed.
3. If the site is a JS-heavy chat or SPA, assume Defuddle-derived content is risky unless the debug output proves otherwise.

When Defuddle fails or is unverified:

- Do not use `{{content}}` or `{{contentHtml}}` for the main body.
- Avoid `{{description}}` for important summaries.
- Prefer `{{selectorHtml:...}}|markdown` for body extraction.
- Use Interpreter prompt variables for summaries, topics, and normalized derived fields.

## 2. Inspect The Live Page

Use the browser MCP tools, not WebFetch, for real DOM analysis:

1. List browser tabs.
2. Navigate to the representative URL.
3. Lock the tab before longer inspection.
4. Take a snapshot for accessibility structure.
5. Use `browser_cdp` with `Runtime.evaluate` for focused DOM queries.
6. Unlock the tab when done.

Prefer stable selectors in this order:

1. Semantic elements and stable data attributes.
2. ARIA roles and labels.
3. Structural selectors anchored to stable parents.
4. Generated or hashed classes only as a last resort.

## 3. Verify Selectors

Before using a selector in a template, verify:

- It matches the intended elements on the sample URL.
- It returns the expected count.
- It preserves important nested content such as code blocks, tables, citations, and links when used with `selectorHtml`.
- It does not capture navigation/sidebar/tool UI.

Useful `Runtime.evaluate` patterns:

```javascript
Array.from(document.querySelectorAll("main")).map((el) => el.innerText.slice(0, 500))
```

```javascript
Array.from(document.querySelectorAll("article")).map((el) => ({
  text: el.innerText.slice(0, 300),
  html: el.innerHTML.slice(0, 300)
}))
```

```javascript
Array.from(document.querySelectorAll("[data-testid], [data-test], [aria-label]")).map((el) => ({
  tag: el.tagName.toLowerCase(),
  testid: el.getAttribute("data-testid"),
  test: el.getAttribute("data-test"),
  aria: el.getAttribute("aria-label"),
  text: el.innerText?.slice(0, 120)
}))
```

## 4. Decide Extraction Strategy

Use the simplest reliable strategy:

- Defuddle works: `{{content}}` may be acceptable for generic articles.
- Structured metadata exists: use `{{schema:...}}` or `{{meta:...}}`.
- Stable DOM exists: use `{{selector:...}}` and `{{selectorHtml:...}}`.
- Content is inconsistent or semantic interpretation is needed: use Interpreter prompt variables.

For AI chat transcripts, expect selector-based body extraction plus prompt-derived summaries/topics.
