import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NotificationCenterPopover } from '@/components/NotificationCenterPopover';

const meta: Meta<typeof NotificationCenterPopover> = {
  title: 'Composites/NotificationCenter',
  component: NotificationCenterPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof NotificationCenterPopover>;

export const Default: Story = {
  render: () => {
    const now = Date.now();
    return (
      <div className="min-h-[460px] flex items-start justify-end w-[440px] pt-4 pr-4">
        <NotificationCenterPopover
          initialNotifications={[
            {
              id: 'n1',
              title: 'New Online Booking',
              message: 'Camille Moreau booked Full Balayage for Tomorrow 10:30 AM.',
              type: 'booking',
              createdAt: new Date(now - 3 * 60 * 1000).toISOString(),
              isRead: false,
            },
            {
              id: 'n2',
              title: 'Deposit Captured',
              message: '$65.00 Apple Pay deposit settled for #AB-4829.',
              type: 'payment',
              createdAt: new Date(now - 24 * 60 * 1000).toISOString(),
              isRead: false,
            },
            {
              id: 'n3',
              title: 'SMS Reminder Delivered',
              message: 'Sent 24h confirmation reminder to +1 (415) 890-4321.',
              type: 'sms',
              recipient: '+1 (415) 890-4321',
              createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
              isRead: true,
            },
          ]}
        />
      </div>
    );
  },
};
