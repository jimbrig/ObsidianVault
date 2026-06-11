---
description: Create a new vault note with correct frontmatter, naming, and placement
---

Create a new note in this vault. Title/subject: $1. Additional guidance (type, topics, content hints): $@[2]

1. Read `skill://vault-notes` for the full conventions (frontmatter, tags, naming, placement, body skeleton).
2. Infer the note Type from the request (Definition, Guide, List, Note, Tool, Code, ...) and derive:
   - filename per naming convention (e.g. `Guide - X.md`, `<Full Name> (<ABBR>).md`)
   - destination folder per placement table
   - `Status/WIP` unless content is complete on creation, then `Status/Complete`
3. Search the vault for existing notes on this subject first — if one exists, propose extending it instead of duplicating.
4. Reuse existing `Topic/` tags (search frontmatter for candidates) before inventing new ones.
5. Write the note with full frontmatter, body skeleton, and backmatter. Link related existing notes with wikilinks in the body and `### See Also`.
6. If a relevant `03-AREAS/MOC - *.md` exists, add a link to the new note in the appropriate MOC section.
