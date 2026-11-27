import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from '@/components/primitives/Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Primitives/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
      <Breadcrumbs
        items={[
          { label: 'Studio', onClick: () => {} },
          { label: 'Services', onClick: () => {} },
          { label: 'Color & Balayage' },
        ]}
      />
    </div>
  ),
};
