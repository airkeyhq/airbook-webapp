'use client';

import { useEffect } from 'react';
import { useAirBookStore } from '@/lib/store';

/**
 * Global keyboard shortcut listener for toggling Demo Mode.
 * Trigger: Ctrl + D (or Cmd + D on Mac)
 */
export function useDemoShortcut(onToggled?: (isDemo: boolean) => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+D or Cmd+D
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        useAirBookStore.getState().toggleDemoMode();
        const nextState = useAirBookStore.getState().isDemoMode;
        onToggled?.(nextState);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggled]);
}
