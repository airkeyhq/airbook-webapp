import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Composites/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">
          Open Confirm Dialog
        </button>
        <ConfirmDialog
          isOpen={open}
          variant="danger"
          title="Cancel Appointment?"
          description="This will notify the client and release the 2:30 PM slot."
          confirmLabel="Cancel Slot"
          onConfirm={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};
