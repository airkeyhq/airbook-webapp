import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DuplicateClientsBanner } from '@/components/DuplicateClientsBanner';

const meta: Meta<typeof DuplicateClientsBanner> = {
  title: 'Composites/DuplicateClientsBanner',
  component: DuplicateClientsBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DuplicateClientsBanner>;

export const Default: Story = {
  render: () => (
    <div className="max-w-3xl mx-auto">
      <DuplicateClientsBanner
        isDemoMode
        groups={[
          {
            id: 'dup-1',
            matchKey: 'camille.moreau@example.com',
            matchType: 'email',
            totalVisits: 14,
            totalSpentCents: 169000,
            clients: [
              { id: 'c1', name: 'Camille Moreau', email: 'camille.moreau@example.com', phone: '+1 555 234 5678', totalVisits: 12, totalSpentCents: 148000 },
              { id: 'c2', name: 'Camille M.', email: 'camille.moreau@example.com', phone: '+1 555 234 5678', totalVisits: 2, totalSpentCents: 21000 },
            ],
          },
        ]}
      />
    </div>
  ),
};
