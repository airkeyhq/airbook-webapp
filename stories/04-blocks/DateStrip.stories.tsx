import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateStrip } from '@/components/DateStrip';
import { useAirBookStore } from '@/lib/store';

const meta: Meta<typeof DateStrip> = {
  title: 'Blocks/DateStrip',
  component: DateStrip,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Default: StoryObj<typeof DateStrip> = {
  render: function DateStripStory() {
    const selectedDateStr = useAirBookStore((s) => s.selectedDateStr);
    const displayDate = new Date(selectedDateStr + 'T00:00:00');
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="p-4 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Interactive Calendar DateStrip</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Mobile-first adaptive day navigator with signature today indicator pill.
              </p>
            </div>
            <div className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
              {displayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <DateStrip />
        </div>
      </div>
    );
  },
};
