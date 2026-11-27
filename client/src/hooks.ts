import { useEffect, useState } from 'react';
import type { Excursion } from './types';
import { getExcursions } from './lib/supabase';
import { sortExcursions } from './data/catalogMeta';

export function useExcursions() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getExcursions().then((data) => {
      if (alive) {
        setExcursions(sortExcursions(data));
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return { excursions, loading };
}
