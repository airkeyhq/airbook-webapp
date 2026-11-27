'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ChevronDown24Regular, Checkmark24Filled } from '@fluentui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_CURRENCIES, CurrencyCode } from '@/lib/plans';
import { CircleFlag } from '@/components/primitives/CircleFlag';
import { Icon } from '@/components/primitives/Icon';

interface CurrencySelectorProps {
  direction?: 'up' | 'down';
  format?: 'code' | 'label';
  size?: 'sm' | 'md';
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  direction = 'down',
  format = 'code',
  size = 'md',
  className = '',
}) => {
  const { currency, setCurrency, currenciesList } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCurrObj =
    SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const heightClass =
    size === 'sm' ? 'h-8 px-2.5 rounded-xl text-xs' : 'h-10 px-3 rounded-2xl text-xs';
  const flagPx = size === 'sm' ? 14 : 16;

  return (
    <div ref={containerRef} className={'relative z-50 ' + className}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={heightClass + ' flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] transition-all font-extrabold text-[var(--text-primary)] cursor-pointer shadow-xs active:scale-97'}
        aria-expanded={isOpen}
        aria-label="Select Currency"
      >
        <CircleFlag countryCode={currentCurrObj.flagCode} size={flagPx} alt={currentCurrObj.label} />
        {format === 'code' ? (
          <span className="uppercase text-[11px] font-black">{currentCurrObj.code}</span>
        ) : (
          <span className="text-[11px] font-bold">{currentCurrObj.label}</span>
        )}
        <Icon
          regular={ChevronDown24Regular}
          size="xs"
          tone="muted"
          className={'transition-transform duration-150 ' + (isOpen ? (direction === 'up' ? '' : 'rotate-180') : (direction === 'up' ? 'rotate-180' : ''))}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'up' ? 6 : -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'up' ? 6 : -6, scale: 0.96 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={'absolute right-0 ' + (direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2') + ' w-48 p-1.5 bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] z-[100] max-h-64 overflow-y-auto'}
          >
            {currenciesList.map((curr) => {
              const isSelected = currency === curr.code;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.code as CurrencyCode);
                    setIsOpen(false);
                  }}
                  className={'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ' + (
                    isSelected
                      ? 'bg-[var(--bg-secondary)] text-[#2BB5FF] font-extrabold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] font-semibold'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <CircleFlag countryCode={curr.flagCode} size={16} alt={curr.label} />
                    <span>{curr.label}</span>
                  </div>
                  {isSelected && (
                    <Icon filled={Checkmark24Filled} size="sm" tone="accent" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelector;
