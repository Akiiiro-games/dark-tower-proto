import type { UpgradeCardViewModel, UpgradeCardHandle, UpgradeCardActionHandler } from './UpgradeCard.types';
import './UpgradeCard.css';

/** Reusable upgrade card. No resource checks, level calculations or simulated timers. */
export function mountUpgradeCard(host: HTMLElement, initial: Readonly<UpgradeCardViewModel>, onRequest: UpgradeCardActionHandler): UpgradeCardHandle {
  const abort = new AbortController();
  const root = document.createElement('article');
  root.className = 'dt-upgrade';
  root.innerHTML = `
    <div class="dt-upgrade__icon" aria-hidden="true"></div>
    <div class="dt-upgrade__name"></div>
    <div class="dt-upgrade__divider"></div>
    <div class="dt-upgrade__levels"><span class="dt-upgrade__level-from"></span><span class="dt-upgrade__arrow">➜</span><span class="dt-upgrade__level-to"></span></div>
    <div class="dt-upgrade__effects"><span class="dt-upgrade__effect-from"></span><span class="dt-upgrade__arrow">➜</span><span class="dt-upgrade__effect-to"></span></div>
    <div class="dt-upgrade__bottom"><button type="button" class="dt-upgrade__button"></button><div class="dt-upgrade__status"></div></div>
  `;
  const get = (selector: string): HTMLElement => {
    const element = root.querySelector<HTMLElement>(selector);
    if (!element) throw new Error(`UpgradeCard missing ${selector}`);
    return element;
  };
  const button = get('.dt-upgrade__button') as HTMLButtonElement;
  let current = initial;
  let destroyed = false;
  button.addEventListener('click', () => {
    if (!destroyed && current.canUpgrade) onRequest(current.id);
  }, { signal: abort.signal });
  function setModel(model: Readonly<UpgradeCardViewModel>): void {
    if (destroyed) return;
    current = model;
    get('.dt-upgrade__icon').textContent = model.icon;
    get('.dt-upgrade__name').textContent = model.title;
    get('.dt-upgrade__level-from').textContent = model.currentLevel;
    get('.dt-upgrade__level-to').textContent = model.nextLevel;
    get('.dt-upgrade__effect-from').textContent = model.currentEffect;
    get('.dt-upgrade__effect-to').textContent = model.nextEffect;
    get('.dt-upgrade__status').textContent = model.statusText ?? '';
    button.textContent = model.buttonLabel;
    button.disabled = !model.canUpgrade;
    button.title = !model.canUpgrade ? (model.disabledReason ?? 'Upgrade unavailable') : '';
    root.classList.toggle('dt-upgrade--disabled', !model.canUpgrade);
  }
  host.replaceChildren(root);
  setModel(initial);
  return { setModel, destroy() { if (destroyed) return; destroyed = true; abort.abort(); root.remove(); } };
}
