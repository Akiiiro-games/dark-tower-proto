# System: Training Hall

**Authoritative rules:** [`../../DarkTowerGameDesign.md`](../../DarkTowerGameDesign.md) §4.4.

## Owning files

| File | Role |
|---|---|
| `src/systems/trainingHall.ts` | `canTrain`, `startTraining`, `completeTraining`, `availableStations`, `transitionFor`. |
| `src/model/GameState.ts` | `trainingStationCount()`, `isTrainingTransitionUnlocked()` (`GameState.ts:145-147, 185-193`). |
| `src/data/config.ts` | `trainingTransitions: TrainingTransitionDef[]` (cost/duration per 1→2, 2→3, 3→4, 4→5); `UpgradeEffect.trainingUnlock` gates each transition sequentially. |
| `src/ui/screens/training-hall/*` | UI entry point. |

## State owned

No new state class — training occupies a `training` `Process` (`model/types.ts:55-60`) and
directly flips `Minion.rank`/`tired` on completion (`trainingHall.ts:45-53`). Station *capacity* is
derived (`trainingStationCount()`), fed by the `th_station` incremental upgrade
(`src/systems/incrementalUpgrades.ts`), not owned by `trainingHall.ts` itself.

## Notes for agents

- There is deliberately **no training-speed upgrade** (design doc §4.4, confirmed in
  `readme.md`'s defaults list) — only station count and rank-transition unlocks affect training.
  Don't add a speed multiplier without an explicit design decision.
- A trained minion becomes Tired and is picked up by Recovery's `assignBeds()` on the next
  auto-assignment pass (`trainingHall.ts:51` calls `markWaitingIfIdle`) — see
  [`Recovery.md`](Recovery.md).
