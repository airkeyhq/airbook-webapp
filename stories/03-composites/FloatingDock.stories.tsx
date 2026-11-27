import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FloatingDock } from '@/components/FloatingDock';

const meta: Meta<typeof FloatingDock> = {
  title: 'Composites/FloatingDock',
  component: FloatingDock,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FloatingDock>;

export const Default: Story = {
  render: () => (
    <div className="relative h-48 w-full bg-[var(--bg-secondary)]/40">
      <FloatingDock activeTab="calendar" />
    </div>
  ),
};
