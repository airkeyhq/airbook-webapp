import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CardView } from '@/components/CardView';
import { getThumbsAvatarUrl } from '@/lib/avatars';

const meta: Meta<typeof CardView> = {
  title: 'Composites/CardView',
  component: CardView,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Responsive grid of cards with avatars, status badges, key-value metadata rows, and tags.',
      },
    },
  },
  argTypes: {
    columns: {
      control: { type: 'radio' },
      options: [1, 2, 3, 4],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CardView>;

export const StudioClients: Story = {
  args: {
    columns: 3,
  },
  render: (args) => (
    <div className="max-w-4xl mx-auto">
      <CardView
        columns={args.columns}
        items={[
          {
            id: 'c1',
            title: 'Camille Moreau',
            subtitle: 'Full Dimensional Balayage',
            avatarSrc: getThumbsAvatarUrl('Camille Moreau', '#2BB5FF'),
            avatarFallback: 'CM',
            status: { label: 'Confirmed', variant: 'success' },
            metadata: [
              { label: 'Time', value: '10:30 AM' },
              { label: 'Total', value: '$240.00' },
            ],
            tags: ['VIP', 'Color'],
          },
          {
            id: 'c2',
            title: 'Jessica Taylor',
            subtitle: 'Gloss & Blowout',
            avatarSrc: getThumbsAvatarUrl('Jessica Taylor', '#34C759'),
            avatarFallback: 'JT',
            status: { label: 'Pending', variant: 'warning' },
            metadata: [
              { label: 'Time', value: '1:15 PM' },
              { label: 'Total', value: '$85.00' },
            ],
            tags: ['Walk-in'],
          },
          {
            id: 'c3',
            title: 'Elena Rostova',
            subtitle: 'Root Smudge',
            avatarSrc: getThumbsAvatarUrl('Elena Rostova', '#AF52DE'),
            avatarFallback: 'ER',
            status: { label: 'Cancelled', variant: 'danger' },
            metadata: [
              { label: 'Time', value: '4:00 PM' },
              { label: 'Total', value: '$110.00' },
            ],
            tags: ['Deposit'],
          },
        ]}
      />
    </div>
  ),
};
