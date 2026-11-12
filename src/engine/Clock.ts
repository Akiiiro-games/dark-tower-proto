import { CONFIG } from "../data/config";

/** 1 real minute = 1 in-game day (§2), scaled further by the debug speed multiplier. */
export function realSecondsToGameHours(realSeconds: number, speed: number): number {
    const hoursPerRealSecond = 24 / CONFIG.constants.dayLengthRealSeconds;
    return realSeconds * hoursPerRealSecond * speed;
}

export function dayOfHour(hours: number): number {
    return Math.floor(hours / 24);
}

export function weekOfHour(hours: number): number {
    return Math.floor(dayOfHour(hours) / CONFIG.constants.weekDays);
}

export function isNightHour(hours: number): boolean {
    return hours % 24 < 1;
}

const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function formatClock(hours: number): string {
    const week = weekOfHour(hours) + 1;
    const dayOfWeek = dayOfHour(hours) % CONFIG.constants.weekDays;
    const weekdayName = WEEKDAY_NAMES[dayOfWeek % WEEKDAY_NAMES.length];
    const hourOfDay = Math.floor(hours % 24);
    const night = hourOfDay < 6 || hourOfDay >= 20;
    return `Week ${week}, Day ${dayOfWeek + 1} (${weekdayName}), ${hourOfDay.toString().padStart(2, "0")}:00 ${night ? "🌙" : "☀️"}`;
}
