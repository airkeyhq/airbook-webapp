import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Command } from '@/components/Command';
import { Kbd } from '@/components/primitives/Kbd';
import { Icon } from '@/components/primitives/Icon';
import {
  Add24Regular,
  Calendar24Regular,
  People24Regular,
  Payment24Regular,
} from '@fluentui/react-icons';

const meta: Meta<typeof Command> = {
  title: 'Composites/Command',
  component: Command,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: function CommandStory() {
    const [open, setOpen] = React.useState(false);

    return (
      <div className="text-center space-y-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <span>Open Command Palette</span>
          <Kbd>⌘K</Kbd>
        </button>

        <Command
          open={open}
          onClose={() => setOpen(false)}
          items={[
            {
              id: 'new-booking',
              group: 'Quick Actions',
              label: 'New Appointment',
              subtitle: 'Reserve a time slot on today’s calendar',
              icon: <Icon regular={Add24Regular} size="md" />,
              shortcut: 'N',
              onSelect: () => {},
            },
            {
              id: 'pos-checkout',
              group: 'Quick Actions',
              label: 'Open POS Checkout',
              subtitle: 'Collect card or Apple Pay payment',
              icon: <Icon regular={Payment24Regular} size="md" />,
              shortcut: 'P',
              onSelect: () => {},
            },
            {
              id: 'calendar',
              group: 'Navigation',
              label: 'Studio Calendar',
              icon: <Icon regular={Calendar24Regular} size="md" />,
              shortcut: 'G C',
              onSelect: () => {},
            },
            {
              id: 'clients',
              group: 'Navigation',
              label: 'Client Directory',
              icon: <Icon regular={People24Regular} size="md" />,
              shortcut: 'G U',
              onSelect: () => {},
            },
          ]}
        />
      </div>
    );
  },
};
