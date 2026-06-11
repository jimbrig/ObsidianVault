---
description: Create or open today's daily note following vault conventions
---

Create or open today's daily note.

1. Read `skill://vault-notes` for conventions.
2. Read `.obsidian/daily-notes.json` for the configured folder. If its `MM-MMM` segment does not match the current month, flag the stale config to the user and offer to update it to `02-JOURNAL/<YYYY>/<MM-MMM>` for the current month (e.g. `02-JOURNAL/2026/06-June`); place the note in the corrected folder.
3. If the note `<folder>/<YYYY-MM-DD>.md` already exists, show its current Tasks/Top of Mind sections and stop.
4. Otherwise create it by manually expanding `05-SYSTEM/Templates/Template-Daily.md` (NEVER leave `<% %>` placeholders):
   - Frontmatter: `creation_date`/`modification_date` = today, description `Daily note for <Month D, YYYY>`, tags `Type/Daily` + `Status/Ongoing`, aliases `<YYYY-MM-DD>`, `<YYYY-MM-DD> Daily Note`, `<dddd - MMMM Do, YYYY>`.
   - Nav line: `<< [[<yesterday>]] | [[<tomorrow>]] >>` with YYYY-MM-DD dates.
   - H1: `<dddd - MMMM Do, YYYY>` (e.g. `Thursday - June 11th, 2026`).
   - TOC code block, `## Top of Mind` and `## Tasks` sections with their callouts, and the appendix/backmatter from the template.

$ARGUMENTS
