'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartPosition, type VerticalPlacement, type HorizontalPlacement } from '@/lib/useSmartPosition';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  preferredVertical?: VerticalPlacement;
  preferredHorizontal?: HorizontalPlacement;
  disabled?: boolean;
  className?: string;
}

/**
 * Space-smart Tooltip primitive for Ozone UI.
 * Automatically flips top/bottom and left/center/right based on available viewport space.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  preferredVertical = 'top',
  preferredHorizontal = 'center',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const { vertical, horizontal, motionY } = useSmartPosition({
    isOpen: isOpen && !disabled,
    triggerRef,
    floatingRef,
    estimatedWidth: 160,
    estimatedHeight: 36,
    preferredVertical,
    preferredHorizontal,
    offset: 8,
  });

  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || disabled || !triggerRef.current) return;
    const update = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const top = vertical === 'top' ? rect.top - 8 : rect.bottom + 8;
      const left =
        horizontal === 'left'
          ? rect.left
          : horizontal === 'right'
            ? rect.right
            : rect.left + rect.width / 2;
      setCoords({ top, left });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [isOpen, disabled, vertical, horizontal]);

  const arrowVerticalClass = vertical === 'top' ? '-bottom-1' : '-top-1';
  const arrowHorizontalClass =
    horizontal === 'left'
      ? 'left-3'
      : horizontal === 'right'
        ? 'right-3'
        : 'left-1/2 -translate-x-1/2';

  const transformOriginTranslate =
    horizontal === 'left'
      ? vertical === 'top'
        ? 'translate(0, -100%)'
        : 'translate(0, 0)'
      : horizontal === 'right'
        ? vertical === 'top'
          ? 'translate(-100%, -100%)'
          : 'translate(-100%, 0)'
        : vertical === 'top'
          ? 'translate(-50%, -100%)'
          : 'translate(-50%, 0)';

  const tooltipNode = (
    <AnimatePresence>
      {isOpen && !disabled && content && coords && (
        <div
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            transform: transformOriginTranslate,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            ref={floatingRef}
            role="tooltip"
            initial={{ opacity: 0, y: motionY, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: motionY, scale: 0.95 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="relative whitespace-nowrap rounded-xl bg-[var(--text-primary)] px-2.5 py-1 text-[11px] font-semibold text-[var(--bg-primary)] shadow-lg"
          >
            <span>{content}</span>
            <span
              className={`absolute h-2 w-2 rotate-45 bg-[var(--text-primary)] ${arrowVerticalClass} ${arrowHorizontalClass}`}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => !disabled && setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => !disabled && setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      className={`relative inline-flex items-center ${className}`}
    >
      {children}
      {typeof document !== 'undefined' ? createPortal(tooltipNode, document.body) : tooltipNode}
    </div>
  );
};
