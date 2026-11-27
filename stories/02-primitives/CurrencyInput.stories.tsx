import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyInput } from '@/components/primitives/CurrencyInput';

const meta: Meta<typeof CurrencyInput> = {
  title: 'Primitives/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  render: function CurrencyStory() {
    const [amount, setAmount] = React.useState('240.00');
    const [currency, setCurrency] = React.useState<'USD' | 'MXN' | 'EUR' | 'GBP'>('USD');
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs w-80">
        <CurrencyInput
          label="Service Price"
          value={amount}
          onChange={setAmount}
          currency={currency}
          onCurrencyChange={setCurrency}
          helperText="Includes booking deposit calculation."
        />
      </div>
    );
  },
};
