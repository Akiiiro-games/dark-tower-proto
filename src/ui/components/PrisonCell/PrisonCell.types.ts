/** Render-ready input for one reusable Dungeon prison cell. */
export interface PrisonerViewModel {
  readonly id: string;
  readonly name: string;
  readonly portrait: Readonly<
    | { kind: 'texture'; src: string; alt: string; fallbackEmoji?: string }
    | { kind: 'emoji'; value: string }
  >;
  /** The action label is display data, not a workflow enum. */
  readonly processLabel: string;
  readonly remainingLabel: string;
  readonly remainingTooltip?: string;
  /** Completed fraction from 0 to 1, computed by the game adapter. */
  readonly progress: number;
}
export interface PrisonCellViewModel {
  readonly id: string;
  readonly label: string;
  readonly emptyArtSrc: string;
  readonly prisoner?: Readonly<PrisonerViewModel>;
}
export interface PrisonCellHandle {
  setModel(model: Readonly<PrisonCellViewModel>): void;
  destroy(): void;
}
