import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CommandPalette } from '@/components/CommandPalette';
import { useAirBookStore } from '@/lib/store';

const meta: Meta<typeof CommandPalette> = {
  title: 'Composites/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  render: () => {
    const { setCommandPaletteOpen } = useAirBookStore();

    return (
      <div>
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="btn-secondary"
        >
          Open Command Palette (⌘K)
        </button>
        <CommandPalette />
      </div>
    );
  },
};
