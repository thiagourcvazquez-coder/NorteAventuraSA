import { useEffect, useState } from 'react';
import type { Excursion } from './types';
import { getExcursions } from './lib/supabase';

export function useExcursions() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getExcursions().then((data) => {
      if (alive) {
        setExcursions(data);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return { excursions, loading };
}
