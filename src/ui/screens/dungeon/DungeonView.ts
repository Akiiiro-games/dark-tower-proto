import { mountRoomOverviewCard } from '../../components/RoomOverviewCard/RoomOverviewCard';
import { mountUpgradeCard } from '../../components/UpgradeCard/UpgradeCard';
import type { UpgradeCardHandle } from '../../components/UpgradeCard/UpgradeCard.types';
import { mountPrisonCell } from '../../components/PrisonCell/PrisonCell';
import type { PrisonCellHandle } from '../../components/PrisonCell/PrisonCell.types';
import type { DungeonActionHandler, DungeonViewHandle, DungeonViewModel } from './DungeonViewModel';
import './DungeonView.css';

interface Mounted<T> { host: HTMLElement; handle: T }
/** Screen-only composition. Never resolves prisoners, starts timers, buys upgrades or mutates gold. */
export function mountDungeonView(host: HTMLElement, initial: Readonly<DungeonViewModel>, onAction: DungeonActionHandler): DungeonViewHandle {
  const abort = new AbortController();
  const root = document.createElement('main');
  root.className = 'dt-dungeon';
  root.innerHTML = `
    <div class="dt-dungeon__mountains" aria-hidden="true"></div>
    <div class="dt-dungeon__shell">
      <section class="dt-dungeon__window" aria-label="Dungeon window">
                <section class="dt-dungeon__upper" aria-label="Dungeon information and upgrades">
          <div class="dt-dungeon__room"></div>
          <section class="dt-dungeon__upgrades" aria-label="Upgrades">
            <button class="dt-dungeon__scroll-arrow dt-dungeon__scroll-arrow--left" type="button" aria-label="Scroll upgrades left">‹</button>
            <div class="dt-dungeon__upgrade-viewport" tabindex="0" aria-label="Horizontal list of Dungeon upgrades"><div class="dt-dungeon__upgrade-track"></div></div>
            <button class="dt-dungeon__scroll-arrow dt-dungeon__scroll-arrow--right" type="button" aria-label="Scroll upgrades right">›</button>
            <div class="dt-dungeon__upgrade-dots" aria-hidden="true"><span></span><span></span><span></span></div>
          </section>
        </section>
        <section class="dt-dungeon__cells-section" aria-label="Prison cells">
          <div class="dt-dungeon__cells-topline"><span class="dt-dungeon__cells-title"></span><span class="dt-dungeon__cells-count"></span></div>
          <div class="dt-dungeon__cells-viewport" tabindex="0" aria-label="Scrollable prison cell slots">
            <div class="dt-dungeon__cells-grid"></div>
            <div class="dt-dungeon__no-cells" role="status" hidden><span>⛓️</span><strong>No prison cells</strong><p></p></div>
          </div>
        </section>
      </section>
    </div>`;
  const required = <T extends Element>(selector: string): T => {
    const el = root.querySelector<T>(selector);
    if (!el) throw new Error(`DungeonView missing ${selector}`);
    return el;
  };
  const room = mountRoomOverviewCard(required<HTMLElement>('.dt-dungeon__room'), initial.room, { variant: 'embedded' });
  const upgradeViewport = required<HTMLElement>('.dt-dungeon__upgrade-viewport');
  const upgradeTrack = required<HTMLElement>('.dt-dungeon__upgrade-track');
  const cellsViewport = required<HTMLElement>('.dt-dungeon__cells-viewport');
  const cellGrid = required<HTMLElement>('.dt-dungeon__cells-grid');
  const noCells = required<HTMLElement>('.dt-dungeon__no-cells');
  const prev = required<HTMLButtonElement>('.dt-dungeon__scroll-arrow--left');
  const next = required<HTMLButtonElement>('.dt-dungeon__scroll-arrow--right');
  const dots = Array.from(root.querySelectorAll<HTMLElement>('.dt-dungeon__upgrade-dots span'));
  const upgrades = new Map<string, Mounted<UpgradeCardHandle>>();
  const cells = new Map<string, Mounted<PrisonCellHandle>>();
  let destroyed = false;
  function updateArrows(): void {
    const maxScroll = Math.max(0, upgradeViewport.scrollWidth - upgradeViewport.clientWidth);
    prev.disabled = upgradeViewport.scrollLeft <= 2;
    next.disabled = upgradeViewport.scrollLeft >= maxScroll - 2;
    const position = maxScroll ? upgradeViewport.scrollLeft / maxScroll : 0;
    dots.forEach((dot, i) => dot.classList.toggle('dt-dungeon__dot--active', i === (maxScroll ? Math.min(dots.length - 1, Math.round(position * (dots.length - 1))) : 0)));
  }
  function scrollUpgrades(direction: -1 | 1): void {
    upgradeViewport.scrollBy({ left: direction * Math.min(500, upgradeViewport.clientWidth * .8), behavior: 'smooth' });
  }
  prev.addEventListener('click', () => scrollUpgrades(-1), { signal: abort.signal });
  next.addEventListener('click', () => scrollUpgrades(1), { signal: abort.signal });
  upgradeViewport.addEventListener('scroll', updateArrows, { signal: abort.signal, passive: true });
  upgradeViewport.addEventListener('wheel', (event: WheelEvent) => {
    if (event.shiftKey && event.deltaY) { event.preventDefault(); upgradeViewport.scrollLeft += event.deltaY; }
  }, { signal: abort.signal, passive: false });
  window.addEventListener('resize', updateArrows, { signal: abort.signal });

  function setModel(model: Readonly<DungeonViewModel>): void {
    if (destroyed) return;
    room.setModel(model.room);
    required<HTMLElement>('.dt-dungeon__cells-title').textContent = model.cellsCaption;
    required<HTMLElement>('.dt-dungeon__cells-count').textContent = model.countCaption;
    required<HTMLElement>('.dt-dungeon__no-cells p').textContent = model.emptyMessage;
    root.classList.toggle('dt-dungeon--busy', Boolean(model.busy));
    const upgradeIds = new Set(model.upgrades.map(x => x.id));
    for (const [id, mounted] of upgrades) if (!upgradeIds.has(id)) { mounted.handle.destroy(); upgrades.delete(id); }
    const orderedUpgrades: HTMLElement[] = [];
    for (const data of model.upgrades) {
      let item = upgrades.get(data.id);
      if (!item) {
        const slot = document.createElement('div'); slot.className = 'dt-dungeon__upgrade-slot';
        item = { host: slot, handle: mountUpgradeCard(slot, data, upgradeId => onAction({ type: 'upgradeRequested', upgradeId })) };
        upgrades.set(data.id, item);
      } else item.handle.setModel(data);
      orderedUpgrades.push(item.host);
    }
    if (upgradeTrack.childElementCount !== orderedUpgrades.length || orderedUpgrades.some((el, i) => upgradeTrack.children[i] !== el)) upgradeTrack.replaceChildren(...orderedUpgrades);

    const cellIds = new Set(model.cells.map(x => x.id));
    for (const [id, mounted] of cells) if (!cellIds.has(id)) { mounted.handle.destroy(); cells.delete(id); }
    const orderedCells: HTMLElement[] = [];
    for (const data of model.cells) {
      let item = cells.get(data.id);
      if (!item) {
        const slot = document.createElement('div'); slot.className = 'dt-dungeon__cell-slot';
        item = { host: slot, handle: mountPrisonCell(slot, data) };
        cells.set(data.id, item);
      } else item.handle.setModel(data);
      orderedCells.push(item.host);
    }
    const priorScroll = cellsViewport.scrollTop;
    if (cellGrid.childElementCount !== orderedCells.length || orderedCells.some((el, i) => cellGrid.children[i] !== el)) cellGrid.replaceChildren(...orderedCells);
    cellsViewport.scrollTop = priorScroll;
    cellGrid.hidden = model.cells.length === 0;
    noCells.hidden = model.cells.length !== 0;
    updateArrows();
  }
  host.replaceChildren(root);
  setModel(initial);
  return { setModel, destroy() {
    if (destroyed) return;
    destroyed = true;
    abort.abort(); room.destroy();
    for (const item of upgrades.values()) item.handle.destroy();
    for (const item of cells.values()) item.handle.destroy();
    upgrades.clear(); cells.clear(); root.remove();
  } };
}
