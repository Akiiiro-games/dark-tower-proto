export interface TagFilterOption {
  readonly id: string;
  readonly title: string;
  readonly icon: string;
  readonly active: boolean;
}
export interface TagFilterBarViewModel {
  readonly options: readonly TagFilterOption[];
}
export interface TagFilterBarHandle { setModel(model: Readonly<TagFilterBarViewModel>): void; destroy(): void; }
