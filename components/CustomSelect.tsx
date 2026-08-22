import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown24Regular, Checkmark24Filled } from '@fluentui/react-icons';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  className = '',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Custom Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${
          compact ? 'px-3 py-2 rounded-xl text-xs font-mono font-bold' : 'px-4 py-3 rounded-2xl text-xs font-medium'
        } bg-black/5 dark:bg-white/5 border ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20'
            : 'border-[var(--border-subtle)] hover:border-black/20 dark:hover:border-white/20'
        } text-[var(--text-primary)] flex items-center justify-between gap-2 transition-all duration-100 ease-out cursor-pointer`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="flex-shrink-0"
        >
          <ChevronDown24Regular className={compact ? 'w-3.5 h-3.5 text-[var(--text-secondary)]' : 'w-4 h-4 text-[var(--text-secondary)]'} />
        </motion.span>
      </button>

      {/* Custom Dropdown Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-[100] p-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl backdrop-blur-md max-h-60 overflow-y-auto space-y-1"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between gap-2 transition-colors ${
                    isSelected
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold'
                      : 'text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                    <div className="truncate">
                      <span>{opt.label}</span>
                      {opt.sublabel && (
                        <span className="block text-[10px] text-[var(--text-muted)] font-normal truncate">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <Checkmark24Filled className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
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
