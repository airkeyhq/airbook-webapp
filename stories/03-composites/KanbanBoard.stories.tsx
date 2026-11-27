import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Badge } from '@/components/primitives/Badge';
import { getThumbsAvatarUrl } from '@/lib/avatars';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Composites/KanbanBoard',
  component: KanbanBoard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive Kanban board with HTML5 drag-and-drop across and within columns, drop insertion indicators, and rolling `InlineIndicator` column counts.',
      },
    },
  },
  argTypes: {
    draggable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

export const StudioQueue: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <KanbanBoard
        columns={[
          {
            id: 'waiting',
            title: 'Waiting Lounge',
            accent: 'amber',
            items: [
              {
                id: 'k1',
                title: 'Jessica Taylor',
                subtitle: 'Gloss & Blowout',
                badge: <Badge size="xs" variant="warning">Arrived</Badge>,
                assignee: { name: 'Hannah', src: getThumbsAvatarUrl('Hannah', '#34C759') },
                meta: '10:45 AM',
              },
            ],
          },
          {
            id: 'in-chair',
            title: 'In Chair',
            accent: 'blue',
            items: [
              {
                id: 'k2',
                title: 'Camille Moreau',
                subtitle: 'Full Dimensional Balayage',
                badge: <Badge size="xs" variant="dashed-blue">Chair #2</Badge>,
                assignee: { name: 'Valeria', src: getThumbsAvatarUrl('Valeria', '#AF52DE') },
                meta: '45m left',
              },
              {
                id: 'k3',
                title: 'Elena Rostova',
                subtitle: 'Keratin Silk Treatment',
                assignee: { name: 'Valeria', src: getThumbsAvatarUrl('Valeria', '#AF52DE') },
                meta: '20m left',
              },
            ],
          },
          {
            id: 'checkout',
            title: 'Ready for Checkout',
            accent: 'emerald',
            items: [
              {
                id: 'k4',
                title: 'Sophia Chen',
                subtitle: 'Precision Cut & Style',
                badge: <Badge size="xs" variant="success">$95.00</Badge>,
                assignee: { name: 'Camille', src: getThumbsAvatarUrl('Camille', '#2BB5FF') },
                meta: 'POS #1',
              },
            ],
          },
        ]}
      />
    </div>
  ),
};
