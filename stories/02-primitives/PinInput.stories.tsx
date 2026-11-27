import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PinInput } from '@/components/primitives/PinInput';

const meta: Meta<typeof PinInput> = {
  title: 'Primitives/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    length: { control: { type: 'number', min: 4, max: 8 } },
    mask: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    spark: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PinInput>;

export const Default: Story = {
  args: {
    length: 6,
    spark: true,
    label: 'Verification Code',
    helperText: 'Enter the 6-digit code sent via SMS (try pasting 123456).',
  },
  render: function PinStory(args) {
    const [code, setCode] = React.useState('');
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
        <PinInput
          {...args}
          value={code}
          onChange={setCode}
        />
      </div>
    );
  },
};

export const KioskPinMasked: Story = {
  render: function MaskedStory() {
    const [pin, setPin] = React.useState('');
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [errorKey, setErrorKey] = React.useState(0);
    const [statusMsg, setStatusMsg] = React.useState('Enter PIN 1234 to unlock (any other 4 digits will shake).');

    const verifyPin = (val: string) => {
      if (val === '1234') {
        setError(false);
        setSuccess(true);
        setStatusMsg('Unlocked! Passcode verified.');
      } else {
        setSuccess(false);
        setError(true);
        setErrorKey((k) => k + 1);
        setStatusMsg('Incorrect PIN. Try 1234.');
      }
    };

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4 w-80">
        <PinInput
          length={4}
          mask
          spark
          success={success}
          error={error}
          errorKey={errorKey}
          value={pin}
          onChange={(val) => {
            setPin(val);
            setSuccess(false);
            if (error && val.length < 4) {
              setError(false);
              setStatusMsg('Enter PIN 1234 to unlock (any other 4 digits will shake).');
            }
          }}
          onComplete={verifyPin}
          onSubmit={verifyPin}
          label="Staff POS PIN"
          helperText={statusMsg}
        />
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => verifyPin(pin)}
            className="btn-primary !h-9 flex-1 text-xs"
          >
            Submit PIN
          </button>
          <button
            type="button"
            onClick={() => {
              setPin('');
              setError(false);
              setSuccess(false);
              setStatusMsg('Enter PIN 1234 to unlock (any other 4 digits will shake).');
            }}
            className="btn-secondary !h-9 text-xs"
          >
            Clear
          </button>
        </div>
      </div>
    );
  },
};
