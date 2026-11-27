import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ActionFooter } from '@/components/primitives/ActionFooter';

const meta: Meta<typeof ActionFooter> = {
  title: 'Primitives/ActionFooter',
  component: ActionFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    primaryVariant: { control: { type: 'radio' }, options: ['primary', 'danger'] },
    primaryLoading: { control: 'boolean' },
    primaryDisabled: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ActionFooter>;

export const Default: Story = {
  args: {
    primaryLabel: 'Save Location',
    secondaryLabel: 'Cancel',
    primaryVariant: 'primary',
    primaryLoading: false,
    bordered: true,
  },
  render: (args) => (
    <div className="w-[460px] max-w-full rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden shadow-md">
      <div className="p-6 text-xs text-[var(--text-secondary)]">
        Container body content (Dialog, Drawer, or Settings Card).
      </div>
      <ActionFooter
        {...args}
        onPrimaryClick={() => {}}
        onSecondaryClick={() => {}}
      />
    </div>
  ),
};

export const WithLeadingStatusAndDanger: Story = {
  render: () => (
    <div className="space-y-4 w-[480px] max-w-full">
      <div className="rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden shadow-xs">
        <ActionFooter
          leading={<span>Last saved 2m ago</span>}
          secondaryLabel="Discard"
          primaryLabel="Publish Changes"
          onSecondaryClick={() => {}}
          onPrimaryClick={() => {}}
        />
      </div>

      <div className="rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden shadow-xs">
        <ActionFooter
          primaryVariant="danger"
          secondaryLabel="Keep Booking"
          primaryLabel="Confirm Cancel"
          onSecondaryClick={() => {}}
          onPrimaryClick={() => {}}
        />
      </div>
    </div>
  ),
};
