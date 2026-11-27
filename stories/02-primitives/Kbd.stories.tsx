import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from '@/components/primitives/Kbd';

const meta: Meta<typeof Kbd> = {
  title: 'Primitives/Kbd',
  component: Kbd,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Shortcuts: Story = {
  render: () => (
    <div className="p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-3 w-80">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">Command Palette</span>
        <div className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">New Appointment</span>
        <div className="flex items-center gap-1">
          <Kbd>C</Kbd>
        </div>
      </div>
    </div>
  ),
};
