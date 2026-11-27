import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PulseDot } from '@/components/primitives/PulseDot';

const meta: Meta<typeof PulseDot> = {
  title: 'Primitives/PulseDot',
  component: PulseDot,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PulseDot>;

export const Default: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-wrap items-center gap-5">
      <PulseDot tone="live" label="Calendar Live" />
      <PulseDot tone="success" label="Online" />
      <PulseDot tone="warning" label="In Session" />
      <PulseDot tone="danger" label="Delayed" />
      <PulseDot tone="neutral" label="Offline" ping={false} />
    </div>
  ),
};
