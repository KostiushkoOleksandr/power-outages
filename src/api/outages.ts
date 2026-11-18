import type { OutagesResponse } from "../types/outtages";

const BASE_URL =
  "https://raw.githubusercontent.com/yaroslav2901/OE_OUTAGE_DATA/main/data";

export async function fetchOutages(file: string): Promise<OutagesResponse> {
  const response = await fetch(`${BASE_URL}/${file}.json`);
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити дані: HTTP ${response.status}`);
  }
  return response.json();
}