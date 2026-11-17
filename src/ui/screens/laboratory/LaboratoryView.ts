import { mountUpgradeCard } from '../../components/UpgradeCard/UpgradeCard';
import type { UpgradeCardHandle } from '../../components/UpgradeCard/UpgradeCard.types';
import type { LaboratoryActionHandler, LaboratoryActiveProjectViewModel, LaboratoryResearchViewModel, LaboratoryViewHandle, LaboratoryViewModel } from './LaboratoryViewModel';
import './LaboratoryView.css';

/**
 * Dark Tower Laboratory — VIEW ONLY.
 * Ported from ViewModelsProto/ui-views/laboratory (LaboratoryView.js, a plain-JS UMD class) to a
 * TS module matching this app's mount/setModel/destroy contract. Never purchases upgrades,
 * advances timers, computes costs, unlocks tiers, or starts research — only renders the model.
 * The shell owns the back button/title, so no header is rendered here (same as the other rooms).
 */

const esc = (value: string): string => value.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]!));
const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const ICON_PATHS: Record<string, string> = {
  flask: '<path d="M10 3h4M11 3v6l-5.4 9.2A2 2 0 0 0 7.3 21h9.4a2 2 0 0 0 1.7-2.8L13 9V3"/><path d="M8.5 16h7"/>',
  clock: '<circle cx="12" cy="13" r="8"/><path d="M12 13l3-3M9 2h6M12 5V3"/>',
  hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/><path d="M14.5 9.5c-1.5-1.4-5.2-1-5.2 1s5.2.6 5.2 3-3.9 2.4-5.5 1M12 7v10"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  sparkle: '<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/>',
};
function iconHtml(name: string): string {
  return `<svg class="lab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] ?? ICON_PATHS.sparkle}</svg>`;
}

function activeHtml(project: LaboratoryActiveProjectViewModel | null): string {
  if (!project) {
    return `<div class="lab-active-empty"><span class="lab-active-empty-icon">${iconHtml('flask')}</span><div><strong>No active research</strong><p>Select a project below to begin researching.</p></div></div>`;
  }
  return `<article class="lab-active-card" data-active-id="${esc(project.id)}">
    <div class="lab-active-icon"><img src="${esc(project.icon)}" alt="" /></div>
    <div class="lab-active-copy"><h3>${esc(project.title)}</h3><p>${esc(project.description)}</p></div>
    <div class="lab-progress-group"><div class="lab-progress-track" role="progressbar" aria-label="Research progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(clamp(project.progress, 0, 1) * 100)}"><div class="lab-progress-fill" style="width:${(clamp(project.progress, 0, 1) * 100).toFixed(2)}%"></div></div></div>
    <div class="lab-remaining">${iconHtml('hourglass')}<span data-remaining>${esc(project.remainingText)}</span></div>
    <div class="lab-progress-state">${iconHtml('flask')}<span>${esc(project.statusText)}</span></div>
  </article>`;
}

function researchHtml(research: LaboratoryResearchViewModel): string {
  const unavailable = !research.actionEnabled;
  const locked = research.status === 'locked';
  const completed = research.status === 'completed';
  const badge = locked ? `${iconHtml('lock')} ${esc(research.hint ?? 'Locked')}` : completed ? `${iconHtml('check')} Researched` : '';
  return `<article class="lab-research-card ${locked ? 'is-locked' : ''} ${completed ? 'is-completed' : ''}" title="${esc(research.hint ?? '')}">
    <div class="lab-research-icon"><img src="${esc(research.icon)}" alt="" /></div>
    <div class="lab-research-main"><h3>${esc(research.title)}</h3><p>${esc(research.description)}</p>
      <div class="lab-research-footer">${badge ? `<span class="lab-research-requirement">${badge}</span>` : `<span class="lab-meta">${iconHtml('hourglass')}${esc(research.durationText)}</span><span class="lab-meta lab-coin">${iconHtml('coin')}${esc(research.costText)}</span>`}</div>
    </div>
    <button type="button" class="lab-button lab-research-button ${unavailable ? 'lab-button-muted' : ''}" data-research="${esc(research.id)}" ${unavailable ? 'disabled' : ''} title="${esc(research.hint ?? '')}">${esc(research.actionLabel)}</button>
  </article>`;
}

export function mountLaboratoryView(host: HTMLElement, initial: Readonly<LaboratoryViewModel>, onAction: LaboratoryActionHandler): LaboratoryViewHandle {
  let model: Readonly<LaboratoryViewModel> = initial;
  let upgradePage = 0;
  const upgradeCards: UpgradeCardHandle[] = [];
  let layoutSignature = '';
  let destroyed = false;

  const root = document.createElement('section');
  root.className = 'dt-laboratory';

  function onClick(event: MouseEvent): void {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!target || target.disabled) return;
    if (target.hasAttribute('data-research')) onAction({ type: 'startResearchRequested', researchId: target.dataset.research! });
    if (target.hasAttribute('data-page')) {
      upgradePage += Number(target.dataset.page);
      layoutSignature = '';
      render();
    }
  }
  root.addEventListener('click', onClick);

  function updateProgress(): void {
    const pageSize = Math.max(1, model.upgradePageSize ?? 5);
    upgradeCards.forEach((card, index) => card.setModel(model.upgrades[upgradePage * pageSize + index]));
    const active = model.activeProject;
    if (!active) return;
    const track = root.querySelector<HTMLElement>('.lab-progress-track');
    const fill = root.querySelector<HTMLElement>('.lab-progress-fill');
    const remaining = root.querySelector<HTMLElement>('[data-remaining]');
    if (track) track.setAttribute('aria-valuenow', String(Math.round(clamp(active.progress, 0, 1) * 100)));
    if (fill) fill.style.width = `${(clamp(active.progress, 0, 1) * 100).toFixed(2)}%`;
    if (remaining) remaining.textContent = active.remainingText;
  }

  function render(): void {
    const pageSize = Math.max(1, model.upgradePageSize ?? 5);
    const pageCount = Math.max(1, Math.ceil(model.upgrades.length / pageSize));
    upgradePage = clamp(upgradePage, 0, pageCount - 1);
    const visibleUpgrades = model.upgrades.slice(upgradePage * pageSize, (upgradePage + 1) * pageSize);
    upgradeCards.splice(0).forEach(card => card.destroy());
    root.innerHTML = `
      <div class="lab-outer-glow"></div>
      <main class="lab-window">
        <section class="lab-overview" aria-label="Laboratory upgrades">
          <div class="lab-room-overview"><img class="lab-room-art" src="${esc(model.image)}" alt="Laboratory room illustration" />
            <div class="lab-room-stats">${model.stats.map(stat => `<div class="lab-room-stat"><span class="lab-stat-symbol">${iconHtml(stat.icon ?? 'flask')}</span><span>${esc(stat.label)}</span><strong>${esc(stat.value)}</strong></div>`).join('')}</div>
          </div>
          <div class="lab-upgrade-region">
            <button type="button" class="lab-slider-arrow" data-page="-1" ${upgradePage === 0 ? 'disabled' : ''} aria-label="Previous upgrades">${iconHtml('chevronLeft')}</button>
            <div class="lab-upgrade-grid"></div>
            <button type="button" class="lab-slider-arrow" data-page="1" ${upgradePage >= pageCount - 1 ? 'disabled' : ''} aria-label="Next upgrades">${iconHtml('chevronRight')}</button>
            <div class="lab-carousel-dots" aria-label="Upgrade pages">${Array.from({ length: pageCount }, (_, i) => `<span class="${i === upgradePage ? 'selected' : ''}"></span>`).join('')}</div>
          </div>
        </section>
        <section class="lab-content-section" aria-label="Current active research">
          <h2 class="lab-section-title">CURRENT ACTIVE RESEARCH</h2>
          ${activeHtml(model.activeProject)}
        </section>
        <section class="lab-content-section lab-available-section" aria-label="Available research">
          <h2 class="lab-section-title">AVAILABLE RESEARCH</h2>
          <div class="lab-research-grid">${model.research.map(researchHtml).join('')}</div>
        </section>
      </main>
      ${model.toast ? `<div class="lab-toast" role="status">${esc(model.toast)}</div>` : ''}`;
    const grid = root.querySelector<HTMLElement>('.lab-upgrade-grid')!;
    for (const upgrade of visibleUpgrades) {
      const slot = document.createElement('div');
      slot.className = 'lab-upgrade-slot';
      grid.append(slot);
      upgradeCards.push(mountUpgradeCard(slot, upgrade, upgradeId => onAction({ type: 'upgradeRequested', upgradeId })));
    }
    updateProgress();
  }

  function setModel(next: Readonly<LaboratoryViewModel>): void {
    if (destroyed) return;
    model = next;
    // Preserve button focus/hover between timer-only updates by diffing everything but progress.
    const withoutProgress = { ...next, upgrades: next.upgrades.map(upgrade => ({ ...upgrade, progress: undefined, remainingLabel: undefined })), activeProject: next.activeProject ? { ...next.activeProject, progress: undefined, remainingText: undefined } : null };
    const signature = JSON.stringify(withoutProgress);
    if (signature !== layoutSignature) { layoutSignature = signature; render(); } else updateProgress();
  }

  host.replaceChildren(root);
  setModel(initial);
  return {
    setModel,
    destroy(): void {
      if (destroyed) return;
      destroyed = true;
      upgradeCards.splice(0).forEach(card => card.destroy());
      root.removeEventListener('click', onClick);
      root.remove();
    },
  };
}
