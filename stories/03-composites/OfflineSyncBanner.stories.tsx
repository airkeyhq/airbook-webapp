import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OfflineSyncBanner } from '@/components/OfflineSyncBanner';

const meta: Meta<typeof OfflineSyncBanner> = {
  title: 'Composites/OfflineSyncBanner',
  component: OfflineSyncBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Listens to browser `online` / `offline` events and displays a fixed top sync status banner when offline or reconnected.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OfflineSyncBanner>;

export const Default: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] max-w-md text-center space-y-2">
      <OfflineSyncBanner />
      <p className="font-bold text-[var(--text-primary)]">OfflineSyncBanner mounted</p>
      <p>Toggle offline mode in DevTools Network tab to preview the fixed sync banner.</p>
    </div>
  ),
};
