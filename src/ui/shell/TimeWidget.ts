import type { TimeWidgetActionHandler, TimeWidgetHandle, TimeWidgetViewModel } from './TimeWidget.types';
import './TimeWidget.css';

/**
 * Dark Tower time widget — VIEW ONLY.
 * Ported from ViewModelsProto/ui-views/time-widget (time-widget-view.js), converted to TS.
 * No clock timers, save state, or game rules here — call setModel() with the latest snapshot
 * and route onAction() to the controller.
 */

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SPEEDS = [0.5, 1, 2, 5, 10];

const foldIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>';
const calendarIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="5" width="14" height="12" rx="1"/><path d="M6 3v4M14 3v4M3 9h14M7 12h2M11 12h2"/></svg>';
const pauseIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="4" width="3.5" height="12" rx=".5"/><rect x="11.5" y="4" width="3.5" height="12" rx=".5"/></svg>';
const playIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 3.5L16 10 6 16.5z"/></svg>';
const crownIcon = '<svg class="tw-payday-icon" viewBox="0 0 24 20" aria-hidden="true"><path d="M3 5l5 4 4-7 4 7 5-4-2 10H5zM5 17h14v2H5z" fill="currentColor"/></svg>';

function makeDayCells(): string {
  const initials = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return initials.map((letter, index) => {
    const monday = index === 0;
    return `<span class="tw-day-cell" data-day="${index + 1}" title="${DAYS[index]}${monday ? ' — Payday' : ''}" aria-label="${DAYS[index]}${monday ? ', Payday' : ''}">${monday ? crownIcon : ''}${letter}</span>`;
  }).join('');
}

function makeSpeedButtons(): string {
  return SPEEDS.map(speed =>
    `<button class="tw-speed" type="button" data-action="setSpeed" data-speed="${speed}" aria-label="Time speed ${speed} times">${speed}x</button>`
  ).join('');
}

const dialMarkup = `
  <svg class="tw-clock-svg" viewBox="0 0 120 120" role="img" aria-label="Time-of-day dial">
    <circle cx="60" cy="60" r="55" fill="#29333b"/>
    <circle cx="60" cy="60" r="50" fill="none" stroke="#42505a" stroke-width="10"/>
    <circle class="tw-clock-progress" cx="60" cy="60" r="50" fill="none" stroke="#eebf59" stroke-width="10" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 60 60)"/>
    <g transform="translate(60 83) scale(.4) translate(-60 -60)">
    <g class="tw-sun" stroke="#f6c85f" stroke-width="3.5" stroke-linecap="round">
      <circle cx="60" cy="60" r="11" fill="#f6c85f" stroke="none"/>
      <path d="M60 37v9M60 74v9M37 60h9M74 60h9M44 44l6 6M70 70l6 6M76 44l-6 6M50 70l-6 6"/>
    </g>
    <g class="tw-moon" fill="#e6d8b5">
      <path d="M70 42a20 20 0 1 0 8 33A21 21 0 0 1 70 42z"/>
    </g>
    </g>
    <g class="tw-hour-marker">
      <path d="M60 9L54 20h12z" transform="translate(60 14.5) scale(1.1) translate(-60 -14.5)"/>
    </g>
  </svg>`;

export function mountTimeWidget(host: HTMLElement, initial: Readonly<TimeWidgetViewModel>, onAction: TimeWidgetActionHandler = () => {}): TimeWidgetHandle {
  const abort = new AbortController();
  host.innerHTML = `
    <section class="tw-widget${initial.hour >= 12 ? ' is-daytime' : ''}" aria-label="Game time">
      <div class="tw-expanded">
        <button class="tw-fold" type="button" data-action="toggleExpanded" aria-label="Collapse time widget" aria-expanded="true">
          ${foldIcon}
        </button>
        <div class="tw-main">
          <div class="tw-clock">
            ${dialMarkup}
            <span class="tw-clock-time" data-role="time">13:00</span>
          </div>
          <div class="tw-summary">
            <div class="tw-day-summary">
              <div class="tw-heading"><span>Day <strong data-role="day">6</strong></span><span class="tw-weekday" data-role="weekday">Saturday</span></div>
              <progress class="tw-day-progress" max="1440" value="0" aria-label="Day elapsed"></progress>
            </div>
            <div class="tw-weekdays" aria-label="Weekdays, Monday is payday">${makeDayCells()}</div>
            <div class="tw-week-number">${calendarIcon}<span>Week <strong data-role="week">5</strong></span></div>
          </div>
        </div>
        <div class="tw-controls" aria-label="Clock playback controls">
          ${makeSpeedButtons()}
          <button class="tw-play" type="button" data-action="togglePause" aria-label="Resume time">${playIcon}</button>
        </div>
      </div>
      <div class="tw-collapsed" hidden>
        <button class="tw-unfold" type="button" data-action="toggleExpanded" aria-label="Expand time widget" aria-expanded="false">${foldIcon}</button>
        <span class="tw-small-time" data-role="time">13:00</span>
        <button class="tw-play" type="button" data-action="togglePause" aria-label="Resume time">${playIcon}</button>
        <button class="tw-current-speed" type="button" data-action="cycleSpeed" title="Cycle through speeds" aria-label="Cycle time speed">2x</button>
        <span class="tw-small-day">Day <strong data-role="day">6</strong></span>
      </div>
    </section>`;

  const element = host.querySelector<HTMLElement>('.tw-widget')!;
  let lastPaused: boolean | null = null;
  element.addEventListener('click', event => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target || !element.contains(target)) return;
    const type = target.dataset.action!;
    if (type === 'setSpeed') onAction({ type: 'setSpeed', speed: Number(target.dataset.speed) });
    else onAction({ type } as never);
  }, { signal: abort.signal });

  function setModel(state: Readonly<TimeWidgetViewModel>): void {
    const { day, week, hour, minute, paused, speed, expanded } = state;
    const safeDay = Math.min(7, Math.max(1, Number(day) || 1));
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    element.querySelector<HTMLElement>('.tw-expanded')!.hidden = !expanded;
    element.querySelector<HTMLElement>('.tw-collapsed')!.hidden = Boolean(expanded);
    element.classList.toggle('is-collapsed', !expanded);

    element.querySelectorAll<HTMLElement>('[data-role="time"]').forEach(el => el.textContent = time);
    element.querySelectorAll<HTMLElement>('[data-role="day"]').forEach(el => el.textContent = String(safeDay));
    element.querySelector<HTMLElement>('[data-role="weekday"]')!.textContent = DAYS[safeDay - 1];
    element.querySelector<HTMLElement>('[data-role="week"]')!.textContent = String(week);
    element.querySelectorAll<HTMLElement>('.tw-day-cell').forEach(el => {
      const current = Number(el.dataset.day) === safeDay;
      el.classList.toggle('is-current', current);
      el.setAttribute('aria-current', current ? 'date' : 'false');
    });
    element.querySelectorAll<HTMLButtonElement>('.tw-speed').forEach(button => {
      const active = Number(button.dataset.speed) === speed;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (paused !== lastPaused) {
      lastPaused = paused;
      element.querySelectorAll<HTMLButtonElement>('.tw-play').forEach(button => {
        button.innerHTML = paused ? playIcon : pauseIcon;
        button.setAttribute('aria-label', paused ? 'Resume time' : 'Pause time');
        button.setAttribute('aria-pressed', String(paused));
        button.title = paused ? 'Resume' : 'Pause';
      });
    }
    const speedButton = element.querySelector<HTMLButtonElement>('.tw-current-speed')!;
    speedButton.textContent = `${speed}x`;
    speedButton.setAttribute('aria-label', `Current speed ${speed} times. Click to cycle speed.`);
    const isDaytime = hour >= 12;
    element.classList.toggle('is-daytime', isDaytime);
    element.querySelector<SVGSVGElement>('.tw-clock-svg')!.setAttribute('aria-label', `${time}, ${isDaytime ? 'daytime' : 'nighttime'}`);
    const elapsedMinutes = hour * 60 + minute;
    // A watch face repeats every 12 hours; the separate day bar spans all 24.
    const dialProgress = (elapsedMinutes % 720) / 720;
    element.querySelector<SVGCircleElement>('.tw-clock-progress')!.setAttribute('stroke-dashoffset', String(1 - dialProgress));
    element.querySelector<SVGGElement>('.tw-hour-marker')!.setAttribute('transform', `rotate(${dialProgress * 360} 60 60)`);
    const dayProgress = element.querySelector<HTMLProgressElement>('.tw-day-progress')!;
    dayProgress.value = elapsedMinutes;
    dayProgress.setAttribute('aria-valuetext', `${time} of 24:00`);
  }

  setModel(initial);
  return {
    setModel,
    destroy(): void {
      abort.abort();
      host.replaceChildren();
    },
  };
}
