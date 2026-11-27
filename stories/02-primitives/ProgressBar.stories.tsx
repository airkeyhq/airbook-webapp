import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from '@/components/primitives/ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  render: () => (
    <div className="w-80 p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4">
      <ProgressBar value={72} showLabel color="primary" />
      <ProgressBar value={100} showLabel color="emerald" />
      <ProgressBar value={35} showLabel color="amber" size="sm" />
    </div>
  ),
};
