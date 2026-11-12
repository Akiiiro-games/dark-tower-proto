export interface PayrollButtonViewModel {
  readonly visible: boolean;
}
export type PayrollButtonActionHandler = () => void;
export interface PayrollButtonHandle {
  setModel(model: Readonly<PayrollButtonViewModel>): void;
  destroy(): void;
}
