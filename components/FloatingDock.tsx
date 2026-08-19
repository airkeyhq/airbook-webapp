'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search24Filled, Add24Filled, WeatherMoon24Filled, WeatherSunny24Filled } from '@fluentui/react-icons';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface FloatingDockProps {
  activeTab?: string;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({ activeTab = 'calendar' }) => {
  const {
    theme,
    toggleTheme,
    viewMode,
    setViewMode,
    openBookingDrawer,
    toggleCommandPalette,
  } = useAirBookStore();
  const { t } = useTranslation();

  const SEGMENTS: { id: 'day' | 'week' | 'list'; label: string }[] = [
    { id: 'day', label: t('day') },
    { id: 'week', label: t('week') },
    { id: 'list', label: t('list') },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 pointer-events-none flex justify-center">
      <motion.div
        layout
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="glass-floating-dock pointer-events-auto rounded-full p-1.5 sm:p-2 inline-flex items-center gap-1.5 sm:gap-2 backdrop-blur-3xl shadow-2xl border border-white/60 dark:border-white/10"
      >
        {/* Search / Command Palette (⌘K) */}
        <motion.button
          layout
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Search or type Command (⌘K)"
        >
          <Search24Filled className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="hidden sm:inline">{t('search')}</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-black/5 dark:bg-white/10 rounded-md font-mono font-bold">
            ⌘K
          </kbd>
        </motion.button>

        {/* Date Segmented Control - Only visible when in Calendar module */}
        <AnimatePresence mode="popLayout">
          {activeTab === 'calendar' && (
            <motion.div
              key="calendar-segmented"
              initial={{ opacity: 0, scale: 0.85, x: -6 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: -6 }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 my-auto" />

              {/* Framer Motion Animated Segmented Control Track */}
              <div className="relative flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/10">
                {SEGMENTS.map((seg) => {
                  const isActive = viewMode === seg.id;
                  return (
                    <button
                      key={seg.id}
                      onClick={() => setViewMode(seg.id)}
                      className={`relative px-3.5 py-1.5 rounded-full text-xs font-extrabold z-10 transition-colors ${
                        isActive
                          ? 'text-black dark:text-black'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="dock-segmented-active"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          className="absolute inset-0 bg-white rounded-full shadow-md -z-10"
                        />
                      )}
                      <span>{seg.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Add Button (The Iconic Action Trigger) */}
        <motion.button
          layout
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.08, rotate: 90 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          onClick={() => openBookingDrawer('14:00')}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white shadow-lg shadow-[#2BB5FF]/35"
          title="New Booking"
        >
          <Add24Filled className="w-5 h-5" />
        </motion.button>

        <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 my-auto" />

        {/* Theme Toggle */}
        <motion.button
          layout
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'light' ? (
            <WeatherMoon24Filled className="w-4 h-4 text-gray-700" />
          ) : (
            <WeatherSunny24Filled className="w-4 h-4 text-amber-400" />
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};
