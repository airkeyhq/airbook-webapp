import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from '@/components/ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Composites/ColorPicker',
  component: ColorPicker,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    layoutMode: {
      control: { type: 'radio' },
      options: ['auto', 'desktop', 'tablet', 'mobile'],
      description: 'Responsive presentation mode (2-column Desktop popover, compact Tablet popover, or Mobile bottom sheet).',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: 'auto' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {
    layoutMode: 'auto',
  },
  render: (args) => {
    const [color, setColor] = useState('#2BB5FF');
    return (
      <div className="min-h-[420px] flex items-start justify-center pt-6">
        <div className="w-[360px] p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Accent Color Studio</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Responsive Color Studio: 2-column Desktop popover, compact Tablet popover, or Mobile bottom sheet.
            </p>
          </div>
          <ColorPicker
            value={color}
            layoutMode={args.layoutMode}
            onChange={(newColor) => setColor(newColor)}
          />
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
            <span className="text-[var(--text-muted)]">Active HEX:</span>
            <span className="font-mono font-bold text-[var(--text-primary)]">{color}</span>
          </div>
        </div>
      </div>
    );
  },
};
