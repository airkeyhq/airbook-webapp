import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from '@/components/primitives/Drawer';
import { ActionFooter } from '@/components/primitives/ActionFooter';
import { Icon } from '@/components/primitives/Icon';
import { Sparkle24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof Drawer> = {
  title: 'Primitives/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    side: {
      control: { type: 'radio' },
      options: ['bottom', 'right', 'left'],
      description: 'Edge of the screen the drawer slides from.',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: 'bottom' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Max width (left/right) or max height (bottom).',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: 'md' },
      },
    },
    showHandle: {
      control: 'boolean',
      description: 'Show top drag handle pill on bottom sheets.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const BottomSheet: Story = {
  args: {
    side: 'bottom',
    size: 'md',
    showHandle: true,
  },
  render: function BottomSheetStory(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-3">
        <p className="text-xs text-[var(--text-secondary)] max-w-xs">
          Mobile-first bottom sheet drawer with backdrop blur, Escape dismiss, and header/footer slots.
        </p>
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">
          Open Bottom Drawer
        </button>

        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          side={args.side}
          size={args.size}
          showHandle={args.showHandle}
          title="Quick Appointment Actions"
          description="Manage status, reminders, and checkout options."
          headerIcon={<Icon regular={Sparkle24Regular} size="md" className="text-[var(--color-accent-primary)]" />}
          footer={
            <ActionFooter
              bordered={false}
              secondaryLabel="Cancel"
              primaryLabel="Save Changes"
              onSecondaryClick={() => setOpen(false)}
              onPrimaryClick={() => setOpen(false)}
            />
          }
        >
          <div className="space-y-3 text-xs text-[var(--text-secondary)]">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              Send SMS confirmation reminder 24 hours before arrival.
            </div>
            <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              Assign to primary colorist chair #2.
            </div>
          </div>
        </Drawer>
      </div>
    );
  },
};

export const RightSlideOver: Story = {
  render: function RightDrawerStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <div>
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary">
          Open Right Drawer
        </button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          side="right"
          size="sm"
          title="Client Profile"
          description="Recent visits and formula notes."
        >
          <div className="space-y-3 text-xs text-[var(--text-secondary)]">
            <p>Camille Moreau · VIP Member</p>
            <p>Last visit: Balayage Refresh & Gloss</p>
          </div>
        </Drawer>
      </div>
    );
  },
};
