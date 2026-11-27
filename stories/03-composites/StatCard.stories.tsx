import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from '@/components/StatCard';
import { Icon } from '@/components/primitives/Icon';
import { Money24Regular, Calendar24Regular, People24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof StatCard> = {
  title: 'Composites/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const OverviewGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <StatCard
        title="Monthly Revenue"
        value="24,850"
        prefix="$"
        trend={{ value: '+18.2%', direction: 'up' }}
        subtitle="vs. last month"
        sparkline={[18, 22, 19, 25, 29, 27, 34]}
        icon={<Icon regular={Money24Regular} size="md" />}
      />
      <StatCard
        title="Confirmed Bookings"
        value={142}
        trend={{ value: '+12', direction: 'up' }}
        subtitle="this week"
        sparkline={[12, 18, 15, 22, 24, 28, 31]}
        icon={<Icon regular={Calendar24Regular} size="md" />}
      />
      <StatCard
        title="No-Show Rate"
        value="1.8"
        suffix="%"
        trend={{ value: '-0.6%', direction: 'down' }}
        subtitle="improved"
        sparkline={[5, 4.2, 3.8, 3.1, 2.5, 2.0, 1.8]}
        icon={<Icon regular={People24Regular} size="md" />}
      />
    </div>
  ),
};
