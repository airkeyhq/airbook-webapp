'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './Avatar';
import { HoverCard } from './HoverCard';
import { Badge } from './Badge';
import { useSmartPosition } from '@/lib/useSmartPosition';

export interface MentionOption {
  id: string;
  label: string;
  /** Handle inserted after the trigger (defaults to label without spaces) */
  handle?: string;
  subtitle?: string;
  avatarSrc?: string;
}

export interface MentionsProps {
  value: string;
  onChange: (value: string) => void;
  options: MentionOption[];
  /** Trigger character @default '@' */
  trigger?: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  onMentionSelect?: (option: MentionOption) => void;
  className?: string;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderHighlightedBackdrop(text: string, trigger: string, handles: Set<string>) {
  if (!text) return null;
  const regex = new RegExp(`(${escapeRegExp(trigger)}[a-zA-Z0-9._-]+)`, 'g');
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    if (part.startsWith(trigger)) {
      const token = part.slice(trigger.length).toLowerCase();
      if (handles.size === 0 || handles.has(token)) {
        return (
          <span
            key={idx}
            className="text-[#2BB5FF] underline decoration-dashed underline-offset-4"
          >
            {part}
          </span>
        );
      }
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export interface MentionTextProps {
  text: string;
  options: MentionOption[];
  trigger?: string;
  className?: string;
}

/**
 * Renders text with `@mentions` styled identically to HoverCard mentions
 * (`#2BB5FF` dashed underline) and interactive HoverCard profiles on hover.
 */
export const MentionText: React.FC<MentionTextProps> = ({
  text,
  options,
  trigger = '@',
  className = '',
}) => {
  const optionMap = useMemo(() => {
    const map = new Map<string, MentionOption>();
    options.forEach((opt) => {
      const h = (opt.handle || opt.label.replace(/\s+/g, '')).toLowerCase();
      map.set(h, opt);
    });
    return map;
  }, [options]);

  const regex = useMemo(
    () => new RegExp(`(${escapeRegExp(trigger)}[a-zA-Z0-9._-]+)`, 'g'),
    [trigger]
  );

  const parts = text.split(regex);

  return (
    <span className={`text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap ${className}`}>
      {parts.map((part, idx) => {
        if (part.startsWith(trigger)) {
          const handleKey = part.slice(trigger.length).toLowerCase();
          const match = optionMap.get(handleKey);
          if (match) {
            return (
              <HoverCard
                key={idx}
                trigger={
                  <span className="font-bold text-[#2BB5FF] underline decoration-dashed underline-offset-4 cursor-pointer">
                    {part}
                  </span>
                }
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    size="md"
                    src={match.avatarSrc}
                    fallback={match.label.slice(0, 2).toUpperCase()}
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-[var(--text-primary)]">
                        {match.label}
                      </span>
                      <Badge variant="dashed-blue" size="xs">
                        {trigger}
                        {match.handle || match.label.replace(/\s+/g, '')}
                      </Badge>
                    </div>
                    {match.subtitle && (
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {match.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </HoverCard>
            );
          }
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
};

/**
 * Ozone UI Mentions primitive.
 * Textarea with `@` trigger detection, space-smart suggestion popover, and keyboard navigation.
 */
export const Mentions: React.FC<MentionsProps> = ({
  value,
  onChange,
  options,
  trigger = '@',
  label,
  placeholder = 'Type @ to mention a specialist or client...',
  rows = 3,
  disabled = false,
  onMentionSelect,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  const [mentionMatch, setMentionMatch] = useState<{
    start: number;
    end: number;
    query: string;
  } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const knownHandles = useMemo(() => {
    const set = new Set<string>();
    options.forEach((opt) => {
      set.add((opt.handle || opt.label.replace(/\s+/g, '')).toLowerCase());
    });
    return set;
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!mentionMatch) return [];
    const q = mentionMatch.query.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.handle && opt.handle.toLowerCase().includes(q)) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(q))
    );
  }, [mentionMatch, options]);

  const isOpen = !disabled && mentionMatch !== null && filteredOptions.length > 0;

  const { positionClass, motionY } = useSmartPosition({
    isOpen,
    triggerRef: containerRef,
    floatingRef,
    estimatedWidth: 260,
    estimatedHeight: 220,
    preferredVertical: 'bottom',
    preferredHorizontal: 'left',
    offset: 8,
  });

  useEffect(() => {
    setHighlightedIndex(0);
  }, [mentionMatch?.query]);

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMentionMatch(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  const detectMention = (text: string, caret: number | null) => {
    if (caret === null) {
      setMentionMatch(null);
      return;
    }
    const beforeCaret = text.slice(0, caret);
    const regex = new RegExp(`(?:^|\\s)${escapeRegExp(trigger)}([^\\s]*)$`);
    const match = beforeCaret.match(regex);
    if (!match) {
      setMentionMatch(null);
      return;
    }
    const query = match[1] ?? '';
    const start = caret - query.length - trigger.length;
    setMentionMatch({ start, end: caret, query });
  };

  const insertMention = (option: MentionOption) => {
    if (!mentionMatch) return;
    const handle = option.handle || option.label.replace(/\s+/g, '');
    const inserted = `${trigger}${handle} `;
    const nextValue =
      value.slice(0, mentionMatch.start) + inserted + value.slice(mentionMatch.end);
    onChange(nextValue);
    onMentionSelect?.(option);
    setMentionMatch(null);

    const nextCaret = mentionMatch.start + inserted.length;
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextCaret, nextCaret);
      }
    });
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        className={`relative rounded-2xl bg-[var(--bg-secondary)] border transition-all duration-150 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          isOpen
            ? 'border-[#2BB5FF] ring-2 ring-[#2BB5FF]/20 bg-[var(--bg-primary)]'
            : 'border-[var(--border-subtle)] focus-within:border-[#2BB5FF] focus-within:ring-2 focus-within:ring-[#2BB5FF]/20 focus-within:bg-[var(--bg-primary)]'
        }`}
      >
        {label && (
          <label className="block px-3.5 pt-2.5 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] pointer-events-none">
            {label}
          </label>
        )}
        <div className="relative">
          {/* Highlighted backdrop matching HoverCard mention styling */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 px-3.5 pb-3 text-xs font-medium leading-5 text-[var(--text-primary)] whitespace-pre-wrap break-words overflow-hidden ${
              label ? 'pt-1' : 'pt-3'
            }`}
          >
            {renderHighlightedBackdrop(value, trigger, knownHandles)}
            {value.endsWith('\n') ? ' ' : null}
          </div>

          <textarea
            ref={textareaRef}
            rows={rows}
            disabled={disabled}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              const next = e.target.value;
              onChange(next);
              detectMention(next, e.target.selectionStart);
            }}
            onClick={(e) => detectMention(value, e.currentTarget.selectionStart)}
            onKeyUp={(e) => {
              if (['ArrowUp', 'ArrowDown', 'Enter', 'Tab', 'Escape'].includes(e.key)) return;
              detectMention(e.currentTarget.value, e.currentTarget.selectionStart);
            }}
            onKeyDown={(e) => {
              if (!isOpen) return;
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((i) => (i + 1) % filteredOptions.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(
                  (i) => (i - 1 + filteredOptions.length) % filteredOptions.length
                );
              } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                const chosen = filteredOptions[highlightedIndex];
                if (chosen) insertMention(chosen);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setMentionMatch(null);
              }
            }}
            className={`relative z-10 w-full bg-transparent px-3.5 pb-3 text-xs font-medium leading-5 text-transparent caret-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none resize-y ${
              label ? 'pt-1' : 'pt-3'
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={floatingRef}
            initial={{ opacity: 0, y: motionY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: motionY, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-[240] w-64 max-h-56 overflow-y-auto p-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl ${positionClass}`}
          >
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Mention
            </div>
            {filteredOptions.map((opt, idx) => {
              const isHighlighted = idx === highlightedIndex;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    insertMention(opt);
                  }}
                  className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                    isHighlighted
                      ? 'bg-[#2BB5FF]/12 text-[#1A8EFF] dark:text-[#2BB5FF]'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  <Avatar
                    size="xs"
                    src={opt.avatarSrc}
                    fallback={opt.label.slice(0, 2).toUpperCase()}
                    className="!w-6 !h-6 !text-[9px] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{opt.label}</div>
                    {opt.subtitle && (
                      <div className="text-[10px] text-[var(--text-muted)] truncate">
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0">
                    {trigger}
                    {opt.handle || opt.label.replace(/\s+/g, '')}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
