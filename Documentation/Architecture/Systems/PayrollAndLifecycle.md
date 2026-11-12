# System: Payroll & Lifecycle (cross-cutting)

**Authoritative rules:** [`../../DarkTowerGameDesign.md`](../../DarkTowerGameDesign.md) §2 (clock/payday), §2.2 (Payroll popup).

Grouped as one doc because these files are small, have no dedicated UI room of their own (Payroll
is a popup, not a Room), and are the plumbing every other system's timing depends on.

## Owning files

| File | Role |
|---|---|
| `src/systems/payroll.ts` | `payAll()` — pays `weeklySalary()` in full or not at all, clears `paydayPending`. |
| `src/systems/lifecycle.ts` | `nightfall`, `checkDepartures`, `triggerPaydayDue`, `checkBankruptcy` — the four day-boundary hooks (see [`../Features/GameClockAndScheduler.md`](../Features/GameClockAndScheduler.md)). |
| `src/systems/economy.ts` | `canAfford`/`spend`/`creditGold`/`creditCrystals` — shared by every system that spends or earns currency; not payroll-specific. |
| `src/model/GameState.ts` | `weeklySalary()` (`GameState.ts:239-241`); `gold`, `crystals`, `paydayPending`, `paydayDueAtHour`, `paydayAnnouncement`, `gameOver`. |
| `src/data/weeks.json` | Random "Week of…" flavor messages shown on the payday announcement. |
| `src/ui/screens/payroll/*` | Payroll popup UI. |

## State owned

`gold`/`crystals` (shared currency), `paydayPending`/`paydayDueAtHour`/`paydayAnnouncement` (payday
state machine), `gameOver: "bankruptcy" | null` (terminal state — once set, `checkBankruptcy()`
short-circuits, `lifecycle.ts:37`).

## Notes for agents

- `payAll()` is strictly all-or-nothing (`payroll.ts:5`, matches design doc §2.2 "no partial
  payments") — don't add partial-payment support without an explicit decision.
- `triggerPaydayDue()` force-pauses the game (`lifecycle.ts:32`) until the payday announcement
  popup is dismissed; this is one of only three things in the prototype allowed to auto-pause time
  (the others are the Raid Report and Payroll popups themselves, opened from `App.ts`).
- Bankruptcy is permanent: nothing in the codebase clears `gameOver` once set. Design doc §9.2
  confirms this is intended ("the simulation stops permanently").
