import type { UpgradeCardViewModel } from '../../components/UpgradeCard/UpgradeCard.types';

/** Display-ready contract, ported from the plain-JS LaboratoryView mock. The shell now owns the
 * back button/title, so this screen renders only its own content (no header). */
export interface LaboratoryRoomStat {
  readonly icon?: string;
  readonly label: string;
  readonly value: string;
}
export type LaboratoryUpgradeViewModel = UpgradeCardViewModel;
export interface LaboratoryResearchViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly durationText: string;
  readonly costText: string;
  readonly actionLabel: string;
  readonly actionEnabled: boolean;
  readonly hint?: string;
  readonly status?: 'locked' | 'completed' | 'ready';
}
export interface LaboratoryActiveProjectViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly progress: number;
  readonly remainingText: string;
  readonly statusText: string;
}
export interface LaboratoryViewModel {
  readonly image: string;
  readonly stats: readonly LaboratoryRoomStat[];
  readonly upgrades: readonly LaboratoryUpgradeViewModel[];
  readonly upgradePageSize?: number;
  readonly activeProject: LaboratoryActiveProjectViewModel | null;
  readonly research: readonly LaboratoryResearchViewModel[];
  readonly toast?: string;
}
export type LaboratoryAction =
  | Readonly<{ type: 'upgradeRequested'; upgradeId: string }>
  | Readonly<{ type: 'startResearchRequested'; researchId: string }>;
export type LaboratoryActionHandler = (action: LaboratoryAction) => void;
export interface LaboratoryViewHandle {
  setModel(model: Readonly<LaboratoryViewModel>): void;
  destroy(): void;
}
