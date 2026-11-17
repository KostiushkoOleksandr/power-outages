import type { HourlySchedule } from "../types/outtages";

function formatSlot(index: number): string {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minutes = index % 2 === 0 ? "00" : "30";
  return `${hour}:${minutes}`;
}

export function toOutageRanges(hours: HourlySchedule): string[] {
  // 48 півгодинних слотів: true означає, що світла немає
  const slots: boolean[] = [];

  for (let hour = 1; hour <= 24; hour++) {
    const status = hours[hour];
    slots.push(status === "no" || status === "first");  // перші 30 хв
    slots.push(status === "no" || status === "second"); // другі 30 хв
  }

  const ranges: string[] = [];
  let start: number | null = null;

  slots.forEach((isOff, i) => {
    if (isOff && start === null) {
      start = i;
    }
    if (!isOff && start !== null) {
      ranges.push(`${formatSlot(start)}–${formatSlot(i)}`);
      start = null;
    }
  });

  if (start !== null) {
    ranges.push(`${formatSlot(start)}–24:00`);
  }

  return ranges;
}