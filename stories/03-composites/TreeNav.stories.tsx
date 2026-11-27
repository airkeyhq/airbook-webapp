import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeNav } from '@/components/TreeNav';
import { Badge } from '@/components/primitives/Badge';
import { Icon } from '@/components/primitives/Icon';
import { Calendar24Regular, People24Regular, Settings24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof TreeNav> = {
  title: 'Composites/TreeNav',
  component: TreeNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TreeNav>;

export const Default: Story = {
  render: function TreeStory() {
    const [active, setActive] = React.useState('calendar-day');
    return (
      <div className="w-64">
        <TreeNav
          activeId={active}
          onSelect={setActive}
          defaultExpandedIds={['calendar', 'settings']}
          items={[
            {
              id: 'calendar',
              label: 'Calendar',
              icon: <Icon regular={Calendar24Regular} />,
              badge: <Badge variant="dashed-blue" size="xs">Live</Badge>,
              children: [
                { id: 'calendar-day', label: 'Daily Schedule' },
                { id: 'calendar-week', label: 'Weekly Grid' },
              ],
            },
            {
              id: 'clients',
              label: 'Clients',
              icon: <Icon regular={People24Regular} />,
              count: 142,
            },
            {
              id: 'settings',
              label: 'Studio Settings',
              icon: <Icon regular={Settings24Regular} />,
              children: [
                { id: 'locations', label: 'Locations' },
                { id: 'payouts', label: 'Stripe Payouts' },
              ],
            },
          ]}
        />
      </div>
    );
  },
};
