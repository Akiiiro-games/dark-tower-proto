import { CONFIG } from "../data/config";
import type { GameState } from "../model/GameState";
import type { SaleProcess } from "../model/types";
import { creditGold } from "./economy";

function itemDef(itemId: string) {
    return CONFIG.items.find(i => i.id === itemId)!;
}

export function fullStackValue(itemId: string, count: number): number {
    return itemDef(itemId).baseValueGold * count;
}

export function instantSaleValue(goldValue: number): number {
    return Math.floor(goldValue * CONFIG.constants.instantSaleFraction);
}

function normalSaleDurationHours(count: number, state: GameState): number {
    const base = CONFIG.constants.saleBaseHours + CONFIG.constants.saleHoursPerCopy * count;
    return base * state.saleEfficiencyMultiplier();
}

export function startNormalSale(state: GameState, stackId: string, now: number): boolean {
    const stack = state.stacks.find(s => s.id === stackId);
    if (!stack) return false;
    const goldValue = fullStackValue(stack.itemId, stack.count);
    const duration = normalSaleDurationHours(stack.count, state);
    state.removeStack(stackId);
    state.processes.push({
        id: state.genId("sale"),
        type: "sale",
        startHour: now,
        endHour: now + duration,
        stackId,
        itemId: stack.itemId,
        count: stack.count,
        goldValue,
    });
    state.log(`Selling a stack of ${stack.count} ${itemDef(stack.itemId).name} — ready in ${duration.toFixed(1)}h.`);
    return true;
}

export function instantSale(state: GameState, stackId: string): boolean {
    const sale = findPendingSale(state, stackId);
    const stack = sale ?? state.stacks.find(s => s.id === stackId);
    if (!stack) return false;
    const payout = instantSaleValue(fullStackValue(stack.itemId, stack.count));
    if (sale) state.processes = state.processes.filter(process => process !== sale);
    else state.removeStack(stackId);
    creditGold(state, payout);
    state.log(`Instantly sold ${stack.count} ${itemDef(stack.itemId).name} for ${payout} gold.`);
    return true;
}

function findPendingSale(state: GameState, stackId: string): SaleProcess | undefined {
    return state.processes.find(
        (process): process is SaleProcess => process.type === "sale" && process.stackId === stackId,
    );
}

export function cancelNormalSale(state: GameState, stackId: string): boolean {
    const sale = findPendingSale(state, stackId);
    if (!sale) return false;
    state.stacks.push({ id: sale.stackId, itemId: sale.itemId, count: sale.count });
    state.processes = state.processes.filter(process => process !== sale);
    state.log(`Sale canceled: returned a stack of ${sale.count} ${itemDef(sale.itemId).name} to storage.`);
    return true;
}

export function completeSale(state: GameState, process: SaleProcess): void {
    creditGold(state, process.goldValue);
    state.log(`Sale complete: received ${process.goldValue} gold for ${process.count} ${itemDef(process.itemId).name}.`);
}
