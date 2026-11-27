import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PlanGate } from '@/components/PlanGate';

const meta: Meta<typeof PlanGate> = {
  title: 'Composites/PlanGate',
  component: PlanGate,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Feature-gate card that unlocks gated modules on eligible plans or displays an upgrade prompt.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlanGate>;

export const LockedFeature: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto">
      <PlanGate
        feature="custom_domain"
        fallbackTitle="Custom Domain Studio"
        fallbackDescription="Connect your own studio domain (e.g. book.yourstudio.com) with automatic SSL."
      >
        <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-bold">
          Unlocked Custom Domain Content
        </div>
      </PlanGate>
    </div>
  ),
};
