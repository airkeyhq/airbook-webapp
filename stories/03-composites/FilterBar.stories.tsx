import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar, type ActiveFilter, type FilterDefinition } from '@/components/FilterBar';
import { SearchInput } from '@/components/primitives/SearchInput';

const meta: Meta<typeof FilterBar> = {
  title: 'Composites/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Mosaic-style FilterBar with funnel enabler trigger, dashed segmented filter chips (`text`, `date`, `select`), operator dropdowns, and Clear filters action.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

const AVAILABLE_FILTERS: FilterDefinition[] = [
  { id: 'client', label: 'Client', type: 'text' },
  { id: 'service', label: 'Service', type: 'text' },
  { id: 'status', label: 'Status', type: 'select', options: ['Confirmed', 'In Chair', 'Completed', 'Cancelled'] },
  { id: 'created', label: 'Created', type: 'date' },
  { id: 'visit', label: 'Last visit', type: 'date' },
];

export const StudioFilterChips: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
      { id: 'client', label: 'Client', type: 'text', value: '' },
      { id: 'status', label: 'Status', type: 'select', value: 'Confirmed', options: ['Confirmed', 'In Chair', 'Completed', 'Cancelled'] },
      { id: 'created', label: 'Created', type: 'date', operator: 'between', value: 'Last 7 days' },
    ]);

    return (
      <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-72">
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="Search bookings..."
            />
          </div>
          <button type="button" className="btn-primary !h-9 !px-4 text-xs">
            New Booking
          </button>
        </div>

        <FilterBar
          availableFilters={AVAILABLE_FILTERS}
          activeFilters={activeFilters}
          onAddFilter={(f) =>
            setActiveFilters((prev) => [
              ...prev,
              { ...f, operator: f.type === 'date' ? 'between' : undefined, value: '' },
            ])
          }
          onRemoveFilter={(id) =>
            setActiveFilters((prev) => prev.filter((f) => f.id !== id))
          }
          onUpdateFilter={(id, updates) =>
            setActiveFilters((prev) =>
              prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
            )
          }
          onClearAll={() => setActiveFilters([])}
        />
      </div>
    );
  },
};
