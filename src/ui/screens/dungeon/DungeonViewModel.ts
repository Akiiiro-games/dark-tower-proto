import type { RoomOverviewViewModel } from '../../components/RoomOverviewCard/RoomOverviewCard.types';
import type { UpgradeCardViewModel } from '../../components/UpgradeCard/UpgradeCard.types';
import type { PrisonCellViewModel } from '../../components/PrisonCell/PrisonCell.types';

export interface DungeonViewModel {
  readonly room: Readonly<RoomOverviewViewModel>;
  readonly upgrades: readonly UpgradeCardViewModel[];
  /** Ordered physical cells. Prisoners are assigned automatically by gameplay logic. */
  readonly cells: readonly PrisonCellViewModel[];
  readonly cellsCaption: string;
  readonly countCaption: string;
  readonly emptyMessage: string;
  readonly busy?: boolean;
}
export type DungeonAction =
  | Readonly<{ type: 'upgradeRequested'; upgradeId: string }>;
export type DungeonActionHandler = (action: DungeonAction) => void;
export interface DungeonViewHandle {
  setModel(model: Readonly<DungeonViewModel>): void;
  destroy(): void;
}
