import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSelector } from '@/components/LanguageSelector';

const meta: Meta<typeof LanguageSelector> = {
  title: 'Composites/LanguageSelector',
  component: LanguageSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Locale/language switcher powered by `CircleFlag` and AirBook i18n store.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LanguageSelector>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3 min-h-[200px] items-start pt-4">
      <LanguageSelector format="code" size="sm" />
      <LanguageSelector format="label" size="md" />
    </div>
  ),
};
