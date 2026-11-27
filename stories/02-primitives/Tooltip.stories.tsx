import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@/components/primitives/Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const SpaceSmartEdges: Story = {
  render: () => (
    <div className="min-h-[calc(100vh-2rem)] w-full flex flex-col justify-between p-4 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <div className="flex items-center justify-between">
        <Tooltip content="Auto-flipped below & left-aligned">
          <button type="button" className="btn-secondary">Top Left Edge</button>
        </Tooltip>
        <Tooltip content="Auto-flipped below & right-aligned">
          <button type="button" className="btn-secondary">Top Right Edge</button>
        </Tooltip>
      </div>

      <div className="flex justify-center">
        <Tooltip content="Centered above trigger when space allows">
          <button type="button" className="btn-primary">Center Trigger</button>
        </Tooltip>
      </div>

      <div className="flex items-center justify-between">
        <Tooltip content="Auto-flipped above & left-aligned" preferredVertical="bottom">
          <button type="button" className="btn-secondary">Bottom Left Edge</button>
        </Tooltip>
        <Tooltip content="Auto-flipped above & right-aligned" preferredVertical="bottom">
          <button type="button" className="btn-secondary">Bottom Right Edge</button>
        </Tooltip>
      </div>
    </div>
  ),
};
