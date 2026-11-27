import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CurrencySelector } from '@/components/CurrencySelector';

const meta: Meta<typeof CurrencySelector> = {
  title: 'Composites/CurrencySelector',
  component: CurrencySelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Currency switcher powered by `CircleFlag` and AirBook i18n store.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CurrencySelector>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3 min-h-[220px] items-start pt-4">
      <CurrencySelector format="code" size="sm" />
      <CurrencySelector format="label" size="md" />
    </div>
  ),
};
