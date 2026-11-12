/** Shared presentation of a single item or stack; selling and loot selection live in parents. */
export type ItemIcon =
  | Readonly<{kind: 'emoji'; value: string}>
  | Readonly<{kind: 'texture'; src: string; alt: string; fallbackEmoji?: string}>;
export interface ItemTileViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: ItemIcon;
  readonly stack?: Readonly<{label: string; tooltip: string}>;
}
export interface ItemTileHandle {setModel(model: Readonly<ItemTileViewModel>): void; destroy(): void}
