'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toast, type ToastVariant } from './Toast';

export interface SonnerItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant: ToastVariant;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

type Listener = (items: SonnerItem[]) => void;

let toastQueue: SonnerItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l([...toastQueue]));
}

function addToast(item: Omit<SonnerItem, 'id'>): string {
  const id = `sonner-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const duration = item.duration ?? 4000;
  toastQueue = [{ ...item, id }, ...toastQueue].slice(0, 5);
  emit();

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }
  return id;
}

export function dismissToast(id: string) {
  toastQueue = toastQueue.filter((t) => t.id !== id);
  emit();
}

export const toast = Object.assign(
  (title: React.ReactNode, opts?: Partial<Omit<SonnerItem, 'id' | 'title'>>) =>
    addToast({ title, variant: opts?.variant ?? 'default', ...opts }),
  {
    success: (title: React.ReactNode, opts?: Partial<Omit<SonnerItem, 'id' | 'title' | 'variant'>>) =>
      addToast({ title, variant: 'success', ...opts }),
    error: (title: React.ReactNode, opts?: Partial<Omit<SonnerItem, 'id' | 'title' | 'variant'>>) =>
      addToast({ title, variant: 'danger', ...opts }),
    warning: (title: React.ReactNode, opts?: Partial<Omit<SonnerItem, 'id' | 'title' | 'variant'>>) =>
      addToast({ title, variant: 'warning', ...opts }),
    info: (title: React.ReactNode, opts?: Partial<Omit<SonnerItem, 'id' | 'title' | 'variant'>>) =>
      addToast({ title, variant: 'info', ...opts }),
    dismiss: dismissToast,
  }
);

export interface ToasterProps {
  position?: 'bottom-right' | 'top-right' | 'bottom-center';
}

const POS_CLASSES: Record<NonNullable<ToasterProps['position']>, string> = {
  'bottom-right': 'bottom-5 right-5 items-end',
  'top-right': 'top-5 right-5 items-end',
  'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2 items-center',
};

/**
 * Ozone UI Sonner-style stacked Toaster.
 * Mount once at app root and call `toast.success(...)` / `toast.error(...)` anywhere.
 */
export const Toaster: React.FC<ToasterProps> = ({ position = 'bottom-right' }) => {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<SonnerItem[]>(toastQueue);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    listeners.add(setItems);
    return () => {
      listeners.delete(setItems);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        fontFamily:
          'var(--font-geist-sans, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif)',
      }}
      className={`fixed z-[320] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)] pointer-events-none font-sans antialiased text-[var(--text-primary)] ${POS_CLASSES[position]}`}
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, idx) => {
          const collapsedOffset = expanded ? 0 : idx * -10;
          const collapsedScale = expanded ? 1 : Math.max(0.88, 1 - idx * 0.04);

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{
                opacity: idx > 2 && !expanded ? 0 : 1,
                y: collapsedOffset,
                scale: collapsedScale,
              }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className="w-full pointer-events-auto"
              style={{ zIndex: 50 - idx }}
            >
              <Toast
                title={item.title}
                description={item.description}
                variant={item.variant}
                action={item.action}
                onDismiss={() => dismissToast(item.id)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body
  );
};
