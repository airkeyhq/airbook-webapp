'use client';

import React, { useEffect, useState } from 'react';
import {
  Filter24Filled,
  DismissCircle24Filled,
  ChevronDown24Regular,
  Checkmark24Filled,
} from '@fluentui/react-icons';
import { Input } from '@/components/primitives/Input';
import { Popover } from '@/components/primitives/Popover';
import { Tooltip } from '@/components/primitives/Tooltip';
import { Icon } from '@/components/primitives/Icon';
import { DatePicker } from '@/components/primitives/DatePicker';
import { DateRangePicker, type DateRange } from '@/components/DateRangePicker';

export type FilterType = 'text' | 'date' | 'select';

export interface FilterDefinition {
  id: string;
  label: string;
  type: FilterType;
  options?: string[];
}

export interface ActiveFilter {
  id: string;
  label: string;
  type: FilterType;
  operator?: string;
  value?: string;
  options?: string[];
}

export interface FilterBarProps {
  availableFilters: FilterDefinition[];
  activeFilters: ActiveFilter[];
  onAddFilter: (filter: FilterDefinition) => void;
  onRemoveFilter: (id: string) => void;
  onUpdateFilter: (id: string, updates: Partial<ActiveFilter>) => void;
  onClearAll: () => void;
  className?: string;
  hideTrigger?: boolean;
  hideChips?: boolean;
}

const DATE_OPERATORS = ['between', 'on', 'after', 'before', 'on or after'];
const DATE_PRESETS = ['Today', 'Last 7 days', 'Last 30 days', 'This month'];

interface AnchorPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  estimatedWidth?: number;
  estimatedHeight?: number;
}

const AnchorPopover: React.FC<AnchorPopoverProps> = ({
  open,
  onOpenChange,
  trigger,
  children,
  align = 'left',
  estimatedWidth = 220,
  estimatedHeight = 200,
}) => (
  <Popover
    open={open}
    onOpenChange={onOpenChange}
    trigger={trigger}
    preferredHorizontal={align}
    estimatedWidth={estimatedWidth}
    estimatedHeight={estimatedHeight}
    contentClassName="absolute z-[240]"
  >
    {children}
  </Popover>
);

/**
 * Ozone UI FilterBar composite (Mosaic signature dashed-pill filter chips).
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  availableFilters,
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onUpdateFilter,
  onClearAll,
  className = '',
  hideTrigger = false,
  hideChips = false,
}) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const unaddedFilters = availableFilters.filter(
    (af) => !activeFilters.some((f) => f.id === af.id)
  );

  return (
    <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 select-none ${className}`}>
      {/* 1. Filter Enabler Trigger Button */}
      {!hideTrigger && (
        <AnchorPopover
          open={filterMenuOpen}
          onOpenChange={setFilterMenuOpen}
          trigger={
            <Tooltip content="Filters">
              <button
                type="button"
                onClick={() => setFilterMenuOpen((o) => !o)}
                aria-label="Add filter"
                className="btn-secondary !w-8 !h-8 !p-0 !rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <Icon filled={Filter24Filled} size="md" />
              </button>
            </Tooltip>
          }
        >
          <div className="min-w-[180px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-1.5 shadow-xl">
            <div className="flex flex-col gap-0.5">
              {unaddedFilters.length === 0 ? (
                <div className="px-3 py-2 text-xs text-[var(--text-muted)]">
                  All filters active
                </div>
              ) : (
                unaddedFilters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      onAddFilter(f);
                      setFilterMenuOpen(false);
                    }}
                    className="w-full text-left cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    {f.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </AnchorPopover>
      )}

      {/* 2. Active Filter Chips */}
      {!hideChips &&
        activeFilters.map((filter) => {
          const def = availableFilters.find((af) => af.id === filter.id);
          return (
            <FilterChip
              key={filter.id}
              filter={{ ...filter, options: filter.options ?? def?.options }}
              onRemove={() => onRemoveFilter(filter.id)}
              onUpdate={(updates) => onUpdateFilter(filter.id, updates)}
            />
          );
        })}

      {/* 3. Clear all link */}
      {!hideChips && activeFilters.length > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ml-1 cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export interface FilterChipProps {
  filter: ActiveFilter;
  onRemove: () => void;
  onUpdate: (updates: Partial<ActiveFilter>) => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  filter,
  onRemove,
  onUpdate,
}) => {
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [valueOpen, setValueOpen] = useState(false);
  const [tempValue, setTempValue] = useState(filter.value || '');
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (filter.value) {
      const parsed = new Date(filter.value);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });
  const [selectedRange, setSelectedRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return { start, end };
  });

  useEffect(() => {
    setTempValue(filter.value || '');
    if (filter.value) {
      const parsed = new Date(filter.value);
      if (!Number.isNaN(parsed.getTime())) setSelectedDate(parsed);
    }
  }, [filter.value]);

  return (
    <div className="inline-flex max-w-full items-center rounded-full border border-dashed border-[var(--border-subtle)] hover:border-[#2BB5FF]/60 bg-[var(--bg-primary)] px-2 sm:px-2.5 py-1 text-xs font-medium text-[var(--text-primary)] shadow-xs transition-colors">
      {/* Remove Button + Field Label */}
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-rose-500 cursor-pointer transition-colors pr-2 border-r border-[var(--border-subtle)]"
        aria-label={`Remove ${filter.label} filter`}
      >
        <Icon filled={DismissCircle24Filled} size="sm" />
        <span className="font-bold text-[var(--text-primary)]">{filter.label}</span>
      </button>

      {/* Operator segment (for dates) */}
      {filter.type === 'date' && (
        <AnchorPopover
          open={operatorOpen}
          onOpenChange={setOperatorOpen}
          trigger={
            <button
              type="button"
              onClick={() => setOperatorOpen((o) => !o)}
              className="flex items-center gap-1 px-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer border-r border-[var(--border-subtle)] transition-colors"
            >
              <span>{filter.operator || 'between'}</span>
              <Icon regular={ChevronDown24Regular} size="xs" tone="muted" />
            </button>
          }
        >
          <div className="min-w-[140px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-1.5 shadow-xl">
            <div className="flex flex-col gap-0.5">
              {DATE_OPERATORS.map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => {
                    onUpdate({ operator: op });
                    setOperatorOpen(false);
                  }}
                  className="w-full text-left cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-between"
                >
                  <span>{op}</span>
                  {(filter.operator || 'between') === op && (
                    <Icon filled={Checkmark24Filled} size="xs" tone="accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </AnchorPopover>
      )}

      {/* Value Selector Popover */}
      <AnchorPopover
        open={valueOpen}
        onOpenChange={setValueOpen}
        estimatedWidth={filter.type === 'date' ? 300 : 260}
        estimatedHeight={240}
        trigger={
          <button
            type="button"
            onClick={() => setValueOpen((o) => !o)}
            className="flex items-center gap-1 pl-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
          >
            <span className={filter.value ? 'text-[#2BB5FF] font-bold' : ''}>
              {filter.value || (filter.type === 'date' ? 'Select value' : 'Enter value')}
            </span>
            <Icon regular={ChevronDown24Regular} size="xs" tone="muted" />
          </button>
        }
      >
        {filter.type === 'text' && (
          <div className="w-64 flex flex-col gap-3 p-3.5 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl">
            <div className="text-xs font-bold text-[var(--text-primary)]">
              Filter by {filter.label}
            </div>
            <Input
              autoFocus
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={`Type ${filter.label.toLowerCase()}...`}
              className="!h-8 !text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdate({ value: tempValue });
                  setValueOpen(false);
                }
              }}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setValueOpen(false)}
                className="btn-secondary !h-7 !px-2.5 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdate({ value: tempValue });
                  setValueOpen(false);
                }}
                className="btn-primary !h-7 !px-3 text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {filter.type === 'select' && (
          <div className="min-w-[170px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-1.5 shadow-xl">
            <div className="flex flex-col gap-0.5">
              {(filter.options || ['Active', 'Pending', 'Completed']).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onUpdate({ value: opt });
                    setValueOpen(false);
                  }}
                  className="w-full text-left cursor-pointer rounded-xl px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-between"
                >
                  <span>{opt}</span>
                  {filter.value === opt && (
                    <Icon filled={Checkmark24Filled} size="xs" tone="accent" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {filter.type === 'date' && (
          <div className="w-[296px] flex flex-col gap-2.5 p-3.5 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl">
            <div className="text-xs font-bold text-[var(--text-primary)]">
              {filter.label} ({filter.operator || 'between'})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onUpdate({ value: preset });
                    setValueOpen(false);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                    filter.value === preset
                      ? 'bg-[#2BB5FF] text-white border-[#2BB5FF]'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[#2BB5FF]/50'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            {(filter.operator || 'between') === 'between' ? (
              <DateRangePicker
                className="w-full"
                value={selectedRange}
                onChange={(range) => {
                  setSelectedRange(range);
                  const fmt = (d: Date) =>
                    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  onUpdate({ value: `${fmt(range.start)} - ${fmt(range.end)}` });
                  setValueOpen(false);
                }}
              />
            ) : (
              <DatePicker
                className="w-full"
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  const formatted = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  onUpdate({ value: formatted });
                  setValueOpen(false);
                }}
              />
            )}
          </div>
        )}
      </AnchorPopover>
    </div>
  );
};
