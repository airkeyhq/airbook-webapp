import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GoToAppPill } from '@/components/GoToAppPill';

const meta: Meta = {
  title: 'Composites/GoToAppPill',
  component: GoToAppPill,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4">
      <div className="text-xs text-[var(--text-secondary)]">
        Concentric nested pill navigation component (Outer: 40px / Inner: 28px / Uniform padding: 6px):
      </div>
      <GoToAppPill />
    </div>
  ),
};
