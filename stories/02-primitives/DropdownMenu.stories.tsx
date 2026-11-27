import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from '@/components/primitives/DropdownMenu';
import { Icon } from '@/components/primitives/Icon';
import {
  Edit24Filled,
  Copy24Filled,
  Calendar24Filled,
  Delete24Filled,
  MoreHorizontal24Filled,
} from '@fluentui/react-icons';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Primitives/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[240px] flex items-start pt-4">
      <DropdownMenu
        trigger={
          <button type="button" className="btn-secondary flex items-center gap-2">
            <span>Appointment Actions</span>
            <Icon filled={MoreHorizontal24Filled} active size="md" />
          </button>
        }
        items={[
          { type: 'label', id: 'lbl-1', label: 'Manage' },
          { id: 'edit', label: 'Edit Appointment', icon: <Icon filled={Edit24Filled} active />, shortcut: '⌘E' },
          { id: 'reschedule', label: 'Reschedule Slot', icon: <Icon filled={Calendar24Filled} active />, shortcut: '⌘R' },
          { id: 'duplicate', label: 'Duplicate Booking', icon: <Icon filled={Copy24Filled} active /> },
          { type: 'separator', id: 'sep-1' },
          { id: 'cancel', label: 'Cancel Appointment', icon: <Icon filled={Delete24Filled} active />, danger: true },
        ]}
      />
    </div>
  ),
};
