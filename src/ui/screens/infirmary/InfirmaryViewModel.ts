import type { RoomOverviewViewModel } from '../../components/RoomOverviewCard/RoomOverviewCard.types';
import type { UpgradeCardViewModel } from '../../components/UpgradeCard/UpgradeCard.types';
import type { BedSlotViewModel } from '../../components/BedSlot/BedSlot.types';

export interface InfirmaryViewModel {
  readonly room: Readonly<RoomOverviewViewModel>;
  readonly upgrades: readonly UpgradeCardViewModel[];
  /** Ordered physical bed slots. Infirmary assignment is automatic; no manual actions. */
  readonly beds: readonly BedSlotViewModel[];
  readonly bedsCaption: string;
  readonly countCaption: string;
  readonly emptyMessage: string;
  readonly busy?: boolean;
}
export type InfirmaryAction =
  | Readonly<{ type: 'upgradeRequested'; upgradeId: string }>;
export type InfirmaryActionHandler = (action: InfirmaryAction) => void;
export interface InfirmaryViewHandle {
  setModel(model: Readonly<InfirmaryViewModel>): void;
  destroy(): void;
}
