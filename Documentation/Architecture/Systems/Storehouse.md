# System: Storehouse

**Authoritative rules:** [`../../DarkTowerGameDesign.md`](../../DarkTowerGameDesign.md) §4.1, §7.

## Owning files

| File | Role |
|---|---|
| `src/systems/storehouse.ts` | `startNormalSale`, `instantSale`, `completeSale`; stack-value/duration math. |
| `src/systems/economy.ts` | shared `creditGold`/`canAfford`/`spend` used by every system, not Storehouse-specific. |
| `src/model/GameState.ts` | `stacks: ItemStack[]`, `storageSlots()`, `usedSlots()`, `addItems()`, `removeStack()` (`GameState.ts:113-120, 243-264`). |
| `src/data/config.ts` | `items: ItemDef[]` (id, tags, `maxStackSize`, `baseValueGold`); `constants.saleBaseHours`, `saleHoursPerCopy`, `instantSaleFraction`. |
| `src/ui/screens/storehouse/{StorehouseView,StorehouseViewModel,StorehouseAdapter}.ts` | UI entry point. |

## State owned

`GameState.stacks` (one slot per stack, `count` ≤ `item.maxStackSize`) and the `sale` `Process`
subtype (`model/types.ts:62-68`). Storage capacity itself is a *derived* value
(`GameState.storageSlots()`), computed from `CONFIG.startingBalance.storageSlots` plus any
purchased `storageSlots` `UpgradeEffect` — Storehouse doesn't own a capacity field, it owns the
upgrade effects that feed one.

## Notes for agents

- A normal sale reserves/removes the stack **immediately** at `startNormalSale()` and only credits
  gold on completion (`storehouse.ts:19-37`) — mirrors design doc §4.1 exactly; don't "fix" the gap
  between stack removal and payout, it's intentional.
- Selling is the only consumer of `sale_duration_hours = (1 + 0.5·copies) × saleEfficiencyMultiplier`;
  `saleEfficiencyMultiplier()` is a derived `GameState` method reading purchased `saleEfficiency`
  upgrades (`GameState.ts:153-155`), not stored on the sale system itself.
- To add a new sellable item: edit `CONFIG.items` only. No code change needed unless it needs a new
  `UpgradeEffect` type.
