'use client';

import React, { useState } from 'react';
import { SparkleBurst } from './SparkleBurst';

export interface ToggleButtonProps {
  pressed: boolean;
  onChange: (pressed: boolean) => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  spark?: boolean;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

/**
 * Ozone UI single ToggleButton primitive.
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  pressed,
  onChange,
  icon,
  children,
  spark = false,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const [burstKey, setBurstKey] = useState(0);

  const handleClick = () => {
    if (disabled) return;
    const next = !pressed;
    if (next && spark) setBurstKey((k) => k + 1);
    onChange(next);
  };

  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-1.5 rounded-full font-bold transition-all duration-150 select-none ${
        size === 'sm' ? 'h-8 px-3 text-[11px]' : 'h-9 px-3.5 text-xs'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'} ${
        pressed
          ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]'
          : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#2BB5FF]/40'
      } ${className}`}
    >
      {icon && (
        <span className="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </span>
      )}
      {children && <span>{children}</span>}
      {spark && (
        <SparkleBurst
          burstKey={burstKey}
          shape={children ? 'pill' : 'circle'}
          particle="stars"
          tone="tier1"
        />
      )}
    </button>
  );
};
