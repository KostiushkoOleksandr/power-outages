import { useEffect, useState } from "react";
import { fetchOutages } from "../api/outages";
import type { OutagesResponse } from "../types/outtages";

const CACHE_KEY = "outagesCache";

function readCache(): OutagesResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as OutagesResponse) : null;
  } catch {
    return null;
  }
}

function writeCache(data: OutagesResponse): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
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

export function useOutages(): UseOutagesResult {
  const [initial] = useState(readCache);
  const [data, setData] = useState<OutagesResponse | null>(initial);
  const [loading, setLoading] = useState(initial === null);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(initial !== null);

  useEffect(() => {
    let cancelled = false;

    fetchOutages()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setFromCache(false);
        setError(null);
        writeCache(result);
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
  }, []);

  return { data, loading, error, fromCache };
}