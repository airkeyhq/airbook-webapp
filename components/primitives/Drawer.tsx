'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Dismiss24Filled } from '@fluentui/react-icons';
import { Icon } from './Icon';

export type DrawerSide = 'bottom' | 'right' | 'left';
export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerIcon?: React.ReactNode;
  footer?: React.ReactNode;
  showHandle?: boolean;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sidePanelClasses: Record<DrawerSide, string> = {
  bottom: 'inset-x-0 bottom-0 rounded-t-3xl border-t',
  right: 'inset-y-0 right-0 h-full rounded-l-3xl border-l',
  left: 'inset-y-0 left-0 h-full rounded-r-3xl border-r',
};

const sizeClasses: Record<DrawerSide, Record<DrawerSize, string>> = {
  bottom: {
    sm: 'max-h-[50vh]',
    md: 'max-h-[80vh]',
    lg: 'max-h-[92vh]',
  },
  right: {
    sm: 'w-full max-w-xs',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-xl',
  },
  left: {
    sm: 'w-full max-w-xs',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-xl',
  },
};

const motionVariants: Record<
  DrawerSide,
  { initial: { x?: string | number; y?: string | number; opacity: number }; animate: { x: number; y: number; opacity: number } }
> = {
  bottom: {
    initial: { y: '100%', opacity: 0.5 },
    animate: { x: 0, y: 0, opacity: 1 },
  },
  right: {
    initial: { x: '100%', opacity: 0.5 },
    animate: { x: 0, y: 0, opacity: 1 },
  },
  left: {
    initial: { x: '-100%', opacity: 0.5 },
    animate: { x: 0, y: 0, opacity: 1 },
  },
};

/**
 * Reusable Ozone UI Drawer / Sheet primitive.
 * Supports bottom sheets (mobile-first) and left/right slide-over drawers.
 */
export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  side = 'bottom',
  size = 'md',
  title,
  description,
  headerIcon,
  footer,
  showHandle = true,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!mounted) return null;

  const variant = motionVariants[side];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[250] font-sans antialiased text-[var(--text-primary)]"
          style={{
            fontFamily:
              'var(--font-geist-sans, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif)',
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => {
              if (closeOnBackdrop) onClose();
            }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.initial}
            transition={{ type: 'spring', damping: 32, stiffness: 360 }}
            drag={side === 'bottom' && showHandle ? 'y' : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.55 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 400) {
                onClose();
              }
            }}
            className={`fixed flex flex-col bg-[var(--bg-primary)] border-[var(--border-subtle)] shadow-2xl overflow-hidden ${sidePanelClasses[side]} ${sizeClasses[side][size]} ${className}`}
          >
            {/* Bottom Sheet Handle */}
            {side === 'bottom' && showHandle && (
              <div
                onPointerDown={(e) => dragControls.start(e)}
                title="Drag down to dismiss"
                className="group/handle pt-3 pb-1.5 flex justify-center flex-shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
              >
                <div className="w-10 h-1 rounded-full bg-[var(--border-subtle)] transition-all duration-150 group-hover/handle:w-12 group-hover/handle:bg-[var(--text-muted)]/60 group-active/handle:w-9" />
              </div>
            )}

            {/* Header */}
            {(title || description || showCloseButton) && (
              <div
                className={`flex items-start justify-between gap-3 px-5 pb-3 border-b border-[var(--border-subtle)] flex-shrink-0 ${
                  side === 'bottom' && showHandle ? 'pt-2' : 'pt-4'
                }`}
              >
                <div className="min-w-0">
                  {title && (
                    <div className="flex items-center gap-2 text-sm font-black text-[var(--text-primary)]">
                      {headerIcon && <span className="flex-shrink-0">{headerIcon}</span>}
                      <span className="truncate">{title}</span>
                    </div>
                  )}
                  {description && (
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close drawer"
                    className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer flex-shrink-0"
                  >
                    <Icon filled={Dismiss24Filled} size="md" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

            {/* Optional Footer */}
            {footer && (
              <div className="px-5 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex-shrink-0">
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
