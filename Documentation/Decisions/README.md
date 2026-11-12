# Decisions & Playtests — Convention

This is the **Knowledge** level of the documentation hierarchy (see `readme.md` §3): a durable
record of decisions and what was learned from playing the game, kept separate from Project/Systems/
Features docs so those can describe current reality without accumulating historical reasoning.

## Recording a decision

Add an entry to the relevant log file (today there is only
[`prototype-defaults-log.md`](prototype-defaults-log.md); split into more files if one file grows
unwieldy, not before). Each entry is a short block, not a full ADR template — keep it skimmable:

```markdown
### <short title>

- **Context:** what question or gap prompted this (cite a design-doc section if one exists).
- **Decision:** what was actually implemented.
- **Status:** `prototype default` (not binding on the final design) | `adopted` (confirmed for the real game) | `superseded by <link>`.
- **Revisit when:** what would make this worth reopening (e.g. "the design doc resolves §12's
  population-cap question either way").
```

Use `prototype default` for anything filling a gap in `DarkTowerGameDesign.md` §12's Open Design
Decisions list. Use `adopted` only once the design doc itself is updated to match — don't mark
something `adopted` here first and let the design doc lag.

## Recording a playtest finding

There is no `Documentation/Playtests/` folder yet because no playtest has happened. When one does,
create `Documentation/Playtests/<yyyy-mm-dd>-<short-topic>.md` with:

```markdown
# Playtest: <topic> — <date>

- **Who/how many, what build:**
- **What we watched for:**
- **Observations:** (what players actually did, not just what they said)
- **Decisions/follow-ups:** link to a new or updated entry in Decisions, or to a roadmap item.
```

Don't create empty placeholder files for future playtests — add the folder and file together when
the first one actually happens.

## Why this is lightweight on purpose

This project is a solo-developer, AI-agent-assisted Phase 1 prototype (see `readme.md` §1). A full
ADR process would cost more than it returns at this scale; the goal here is just to stop
knowledge — *why* something is the way it is — from existing only in chat history or a developer's
head.
