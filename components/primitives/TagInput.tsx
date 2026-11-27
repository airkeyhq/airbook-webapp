'use client';

import React, { useState } from 'react';
import { Dismiss24Filled } from '@fluentui/react-icons';
import { Icon } from './Icon';

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  maxTags?: number;
  className?: string;
}

/**
 * Ozone UI TagInput primitive.
 * Press Enter or comma to add chips; Backspace or × to remove.
 */
export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add tag and press Enter...',
  label,
  maxTags,
  className = '',
}) => {
  const [draft, setDraft] = useState('');

  const addTag = (raw: string) => {
    const clean = raw.trim();
    if (!clean) return;
    if (tags.includes(clean)) {
      setDraft('');
      return;
    }
    if (maxTags !== undefined && tags.length >= maxTags) return;
    onChange([...tags, clean]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>
      )}
      <div className="min-h-[44px] w-full rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus-within:bg-[var(--bg-primary)] focus-within:border-[#2BB5FF] focus-within:ring-2 focus-within:ring-[#2BB5FF]/20 px-2.5 py-1.5 flex flex-wrap items-center gap-1.5 transition-all">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-primary)] shadow-xs"
          >
            <span>{tag}</span>
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => removeTag(tag)}
              className="text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer"
            >
              <Icon filled={Dismiss24Filled} size="xs" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addTag(draft);
            } else if (e.key === 'Backspace' && !draft && tags.length > 0) {
              removeTag(tags[tags.length - 1]);
            }
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] h-7 bg-transparent px-1 text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
        />
      </div>
    </div>
  );
};
