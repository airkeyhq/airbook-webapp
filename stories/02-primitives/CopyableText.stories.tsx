import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CopyableText } from '@/components/primitives/CopyableText';

const meta: Meta<typeof CopyableText> = {
  title: 'Primitives/CopyableText',
  component: CopyableText,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CopyableText>;

export const Default: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col items-start gap-3">
      <CopyableText label="Booking Link" value="https://airbook.app/aurelia" />
      <CopyableText label="Order ID" value="#AB-4829-VIP" />
    </div>
  ),
};
