import type { UpgradeCardViewModel, UpgradeCardHandle, UpgradeCardActionHandler } from './UpgradeCard.types';
import './UpgradeCard.css';

let nextInfoId = 0;

/** Reusable upgrade card. No resource checks, level calculations or simulated timers. */
export function mountUpgradeCard(host: HTMLElement, initial: Readonly<UpgradeCardViewModel>, onRequest: UpgradeCardActionHandler): UpgradeCardHandle {
  const abort = new AbortController();
  const tooltipId = `dt-upgrade-info-${++nextInfoId}`;
  const root = document.createElement('article');
  root.className = 'dt-upgrade';
  root.innerHTML = `
    <button type="button" class="dt-upgrade__info" aria-label="Upgrade information" aria-describedby="${tooltipId}">i<span id="${tooltipId}" class="dt-upgrade__description" role="tooltip"></span></button>
    <div class="dt-upgrade__icon" aria-hidden="true"></div>
    <div class="dt-upgrade__name"></div>
    <div class="dt-upgrade__divider"></div>
    <div class="dt-upgrade__levels"><span class="dt-upgrade__level-from"></span><span class="dt-upgrade__arrow">➜</span><span class="dt-upgrade__level-to"></span></div>
    <div class="dt-upgrade__effects"><span class="dt-upgrade__effect-from"></span><span class="dt-upgrade__arrow">➜</span><span class="dt-upgrade__effect-to"></span></div>
    <div class="dt-upgrade__bottom"><button type="button" class="dt-upgrade__button"><span class="dt-upgrade__label"></span><span class="dt-upgrade__progress" hidden><span class="dt-upgrade__fill"></span><span class="dt-upgrade__remaining"></span></span></button><div class="dt-upgrade__status"></div></div>
  `;
  const get = (selector: string): HTMLElement => {
    const element = root.querySelector<HTMLElement>(selector);
    if (!element) throw new Error(`UpgradeCard missing ${selector}`);
    return element;
  };
  const button = get('.dt-upgrade__button') as HTMLButtonElement;
  const info = get('.dt-upgrade__info');
  const description = get('.dt-upgrade__description');
  function fitTooltip(): void {
    description.style.left = '';
    description.style.right = '';
    if (description.getBoundingClientRect().right > window.innerWidth - 8) {
      description.style.left = 'auto';
      description.style.right = '0';
    }
    if (description.getBoundingClientRect().left < 8) {
      description.style.right = 'auto';
      description.style.left = '0';
    }
  }
  info.addEventListener('mouseenter', fitTooltip, { signal: abort.signal });
  info.addEventListener('focus', fitTooltip, { signal: abort.signal });
  let current = initial;
  let destroyed = false;
  button.addEventListener('click', () => {
    if (!destroyed && current.canUpgrade) onRequest(current.id);
  }, { signal: abort.signal });
  function setModel(model: Readonly<UpgradeCardViewModel>): void {
    if (destroyed) return;
    current = model;
    const icon = get('.dt-upgrade__icon');
    if (model.iconSrc) {
      const image = document.createElement('img');
      image.src = model.iconSrc;
      image.alt = '';
      icon.replaceChildren(image);
    } else icon.textContent = model.icon;
    get('.dt-upgrade__name').textContent = model.title;
    get('.dt-upgrade__level-from').textContent = model.currentLevel;
    get('.dt-upgrade__level-to').textContent = model.nextLevel;
    get('.dt-upgrade__effect-from').textContent = model.currentEffect;
    get('.dt-upgrade__effect-to').textContent = model.nextEffect;
    get('.dt-upgrade__status').textContent = model.statusText ?? '';
    get('.dt-upgrade__label').textContent = model.buttonLabel;
    description.textContent = model.description ?? '';
    info.setAttribute('aria-label', `About ${model.title}`);
    get('.dt-upgrade__progress').hidden = model.progress === undefined;
    get('.dt-upgrade__fill').style.width = String((model.progress ?? 0) * 100) + '%';
    get('.dt-upgrade__remaining').textContent = model.remainingLabel ?? '';
    button.disabled = !model.canUpgrade;
    button.title = !model.canUpgrade ? (model.disabledReason ?? 'Upgrade unavailable') : '';
    root.classList.toggle('dt-upgrade--disabled', !model.canUpgrade);
  }
  host.replaceChildren(root);
  setModel(initial);
  return { setModel, destroy() { if (destroyed) return; destroyed = true; abort.abort(); root.remove(); } };
}
