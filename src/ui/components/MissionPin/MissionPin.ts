import type { MissionPinHandle, MissionPinViewModel } from './MissionPin.types';
import './MissionPin.css';
/** Interactive map locator; never computes progress, rewards, difficulty or selection. */
export function mountMissionPin(host: HTMLElement, initial: Readonly<MissionPinViewModel>, onSelect: (id: string) => void): MissionPinHandle {
  const controller = new AbortController();
  let model = initial;
  let disposed = false;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dt-mission-pin';
  button.innerHTML = `<span class="dt-mission-pin__difficulty" aria-hidden="true"></span>
    <span class="dt-mission-pin__line"><span class="dt-mission-pin__icon" aria-hidden="true"></span><span class="dt-mission-pin__rewards" aria-hidden="true"></span></span>
    <span class="dt-mission-pin__progress"><span class="dt-mission-pin__progress-bar"></span></span>
    <span class="dt-mission-pin__tooltip" role="tooltip"></span>`;
  button.addEventListener('click', () => { if (!disposed) onSelect(model.id); }, { signal: controller.signal });
  host.replaceChildren(button);
  const diff = button.querySelector<HTMLElement>('.dt-mission-pin__difficulty')!;
  const icon = button.querySelector<HTMLElement>('.dt-mission-pin__icon')!;
  const rewards = button.querySelector<HTMLElement>('.dt-mission-pin__rewards')!;
  const progress = button.querySelector<HTMLElement>('.dt-mission-pin__progress')!;
  const bar = button.querySelector<HTMLElement>('.dt-mission-pin__progress-bar')!;
  const tooltip = button.querySelector<HTMLElement>('.dt-mission-pin__tooltip')!;
  const setModel = (next: Readonly<MissionPinViewModel>) => {
    if (disposed) return;
    model = next;
    button.dataset.state = next.state;
    button.dataset.tier = String(next.tier);
    button.dataset.missionId = next.id;
    button.classList.toggle('dt-mission-pin--selected', !!next.selected);
    button.setAttribute('aria-pressed', String(!!next.selected));
    button.style.left = `${next.x}%`;
    button.style.top = `${next.y}%`;
    diff.textContent = next.difficultyIcons;
    icon.textContent = next.state === 'completed' ? '✓' : next.icon;
    rewards.textContent = next.rewardIcons.slice(0, 2).join(' ');
    const running = next.state === 'inProgress';
    progress.hidden = !running;
    bar.style.width = `${Math.max(0, Math.min(100, (next.raidProgress ?? 0) * 100))}%`;
    const desc = running ? `${Math.round((next.raidProgress ?? 0) * 100)}% in progress` : next.state;
    tooltip.textContent = `${next.name} · ${next.raidStatusLabel ?? desc}`;
    button.setAttribute('aria-label', `${next.name}, tier ${next.tier}, ${next.difficultyIcons.length} difficulty, ${desc}`);
  };
  setModel(initial);
  return { setModel, destroy() { disposed = true; controller.abort(); button.remove(); } };
}
