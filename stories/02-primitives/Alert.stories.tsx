import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '@/components/primitives/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Primitives/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3 w-[420px] max-w-full">
      <Alert variant="info" title="Online Booking Active">
        Your salon booking link is live and synced with Google Calendar.
      </Alert>
      <Alert variant="success" title="Payout Completed">
        $2,480.00 was deposited to your connected bank account.
      </Alert>
      <Alert variant="warning" title="Low Retail Stock">
        3 products are below your 5-unit reorder threshold.
      </Alert>
      <Alert variant="danger" title="SMS Credits Depleted" onDismiss={() => {}}>
        Automated appointment reminders are paused until you top up.
      </Alert>
    </div>
  ),
};
