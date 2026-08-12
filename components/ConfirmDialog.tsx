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
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Dialog */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 460, damping: 30 }}
          className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-[28px] p-6 shadow-2xl border border-black/10 dark:border-white/10 z-10"
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400"
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
              <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-2xl bg-black/5 dark:bg-white/10 text-xs font-semibold text-[var(--text-primary)] hover:bg-black/10 transition-colors"
            >
              {cancelLabel}
            </button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onConfirm}
              className={`flex-1 py-2.5 rounded-2xl text-xs font-bold shadow-md transition-colors ${
                variant === 'danger'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-black text-white dark:bg-white dark:text-black'
              }`}
            >
              {confirmLabel}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
