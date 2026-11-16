# System: Laboratory

**Authoritative rules:** [`../../DarkTowerGameDesign.md`](../../DarkTowerGameDesign.md) §4.5, §8.3.

## Owning files

| File | Role |
|---|---|
| `src/systems/laboratory.ts` | `availableResearch`, `startResearch`, `completeResearch`. Enforces the single-active-research rule via `state.activeResearchId`. |
| `src/model/GameState.ts` | `researchTierUnlocked()` (`GameState.ts:181-183`); **`effectiveStat()` / `effectiveAttack()` / `effectiveDefense()`** (`GameState.ts:195-219`) — see boundary note below. |
| `src/data/config.ts` | `research: ResearchDef[]` (tier, cost, duration, `requires`, `effects: {stat, mode: "add"|"mult", value}`). |
| `src/ui/screens/laboratory/*` | UI entry point. |

## State owned

`GameState.completedResearch: Set<string>` and `activeResearchId: string | null`. No `research`
effect is retroactive — stats are computed fresh from `completedResearch` on every call, so a raid
already captured its squad power at launch time and isn't affected by research completing mid-raid
(design doc §4.5, §8.2).

## Notes for agents

- **Boundary leak, not a bug:** the additive-then-multiplicative combination of research effects on
  Attack/Defense (design doc §8.3) is implemented inside `GameState.effectiveStat()`
  (`GameState.ts:203-219`), not in `laboratory.ts`. If you're changing how research effects
  combine, that's the method to edit even though it lives in `model/`, not `systems/`. Flagged as
  worth relocating in [`../ImprovementPlan.md`](../ImprovementPlan.md); not moved by this task.
- Only one research process may run at a time (`laboratory.ts:17`), independent of Room-upgrade
  construction, which *can* run concurrently (design doc §8.2) — see
  [`WarRoom.md`](WarRoom.md)/[`../../DarkTowerGameDesign.md`](../../DarkTowerGameDesign.md)#8.2 for
  the upgrade-concurrency rule this doesn't share.
