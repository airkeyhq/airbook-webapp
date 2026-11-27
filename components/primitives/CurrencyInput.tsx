'use client';

import React, { useState } from 'react';
import { Checkmark24Filled, ChevronDown24Regular } from '@fluentui/react-icons';
import { Popover } from './Popover';
import { CircleFlag } from './CircleFlag';
import { Icon } from './Icon';

type CurrencyCode = 'USD' | 'MXN' | 'EUR' | 'GBP';

export interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  currency?: CurrencyCode;
  onCurrencyChange?: (currency: CurrencyCode) => void;
  label?: string;
  helperText?: string;
  error?: boolean;
  /** Use 52px floating overline label matching FloatingInput */
  floating?: boolean;
  className?: string;
}

const CURRENCIES: { code: CurrencyCode; symbol: string; flagCode: string; label: string }[] = [
  { code: 'USD', symbol: '$', flagCode: 'us', label: 'US Dollar' },
  { code: 'MXN', symbol: 'MX$', flagCode: 'mx', label: 'Mexican Peso' },
  { code: 'EUR', symbol: '€', flagCode: 'eu', label: 'Euro' },
  { code: 'GBP', symbol: '£', flagCode: 'gb', label: 'British Pound' },
];

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  MXN: 'MX$',
  EUR: '€',
  GBP: '£',
};

/**
 * Ozone UI CurrencyInput primitive for service pricing, deposits & POS.
 */
export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  currency = 'USD',
  onCurrencyChange,
  label,
  helperText,
  error = false,
  floating = false,
  className = '',
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
    onChange(normalized);
  };

  const currentCurrency = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

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
        {label && floating && (
          <span className="absolute left-3.5 top-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] pointer-events-none">
            {label}
          </span>
        )}
        <span
          className={`pl-3.5 pr-1 text-xs font-mono font-black text-[var(--text-muted)] ${
            floating ? 'pt-4 pb-1' : ''
          }`}
        >
          {SYMBOLS[currency]}
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="0.00"
          className={`flex-1 h-full min-w-0 bg-transparent pr-2 text-xs font-mono font-extrabold tabular-nums text-[var(--text-primary)] outline-none ${
            floating ? 'pt-4 pb-1' : ''
          }`}
        />
        {onCurrencyChange ? (
          <Popover
            open={menuOpen}
            onOpenChange={setMenuOpen}
            preferredHorizontal="right"
            estimatedWidth={184}
            estimatedHeight={180}
            contentClassName="absolute z-[240]"
            className="h-full flex items-center border-l border-[var(--border-subtle)] flex-shrink-0"
            trigger={
              <button
                type="button"
                aria-label="Currency"
                onClick={() => setMenuOpen((o) => !o)}
                className="px-3 py-2 flex items-center gap-1.5 text-[11px] font-mono font-bold text-[var(--text-primary)] hover:text-[#2BB5FF] transition-colors cursor-pointer"
              >
                <CircleFlag countryCode={currentCurrency.flagCode} size={14} />
                <span>{currency}</span>
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
              {CURRENCIES.map((c) => {
                const isSelected = c.code === currency;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onCurrencyChange(c.code);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--bg-secondary)] text-[#2BB5FF] font-extrabold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] font-semibold'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CircleFlag countryCode={c.flagCode} size={14} />
                      <span className="font-mono">{c.code}</span>
                    </span>
                    {isSelected && <Icon filled={Checkmark24Filled} size="sm" tone="accent" />}
                  </button>
                );
              })}
            </div>
          </Popover>
        ) : (
          <span
            className={`pr-3.5 text-[11px] font-mono font-bold text-[var(--text-muted)] ${
              floating ? 'pt-4 pb-1' : ''
            }`}
          >
            {currency}
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
};
