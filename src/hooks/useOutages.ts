import { useEffect, useState } from "react";
import { fetchOutages } from "../api/outages";
import type { OutagesResponse } from "../types/outtages";
import type { Region } from "../data/regions";

const REFRESH_MS = 10 * 60 * 1000; // 10 хвилин

function readCache(key: string): OutagesResponse | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as OutagesResponse) : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: OutagesResponse): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // сховище недоступне або переповнене, це не критично
  }
}

interface UseOutagesResult {
  data: OutagesResponse | null;
  loading: boolean;
  error: string | null;
  // true, якщо показані дані не вдалося оновити (збережені раніше)
  fromCache: boolean;
}

export function useOutages(region: Region): UseOutagesResult {
  const cacheKey = `outagesCache:${region.id}`;
  const [initial] = useState(() => readCache(cacheKey));
  const [data, setData] = useState<OutagesResponse | null>(initial);
  const [loading, setLoading] = useState(initial === null);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(initial !== null);

  useEffect(() => {
    let cancelled = false;

    function load() {
      fetchOutages(region.file)
        .then((result) => {
          if (cancelled) return;
          setData(result);
          setFromCache(false);
          setError(null);
          writeCache(cacheKey, result);
        })
        .catch((err: Error) => {
          if (cancelled) return;
          setError(err.message);
          setFromCache(true);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    load();
    const id = setInterval(load, REFRESH_MS);

    function onVisible() {
      if (document.visibilityState === "visible") load();
    }
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [region.file, cacheKey]);

  return { data, loading, error, fromCache };
}