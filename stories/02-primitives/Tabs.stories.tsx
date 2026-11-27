import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@/components/primitives/Tabs';
import { Icon } from '@/components/primitives/Icon';
import { Sparkle24Filled, People24Filled, Tag24Filled } from '@fluentui/react-icons';

const meta: Meta<typeof Tabs> = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = React.useState('services');
    return (
      <div className="p-8 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4">
        <Tabs
          activeTab={active}
          onChange={setActive}
          tabs={[
            { id: 'services', label: 'Services', icon: <Icon filled={Sparkle24Filled} active />, count: 18 },
            { id: 'clients', label: 'Clients', icon: <Icon filled={People24Filled} active />, count: 142 },
            { id: 'packages', label: 'Packages', icon: <Icon filled={Tag24Filled} active /> },
          ]}
        />
      </div>
    );
  },
};
