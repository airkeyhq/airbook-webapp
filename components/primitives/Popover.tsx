'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartPosition } from '@/lib/useSmartPosition';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  preferredHorizontal?: 'left' | 'right' | 'center';
  preferredVertical?: 'top' | 'bottom';
  estimatedWidth?: number;
  estimatedHeight?: number;
  className?: string;
  contentClassName?: string;
}

/**
 * Ozone UI space-smart Popover primitive.
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  preferredHorizontal = 'left',
  preferredVertical = 'bottom',
  estimatedWidth = 280,
  estimatedHeight = 200,
  className = '',
  contentClassName,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    const resolved = typeof next === 'function' ? next(isOpen) : next;
    if (!isControlled) setUncontrolledOpen(resolved);
    onOpenChange?.(resolved);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const { positionClass, motionY } = useSmartPosition({
    isOpen,
    triggerRef: containerRef,
    floatingRef,
    estimatedWidth,
    estimatedHeight,
    preferredVertical,
    preferredHorizontal,
    offset: 8,
  });

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-flex items-center ${className}`}>
      <div
        onClick={isControlled ? undefined : () => setIsOpen((o) => !o)}
        className="inline-flex items-center cursor-pointer"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={floatingRef}
            initial={{ opacity: 0, y: motionY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: motionY, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={
              contentClassName
                ? `${contentClassName} ${positionClass}`
                : `absolute z-[240] p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl ${positionClass}`
            }
            style={contentClassName ? undefined : { width: estimatedWidth }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
