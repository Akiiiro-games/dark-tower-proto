import { mountItemComponent } from '../../components/ItemComponent/ItemComponent';
import type { ItemComponentHandle } from '../../components/ItemComponent/ItemComponent.types';
import { mountRoomOverviewCard } from '../../components/RoomOverviewCard/RoomOverviewCard';
import { mountTagFilterBar } from '../../components/TagFilterBar/TagFilterBar';
import { mountUpgradeCard } from '../../components/UpgradeCard/UpgradeCard';
import type { UpgradeCardHandle } from '../../components/UpgradeCard/UpgradeCard.types';
import type { StorehouseActionHandler, StorehouseViewHandle, StorehouseViewModel } from './StorehouseViewModel';
import './StorehouseView.css';

interface MountedCard<T> { host: HTMLElement; handle: T; }

/**
 * Engine-agnostic Storehouse UI. It composes the unmodified shared ItemComponent.
 * Game/upgrade/reward/eligibility decisions belong to the calling adapter.
 * Only DOM, selection appearance, carousel scrolling and mount lifecycle live here.
 */
export function mountStorehouseView(
  host: HTMLElement,
  initial: Readonly<StorehouseViewModel>,
  onAction: StorehouseActionHandler,
): StorehouseViewHandle {
  const abort = new AbortController();
  const root = document.createElement('main');
  root.className = 'dt-storehouse';
  root.innerHTML = `
    <div class="dt-storehouse__mountains" aria-hidden="true"></div>
    <div class="dt-storehouse__shell">
      <section class="dt-storehouse__window" aria-label="Storehouse window">
      <section class="dt-storehouse__upper" aria-label="Room information and upgrades">
        <div class="dt-storehouse__room"></div>
        <section class="dt-storehouse__upgrades" aria-label="Upgrades">
          <div class="dt-storehouse__upgrade-caption">Upgrades</div>
          <button class="dt-storehouse__scroll-arrow dt-storehouse__scroll-arrow--left" type="button" aria-label="Scroll upgrades left">‹</button>
          <div class="dt-storehouse__upgrade-viewport" tabindex="0" aria-label="Horizontal list of Storehouse upgrades">
            <div class="dt-storehouse__upgrade-track"></div>
          </div>
          <button class="dt-storehouse__scroll-arrow dt-storehouse__scroll-arrow--right" type="button" aria-label="Scroll upgrades right">›</button>
        </section>
      </section>
      <section class="dt-storehouse__inventory" aria-label="Stored items">
        <div class="dt-storehouse__filters"></div>
        <div class="dt-storehouse__inventory-frame">
          <div class="dt-storehouse__inventory-topline"><span class="dt-storehouse__inventory-title">Stored items</span><span class="dt-storehouse__inventory-count"></span></div>
          <div class="dt-storehouse__inventory-viewport" tabindex="0" aria-label="Scrollable inventory item stacks">
            <div class="dt-storehouse__items"></div>
            <div class="dt-storehouse__empty" role="status" hidden><span aria-hidden="true">📦</span><strong>Nothing here yet</strong><p></p></div>
          </div>
        </div>
      </section>
      </section>
    </div>
  `;

  function required<T extends Element>(selector: string): T {
    const el = root.querySelector<T>(selector);
    if (!el) throw new Error(`StorehouseView missing ${selector}`);
    return el;
  }
  const roomEl = required<HTMLElement>('.dt-storehouse__room');
  const upgradesTrack = required<HTMLElement>('.dt-storehouse__upgrade-track');
  const upgradesViewport = required<HTMLElement>('.dt-storehouse__upgrade-viewport');
  const inventoryViewport = required<HTMLElement>('.dt-storehouse__inventory-viewport');
  const inventoryGrid = required<HTMLElement>('.dt-storehouse__items');
  const inventoryCount = required<HTMLElement>('.dt-storehouse__inventory-count');
  const emptyEl = required<HTMLElement>('.dt-storehouse__empty');
  const emptyText = required<HTMLElement>('.dt-storehouse__empty p');
  const prev = required<HTMLButtonElement>('.dt-storehouse__scroll-arrow--left');
  const next = required<HTMLButtonElement>('.dt-storehouse__scroll-arrow--right');
  const room = mountRoomOverviewCard(roomEl, initial.room, { variant: 'embedded' });
  const filters = mountTagFilterBar(required<HTMLElement>('.dt-storehouse__filters'), initial.filters, tag => {
    onAction({ type: 'filterToggled', tag });
  });
  const itemCards = new Map<string, MountedCard<ItemComponentHandle>>();
  const upgradeCards = new Map<string, MountedCard<UpgradeCardHandle>>();
  let disposed = false;

  function updateArrows(): void {
    const end = Math.max(0, upgradesViewport.scrollWidth - upgradesViewport.clientWidth);
    prev.disabled = upgradesViewport.scrollLeft <= 2;
    next.disabled = upgradesViewport.scrollLeft >= end - 2;
    prev.hidden = upgradeCards.size <= 5;
    next.hidden = upgradeCards.size <= 5;
  }
  function scrollUpgrades(dir: 1 | -1): void {
    upgradesViewport.scrollBy({ left: dir * Math.min(500, upgradesViewport.clientWidth * 0.8), behavior: 'smooth' });
  }
  prev.addEventListener('click', () => scrollUpgrades(-1), { signal: abort.signal });
  next.addEventListener('click', () => scrollUpgrades(1), { signal: abort.signal });
  upgradesViewport.addEventListener('scroll', updateArrows, { signal: abort.signal, passive: true });
  // Shift + wheel also scrolls the carousel; default vertical wheel continues scrolling the inventory/page.
  upgradesViewport.addEventListener('wheel', (event: WheelEvent) => {
    if (event.shiftKey && Math.abs(event.deltaY) > 0) {
      event.preventDefault();
      upgradesViewport.scrollLeft += event.deltaY;
    }
  }, { signal: abort.signal, passive: false });
  window.addEventListener('resize', updateArrows, { signal: abort.signal });

  function setModel(model: Readonly<StorehouseViewModel>): void {
    if (disposed) return;
    room.setModel(model.room);
    filters.setModel(model.filters);
    inventoryCount.textContent = model.inventoryLabel;
    emptyText.textContent = model.emptyMessage;
    root.classList.toggle('dt-storehouse--busy', !!model.busy);

    const activeUpgrades = new Set(model.upgrades.map(upgrade => upgrade.id));
    for (const [id, mounted] of upgradeCards) {
      if (!activeUpgrades.has(id)) { mounted.handle.destroy(); mounted.host.remove(); upgradeCards.delete(id); }
    }
    const upgradeHosts: HTMLElement[] = [];
    for (const upgrade of model.upgrades) {
      let card = upgradeCards.get(upgrade.id);
      if (!card) {
        const wrapper = document.createElement('div');
        wrapper.className = 'dt-storehouse__upgrade-slot';
        card = { host: wrapper, handle: mountUpgradeCard(wrapper, upgrade, id => onAction({ type: 'upgradeRequested', upgradeId: id })) };
        upgradeCards.set(upgrade.id, card);
      } else card.handle.setModel(upgrade);
      upgradeHosts.push(card.host);
    }
    // Reuse mounted cards and preserve carousel scroll position on updates.
    if (upgradesTrack.childElementCount !== upgradeHosts.length || upgradeHosts.some((element, index) => upgradesTrack.children[index] !== element)) {
      upgradesTrack.replaceChildren(...upgradeHosts);
    }

    const activeItems = new Set(model.items.map(item => item.id));
    for (const [id, card] of itemCards) {
      if (!activeItems.has(id)) { card.handle.destroy(); card.host.remove(); itemCards.delete(id); }
    }
    const orderedItemHosts: HTMLElement[] = [];
    for (const item of model.items) {
      let card = itemCards.get(item.id);
      if (!card) {
        const wrapper = document.createElement('div');
        wrapper.className = 'dt-storehouse__item-slot';
        card = { host: wrapper, handle: mountItemComponent(wrapper, item, onAction) };
        itemCards.set(item.id, card);
      } else card.handle.setModel(item);
      orderedItemHosts.push(card.host);
    }
    const priorScroll = inventoryViewport.scrollTop;
    if (inventoryGrid.childElementCount !== orderedItemHosts.length || orderedItemHosts.some((element, index) => inventoryGrid.children[index] !== element)) {
      inventoryGrid.replaceChildren(...orderedItemHosts);
    }
    inventoryViewport.scrollTop = priorScroll;
    emptyEl.hidden = model.items.length !== 0;
    inventoryGrid.hidden = model.items.length === 0;
    updateArrows();
  }
  host.replaceChildren(root);
  setModel(initial);
  return {
    setModel,
    destroy() {
      if (disposed) return;
      disposed = true;
      abort.abort();
      room.destroy(); filters.destroy();
      for (const card of itemCards.values()) card.handle.destroy();
      for (const card of upgradeCards.values()) card.handle.destroy();
      itemCards.clear(); upgradeCards.clear();
      root.remove();
    },
  };
}
