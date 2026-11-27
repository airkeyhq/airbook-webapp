import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FloatingDock } from '@/components/FloatingDock';

const meta: Meta = {
  title: 'Blocks/FloatingDock',
  component: FloatingDock,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="relative w-full h-[320px] bg-[var(--canvas-bg)] flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-1 mb-8">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">macOS / iPadOS Floating Dock</h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Persistent quick-access navigation dock with tactile glassmorphism backdrop.
        </p>
      </div>
      <FloatingDock />
    </div>
  ),
};
