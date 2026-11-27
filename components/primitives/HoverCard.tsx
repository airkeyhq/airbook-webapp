'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartPosition } from '@/lib/useSmartPosition';

export interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  estimatedWidth?: number;
  estimatedHeight?: number;
  className?: string;
}

/**
 * Ozone UI space-smart HoverCard primitive.
 */
export const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  children,
  estimatedWidth = 280,
  estimatedHeight = 160,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { positionClass, motionY } = useSmartPosition({
    isOpen,
    triggerRef,
    floatingRef: cardRef,
    estimatedWidth,
    estimatedHeight,
    preferredVertical: 'bottom',
    preferredHorizontal: 'left',
    offset: 8,
  });

  const open = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(true), 120);
  };

  const close = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsOpen(false), 120);
  };

  return (
    <div
      ref={triggerRef}
      onMouseEnter={open}
      onMouseLeave={close}
      className={`relative inline-block ${className}`}
    >
      {trigger}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: motionY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: motionY, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: estimatedWidth }}
            className={`absolute z-[240] p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl ${positionClass}`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
