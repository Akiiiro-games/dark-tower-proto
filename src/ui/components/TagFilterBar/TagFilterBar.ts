import type { TagFilterBarHandle, TagFilterBarViewModel } from './TagFilterBar.types';
import './TagFilterBar.css';

/** Generic, controlled multi-select semantic tag chips. Special `all` option is routed by the parent. */
export function mountTagFilterBar(host: HTMLElement, initial: Readonly<TagFilterBarViewModel>, onToggle: (id: string) => void): TagFilterBarHandle {
  const abort = new AbortController();
  const root = document.createElement('div');
  root.className = 'dt-tags';
  root.setAttribute('role', 'group');
  root.setAttribute('aria-label', 'Filter items by type');
  let destroyed = false;
  const existing = new Map<string, HTMLButtonElement>();
  function setModel(model: Readonly<TagFilterBarViewModel>): void {
    if (destroyed) return;
    const ids = new Set(model.options.map(option => option.id));
    for (const [id, button] of existing) if (!ids.has(id)) { button.remove(); existing.delete(id); }
    for (const [index, option] of model.options.entries()) {
      let button = existing.get(option.id);
      if (!button) {
        button = document.createElement('button');
        button.type = 'button'; button.className = 'dt-tags__option';
        const icon = document.createElement('span'); icon.className = 'dt-tags__icon'; icon.setAttribute('aria-hidden', 'true');
        const text = document.createElement('span'); text.className = 'dt-tags__label';
        button.append(icon, text);
        button.addEventListener('click', () => onToggle(option.id), { signal: abort.signal });
        existing.set(option.id, button);
      }
      button.children[0].textContent = option.icon;
      button.children[1].textContent = option.title;
      button.setAttribute('aria-pressed', String(option.active));
      button.classList.toggle('dt-tags__option--active', option.active);
      // Keep stable DOM nodes in place; timer updates must not steal keyboard focus.
      if (root.children[index] !== button) root.insertBefore(button, root.children[index] ?? null);
    }
  }
  host.replaceChildren(root);
  setModel(initial);
  return { setModel, destroy() { destroyed = true; abort.abort(); root.remove(); existing.clear(); } };
}
