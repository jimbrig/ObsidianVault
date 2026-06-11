---
description: Triage 00-INBOX notes into their proper vault locations
---

Triage the inbox. Optional scope filter: $ARGUMENTS

1. Read `skill://vault-notes` for conventions.
2. List `00-INBOX/` and read each note's frontmatter + a skim of its body (respect the scope filter if given).
3. For each note, determine:
   - proper Type tag and destination folder (placement table in the skill)
   - filename per naming convention (rename if needed)
   - frontmatter gaps: missing/placeholder tags (`Status/NA`), missing description or aliases
   - duplicate/overlap with existing notes (search before moving)
4. Present a triage table (note → destination, rename, tag fixes, or "merge into X" / "leave in inbox — still active capture") and get user confirmation before moving anything.
5. On confirmation: move files, normalize frontmatter, add body skeleton/backmatter where missing, and update relevant `03-AREAS/MOC - *.md` indices with links to relocated notes.
6. Report what moved where and anything left behind with reasons.
