'use client';

import React, { forwardRef } from 'react';

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, rightElement, icon, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div
        className={`relative w-full rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-4 py-2 flex items-center justify-between gap-2.5 focus-within:border-[var(--color-accent-primary)] focus-within:ring-2 focus-within:ring-[#1A8EFF]/20 transition-all duration-100 ease-out hover:border-black/20 dark:hover:border-white/20 ${containerClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {icon && <span className="flex-shrink-0 text-[var(--text-muted)]">{icon}</span>}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] select-none pointer-events-none truncate block">
              {label}
            </label>
            <input
              ref={ref}
              className={`w-full bg-transparent border-0 p-0 text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-0 truncate ${className}`}
              {...props}
            />
          </div>
        </div>
        {rightElement && <div className="flex-shrink-0 flex items-center">{rightElement}</div>}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  containerClassName?: string;
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, containerClassName = '', className = '', ...props }, ref) => {
    return (
      <div
        className={`relative w-full rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-4 py-2.5 flex flex-col gap-1 focus-within:border-[var(--color-accent-primary)] focus-within:ring-2 focus-within:ring-[#1A8EFF]/20 transition-all duration-100 ease-out hover:border-black/20 dark:hover:border-white/20 ${containerClassName}`}
      >
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] select-none pointer-events-none truncate block">
          {label}
        </label>
        <textarea
          ref={ref}
          className={`w-full bg-transparent border-0 p-0 text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-0 resize-none ${className}`}
          {...props}
        />
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';
