'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Spinner } from './Spinner';
import { SparkleBurst } from './SparkleBurst';

export interface PullToRefreshProps {
  /** Async callback triggered when user pulls past `threshold` and releases */
  onRefresh: () => Promise<void> | void;
  /** Pull distance in pixels required to trigger refresh @default 72 */
  threshold?: number;
  /** Maximum elastic pull distance @default 130 */
  maxPull?: number;
  /**
   * Visual style variant:
   * - 'default': Subtle floating pill indicator
   * - 'spark': Reveals Tier 1 Electric Sky Blue background beneath and bursts sparkles on release
   * @default 'default'
   */
  variant?: 'default' | 'spark';
  /** Disable pull-to-refresh gesture */
  disabled?: boolean;
  /** Optional label shown while pulling */
  pullLabel?: string;
  /** Optional label shown once threshold is reached */
  releaseLabel?: string;
  /** Optional label shown during active refresh */
  refreshingLabel?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Snapchat-style elastic Pull-to-Refresh window container.
 * Supports both touch (mobile) and pointer drag (desktop) when scrolled to top.
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  threshold = 72,
  maxPull = 130,
  variant = 'default',
  disabled = false,
  pullLabel = 'Pull to refresh',
  releaseLabel = 'Release to refresh',
  refreshingLabel = 'Refreshing...',
  children,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const springY = useSpring(0, { stiffness: 360, damping: 30 });
  const indicatorOpacity = useTransform(springY, [8, 36], [0, 1]);
  const indicatorScale = useTransform(springY, [0, threshold], [0.6, 1]);

  const progress = Math.min(1, pullY / threshold);
  const readyToRefresh = pullY >= threshold;

  const startPull = (clientY: number) => {
    if (disabled || isRefreshing) return;
    const el = scrollRef.current;
    if (el && el.scrollTop > 0) return;
    startYRef.current = clientY;
    isDraggingRef.current = true;
  };

  const movePull = (clientY: number) => {
    if (!isDraggingRef.current || startYRef.current === null || isRefreshing) return;
    const delta = clientY - startYRef.current;
    if (delta <= 0) {
      setPullY(0);
      springY.set(0);
      return;
    }
    // Rubber-band damping curve
    const damped = Math.min(maxPull, Math.pow(delta, 0.85) * 1.15);
    setPullY(damped);
    springY.set(damped);
  };

  const endPull = async () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    startYRef.current = null;

    if (pullY >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      if (variant === 'spark') {
        setBurstKey((prev) => prev + 1);
      }
      setPullY(56);
      springY.set(56);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullY(0);
        springY.set(0);
      }
    } else {
      setPullY(0);
      springY.set(0);
    }
  };

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - progress);

  const isSpark = variant === 'spark';
  const isPulled = pullY > 0 || isRefreshing;

  return (
    <div
      className={`relative overflow-hidden select-none ${
        isSpark && isPulled
          ? 'bg-gradient-to-b from-[#2BB5FF] to-[#1A8EFF] shadow-[inset_0_2px_14px_rgba(0,0,0,0.12)]'
          : ''
      } ${className}`}
      onMouseDown={(e) => startPull(e.clientY)}
      onMouseMove={(e) => movePull(e.clientY)}
      onMouseUp={endPull}
      onMouseLeave={endPull}
      onTouchStart={(e) => {
        if (e.touches[0]) startPull(e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) movePull(e.touches[0].clientY);
      }}
      onTouchEnd={endPull}
    >
      {/* ─── Top Pull-to-Refresh Reveal Zone ─── */}
      <motion.div
        style={{ height: springY, opacity: indicatorOpacity }}
        className="absolute inset-x-0 top-0 z-10 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          style={{ scale: isRefreshing ? 1 : indicatorScale }}
          className={
            isSpark
              ? 'relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm shadow-sm'
              : `inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-colors ${
                  readyToRefresh || isRefreshing
                    ? 'bg-[var(--bg-primary)] border-[#2BB5FF]/40 shadow-[0_4px_14px_-2px_rgba(43,181,255,0.3)]'
                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)]'
                }`
          }
        >
          {/* Sparkles burst on release */}
          {isSpark && (
            <SparkleBurst
              burstKey={burstKey}
              shape="pill"
              particle="mixed"
              tone="tier1"
              distanceScale={1.4}
            />
          )}

          {isRefreshing ? (
            <Spinner size="sm" color={isSpark ? 'white' : 'primary'} />
          ) : (
            <svg
              className="w-4 h-4 -rotate-90 transition-transform duration-150"
              style={{ transform: `rotate(${progress * 270 - 90}deg)` }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2.5"
                className={isSpark ? 'text-white/30' : 'text-[var(--border-subtle)]'}
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={isSpark ? '#FFFFFF' : '#2BB5FF'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
          )}
          <span
            className={`text-[11px] font-bold tracking-tight ${
              isSpark
                ? 'text-white'
                : readyToRefresh || isRefreshing
                  ? 'text-[#2BB5FF]'
                  : 'text-[var(--text-secondary)]'
            }`}
          >
            {isRefreshing ? refreshingLabel : readyToRefresh ? releaseLabel : pullLabel}
          </span>
        </motion.div>
      </motion.div>

      {/* ─── Scrollable Window Content ─── */}
      <motion.div
        ref={scrollRef}
        style={{ y: springY }}
        className={`h-full w-full overflow-y-auto cursor-grab active:cursor-grabbing transition-[border-radius] duration-150 ${
          isSpark ? 'bg-[var(--bg-secondary)]' : ''
        } ${isSpark && isPulled ? 'rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.08)]' : ''}`}
      >
        {children}
      </motion.div>
    </div>
  );
};
