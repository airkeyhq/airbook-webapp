import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/primitives/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const LoadingClientCard: Story = {
  render: () => (
    <div className="w-80 p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-12 h-12" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="rectangular" className="h-4 w-3/4" />
          <Skeleton variant="rectangular" className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton variant="rectangular" className="h-10 w-full" />
        <Skeleton variant="rectangular" className="h-10 w-full" />
      </div>
    </div>
  ),
};
