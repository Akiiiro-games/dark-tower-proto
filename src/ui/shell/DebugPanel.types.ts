export interface DebugProcessRow {
  readonly id: string;
  readonly label: string;
  /** 0..1 completion fraction, rendered as a small progress bar next to the label. */
  readonly progress: number;
}
export interface DebugPanelViewModel {
  readonly processes: readonly DebugProcessRow[];
}
export type DebugPanelAction =
  | Readonly<{ type: 'forceComplete'; processId: string }>
  | Readonly<{ type: 'copyState' }>;
export type DebugPanelActionHandler = (action: DebugPanelAction) => void;
export interface DebugPanelHandle {
  setModel(model: Readonly<DebugPanelViewModel>): void;
  destroy(): void;
}
