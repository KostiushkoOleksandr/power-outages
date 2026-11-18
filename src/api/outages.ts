import type { OutagesResponse } from "../types/outtages.ts";

const OUTAGES_URL =
  "https://raw.githubusercontent.com/yaroslav2901/OE_OUTAGE_DATA/main/data/Zhytomyroblenergo.json";

export async function fetchOutages(): Promise<OutagesResponse> {
  const response = await fetch(OUTAGES_URL);
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити дані: HTTP ${response.status}`);
  }
  return response.json();
}