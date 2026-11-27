import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from '@/components/primitives/PhoneInput';

const meta: Meta<typeof PhoneInput> = {
  title: 'Primitives/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Default: Story = {
  render: function PhoneStory() {
    const [phone, setPhone] = React.useState('(415) 890-4321');
    const [code, setCode] = React.useState('+1');
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs w-80">
        <PhoneInput
          label="Client Mobile (SMS Reminders)"
          countryCode={code}
          onCountryCodeChange={setCode}
          value={phone}
          onChange={setPhone}
          helperText="Used for 24-hour booking confirmations."
        />
      </div>
    );
  },
};
