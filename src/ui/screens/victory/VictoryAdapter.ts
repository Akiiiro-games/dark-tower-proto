import { CONFIG } from '../../../data/config';
import type { GameEngine } from '../../../engine/GameEngine';
import { asset } from '../assets';
import type { VictoryAction, VictoryViewModel } from './VictoryViewModel';

const illustration = asset('victory-tower.webp');

/** No engine-recognized victory state exists yet (only `gameOver: "bankruptcy"`), so this is a
 * UI-layer proxy condition over existing state: every World Tier unlocked. */
export function hasWonGame(engine: GameEngine): boolean {
  const state = engine.state;
  return CONFIG.worldTiers.every(t => state.unlockedTiers.has(t.tier));
}

export function buildVictoryViewModel(engine: GameEngine): VictoryViewModel {
  const state = engine.state;
  return {
    title: 'Victory!',
    message: 'Every World Tier has fallen before the Dark Tower. Your reign is absolute — for now.',
    illustrationSrc: illustration,
    stats: [
      { id: 'week', icon: '📅', label: 'Weeks played', value: `${state.week + 1}` },
      { id: 'tower', icon: '🏰', label: 'Tower level', value: `${state.towerLevel()}` },
      { id: 'gold', icon: '🪙', label: 'Gold banked', value: `${state.gold}` },
    ],
    canEnterNextWorld: false,
    nextWorldDisabledReason: 'Coming soon',
    canContinue: true,
  };
}

export interface VictoryNav {
  dismiss(): void;
}

export function handleVictoryAction(action: VictoryAction, nav: VictoryNav): void {
  switch (action.type) {
    case 'continueRequested':
      nav.dismiss();
      return;
    case 'nextWorldRequested':
      return; // Not available in this prototype.
  }
}
