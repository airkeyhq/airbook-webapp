'use client';

import React, { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dismiss24Filled } from '@fluentui/react-icons';
import { Icon } from '@/components/primitives/Icon';

export interface SettingsTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  content: React.ReactNode;
}

export interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  tabs: SettingsTab[];
  footer?: React.ReactNode;
}

/**
 * Ozone UI SettingsDialog composite.
 * Two-pane settings modal with sidebar navigation and content pane.
 */
export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  tabs,
  footer,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '');
  const layoutGroupId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[265] flex items-center justify-center p-4 font-sans antialiased text-[var(--text-primary)]"
          style={{
            fontFamily:
              'var(--font-geist-sans, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif)',
          }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-[3px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-3xl h-[540px] max-h-[88vh] rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Sidebar */}
            <aside className="w-full md:w-56 bg-[var(--bg-secondary)] border-b md:border-b-0 md:border-r border-[var(--border-subtle)] p-4 flex flex-col gap-4 flex-shrink-0">
              <div>
                <h2 className="text-sm font-black text-[var(--text-primary)]">{title}</h2>
                {subtitle && (
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{subtitle}</p>
                )}
              </div>

              <nav className="flex md:flex-col gap-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTab?.id;
                  const renderedIcon = isActive && tab.activeIcon ? tab.activeIcon : tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTabId(tab.id)}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'text-[#2BB5FF]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId={`settings-tab-pill-${layoutGroupId}`}
                          transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                          className="absolute inset-0 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs"
                        />
                      )}
                      {renderedIcon && (
                        <span className="relative z-10 w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                          {renderedIcon}
                        </span>
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Right Pane */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between flex-shrink-0">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
                  {activeTab?.label}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close settings"
                  className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer"
                >
                  <Icon filled={Dismiss24Filled} size="md" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab?.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {activeTab?.content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {footer}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
