import { mountRoomOverviewCard } from '../../components/RoomOverviewCard/RoomOverviewCard';
import { mountUpgradeCard } from '../../components/UpgradeCard/UpgradeCard';
import type { UpgradeCardHandle } from '../../components/UpgradeCard/UpgradeCard.types';
import { mountBedSlot } from '../../components/BedSlot/BedSlot';
import type { BedSlotHandle } from '../../components/BedSlot/BedSlot.types';
import type { InfirmaryActionHandler, InfirmaryViewHandle, InfirmaryViewModel } from './InfirmaryViewModel';
import './InfirmaryView.css';

interface Mounted<T> { host: HTMLElement; handle: T }
/** Screen-only composition. No treatment calculations, assignment, upgrades, persistence or timers. */
export function mountInfirmaryView(host: HTMLElement, initial: Readonly<InfirmaryViewModel>, onAction: InfirmaryActionHandler): InfirmaryViewHandle {
  const abort = new AbortController();
  const root = document.createElement('main');
  root.className = 'dt-infirmary';
  root.innerHTML = `
  <div class="dt-infirmary__mountains" aria-hidden="true"></div>
  <div class="dt-infirmary__shell">
    <section class="dt-infirmary__window" aria-label="Infirmary window">
      <section class="dt-infirmary__upper" aria-label="Infirmary information and upgrades">
        <div class="dt-infirmary__room"></div>
        <section class="dt-infirmary__upgrades" aria-label="Upgrades">
          <button class="dt-infirmary__scroll-arrow dt-infirmary__scroll-arrow--left" type="button" aria-label="Scroll upgrades left">‹</button>
          <div class="dt-infirmary__upgrade-viewport" tabindex="0" aria-label="Horizontal list of Infirmary upgrades"><div class="dt-infirmary__upgrade-track"></div></div>
          <button class="dt-infirmary__scroll-arrow dt-infirmary__scroll-arrow--right" type="button" aria-label="Scroll upgrades right">›</button>
          <div class="dt-infirmary__upgrade-dots" aria-hidden="true"><span></span><span></span><span></span></div>
        </section>
      </section>
      <section class="dt-infirmary__beds-section" aria-label="Beds">
        <div class="dt-infirmary__beds-topline"><span class="dt-infirmary__beds-title"></span><span class="dt-infirmary__beds-count"></span></div>
        <div class="dt-infirmary__beds-viewport" tabindex="0" aria-label="Scrollable bed slots">
          <div class="dt-infirmary__beds-grid"></div>
          <div class="dt-infirmary__no-beds" role="status" hidden><span>🛏️</span><strong>No beds available</strong><p></p></div>
        </div>
      </section>
    </section>
  </div>`;
  function required<T extends Element>(selector: string): T {
    const el = root.querySelector<T>(selector);
    if (!el) throw new Error(`InfirmaryView missing ${selector}`);
    return el;
  }
  const room = mountRoomOverviewCard(required<HTMLElement>('.dt-infirmary__room'), initial.room, { variant: 'embedded' });
  const upgradeViewport = required<HTMLElement>('.dt-infirmary__upgrade-viewport');
  const upgradeTrack = required<HTMLElement>('.dt-infirmary__upgrade-track');
  const bedsViewport = required<HTMLElement>('.dt-infirmary__beds-viewport');
  const bedGrid = required<HTMLElement>('.dt-infirmary__beds-grid');
  const noBeds = required<HTMLElement>('.dt-infirmary__no-beds');
  const prev = required<HTMLButtonElement>('.dt-infirmary__scroll-arrow--left');
  const next = required<HTMLButtonElement>('.dt-infirmary__scroll-arrow--right');
  const dots = Array.from(root.querySelectorAll<HTMLElement>('.dt-infirmary__upgrade-dots span'));
  const upgrades = new Map<string, Mounted<UpgradeCardHandle>>();
  const beds = new Map<string, Mounted<BedSlotHandle>>();
  let disposed = false;
  function updateArrows() {
    const end = Math.max(0, upgradeViewport.scrollWidth - upgradeViewport.clientWidth);
    prev.disabled = upgradeViewport.scrollLeft <= 2;
    next.disabled = upgradeViewport.scrollLeft >= end - 2;
    const proportion = end ? upgradeViewport.scrollLeft / end : 0;
    dots.forEach((d, i) => d.classList.toggle('dt-infirmary__dot--active', i === (end ? Math.min(dots.length - 1, Math.round(proportion * (dots.length - 1))) : 0)));
  }
  function scrollUpgrades(direction: 1 | -1) {
    upgradeViewport.scrollBy({ left: direction * Math.min(500, upgradeViewport.clientWidth * .8), behavior: 'smooth' });
  }
  prev.addEventListener('click', () => scrollUpgrades(-1), { signal: abort.signal });
  next.addEventListener('click', () => scrollUpgrades(1), { signal: abort.signal });
  upgradeViewport.addEventListener('scroll', updateArrows, { signal: abort.signal, passive: true });
  upgradeViewport.addEventListener('wheel', (event: WheelEvent) => {
    if (event.shiftKey && event.deltaY) { event.preventDefault(); upgradeViewport.scrollLeft += event.deltaY; }
  }, { signal: abort.signal, passive: false });
  window.addEventListener('resize', updateArrows, { signal: abort.signal });

  function setModel(model: Readonly<InfirmaryViewModel>): void {
    if (disposed) return;
    room.setModel(model.room);
    required<HTMLElement>('.dt-infirmary__beds-title').textContent = model.bedsCaption;
    required<HTMLElement>('.dt-infirmary__beds-count').textContent = model.countCaption;
    required<HTMLElement>('.dt-infirmary__no-beds p').textContent = model.emptyMessage;
    root.classList.toggle('dt-infirmary--busy', !!model.busy);
    const activeUpgrades = new Set(model.upgrades.map(value => value.id));
    for (const [id, mounted] of upgrades) if (!activeUpgrades.has(id)) { mounted.handle.destroy(); upgrades.delete(id); }
    const orderedUpgrades: HTMLElement[] = [];
    for (const data of model.upgrades) {
      let item = upgrades.get(data.id);
      if (!item) {
        const slot = document.createElement('div'); slot.className='dt-infirmary__upgrade-slot';
        item = { host: slot, handle: mountUpgradeCard(slot, data, upgradeId => onAction({ type:'upgradeRequested', upgradeId })) };
        upgrades.set(data.id, item);
      } else item.handle.setModel(data);
      orderedUpgrades.push(item.host);
    }
    if (upgradeTrack.childElementCount !== orderedUpgrades.length || orderedUpgrades.some((el, i) => upgradeTrack.children[i] !== el)) upgradeTrack.replaceChildren(...orderedUpgrades);

    const activeBeds = new Set(model.beds.map(value => value.id));
    for (const [id, mounted] of beds) if (!activeBeds.has(id)) { mounted.handle.destroy(); beds.delete(id); }
    const orderedBeds: HTMLElement[] = [];
    for (const data of model.beds) {
      let item = beds.get(data.id);
      if (!item) {
        const slot = document.createElement('div'); slot.className='dt-infirmary__bed-slot';
        item = { host: slot, handle: mountBedSlot(slot, data) };
        beds.set(data.id, item);
      } else item.handle.setModel(data);
      orderedBeds.push(item.host);
    }
    const priorScroll = bedsViewport.scrollTop;
    if (bedGrid.childElementCount !== orderedBeds.length || orderedBeds.some((el, i) => bedGrid.children[i] !== el)) bedGrid.replaceChildren(...orderedBeds);
    bedsViewport.scrollTop = priorScroll;
    bedGrid.hidden = model.beds.length === 0;
    noBeds.hidden = model.beds.length !== 0;
    updateArrows();
  }
  host.replaceChildren(root);
  setModel(initial);
  return { setModel, destroy() {
    if (disposed) return;
    disposed = true;
    abort.abort(); room.destroy();
    for (const item of upgrades.values()) item.handle.destroy();
    for (const item of beds.values()) item.handle.destroy();
    upgrades.clear(); beds.clear(); root.remove();
  } };
}
