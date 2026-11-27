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

export const StickyModuleHeader: Story = {
  render: () => (
    <div className="w-[520px] h-64 flex flex-col overflow-hidden rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
      <div className="flex-shrink-0 px-6 py-3 bg-[var(--bg-secondary)]/85 backdrop-blur-md border-b border-[var(--border-subtle)] flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: 'Online Booking Studio' },
            { label: 'Links & Domain' },
          ]}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-3 text-xs text-[var(--text-secondary)]">
        <p>Scrollable module content respects the card padding while the breadcrumb header stays pinned edge-to-edge.</p>
        <div className="h-40 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]" />
        <div className="h-40 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]" />
      </div>
    </div>
  ),
};
