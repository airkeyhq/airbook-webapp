'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAirBookStore } from '@/lib/store';

export function useInactivityLock() {
  const { posSecurityEnabled, posAutoLockTimeout, isPosLocked, lockPos } = useAirBookStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!posSecurityEnabled || posAutoLockTimeout <= 0 || isPosLocked) {
      return;
    }

    const timeoutMs = posAutoLockTimeout * 60 * 1000;
    timerRef.current = setTimeout(() => {
      lockPos();
    }, timeoutMs);
  }, [posSecurityEnabled, posAutoLockTimeout, isPosLocked, lockPos]);

  useEffect(() => {
    if (!posSecurityEnabled || posAutoLockTimeout <= 0 || isPosLocked) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Initialize timer
    resetTimer();

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'touchstart',
      'scroll',
      'pointerdown',
      'click',
    ];

    // Throttle event handlers to avoid performance hits
    let lastActivity = Date.now();
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivity > 1000) {
        lastActivity = now;
        resetTimer();
      }
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleActivity, { passive: true });
    });

    // Also handle tab visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        resetTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [posSecurityEnabled, posAutoLockTimeout, isPosLocked, resetTimer]);
}
