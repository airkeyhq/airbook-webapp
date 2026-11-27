import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@/components/primitives/Dialog';
import { ActionFooter } from '@/components/primitives/ActionFooter';
import { FloatingInput } from '@/components/FloatingInput';
import { Icon } from '@/components/primitives/Icon';
import { Sparkle24Regular, Warning24Filled } from '@fluentui/react-icons';

const meta: Meta<typeof Dialog> = {
  title: 'Primitives/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: { type: 'radio' }, options: ['sm', 'md', 'lg', 'xl'] },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: { size: 'md' },
  render: function DialogStory(args) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('Aurelia Salon Studio');

    return (
      <div>
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">
          Open Dialog
        </button>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          size={args.size}
          title="Edit Studio Location"
          description="Update the public display name and booking address."
          headerIcon={<Icon regular={Sparkle24Regular} size="md" className="text-[var(--color-accent-primary)]" />}
          footer={
            <ActionFooter
              bordered={false}
              secondaryLabel="Cancel"
              primaryLabel="Save Location"
              onSecondaryClick={() => setOpen(false)}
              onPrimaryClick={() => setOpen(false)}
            />
          }
        >
          <div className="space-y-4">
            <FloatingInput
              label="Studio Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </Dialog>
      </div>
    );
  },
};

export const DestructiveConfirm: Story = {
  render: function ConfirmStory() {
    const [open, setOpen] = React.useState(false);

    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 h-10 rounded-2xl bg-rose-500 text-white text-xs font-extrabold shadow-xs hover:bg-rose-600 transition-colors cursor-pointer"
        >
          Cancel Appointment
        </button>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          size="sm"
          title="Cancel Appointment?"
          description="This will notify Camille Moreau via SMS and release the 2:30 PM slot."
          headerIcon={<Icon filled={Warning24Filled} active size="md" className="text-rose-500" />}
          footer={
            <ActionFooter
              bordered={false}
              primaryVariant="danger"
              secondaryLabel="Keep Booking"
              primaryLabel="Confirm Cancel"
              onSecondaryClick={() => setOpen(false)}
              onPrimaryClick={() => setOpen(false)}
            />
          }
        >
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            The $40.00 deposit will be automatically refunded to the client&apos;s original payment method.
          </p>
        </Dialog>
      </div>
    );
  },
};
