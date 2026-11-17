export interface UpgradeCardViewModel {
  readonly id: string;
  readonly icon: string;
  readonly title: string;
  readonly description?: string;
  readonly progress?: number;
  readonly remainingLabel?: string;
  readonly currentLevel: string;
  readonly nextLevel: string;
  readonly currentEffect: string;
  readonly nextEffect: string;
  /** A display-ready label. Prices and affordability are calculated outside this component. */
  readonly buttonLabel: string;
  readonly canUpgrade: boolean;
  readonly disabledReason?: string;
  readonly statusText?: string;
}
export interface UpgradeCardHandle {
  setModel(model: Readonly<UpgradeCardViewModel>): void;
  destroy(): void;
}
export type UpgradeCardActionHandler = (upgradeId: string) => void;
