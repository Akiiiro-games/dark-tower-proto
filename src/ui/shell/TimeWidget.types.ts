export interface TimeWidgetViewModel {
  /** 1..7, Monday=1 .. Sunday=7 */
  readonly day: number;
  readonly week: number;
  readonly hour: number;
  readonly minute: number;
  readonly paused: boolean;
  readonly speed: number;
  readonly expanded: boolean;
}

export type TimeWidgetAction =
  | Readonly<{ type: 'toggleExpanded' }>
  | Readonly<{ type: 'togglePause' }>
  | Readonly<{ type: 'cycleSpeed' }>
  | Readonly<{ type: 'setSpeed'; speed: number }>;

export type TimeWidgetActionHandler = (action: TimeWidgetAction) => void;

export interface TimeWidgetHandle {
  setModel(model: Readonly<TimeWidgetViewModel>): void;
  destroy(): void;
}
