import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, toast } from '@/components/primitives/Sonner';

const meta: Meta<typeof Toaster> = {
  title: 'Primitives/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-3 text-center">
      <Toaster position="bottom-right" />
      <p className="text-xs text-[var(--text-secondary)] max-w-xs">
        Trigger multiple toasts to see Sonner-style stacking (hover the stack to expand).
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() =>
            toast.success('Booking Confirmed', {
              description: 'Camille Moreau · Tomorrow 10:30 AM',
              action: { label: 'Undo', onClick: () => {} },
            })
          }
          className="btn-primary !h-9 text-xs"
        >
          Success Toast
        </button>
        <button
          type="button"
          onClick={() =>
            toast.info('SMS Reminder Queued', {
              description: 'Sending 24h before appointment.',
            })
          }
          className="btn-secondary !h-9 text-xs"
        >
          Info Toast
        </button>
        <button
          type="button"
          onClick={() =>
            toast.warning('Deposit Pending', {
              description: 'Awaiting client authorization.',
            })
          }
          className="btn-secondary !h-9 text-xs"
        >
          Warning
        </button>
        <button
          type="button"
          onClick={() =>
            toast.error('Payment Declined', {
              description: 'Card ending in 4242 was declined.',
            })
          }
          className="btn-secondary !h-9 text-xs"
        >
          Error Toast
        </button>
      </div>
    </div>
  ),
};
