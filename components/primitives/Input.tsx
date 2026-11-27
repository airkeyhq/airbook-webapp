'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: boolean;
  label?: string;
  helperText?: string;
}

/**
 * Ozone UI standard compact Input primitive.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ leftElement, rightElement, error = false, label, helperText, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-bold text-[var(--text-primary)]">{label}</label>
        )}
        <div
          className={`relative flex items-center h-[var(--control-height)] w-full rounded-2xl border bg-[var(--bg-secondary)] transition-all duration-150 ${
            error
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-[var(--bg-primary)]'
              : 'border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 focus-within:bg-[var(--bg-primary)] focus-within:border-[#2BB5FF] focus-within:ring-2 focus-within:ring-[#2BB5FF]/20'
          }`}
        >
          {leftElement && (
            <span className="pl-3.5 text-[var(--text-muted)] flex items-center pointer-events-none">
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full h-full bg-transparent px-3.5 text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none disabled:opacity-45 disabled:cursor-not-allowed ${
              leftElement ? 'pl-2.5' : ''
            } ${rightElement ? 'pr-2.5' : ''} ${className}`}
            {...props}
          />
          {rightElement && (
            <span className="pr-3.5 text-[var(--text-muted)] flex items-center">
              {rightElement}
            </span>
          )}
        </div>
        {helperText && (
          <span className={`text-[11px] ${error ? 'text-rose-500 font-medium' : 'text-[var(--text-muted)]'}`}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
