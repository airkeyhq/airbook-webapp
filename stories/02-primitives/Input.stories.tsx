import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/primitives/Input';
import { Icon } from '@/components/primitives/Icon';
import { Mail24Regular, LockClosed24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4 w-80">
      <Input label="Client Email" placeholder="camille@example.com" leftElement={<Icon regular={Mail24Regular} size="md" />} />
      <Input label="Access Code" type="password" defaultValue="123456" leftElement={<Icon regular={LockClosed24Regular} size="md" />} />
      <Input label="Promo Code" defaultValue="EXPIRED50" error helperText="This promo code has expired." />
    </div>
  ),
};
