import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@/components/primitives/Accordion';
import { Badge } from '@/components/primitives/Badge';

const meta: Meta<typeof Accordion> = {
  title: 'Primitives/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <div className="w-[440px] max-w-full">
      <Accordion
        type="single"
        defaultOpenIds={['deposit']}
        items={[
          {
            id: 'deposit',
            title: 'Deposit & Cancellation Policy',
            subtitle: '24-hour notice & automatic Apple Pay refund',
            badge: <Badge variant="dashed-blue" size="xs">Required</Badge>,
            content:
              'A $40 deposit secures the reservation. Cancellations made more than 24 hours in advance are refunded automatically.',
          },
          {
            id: 'prep',
            title: 'Pre-Appointment Color Prep',
            subtitle: 'Arrive with dry, unwashed hair for best lift',
            content:
              'Please avoid heavy oils or dry shampoo 24 hours prior to your balayage or gloss appointment.',
          },
          {
            id: 'parking',
            title: 'Studio Parking & Arrival',
            subtitle: 'Complimentary 2-hour valet behind Aurelia Studio',
            content:
              'Check in at the front tablet or tap the link in your SMS reminder 10 minutes before your session.',
          },
        ]}
      />
    </div>
  ),
};
