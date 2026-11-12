import { CONFIG } from '../../../data/config';
import type { GameEngine } from '../../../engine/GameEngine';
import { asset } from '../assets';
import type { PayrollAction, PayrollGroupViewModel, PayrollViewModel } from './PayrollViewModel';

const illustration = asset('payroll-treasury.webp');
const RANK_EMOJI = ['🧟', '👹', '🗡️', '🛡️', '👑'];

export function buildPayrollViewModel(engine: GameEngine): PayrollViewModel {
  const state = engine.state;
  const total = state.weeklySalary();
  const groups: PayrollGroupViewModel[] = CONFIG.ranks
    .map(rankDef => {
      const count = state.minions.filter(m => m.rank === rankDef.rank).length;
      return { rankDef, count };
    })
    .filter(g => g.count > 0)
    .map(({ rankDef, count }) => ({
      id: `rank-${rankDef.rank}`,
      label: rankDef.name,
      countLabel: `× ${count}`,
      emoji: RANK_EMOJI[rankDef.rank - 1] ?? '👹',
      salaryText: `${count * rankDef.salaryGoldPerWeek}`,
    }));

  const afterPayment = state.gold - total;
  const canPayAll = state.gold >= total;

  return {
    currentGoldText: `${state.gold}`,
    upkeepText: `${total}`,
    afterPaymentText: `${afterPayment}`,
    afterPaymentTone: afterPayment >= 0 ? 'positive' : 'negative',
    groups,
    status: 'due',
    canPayAll,
    disabledReason: canPayAll ? undefined : 'Not enough gold to pay everyone.',
    illustrationSrc: illustration,
  };
}

export interface PayrollNav {
  close(): void;
}

export function handlePayrollAction(engine: GameEngine, action: PayrollAction, nav: PayrollNav): void {
  switch (action.type) {
    case 'closeRequested':
      nav.close();
      return;
    case 'payAllRequested':
      if (engine.payPayroll()) nav.close();
      return;
  }
}
