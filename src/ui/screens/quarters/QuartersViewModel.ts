import type { RoomOverviewViewModel } from '../../components/RoomOverviewCard/RoomOverviewCard.types';
import type { UpgradeCardViewModel } from '../../components/UpgradeCard/UpgradeCard.types';
import type { BedSlotViewModel } from '../../components/BedSlot/BedSlot.types';
import type { MinionComponentViewModel } from '../../components/MinionComponent/MinionComponent.types';

export interface QuartersViewModel {
  readonly room: Readonly<RoomOverviewViewModel>;
  readonly upgrades: readonly UpgradeCardViewModel[];
  /** Ordered physical bed slots. No manual assignment is supported. */
  readonly beds: readonly BedSlotViewModel[];
  readonly bedsCaption: string;
  readonly countCaption: string;
  readonly emptyMessage: string;
  /** Not part of the ViewModelsProto mock — brief explicitly asks for a War-Room-style master
   * minion list here. Read-only (no selection/raid-planning behavior). */
  readonly minions: readonly MinionComponentViewModel[];
  readonly minionsCaption: string;
  readonly busy?: boolean;
}
export type QuartersAction =
  | Readonly<{ type: 'upgradeRequested'; upgradeId: string }>;
export type QuartersActionHandler = (action: QuartersAction) => void;
export interface QuartersViewHandle {
  setModel(model: Readonly<QuartersViewModel>): void;
  destroy(): void;
}
