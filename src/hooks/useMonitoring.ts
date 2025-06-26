// hooks/useMonitoring.ts
import { useEffect } from 'react';

export const useMonitoring = (enabled: boolean, userId: string) => {
  useEffect(() => {
    if (!enabled) return;

    const logAccess = async () => {
      await fetch('/api/log-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userId,
        }),
      });
    };

    logAccess();
  }, [enabled, userId]);
};
