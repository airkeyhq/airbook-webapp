import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatePresence } from 'framer-motion';
import { Toast, type ToastVariant } from '@/components/primitives/Toast';

const meta: Meta<typeof Toast> = {
  title: 'Primitives/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[360px]">
      <Toast
        variant="success"
        title="Booking Confirmed"
        description="Camille Moreau scheduled for Tomorrow at 10:30 AM."
        action={{ label: 'View Calendar', onClick: () => {} }}
      />
      <Toast
        variant="info"
        title="SMS Reminder Queued"
        description="Automated 24h reminder will send at 10:30 AM."
      />
      <Toast
        variant="warning"
        title="Deposit Pending"
        description="Awaiting client card authorization."
      />
      <Toast
        variant="danger"
        title="Payment Declined"
        description="Visa ending in 4242 was declined. Please retry."
      />
    </div>
  ),
};

export const InteractiveStack: Story = {
  render: function StackStory() {
    const [toasts, setToasts] = React.useState<{ id: number; variant: ToastVariant; title: string }[]>([]);

    const push = (variant: ToastVariant, title: string) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, variant, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };

    return (
      <div className="space-y-4 w-[380px]">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => push('success', 'Appointment saved')} className="btn-primary !h-9 text-xs">
            Trigger Success
          </button>
          <button type="button" onClick={() => push('danger', 'Sync failed')} className="btn-secondary !h-9 text-xs">
            Trigger Error
          </button>
        </div>

        <div className="flex flex-col gap-2 min-h-[120px]">
          <AnimatePresence>
            {toasts.map((t) => (
              <Toast
                key={t.id}
                variant={t.variant}
                title={t.title}
                description="Transient toast notification with auto-dismiss."
                onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  },
};
