import { useEffect, useState } from "react";
import { fetchOutages } from "../api/outages";
import type { OutagesResponse } from "../types/outtages";
import type { Region } from "../data/regions";

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

    fetchOutages(region.file)
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setFromCache(false);
        setError(null);
        writeCache(cacheKey, result);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [region.file, cacheKey]);

  return { data, loading, error, fromCache };
}