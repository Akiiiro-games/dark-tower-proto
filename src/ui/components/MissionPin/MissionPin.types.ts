/** Map coordinates are percentages of the authored world-map canvas, not screen pixels. */
export type MissionVisualState = 'available' | 'inProgress' | 'completed' | 'locked';

export interface MissionPinViewModel {
  readonly id: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly tier: number;
  readonly icon: string;
  readonly difficultyIcons: string;
  readonly rewardIcons: readonly string[];
  readonly state: MissionVisualState;
  /** 0..1; supplied by host, displayed only. */
  readonly raidProgress?: number;
  readonly raidStatusLabel?: string;
  readonly selected?: boolean;
}
export type MissionPinHandle = { setModel(value: Readonly<MissionPinViewModel>): void; destroy(): void };
