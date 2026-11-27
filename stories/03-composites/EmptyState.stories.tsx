import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '@/components/EmptyState';
import { Icon } from '@/components/primitives/Icon';
import { People24Regular, ShoppingBag24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof EmptyState> = {
  title: 'Composites/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="w-[480px]">
      <EmptyState
        icon={<Icon regular={People24Regular} />}
        title="No clients found yet"
        description="Add your first client profile to manage personal styling formulas, past booking history, and transformation galleries."
        action={{
          label: 'Create First Client',
          onClick: () => alert('Create client action clicked'),
        }}
      />
    </div>
  ),
};

export const InventoryEmpty: StoryObj = {
  render: () => (
    <div className="w-[480px]">
      <EmptyState
        icon={<Icon regular={ShoppingBag24Regular} />}
        title="Retail shelf is clean"
        description="Sync retail shampoos, restorative balms, and styling tools to unlock instant checkout and low-stock replenishment alerts."
        action={{
          label: 'Add Retail Product',
          onClick: () => alert('Add product clicked'),
        }}
      />
    </div>
  ),
};
