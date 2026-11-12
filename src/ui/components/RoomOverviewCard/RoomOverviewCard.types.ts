/** Generic room information for the reusable overview card. */
export interface RoomStatViewModel {
  readonly id: string;
  readonly icon: string;
  readonly label: string;
  readonly value: string;
  readonly emphasized?: boolean;
}
export interface RoomOverviewViewModel {
  readonly id: string;
  readonly title: string;
  readonly imageSrc: string;
  readonly imageAlt: string;
  readonly stats: readonly RoomStatViewModel[];
}
export interface RoomOverviewHandle {
  setModel(model: Readonly<RoomOverviewViewModel>): void;
  destroy(): void;
}
