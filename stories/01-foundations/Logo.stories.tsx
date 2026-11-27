import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Logo from '@/components/Logo';

const meta: Meta<typeof Logo> = {
  title: 'Foundations/Logo',
  component: Logo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Variants: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-wrap items-center gap-6">
      <Logo variant="3d" size={36} showText />
      <Logo variant="badge" badgeStyle="sky" size={28} />
      <Logo variant="badge" badgeStyle="dark" size={28} />
      <Logo variant="badge" badgeStyle="blueprint" size={28} />
      <Logo variant="flat" flatStyle="duotone" size={32} />
    </div>
  ),
};
