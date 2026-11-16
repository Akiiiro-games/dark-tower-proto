/** Immutable, display-ready contract. No game engine or domain service types. */
export type ItemIcon =
  | Readonly<{ kind: 'emoji'; value: string }>
  | Readonly<{ kind: 'texture'; src: string; alt: string; fallbackEmoji?: string }>;

export interface ItemStackDisplay {
  /** Short visible badge, for example: "× 5". */
  readonly label: string;
  /** Tooltip provided by the adapter, for example: "5 of 10 in stack". */
  readonly tooltip: string;
}

interface SaleControlsDisplay {
  readonly sellLabel: string;
  /** Immediate sale at a discount (e.g. "Instant sale (50%)"). Omit to hide the affordance entirely. */
  readonly instantSellLabel?: string;
  readonly canInstantSell?: boolean;
  readonly instantSellDisabledReason?: string;
}

export interface ReadySaleDisplay extends SaleControlsDisplay {
  readonly status: 'ready';
  readonly canSell: boolean;
  readonly disabledReason?: string;
}

export interface SellingSaleDisplay extends SaleControlsDisplay {
  readonly status: 'selling';
  /** Normalized progress 0..1, provided by the adapter. */
  readonly progress: number;
  /** Short visible timer text rendered OVER the progress track, e.g. "00:19". */
  readonly remainingLabel: string;
}

export type ItemSaleDisplay = ReadySaleDisplay | SellingSaleDisplay;

/** Completed sales are represented by removing this item from the parent collection. */

export interface ItemComponentViewModel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: ItemIcon;
  /** Classification metadata for parent-level tag filters. Never displayed by ItemComponent. */
  readonly tags: readonly string[];
  readonly stack: Readonly<ItemStackDisplay>;
  readonly sale: Readonly<ItemSaleDisplay>;
}

export type ItemComponentAction =
  | Readonly<{ type: 'sellRequested'; itemId: string }>
  | Readonly<{ type: 'instantSellRequested'; itemId: string }>
  | Readonly<{ type: 'cancelSaleRequested'; itemId: string }>;

export type ItemComponentActionHandler = (action: ItemComponentAction) => void;

export interface ItemComponentHandle {
  setModel(model: Readonly<ItemComponentViewModel>): void;
  destroy(): void;
}
