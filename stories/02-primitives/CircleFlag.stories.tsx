import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CircleFlag } from '@/components/primitives/CircleFlag';

const meta: Meta<typeof CircleFlag> = {
  title: 'Primitives/CircleFlag',
  component: CircleFlag,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Circular SVG country flag primitive for locale selectors, phone inputs, and multi-region studio locations.',
      },
    },
  },
  argTypes: {
    countryCode: { control: 'text' },
    size: { control: { type: 'number', min: 12, max: 64, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<typeof CircleFlag>;

export const Default: Story = {
  args: {
    countryCode: 'mx',
    size: 24,
  },
};

export const LocalesGallery: Story = {
  render: () => {
    const locales = [
      { code: 'us', label: 'United States' },
      { code: 'mx', label: 'Mexico' },
      { code: 'ca', label: 'Canada' },
      { code: 'gb', label: 'United Kingdom' },
      { code: 'es', label: 'Spain' },
      { code: 'fr', label: 'France' },
      { code: 'de', label: 'Germany' },
      { code: 'jp', label: 'Japan' },
      { code: 'br', label: 'Brazil' },
    ];

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] grid grid-cols-3 gap-3 max-w-md">
        {locales.map((loc) => (
          <div
            key={loc.code}
            className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)]"
          >
            <CircleFlag countryCode={loc.code} size={20} />
            <span className="text-xs font-bold text-[var(--text-primary)] truncate">
              {loc.label}
            </span>
          </div>
        ))}
      </div>
    );
  },
};
