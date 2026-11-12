import type {
  MinionComponentActionHandler,
  MinionComponentHandle,
  MinionComponentViewModel,
} from './MinionComponent.types';
import './MinionComponent.css';

let nextInstanceId = 0;

/** Reusable square, framework-free, game-state-free minion presentation. */
export function mountMinionComponent(
  host: HTMLElement,
  initialModel: Readonly<MinionComponentViewModel>,
  onAction: MinionComponentActionHandler = () => {},
): MinionComponentHandle {
  const token = ++nextInstanceId;
  const abort = new AbortController();
  let model = initialModel;
  let disposed = false;
  let pinnedInfo = false;
  let failedPortraitSrc: string | undefined;

  const root = document.createElement('article');
  root.className = 'dt-minion';
  root.innerHTML = `
    <button class="dt-minion__info" type="button" aria-label="Minion information" aria-describedby="dt-minion-info-${token}" aria-expanded="false">
      i<span class="dt-minion__tooltip dt-minion__info-tooltip" id="dt-minion-info-${token}" role="tooltip"></span>
    </button>
    <div class="dt-minion__name"></div>
    <div class="dt-minion__rank" tabindex="0">
      <span class="dt-minion__rank-icon" aria-hidden="true"></span>
      <span class="dt-minion__rank-label"></span>
      <span class="dt-minion__tooltip dt-minion__rank-tooltip" role="tooltip"></span>
    </div>
    <div class="dt-minion__portrait" aria-hidden="true">
      <img class="dt-minion__portrait-texture" alt="" hidden />
      <span class="dt-minion__portrait-emoji" hidden></span>
    </div>
    <div class="dt-minion__conditions" aria-label="Conditions"></div>
    <div class="dt-minion__status" tabindex="0" role="status">
      <span class="dt-minion__status-icon" aria-hidden="true"></span>
      <span class="dt-minion__status-label"></span>
      <span class="dt-minion__tooltip dt-minion__status-tooltip" role="tooltip"></span>
    </div>
  `;

  function required<T extends Element>(selector: string): T {
    const node = root.querySelector<T>(selector);
    if (!node) throw new Error(`MinionComponent markup missing ${selector}`);
    return node;
  }

  const info = required<HTMLButtonElement>('.dt-minion__info');
  const infoTooltip = required<HTMLElement>('.dt-minion__info-tooltip');
  const name = required<HTMLElement>('.dt-minion__name');
  const rank = required<HTMLElement>('.dt-minion__rank');
  const rankIcon = required<HTMLElement>('.dt-minion__rank-icon');
  const rankLabel = required<HTMLElement>('.dt-minion__rank-label');
  const rankTooltip = required<HTMLElement>('.dt-minion__rank-tooltip');
  const portraitTexture = required<HTMLImageElement>('.dt-minion__portrait-texture');
  const portraitEmoji = required<HTMLElement>('.dt-minion__portrait-emoji');
  const conditions = required<HTMLElement>('.dt-minion__conditions');
  const status = required<HTMLElement>('.dt-minion__status');
  const statusIcon = required<HTMLElement>('.dt-minion__status-icon');
  const statusLabel = required<HTMLElement>('.dt-minion__status-label');
  const statusTooltip = required<HTMLElement>('.dt-minion__status-tooltip');

  // Tooltip positioning is presentation-only and does not touch game state.
  function fitTooltip(tooltip: HTMLElement): void {
    tooltip.style.left = '';
    tooltip.style.right = '';
    const bounds = tooltip.getBoundingClientRect();
    if (bounds.right > window.innerWidth - 10) {
      tooltip.style.left = 'auto';
      tooltip.style.right = '0';
    }
    if (tooltip.getBoundingClientRect().left < 10) {
      tooltip.style.left = '0';
      tooltip.style.right = 'auto';
    }
  }

  root.addEventListener('mouseenter', event => {
    const anchor = (event.target as HTMLElement).closest<HTMLElement>('.dt-minion__info,.dt-minion__rank,.dt-minion__condition,.dt-minion__status');
    if (anchor) {
      const tooltip = anchor.querySelector<HTMLElement>('.dt-minion__tooltip');
      if (tooltip) fitTooltip(tooltip);
    }
  }, { capture: true, signal: abort.signal });
  root.addEventListener('focusin', event => {
    const anchor = (event.target as HTMLElement).closest<HTMLElement>('.dt-minion__info,.dt-minion__rank,.dt-minion__condition,.dt-minion__status');
    const tooltip = anchor?.querySelector<HTMLElement>('.dt-minion__tooltip');
    if (tooltip) fitTooltip(tooltip);
  }, { signal: abort.signal });

  info.addEventListener('click', () => {
    pinnedInfo = !pinnedInfo;
    root.classList.toggle('dt-minion--info-open', pinnedInfo);
    info.setAttribute('aria-expanded', String(pinnedInfo));
    fitTooltip(infoTooltip);
    if (!disposed) onAction({ type: 'infoRequested', minionId: model.id });
  }, { signal: abort.signal });

  portraitTexture.addEventListener('error', () => {
    if (model.portrait.kind !== 'texture') return;
    failedPortraitSrc = model.portrait.src;
    portraitTexture.hidden = true;
    portraitEmoji.hidden = false;
    portraitEmoji.textContent = model.portrait.fallbackEmoji ?? '👹';
  }, { signal: abort.signal });

  const conditionNodes = new Map<string, HTMLElement>();
  function renderConditions(): void {
    const renderList: HTMLElement[] = [];
    const activeKeys = new Set<string>();
    for (const condition of model.conditions) {
      activeKeys.add(condition.id);
      let node = conditionNodes.get(condition.id);
      if (!node) {
        node = document.createElement('div');
        node.className = 'dt-minion__condition';
        node.tabIndex = 0;
        node.innerHTML = `
          <span class="dt-minion__condition-icon" aria-hidden="true"></span>
          <span class="dt-minion__condition-label"></span>
          <span class="dt-minion__tooltip dt-minion__condition-tooltip" role="tooltip"></span>
        `;
        conditionNodes.set(condition.id, node);
      }
      node.dataset.tone = condition.tone;
      node.querySelector<HTMLElement>('.dt-minion__condition-icon')!.textContent = condition.icon;
      node.querySelector<HTMLElement>('.dt-minion__condition-label')!.textContent = condition.label;
      node.querySelector<HTMLElement>('.dt-minion__condition-tooltip')!.textContent = condition.tooltip ?? condition.label;
      node.setAttribute('aria-label', condition.tooltip ?? condition.label);
      renderList.push(node);
    }
    for (const id of conditionNodes.keys()) if (!activeKeys.has(id)) conditionNodes.delete(id);
    conditions.replaceChildren(...renderList);
    conditions.classList.toggle('dt-minion__conditions--empty', renderList.length === 0);
  }

  function setModel(next: Readonly<MinionComponentViewModel>): void {
    if (disposed) return;
    model = next;
    root.dataset.minionId = model.id;
    root.setAttribute('aria-label', `${model.name}, ${model.rank.label}, ${model.status.label}`);
    name.textContent = model.name;
    name.title = model.name;
    rankIcon.textContent = model.rank.icon;
    rankLabel.textContent = model.rank.label;
    rankTooltip.textContent = model.rank.tooltip ?? `Rank: ${model.rank.label}`;
    rank.setAttribute('aria-label', model.rank.tooltip ?? `Rank: ${model.rank.label}`);
    info.setAttribute('aria-label', `Information about ${model.name}`);
    infoTooltip.textContent = model.description;

    if (model.portrait.kind === 'emoji') {
      portraitTexture.hidden = true;
      portraitEmoji.hidden = false;
      portraitEmoji.textContent = model.portrait.value;
    } else {
      const knownBroken = failedPortraitSrc === model.portrait.src;
      portraitTexture.hidden = knownBroken;
      portraitEmoji.hidden = !knownBroken;
      portraitEmoji.textContent = model.portrait.fallbackEmoji ?? '👹';
      portraitTexture.alt = model.portrait.alt;
      if (!knownBroken && portraitTexture.getAttribute('src') !== model.portrait.src) {
        portraitTexture.src = model.portrait.src;
      }
    }

    renderConditions();
    statusIcon.textContent = model.status.icon;
    statusLabel.textContent = model.status.label;
    statusTooltip.textContent = model.status.tooltip ?? model.status.label;
    status.setAttribute('aria-label', model.status.tooltip ?? model.status.label);
  }

  host.replaceChildren(root);
  setModel(initialModel);
  return {
    setModel,
    destroy(): void {
      if (disposed) return;
      disposed = true;
      abort.abort();
      conditionNodes.clear();
      root.remove();
    },
  };
}
