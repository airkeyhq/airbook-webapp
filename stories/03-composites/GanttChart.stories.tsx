import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GanttChart } from '@/components/GanttChart';
import { getThumbsAvatarUrl } from '@/lib/avatars';

const meta: Meta<typeof GanttChart> = {
  title: 'Composites/GanttChart',
  component: GanttChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Horizontal Gantt schedule chart with configurable time axis, color-coded bars, assignee avatars, and hover tooltips.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GanttChart>;

export const StudioSchedule: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <GanttChart
        min={9}
        max={19}
        tasks={[
          {
            id: 'g1',
            title: 'Camille Moreau',
            subtitle: 'Full Balayage',
            start: 10.5,
            end: 13,
            color: 'blue',
            assignee: { name: 'Valeria', src: getThumbsAvatarUrl('Valeria', '#AF52DE') },
            meta: '10:30a - 1:00p',
          },
          {
            id: 'g2',
            title: 'Valeria Morales',
            subtitle: 'Keratin Silk',
            start: 11.75,
            end: 13.75,
            color: 'emerald',
            assignee: { name: 'Hannah', src: getThumbsAvatarUrl('Hannah', '#34C759') },
            meta: '11:45a - 1:45p',
          },
          {
            id: 'g3',
            title: 'Jessica Taylor',
            subtitle: 'Gloss & Blowout',
            start: 13.25,
            end: 14.5,
            color: 'amber',
            assignee: { name: 'Camille', src: getThumbsAvatarUrl('Camille', '#2BB5FF') },
            meta: '1:15p - 2:30p',
          },
          {
            id: 'g4',
            title: 'Elena Rostova',
            subtitle: 'Root Smudge (Cancelled)',
            start: 16,
            end: 17.25,
            color: 'rose',
            meta: '4:00p - 5:15p',
          },
        ]}
      />
    </div>
  ),
};
