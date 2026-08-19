'use client';

import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Search24Regular, Add24Filled, WeatherMoon24Regular } from '@fluentui/react-icons';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    toggleTheme,
    setViewMode,
    openBookingDrawer,
    services,
    appointments,
  } = useAirBookStore();
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Command Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative w-full max-w-lg glass-panel rounded-3xl p-3 shadow-2xl bg-white/90 dark:bg-gray-900/90 border border-white/80 dark:border-white/10 z-10 overflow-hidden"
        >
          <Command className="w-full">
            <div className="flex items-center px-3 border-b border-black/5 dark:border-white/10 pb-2">
              <Search24Regular className="w-4 h-4 text-gray-400 mr-2" />
              <Command.Input
                autoFocus
                placeholder={t('searchPlaceholder')}
                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-gray-400 focus:outline-none py-1.5"
              />
            </div>

            <Command.List className="max-h-72 overflow-y-auto pt-2 space-y-1">
              <Command.Empty className="text-center py-6 text-xs text-[var(--text-muted)]">
                No matching bookings or commands found.
              </Command.Empty>

              <Command.Group heading="Quick Actions" className="px-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                <Command.Item
                  onSelect={() => {
                    openBookingDrawer();
                    setCommandPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
                >
                  <Add24Filled className="w-4 h-4" />
                  <span>Create New Booking Slot</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    toggleTheme();
                    setCommandPaletteOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] hover:bg-blue-500 hover:text-white cursor-pointer transition-colors"
                >
                  <WeatherMoon24Regular className="w-4 h-4" />
                  <span>Toggle Dark / Light Theme</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Existing Bookings" className="px-2 text-[10px] uppercase tracking-wider text-gray-400 font-semibold my-1">
                {appointments.map((apt) => (
                  <Command.Item
                    key={apt.id}
                    onSelect={() => setCommandPaletteOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: apt.color }} />
                      <span className="font-medium">{apt.clientName}</span>
                      <span className="text-[11px] text-[var(--text-muted)]">— {apt.serviceName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400">{apt.startTime}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
