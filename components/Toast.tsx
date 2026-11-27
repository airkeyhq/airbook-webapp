'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckmarkCircle24Regular, ErrorCircle24Regular, Info24Regular, Dismiss24Filled } from '@fluentui/react-icons';
import { Icon } from '@/components/primitives/Icon';
import { toast as sonnerToast, dismissToast } from '@/components/primitives/Sonner';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <Icon regular={CheckmarkCircle24Regular} size="md" tone="success" />,
  error: <Icon regular={ErrorCircle24Regular} size="md" tone="danger" />,
  info: <Icon regular={Info24Regular} size="md" tone="accent" />,
};

const STYLES: Record<ToastVariant, string> = {
  success: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300',
  error: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300',
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
};

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-24 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-lg shadow-xl text-xs font-semibold max-w-xs ${STYLES[toast.variant]}`}
          >
            {ICONS[toast.variant]}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <Icon filled={Dismiss24Filled} size="sm" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook bridged to global Ozone Sonner queue so every module's addToast() renders at root
export function useToast() {
  const addToast = React.useCallback((message: string, variant: ToastVariant = 'success') => {
    if (variant === 'error') {
      sonnerToast.error(message);
    } else if (variant === 'info') {
      sonnerToast.info(message);
    } else {
      sonnerToast.success(message);
    }
  }, []);

  const dismiss = React.useCallback((id: string) => {
    dismissToast(id);
  }, []);

  return { toasts: [] as ToastMessage[], addToast, dismiss };
}
