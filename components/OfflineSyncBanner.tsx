'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff24Filled, Wifi124Filled, Dismiss24Filled } from '@fluentui/react-icons';

export const OfflineSyncBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnect, setShowReconnect] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(() => setSwRegistered(true))
        .catch((err) => console.warn('Service worker registration failed:', err));
    }

    const handleOffline = () => { setIsOnline(false); setShowReconnect(false); };
    const handleOnline = () => { setIsOnline(true); setShowReconnect(true); setTimeout(() => setShowReconnect(false), 4000); };

    setIsOnline(navigator.onLine);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          key="offline"
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-xs font-extrabold shadow-lg"
        >
          <WifiOff24Filled className="w-4 h-4 flex-shrink-0" />
          <span>You are offline. AirBook will sync automatically when your connection returns.</span>
        </motion.div>
      )}

      {/* Reconnected Banner */}
      {showReconnect && isOnline && (
        <motion.div
          key="reconnected"
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-xs font-extrabold shadow-lg"
        >
          <Wifi124Filled className="w-4 h-4 flex-shrink-0" />
          <span>Back online — AirBook is synced and ready.</span>
          <button
            type="button"
            onClick={() => setShowReconnect(false)}
            className="ml-2 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <Dismiss24Filled className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineSyncBanner;
