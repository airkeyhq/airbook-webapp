'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ChevronDown24Filled, Checkmark24Filled } from '@fluentui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageSelectorProps {
  direction?: 'up' | 'down';
  format?: 'code' | 'label';
  size?: 'sm' | 'md';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  direction = 'down',
  format = 'code',
  size = 'md',
  className = '',
}) => {
  const { language, setLanguage, availableLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLangObj =
    availableLanguages.find((l) => l.id === language) || availableLanguages[0];

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
  const flagSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div ref={containerRef} className={`relative z-50 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${heightClass} flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] transition-all font-extrabold text-[var(--text-primary)] cursor-pointer shadow-xs active:scale-97`}
        aria-expanded={isOpen}
        aria-label="Select Language"
      >
        <img
          src={`https://hatscripts.github.io/circle-flags/flags/${currentLangObj.flagCode}.svg`}
          alt={currentLangObj.label}
          className={`${flagSize} rounded-full object-cover flex-shrink-0`}
          loading="lazy"
        />
        {format === 'code' ? (
          <span className="uppercase text-[11px] font-black">{currentLangObj.id}</span>
        ) : (
          <span className="text-[11px] font-bold">{currentLangObj.label}</span>
        )}
        <ChevronDown24Filled
          className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-150 ${
            isOpen
              ? direction === 'up'
                ? ''
                : 'rotate-180'
              : direction === 'up'
              ? 'rotate-180'
              : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'up' ? 6 : -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'up' ? 6 : -6, scale: 0.96 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={`absolute right-0 ${
              direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
            } w-48 p-1.5 bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] z-[100] overflow-hidden`}
          >
            {availableLanguages.map((lang) => {
              const isSelected = language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--bg-secondary)] text-[#2BB5FF] font-extrabold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={`https://hatscripts.github.io/circle-flags/flags/${lang.flagCode}.svg`}
                      alt={lang.label}
                      className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                      loading="lazy"
                    />
                    <span>{lang.label}</span>
                  </div>
                  {isSelected && (
                    <Checkmark24Filled className="w-3.5 h-3.5 text-[#2BB5FF] flex-shrink-0" />
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

export default LanguageSelector;
