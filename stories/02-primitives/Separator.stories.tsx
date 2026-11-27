import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from '@/components/primitives/Separator';

const meta: Meta<typeof Separator> = {
  title: 'Primitives/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => (
    <div className="w-80 p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4">
      <div className="text-xs font-semibold text-[var(--text-primary)]">Quick Actions</div>
      <Separator label="or continue with" />
      <div className="text-xs text-center text-[var(--text-secondary)]">Manual Entry</div>
    </div>
  ),
};
