import type { GameEngine } from '../../../engine/GameEngine';
import { asset } from '../assets';
import type { GameOverAction, GameOverViewModel } from './GameOverViewModel';

const illustration = asset('game-over-ruins.webp');

export function buildGameOverViewModel(engine: GameEngine): GameOverViewModel | null {
  const state = engine.state;
  if (state.gameOver !== 'bankruptcy') return null;
  return {
    reasonTitle: 'Bankruptcy',
    message: 'The weekly payroll went unpaid, and your minions abandoned the Dark Tower.',
    illustrationSrc: illustration,
    stats: [
      { id: 'week', icon: '📅', label: 'Weeks survived', value: `${state.week + 1}` },
      { id: 'tower', icon: '🏰', label: 'Tower level', value: `${state.towerLevel()}` },
      { id: 'raids', icon: '⚔️', label: 'Raids launched', value: `${state.raidsLaunched}` },
    ],
    retryAvailable: true,
    mainMenuAvailable: false,
  };
}

export function handleGameOverAction(action: GameOverAction): void {
  switch (action.type) {
    case 'retryRequested':
      // No in-place engine reset exists in this prototype; reloading starts a fresh session.
      window.location.reload();
      return;
    case 'mainMenuRequested':
      return; // No main menu in this prototype.
  }
}
