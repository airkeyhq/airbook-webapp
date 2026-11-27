import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '@/components/primitives/Popover';

const meta: Meta<typeof Popover> = {
  title: 'Primitives/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[220px] flex items-start pt-4">
      <Popover
        trigger={
          <button type="button" className="btn-secondary">
            Open Quick Info Popover
          </button>
        }
      >
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-[var(--text-primary)]">
            Space-Smart Popover
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            Automatically flips top/bottom and left/right using Ozone&apos;s useSmartPosition hook.
          </p>
        </div>
      </Popover>
    </div>
  ),
};
