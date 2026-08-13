'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Warning24Regular, Dismiss24Filled } from '@fluentui/react-icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Dialog Container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 460, damping: 30 }}
          className="relative w-full max-w-sm bg-[var(--bg-primary)] rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl border border-[var(--border-subtle)] z-10 space-y-5"
        >
          {/* Mobile Drag Handle */}
          <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto -mt-2 mb-2 sm:hidden" />

          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)]"
          >
            <Dismiss24Filled className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            {variant === 'danger' && (
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Warning24Regular className="w-5 h-5 text-red-500" />
              </div>
            )}
            <div>
              <h3 className="text-base font-extrabold text-[var(--text-primary)]">{title}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{description}</p>
            </div>
          </div>

          {/* Vertical Button Stacking */}
          <div className="flex flex-col gap-2.5 w-full pt-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onConfirm}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 ${
                variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-black text-white dark:bg-white dark:text-black'
              }`}
            >
              {confirmLabel}
            </motion.button>
            <button
              onClick={onCancel}
              className="w-full py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-bold text-[var(--text-primary)] transition-colors"
            >
              {cancelLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
