import { useEffect, useState } from "react";
import { fetchOutages } from "../api/outages";
import type { OutagesResponse } from "../types/outtages";

interface UseOutagesResult {
  data: OutagesResponse | null;
  loading: boolean;
  error: string | null;
}

export function useOutages(): UseOutagesResult {
  const [data, setData] = useState<OutagesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchOutages()
      .then((result) => {
        if (!cancelled) setData(result);
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

  return { data, loading, error };
}