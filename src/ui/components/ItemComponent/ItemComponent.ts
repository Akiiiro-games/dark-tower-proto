import type {
  ItemComponentAction,
  ItemComponentActionHandler,
  ItemComponentHandle,
  ItemComponentViewModel,
} from './ItemComponent.types';
import './ItemComponent.css';

let nextInstanceId = 0;

/**
 * A reusable, engine-agnostic item presentation. Tags are deliberately not
 * rendered: the parent gallery owns filtering; the host owns game state.
 */
export function mountItemComponent(
  host: HTMLElement,
  initialModel: Readonly<ItemComponentViewModel>,
  onAction: ItemComponentActionHandler,
): ItemComponentHandle {
  const instanceId = ++nextInstanceId;
  const infoTooltipId = `dt-item-info-${instanceId}`;
  const stackTooltipId = `dt-item-stack-${instanceId}`;
  const quickTooltipId = `dt-item-quick-${instanceId}`;
  const abort = new AbortController();
  let model = initialModel;
  let disposed = false;

  // Fixed, trusted DOM skeleton. All ViewModel values use textContent/attributes.
  const root = document.createElement('article');
  root.className = 'dt-item';
  root.innerHTML = `
    <div class="dt-item__tile">
      <button class="dt-item__info dt-item__corner" type="button" aria-label="Item information" aria-describedby="${infoTooltipId}">
        i<span id="${infoTooltipId}" class="dt-item__tooltip dt-item__tooltip--left" role="tooltip"></span>
      </button>
      <span class="dt-item__stack dt-item__corner" tabindex="0" aria-describedby="${stackTooltipId}">
        <span class="dt-item__stack-label"></span>
        <span id="${stackTooltipId}" class="dt-item__tooltip dt-item__tooltip--right" role="tooltip"></span>
      </span>
      <div class="dt-item__art" aria-hidden="true">
        <span class="dt-item__emoji"></span>
        <img class="dt-item__texture" alt="" hidden />
      </div>
      <div class="dt-item__name"></div>
    </div>
    <div class="dt-item__sale-area">
      <button class="dt-item__sell" type="button"></button>
      <button class="dt-item__instant-sell" type="button" hidden></button>
      <div class="dt-item__selling-panel" hidden>
        <button class="dt-item__panel-action dt-item__cancel" type="button" aria-label="Cancel sale" title="Cancel sale">×</button>
        <div class="dt-item__panel-center">
          <div class="dt-item__panel-label"></div>
          <div class="dt-item__progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Sale progress">
            <span class="dt-item__progress-fill"></span>
            <span class="dt-item__remaining"></span>
          </div>
        </div>
        <button class="dt-item__panel-action dt-item__quick" type="button" aria-describedby="${quickTooltipId}">
          <span class="dt-item__quick-label"></span>
          <span id="${quickTooltipId}" class="dt-item__tooltip dt-item__tooltip--quick" role="tooltip"></span>
        </button>
      </div>
    </div>
  `;

  function required<T extends Element>(selector: string): T {
    const node = root.querySelector<T>(selector);
    if (!node) throw new Error(`ItemComponent template is missing ${selector}`);
    return node;
  }

  const info = required<HTMLButtonElement>('.dt-item__info');
  const infoTooltip = required<HTMLElement>('.dt-item__tooltip--left');
  const stack = required<HTMLElement>('.dt-item__stack');
  const stackLabel = required<HTMLElement>('.dt-item__stack-label');
  const stackTooltip = required<HTMLElement>('.dt-item__tooltip--right');
  const emoji = required<HTMLElement>('.dt-item__emoji');
  const texture = required<HTMLImageElement>('.dt-item__texture');
  const name = required<HTMLElement>('.dt-item__name');
  const sell = required<HTMLButtonElement>('.dt-item__sell');
  const instantSell = required<HTMLButtonElement>('.dt-item__instant-sell');
  const sellingPanel = required<HTMLElement>('.dt-item__selling-panel');
  const panelLabel = required<HTMLElement>('.dt-item__panel-label');
  const cancel = required<HTMLButtonElement>('.dt-item__cancel');
  const quick = required<HTMLButtonElement>('.dt-item__quick');
  const quickLabel = required<HTMLElement>('.dt-item__quick-label');
  const quickTooltip = required<HTMLElement>('.dt-item__tooltip--quick');
  const progressBar = required<HTMLElement>('.dt-item__progress');
  const progressFill = required<HTMLElement>('.dt-item__progress-fill');
  const remaining = required<HTMLElement>('.dt-item__remaining');

  const dispatch = (type: ItemComponentAction['type']): void => {
    if (!disposed) onAction({ type, itemId: model.id });
  };

  sell.addEventListener('click', () => {
    if (model.sale.status === 'ready' && model.sale.canSell) dispatch('sellRequested');
  }, { signal: abort.signal });
  instantSell.addEventListener('click', () => {
    if (model.sale.status === 'ready' && model.sale.canInstantSell) dispatch('instantSellRequested');
  }, { signal: abort.signal });
  cancel.addEventListener('click', () => {
    if (model.sale.status === 'selling' && model.sale.canCancel) dispatch('cancelSaleRequested');
  }, { signal: abort.signal });
  quick.addEventListener('click', () => {
    if (model.sale.status === 'selling' && model.sale.canQuickSell) dispatch('quickSellRequested');
  }, { signal: abort.signal });

  // Presentation-only tooltip positioning near the edge of the viewport.
  function fitTooltip(tooltip: HTMLElement): void {
    tooltip.style.left = '';
    tooltip.style.right = '';
    const rect = tooltip.getBoundingClientRect();
    if (rect.right > window.innerWidth - 8) {
      tooltip.style.left = 'auto';
      tooltip.style.right = '0';
    }
    if (tooltip.getBoundingClientRect().left < 8) {
      tooltip.style.right = 'auto';
      tooltip.style.left = '0';
    }
  }
  for (const [anchor, tooltip] of [
    [info, infoTooltip], [stack, stackTooltip], [quick, quickTooltip],
  ] as const) {
    anchor.addEventListener('mouseenter', () => fitTooltip(tooltip), { signal: abort.signal });
    anchor.addEventListener('focus', () => fitTooltip(tooltip), { signal: abort.signal });
  }

  texture.addEventListener('error', () => {
    texture.hidden = true;
    emoji.hidden = false;
    emoji.textContent = model.icon.kind === 'texture' ? (model.icon.fallbackEmoji ?? '📦') : model.icon.value;
  }, { signal: abort.signal });

  function setModel(updated: Readonly<ItemComponentViewModel>): void {
    if (disposed) return;
    model = updated;
    root.dataset.itemId = model.id;
    root.dataset.status = model.sale.status;
    root.classList.toggle('dt-item--selling', model.sale.status === 'selling');
    root.classList.toggle('dt-item--disabled', model.sale.status === 'ready' && !model.sale.canSell);

    name.textContent = model.title;
    info.setAttribute('aria-label', `About ${model.title}`);
    infoTooltip.textContent = model.description;
    stackLabel.textContent = model.stack.label;
    stackTooltip.textContent = model.stack.tooltip;
    stack.setAttribute('aria-label', model.stack.tooltip);

    if (model.icon.kind === 'emoji') {
      texture.hidden = true;
      emoji.hidden = false;
      emoji.textContent = model.icon.value;
    } else {
      emoji.hidden = true;
      texture.hidden = false;
      texture.alt = model.icon.alt;
      // Avoid re-fetching the texture once per timer tick.
      if (texture.getAttribute('src') !== model.icon.src) texture.src = model.icon.src;
    }

    const isSelling = model.sale.status === 'selling';
    sell.hidden = isSelling;
    instantSell.hidden = isSelling;
    sellingPanel.hidden = !isSelling;

    if (model.sale.status === 'selling') {
      panelLabel.textContent = model.sale.sellLabel;
      remaining.textContent = model.sale.remainingLabel;
      // Safety clamp is presentational; the adapter calculates actual progress.
      const progress = Math.min(1, Math.max(0, model.sale.progress));
      progressFill.style.width = `${progress * 100}%`;
      progressBar.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      progressBar.setAttribute('aria-valuetext', `${model.sale.remainingLabel} remaining`);
      cancel.disabled = !model.sale.canCancel;
      cancel.title = model.sale.canCancel ? 'Cancel sale' : (model.sale.cancelDisabledReason ?? 'Unavailable');
      quick.disabled = !model.sale.canQuickSell;
      quickLabel.textContent = model.sale.quickSellLabel;
      quickTooltip.textContent = model.sale.quickSellTooltip;
      quick.title = model.sale.canQuickSell ? '' : (model.sale.quickSellDisabledReason ?? 'Unavailable');
    } else {
      sell.textContent = model.sale.sellLabel;
      sell.disabled = !model.sale.canSell;
      sell.title = !model.sale.canSell ? (model.sale.disabledReason ?? 'Unavailable') : '';
      instantSell.hidden = !model.sale.instantSellLabel;
      if (model.sale.instantSellLabel) {
        instantSell.textContent = model.sale.instantSellLabel;
        instantSell.disabled = !model.sale.canInstantSell;
        instantSell.title = !model.sale.canInstantSell ? (model.sale.instantSellDisabledReason ?? 'Unavailable') : '';
      }
    }
  }

  host.replaceChildren(root);
  setModel(initialModel);

  return {
    setModel,
    destroy(): void {
      if (disposed) return;
      disposed = true;
      abort.abort();
      root.remove();
    },
  };
}
