import type { MinionPortrait } from '../MinionComponent/MinionComponent.types';

/** One physical training station, read-only. All labels and eligibility come from the adapter. */
export interface TrainingOccupantViewModel {
  readonly minionId: string;
  readonly name: string;
  readonly portrait: MinionPortrait;
  readonly rank: number;
  readonly nextRank: number;
  readonly rankLabel: string;
  readonly nextRankLabel: string;
  readonly timeRemainingLabel: string;
  readonly timeRemainingTooltip?: string;
  readonly progress: number; // caller-calculated 0..1
  readonly conditionBadges?: readonly { readonly id: string; readonly label: string; readonly icon: string }[];
}
export interface TrainingStationViewModel {
  readonly id: string;
  readonly label: string;
  readonly artworkSrc: string;
  readonly artworkAlt: string;
  /** Empty stations may still be unavailable for assignment. */
  readonly canAssign: boolean;
  readonly disabledReason?: string;
  readonly occupant?: Readonly<TrainingOccupantViewModel>;
}
export interface TrainingStationHandle {
  setModel(model: Readonly<TrainingStationViewModel>): void;
  destroy(): void;
}
export type TrainingStationAction = Readonly<{ type: 'stationSelected'; stationId: string }>;
