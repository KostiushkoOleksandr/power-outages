export type SlotStatus = "yes" | "no" | "maybe" | "first" | "second";

// ключі "1".."24" (година доби) -> статус
export type HourlySchedule = Record<string, SlotStatus>;

// ключ групи ("GPV1.1" тощо) -> розклад по годинах
export type DaySchedule = Record<string, HourlySchedule>;

export interface OutagesResponse {
  regionId: string;
  lastUpdated: string;
  fact: {
    data: Record<string, DaySchedule>; // ключ це timestamp дня
    update: string;
    today: number;
  };
}