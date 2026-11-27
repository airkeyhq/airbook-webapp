'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SparkleBurst } from './SparkleBurst';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'spark';
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  variant = 'default',
  className = '',
}) => {
  const [burstKey, setBurstKey] = React.useState(0);

  const sizeMap = {
    sm: { track: 'w-8 h-4.5 p-0.5', thumb: 'w-3.5 h-3.5', translate: 14 },
    md: { track: 'w-11 h-6 p-0.5', thumb: 'w-5 h-5', translate: 20 },
    lg: { track: 'w-14 h-7.5 p-1', thumb: 'w-5.5 h-5.5', translate: 26 },
  }[size];

  const handleToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!disabled) {
      if (variant === 'spark') {
        setBurstKey((prev) => prev + 1);
      }
      onChange(!checked);
    }
  };

  const track = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleToggle}
      className={`relative inline-flex items-center flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2BB5FF]/40 ${
        sizeMap.track
      } ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-black/10 dark:bg-white/10'
          : checked
          ? 'bg-[var(--color-accent-primary)] ring-1 ring-inset ring-[#1A8EFF] shadow-[0_4px_12px_-2px_rgba(43,181,255,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:bg-[var(--color-accent-primary-hover)] hover:shadow-[0_6px_16px_-2px_rgba(43,181,255,0.7),inset_0_1px_1px_rgba(255,255,255,0.4)]'
          : 'bg-black/15 dark:bg-white/15'
      }`}
    >
      <motion.span
        animate={{ x: checked ? sizeMap.translate : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`pointer-events-none relative inline-block rounded-full bg-white shadow-md ring-0 ${sizeMap.thumb}`}
      >
        {variant === 'spark' && (
          <SparkleBurst burstKey={burstKey} shape="circle" particle="mixed" tone="electric" />
        )}
      </motion.span>
    </button>
  );

  if (!label && !description) {
    return <div className={className}>{track}</div>;
  }

  return (
    <div
      onClick={handleToggle}
      className={`flex items-start justify-between gap-4 ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      <div className="select-none min-w-0">
        {label && <div className="text-xs font-semibold text-[var(--text-primary)] leading-tight">{label}</div>}
        {description && (
          <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">{description}</div>
        )}
      </div>
      {track}
    </div>
  );
};
