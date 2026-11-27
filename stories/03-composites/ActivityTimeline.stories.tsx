import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { Badge } from '@/components/primitives/Badge';
import { getThumbsAvatarUrl } from '@/lib/avatars';

const meta: Meta<typeof ActivityTimeline> = {
  title: 'Composites/ActivityTimeline',
  component: ActivityTimeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    layoutMode: {
      control: { type: 'radio' },
      options: ['auto', 'desktop', 'tablet', 'mobile'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityTimeline>;

const SAMPLE_ITEMS = [
  {
    id: '1',
    type: 'status' as const,
    title: 'Checked In at Front Desk',
    description: 'Assigned to Styling Chair #2 with Valeria Morales.',
    timestamp: '10:28 AM',
    badge: <Badge variant="success" size="xs" dot>Checked In</Badge>,
    actor: {
      name: 'Valeria Morales',
      src: getThumbsAvatarUrl('Valeria', '#AF52DE'),
    },
  },
  {
    id: '2',
    type: 'note' as const,
    title: 'Color Formula Updated',
    description: '7N + 20vol root smudge with bond-builder additive (15 min process).',
    timestamp: '10:15 AM',
    actor: {
      name: 'Valeria Morales',
      src: getThumbsAvatarUrl('Valeria', '#AF52DE'),
    },
  },
  {
    id: '3',
    type: 'message' as const,
    title: 'SMS Reminder Confirmed',
    description: 'Client replied "YES" to 24-hour arrival reminder.',
    timestamp: 'Yesterday',
    badge: <Badge variant="warning" size="xs">SMS</Badge>,
  },
  {
    id: '4',
    type: 'payment' as const,
    title: 'Deposit Captured',
    description: '$65.00 collected via Apple Pay (Visa •••• 4242).',
    timestamp: 'Nov 23',
    badge: <Badge variant="dashed-emerald" size="xs">$65.00</Badge>,
  },
  {
    id: '5',
    type: 'booking' as const,
    title: 'Appointment Created Online',
    description: 'Full Dimensional Balayage · 150 min booked via AirBook Widget.',
    timestamp: 'Nov 23',
    badge: <Badge variant="dashed-blue" size="xs">Online</Badge>,
  },
];

export const Desktop: Story = {
  args: { layoutMode: 'desktop' },
  render: (args) => (
    <div className="w-full max-w-3xl mx-auto">
      <ActivityTimeline
        {...args}
        title="Appointment Activity (Desktop)"
        subtitle="Real-time audit log for Camille Moreau · #AB-4829"
        items={SAMPLE_ITEMS}
      />
    </div>
  ),
};

export const Tablet: Story = {
  args: { layoutMode: 'tablet' },
  render: (args) => (
    <div className="w-full max-w-lg mx-auto">
      <ActivityTimeline
        {...args}
        title="Appointment Activity (Tablet)"
        subtitle="Balanced single-column feed"
        items={SAMPLE_ITEMS}
      />
    </div>
  ),
};

export const Mobile: Story = {
  args: { layoutMode: 'mobile' },
  render: (args) => (
    <div className="w-[375px] max-w-full mx-auto">
      <ActivityTimeline
        {...args}
        title="Appointment Activity (Mobile)"
        subtitle="Compact touch feed"
        items={SAMPLE_ITEMS}
      />
    </div>
  ),
};
