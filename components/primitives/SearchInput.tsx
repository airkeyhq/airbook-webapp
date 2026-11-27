'use client';

import React from 'react';
import { Search24Regular, Dismiss24Filled } from '@fluentui/react-icons';
import { Kbd } from './Kbd';
import { Icon } from './Icon';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  shortcut?: string;
  onClear?: () => void;
  className?: string;
}

/**
 * Ozone UI SearchInput primitive.
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Search...',
      shortcut = '⌘K',
      onClear,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`relative flex items-center h-10 w-full rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus-within:bg-[var(--bg-primary)] focus-within:border-[#2BB5FF] focus-within:ring-2 focus-within:ring-[#2BB5FF]/20 transition-all duration-150 ${className}`}
      >
        <Icon regular={Search24Regular} size="md" tone="muted" className="ml-3.5 pointer-events-none" />

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-full bg-transparent px-2.5 text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none min-w-0"
          {...props}
        />

        <div className="pr-2.5 flex items-center gap-1.5 flex-shrink-0">
          {value ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onChange('');
                onClear?.();
              }}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            >
              <Icon filled={Dismiss24Filled} size="sm" />
            </button>
          ) : (
            shortcut && <Kbd>{shortcut}</Kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
