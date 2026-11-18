export interface Region {
  id: string;
  name: string; // прикметник: "Житомирська"
  file: string; // назва JSON-файлу без розширення
}

const REGION_LIST: Region[] = [
  { id: "zhytomyr", name: "Житомирська", file: "Zhytomyroblenergo" },
  { id: "poltava", name: "Полтавська", file: "Poltavaoblenergo" },
  { id: "chernihiv", name: "Чернігівська", file: "Chernihivoblenergo" },
  { id: "rivne", name: "Рівненська", file: "Rivneoblenergo" },
  { id: "zaporizhzhia", name: "Запорізька", file: "Zaporizhzhiaoblenergo" },
  { id: "cherkasy", name: "Черкаська", file: "Cherkasyoblenergo" },
  { id: "lviv", name: "Львівська", file: "Lvivoblenerho" },
  { id: "kharkiv", name: "Харківська", file: "Kharkivoblenerho" },
  { id: "khmelnytskyi", name: "Хмельницька", file: "Khmelnytskoblenerho" },
  { id: "ternopil", name: "Тернопільська", file: "Ternopiloblenerho" },
  { id: "zakarpattia", name: "Закарпатська", file: "Zakarpattiaoblenerho" },
  { id: "ivano-frankivsk", name: "Івано-Франківська", file: "Prykarpattiaoblenerho" },
];

export const REGIONS: Region[] = [...REGION_LIST].sort((a, b) =>
  a.name.localeCompare(b.name, "uk"),
);

export const DEFAULT_REGION_ID = "zhytomyr";

export function findRegion(id: string | null): Region {
  return (
    REGIONS.find((r) => r.id === id) ??
    REGIONS.find((r) => r.id === DEFAULT_REGION_ID) ??
    REGIONS[0]
  );
}

export function regionTitle(region: Region): string {
  return `${region.name} область`;
}