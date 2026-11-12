import type { RoomOverviewHandle, RoomOverviewViewModel } from './RoomOverviewCard.types';
import './RoomOverviewCard.css';

/** Reusable, display-only room artwork + optional heading + stats. */
export function mountRoomOverviewCard(
  host: HTMLElement,
  initial: Readonly<RoomOverviewViewModel>,
  options: { readonly variant?: 'default' | 'embedded' } = {},
): RoomOverviewHandle {
  const root = document.createElement('section');
  root.className = `dt-room-card${options.variant === 'embedded' ? ' dt-room-card--embedded' : ''}`;
  root.setAttribute('aria-label', 'Room overview');
  const art = document.createElement('div');
  art.className = 'dt-room-card__art';
  const image = document.createElement('img');
  image.className = 'dt-room-card__image';
  art.append(image);
  const details = document.createElement('div');
  details.className = 'dt-room-card__details';
  const heading = document.createElement('h1');
  heading.className = 'dt-room-card__name';
  const stats = document.createElement('div');
  stats.className = 'dt-room-card__stats';
  if (options.variant !== 'embedded') details.append(heading);
  details.append(stats);
  root.append(art, details);
  host.replaceChildren(root);
  let destroyed = false;
  function setModel(model: Readonly<RoomOverviewViewModel>): void {
    if (destroyed) return;
    heading.textContent = model.title;
    if (image.getAttribute('src') !== model.imageSrc) image.src = model.imageSrc;
    image.alt = model.imageAlt;
    const fragments: HTMLElement[] = [];
    for (const stat of model.stats) {
      const line = document.createElement('div');
      line.className = 'dt-room-card__stat';
      const icon = document.createElement('span');
      icon.className = 'dt-room-card__stat-icon';
      icon.textContent = stat.icon;
      icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.textContent = stat.label;
      const value = document.createElement('strong');
      value.className = stat.emphasized ? 'dt-room-card__stat-value dt-room-card__stat-value--gold' : 'dt-room-card__stat-value';
      value.textContent = stat.value;
      line.append(icon, label, value);
      fragments.push(line);
    }
    stats.replaceChildren(...fragments);
  }
  setModel(initial);
  return { setModel, destroy() { destroyed = true; root.remove(); } };
}
