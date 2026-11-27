'use client';

import React, { useState } from 'react';
import { Checkmark24Filled, ChevronDown24Regular } from '@fluentui/react-icons';
import { Popover } from './Popover';
import { CircleFlag } from './CircleFlag';
import { Icon } from './Icon';

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  /** Use 52px floating overline label matching FloatingInput */
  floating?: boolean;
  placeholder?: string;
  className?: string;
}

const DIAL_CODES = [
  { code: '+1', label: 'US / CA', flagCode: 'us' },
  { code: '+52', label: 'Mexico', flagCode: 'mx' },
  { code: '+44', label: 'UK', flagCode: 'gb' },
  { code: '+33', label: 'France', flagCode: 'fr' },
  { code: '+34', label: 'Spain', flagCode: 'es' },
];

function formatUsPhone(digits: string): string {
  const clean = digits.replace(/\D/g, '').slice(0, 10);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`;
  return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6)}`;
}

/**
 * Ozone UI PhoneInput primitive for SMS reminders & client profiles.
 */
export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  countryCode = '+1',
  onCountryCodeChange,
  label,
  helperText,
  error = false,
  floating = false,
  placeholder = '(555) 234-5678',
  className = '',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentDial = DIAL_CODES.find((d) => d.code === countryCode) || DIAL_CODES[0];

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && !floating && (
        <label className="text-xs font-bold text-[var(--text-primary)]">{label}</label>
      )}
      <div
        className={`relative flex items-center w-full rounded-2xl border bg-[var(--bg-secondary)] transition-all overflow-visible ${
          floating ? 'h-[52px]' : 'h-[var(--control-height)]'
        } ${
          error
            ? 'border-rose-500 ring-2 ring-rose-500/20 bg-[var(--bg-primary)]'
            : 'border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 focus-within:bg-[var(--bg-primary)] focus-within:border-[#2BB5FF] focus-within:ring-2 focus-within:ring-[#2BB5FF]/20'
        }`}
      >
        <Popover
          open={menuOpen}
          onOpenChange={setMenuOpen}
          preferredHorizontal="left"
          estimatedWidth={184}
          estimatedHeight={210}
          contentClassName="absolute z-[240]"
          className="h-full flex items-center border-r border-[var(--border-subtle)] flex-shrink-0"
          trigger={
            <button
              type="button"
              aria-label="Country dial code"
              onClick={() => setMenuOpen((o) => !o)}
              className="pl-3 pr-2.5 py-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--text-primary)] hover:text-[#2BB5FF] transition-colors cursor-pointer"
            >
              <CircleFlag countryCode={currentDial.flagCode} size={14} />
              <span>{currentDial.code}</span>
              <Icon
                regular={ChevronDown24Regular}
                size="xs"
                tone="muted"
                className={`transition-transform duration-150 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          }
        >
          <div className="w-44 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-1.5 shadow-2xl space-y-0.5">
            {DIAL_CODES.map((d) => {
              const isSelected = d.code === countryCode;
              return (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => {
                    onCountryCodeChange?.(d.code);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--bg-secondary)] text-[#2BB5FF] font-extrabold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] font-semibold'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CircleFlag countryCode={d.flagCode} size={14} />
                    <span>{d.label}</span>
                    <span className="font-mono text-[var(--text-muted)]">{d.code}</span>
                  </span>
                  {isSelected && <Icon filled={Checkmark24Filled} size="sm" tone="accent" />}
                </button>
              );
            })}
          </div>
        </Popover>

        <div className="relative flex-1 h-full flex items-center">
          {label && floating && (
            <span className="absolute left-3 top-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] pointer-events-none">
              {label}
            </span>
          )}
          <input
            type="tel"
            inputMode="tel"
            value={value}
            onChange={(e) => onChange(formatUsPhone(e.target.value))}
            placeholder={placeholder}
            className={`w-full h-full bg-transparent px-3 text-xs font-mono font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none ${
              floating ? 'pt-4 pb-1' : ''
            }`}
          />
        </div>
      </div>
      {helperText && (
        <span className={`text-[11px] ${error ? 'text-rose-500 font-medium' : 'text-[var(--text-muted)]'}`}>
          {helperText}
        </span>
      )}
    </div>
  );
};
