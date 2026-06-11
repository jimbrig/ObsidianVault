---
name: vault-obsidian-mcp
description: Use when interacting with the live Obsidian app for this vault via the obsidian MCP tools (mcp__obsidian_*) — when to prefer them over direct file tools, periodic notes, heading-targeted patches, search, and troubleshooting Local REST API connection failures.
---

# Obsidian MCP Operations

The `mcp__obsidian_*` tools talk to the **Obsidian Local REST API plugin** over HTTP(S). The vault is also the working directory, so direct file tools (`read`/`write`/`edit`/`search`/`find`) always work on the same notes.

## Connectivity

- Requires the Obsidian desktop app to be **running** with the `obsidian-local-rest-api` plugin enabled.
- Endpoints: HTTPS `127.0.0.1:27124` (self-signed cert), HTTP `127.0.0.1:27123` (insecure server is enabled).
- `Connection refused` / `WinError 10061` → Obsidian is not running. **Fall back to direct file tools immediately** — do not retry in a loop. Tell the user the live-app features (periodic notes, recent changes) need Obsidian open.
- `Error 40101: Authorization required` → API key mismatch. The server is configured in `.omp/mcp.json` (gitignored); the authoritative key lives in `.obsidian/plugins/obsidian-local-rest-api/data.json` (`apiKey`). Sync the key into `.omp/mcp.json`, then have the user run `/mcp reload`.
- Note: `.cursor/mcp.json` also defines this server for Cursor using `envFile`/`${env:…}` syntax that pi does not expand — never rely on it; `.omp/mcp.json` overrides it by provider priority.

## Tool selection

| Task | Prefer | Why |
|---|---|---|
| Read one/many notes | `read` (file tool) | no app dependency, line selectors |
| Create/overwrite note | `write` (file tool) | precise content control |
| Surgical line edits | `edit` (file tool) | anchored, verifiable |
| Append/prepend **under a specific heading** | `mcp__obsidian_patch_content` | heading-targeted; no manual offset math |
| Patch a frontmatter field | `mcp__obsidian_patch_content` (`target_type: frontmatter`) | YAML-safe |
| Full-text search with context | `mcp__obsidian_simple_search` or `search` (file tool) | either works; file `search` works offline |
| Query by tag/glob/metadata | `mcp__obsidian_complex_search` (JsonLogic) | metadata-aware |
| Today's / recent periodic notes | `mcp__obsidian_get_periodic_note`, `mcp__obsidian_get_recent_periodic_notes` | resolves the app's periodic-note config |
| Recently modified notes | `mcp__obsidian_get_recent_changes` | app-tracked mtimes |
| Delete a note | ask user first; `mcp__obsidian_delete_file` needs `confirm: true` | destructive |

## Cautions

- `mcp__obsidian_append_content` creates the file if missing — verify the path first to avoid stray notes.
- All MCP filepaths are **relative to vault root**, same as the working directory.
- After bulk direct-file changes, Obsidian picks them up automatically; no sync step needed (obsidian-git handles versioning separately).
- Notes created outside Obsidian do not run Templater — see `skill://vault-notes` for manual template expansion rules.
