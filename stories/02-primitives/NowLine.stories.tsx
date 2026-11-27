import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NowLine } from '@/components/primitives/NowLine';

const meta: Meta<typeof NowLine> = {
  title: 'Primitives/NowLine',
  component: NowLine,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Live `#FF3B30` current-time marker used horizontally in `TimeGrid` and vertically in `GanttChart`.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
    ping: { control: 'boolean' },
    showDot: { control: 'boolean' },
    showLine: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NowLine>;

export const Default: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-[560px] max-w-full">
      <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
        <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Horizontal (TimeGrid)
        </div>
        <div className="relative h-32 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)]">
          <NowLine orientation="horizontal" offset="52%" label="1:45 PM" />
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
        <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Vertical (GanttChart)
        </div>
        <div className="relative h-32 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)]">
          <NowLine orientation="vertical" offset="48%" label="Now" />
        </div>
      </div>
    </div>
  ),
};
