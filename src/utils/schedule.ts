import type { HourlySchedule, Interval } from "../types/outtages";

export type PowerStatus =
  | { isOff: true; until: number }
  | { isOff: false; next: number | null };

export function formatMinutes(total: number): string {
  const h = String(Math.floor(total / 60)).padStart(2, "0");
  const m = String(total % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} хв`;
  if (m === 0) return `${h} год`;
  return `${h} год ${m} хв`;
}

export function toOutageIntervals(hours: HourlySchedule): Interval[] {
  const slots: boolean[] = [];
  for (let hour = 1; hour <= 24; hour++) {
    const status = hours[hour];
    slots.push(status === "no" || status === "first");
    slots.push(status === "no" || status === "second");
  }

  const intervals: Interval[] = [];
  let start: number | null = null;

  slots.forEach((isOff, i) => {
    if (isOff && start === null) start = i;
    if (!isOff && start !== null) {
      intervals.push({ start: start * 30, end: i * 30 });
      start = null;
    }
  });
  if (start !== null) intervals.push({ start: start * 30, end: 24 * 60 });

  return intervals;
}

export function getPowerStatus(intervals: Interval[], nowMinutes: number): PowerStatus {
  const current = intervals.find((i) => nowMinutes >= i.start && nowMinutes < i.end);
  if (current) return { isOff: true, until: current.end };

  const next = intervals.find((i) => i.start > nowMinutes);
  return { isOff: false, next: next ? next.start : null };
}