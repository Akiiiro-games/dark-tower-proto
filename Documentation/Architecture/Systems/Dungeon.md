# System: Dungeon

**Authoritative rules:** [`../../DarkTowerGameDesign.md`](../../DarkTowerGameDesign.md) §4.6; population-cap caveat in §12.

## Owning files

| File | Role |
|---|---|
| `src/systems/dungeon.ts` | `admitPrisoner`, `assignCells` (auto-starts processing on a free cell), `completeDungeonProcess` (rolls recruit/interrogate/death and applies the outcome). |
| `src/systems/recovery.ts` | `markWaitingIfIdle` is reused here when a recruited prisoner joins as a minion. |
| `src/model/GameState.ts` | `dungeonCellCount()` (`GameState.ts:149-151`); `recruitmentEfficiencyBonus()` feeds the outcome roll. |
| `src/data/config.ts` | `constants.dungeonBaseDurationHours`, `dungeonOutcomeBase` (60/15/25 recruit/interrogate/death). |
| `src/ui/screens/dungeon/*` | UI entry point. |

## State owned

`GameState.prisoners: Prisoner[]` and the `dungeon` `Process` subtype. A prisoner occupies a cell
the instant `admitPrisoner()` succeeds; `assignCells()` separately starts the timed processing once
a cell is free — these are two steps because admission (triggered by Claim, per
[`../Features/RaidLifecycle.md`](../Features/RaidLifecycle.md)) and processing-start (triggered by
the scheduler) don't have to happen in the same tick.

## Notes for agents

- **The population cap is a prototype-only rule, not an adopted game-design rule.**
  `completeDungeonProcess()` releases a would-be recruit instead of admitting them once
  `minions.length >= bedCount()` (`dungeon.ts:60-61`). This is explicitly tracked as unresolved in
  `DarkTowerGameDesign.md` §12 and in
  [`../../Decisions/prototype-defaults-log.md`](../../Decisions/prototype-defaults-log.md) — do not
  treat the cap as final-design-approved, and do not remove it without an explicit decision either.
- Outcome probabilities shift with prisoner Rank and the Recruitment Efficiency upgrade bonus
  (`dungeon.ts:37-48`); the exact adjustment curve is explicitly **not** final balance per design
  doc §11/§12 — don't read precision into these constants.
