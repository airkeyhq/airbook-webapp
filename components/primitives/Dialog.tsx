'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dismiss24Filled } from '@fluentui/react-icons';
import { Icon } from './Icon';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerIcon?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

/**
 * Ozone UI Dialog / Modal primitive.
 * Centered portaled modal with backdrop blur, Escape dismiss, and header/footer slots.
 */
export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  size = 'md',
  title,
  description,
  headerIcon,
  footer,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[260] flex items-center justify-center p-4 font-sans antialiased text-[var(--text-primary)]"
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
            transition={{ duration: 0.16 }}
            onClick={() => {
              if (closeOnBackdrop) onClose();
            }}
            className="fixed inset-0 bg-black/35 backdrop-blur-[3px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full ${SIZE_CLASSES[size]} rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[88vh] ${className}`}
          >
            {(title || description || showCloseButton) && (
              <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-[var(--border-subtle)] flex-shrink-0">
                <div className="min-w-0">
                  {title && (
                    <div className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)]">
                      {headerIcon && <span className="flex-shrink-0">{headerIcon}</span>}
                      <span className="truncate">{title}</span>
                    </div>
                  )}
                  {description && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Icon filled={Dismiss24Filled} size="md" />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {footer && (
              <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
