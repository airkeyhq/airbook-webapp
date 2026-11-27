import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressRing } from '@/components/primitives/ProgressRing';

const meta: Meta<typeof ProgressRing> = {
  title: 'Primitives/ProgressRing',
  component: ProgressRing,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ProgressRing>;

export const Default: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex items-center gap-6">
      <ProgressRing value={84} color="primary" label="Capacity" />
      <ProgressRing value={96} color="emerald" label="On-Time" />
      <ProgressRing value={62} color="amber" label="Loyalty" />
    </div>
  ),
};
