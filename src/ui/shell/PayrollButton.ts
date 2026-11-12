import type { PayrollButtonActionHandler, PayrollButtonHandle, PayrollButtonViewModel } from './PayrollButton.types';
import './PayrollButton.css';

/**
 * Small circular "Payroll" button that appears under the game widgets once payday is due, and
 * disappears once salaries are paid. VIEW ONLY — visibility and the paid/due state are decided
 * by the adapter from `state.paydayPending`.
 */
export function mountPayrollButton(host: HTMLElement, initial: Readonly<PayrollButtonViewModel>, onOpen: PayrollButtonActionHandler = () => {}): PayrollButtonHandle {
  const abort = new AbortController();
  host.innerHTML = `
    <button class="dt-payroll-btn" type="button" aria-label="Open Payroll">
      <span class="dt-payroll-btn__icon" aria-hidden="true">🪙</span>
      <span class="dt-payroll-btn__label">Payroll</span>
    </button>`;
  const button = host.querySelector<HTMLButtonElement>('.dt-payroll-btn')!;
  button.addEventListener('click', () => onOpen(), { signal: abort.signal });

  function setModel(model: Readonly<PayrollButtonViewModel>): void {
    host.hidden = !model.visible;
  }
  setModel(initial);

  return {
    setModel,
    destroy(): void {
      abort.abort();
      host.replaceChildren();
    },
  };
}
