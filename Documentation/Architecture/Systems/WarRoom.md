# System: War Room (World Map, Raids, Roster)

**Authoritative rules:** [`../../DarkTowerGameDesign.md`](../../DarkTowerGameDesign.md) §4.7, §5.

## Owning files

| File | Role |
|---|---|
| `src/systems/world.ts` | `previewRaid`, `canLaunchRaid`, `launchRaid`, `resolveRaid`, `squadPower`/`unitPower` (provisional combat formulas, design doc §11). |
| `src/systems/raidReport.ts` | Claim-time resolution — see [`../Features/RaidLifecycle.md`](../Features/RaidLifecycle.md), it's documented as a Feature because it spans this system plus Storehouse/Dungeon/Recovery. |
| `src/model/GameState.ts` | `missionState()` (`GameState.ts:267-274`), `unlockedTiers`, `everClaimedMissions`, `everVisitedMissions`, `missionClaimedWeek`, `missionRunningProcess`, `pendingReports`. |
| `src/data/config.ts` | `missions: MissionDef[]`, `worldTiers: WorldTierDef[]`. |
| `src/ui/screens/war-room/*` | UI entry point — the largest Adapter in the codebase (`WarRoomAdapter.ts`, ~265 lines) because it composes map, mission detail, and roster/squad-picker in one screen. |

## State owned

Mission progression is tracked by three independent sets/maps rather than one "mission record"
struct: `unlockedTiers` (tier gating), `everClaimedMissions` (permanent green-checkmark + tier
unlock trigger), `everVisitedMissions` (cosmetic "raided before" flag), `missionClaimedWeek`
(weekly cooldown). `missionState()` derives the five-value `MissionState` enum
(`model/types.ts:108-113`) from these plus `pendingReports`/`missionRunningProcess` on every call —
there's no stored `MissionState` field to go stale.

## Notes for agents

- `previewRaid()`/`canLaunchRaid()` are pure read-only functions the UI calls directly (not through
  `GameEngine`) to render success/duration estimates before the player commits — see the
  read/write split explained in
  [`../CurrentArchitecture.md`](../CurrentArchitecture.md)#5-ui-shell-screens-components. Only
  `launchRaid()` (called via `engine.launchRaid()`) mutates state.
- Mission map coordinates (`missionPosition()`, `WarRoomAdapter.ts:36-42`) and flavor (location
  art/weather/difficulty icons, `screens/shared.ts:180-195`) are derived from `CONFIG.missions`
  array order/index at render time, not stored per-mission data. Reordering `CONFIG.missions`
  changes cosmetic layout as a side effect — see
  [`../CurrentArchitecture.md`](../CurrentArchitecture.md)#9-known-implementationdesign-doc-divergences.
- Combat formulas in `world.ts` (`unitPower`, `failureChance`, `injuryChanceFor`) match design doc
  §11 exactly but are explicitly **provisional**, not final balance.
