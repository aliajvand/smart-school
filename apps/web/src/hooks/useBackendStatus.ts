'use client';

import { useState, useEffect } from 'react';
import { checkBackendHealth, type BackendHealth } from '@/lib/api-client';

export function useBackendStatus() {
  const [health, setHealth] = useState<BackendHealth>({
    online: false,
    latencyMs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function probe() {
      try {
        const res = await checkBackendHealth();
        if (isMounted) {
          setHealth(res);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setHealth({ online: false, latencyMs: 0 });
          setLoading(false);
        }
      }
    }

    probe();
    // Probe every 15 seconds
    const interval = setInterval(probe, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const apiStatus: 'connected' | 'offline_mock' | 'error' = health.online
    ? 'connected'
    : 'offline_mock';

  return {
    apiStatus,
    health,
    loading,
  };
}
