import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FloatingTextarea } from '@/components/primitives/FloatingTextarea';

const meta: Meta<typeof FloatingTextarea> = {
  title: 'Primitives/FloatingTextarea',
  component: FloatingTextarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FloatingTextarea>;

export const Default: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4 w-96">
      <FloatingTextarea
        label="Client Formula & Allergy Notes"
        maxLength={200}
        helperText="Visible to assigned stylists before check-in."
      />
      <FloatingTextarea
        label="Cancellation Reason"
        defaultValue="Client requested reschedule to next Friday morning."
        error
        helperText="Please select a valid cancellation category."
      />
    </div>
  ),
};
