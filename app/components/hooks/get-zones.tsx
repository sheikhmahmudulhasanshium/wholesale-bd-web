import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { Zone } from '@/lib/types';

export function useZones() {
  const [zones, setZones] = useState<Zone[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    apiClient.zones.findAll()
      .then(res => {
        if (isMounted) {
          setZones(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Failed to fetch zones');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { zones, loading, error };
}
