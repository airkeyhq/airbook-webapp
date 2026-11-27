import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SectionCard } from '@/components/SectionCard';
import { Switch } from '@/components/primitives/Switch';
import { Badge } from '@/components/primitives/Badge';
import { ActionFooter } from '@/components/primitives/ActionFooter';

const meta: Meta<typeof SectionCard> = {
  title: 'Composites/SectionCard',
  component: SectionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SectionCard>;

export const Default: Story = {
  render: function SectionStory() {
    const [autoConfirm, setAutoConfirm] = React.useState(true);
    const [smsRemind, setSmsRemind] = React.useState(true);

    return (
      <div className="w-[480px] max-w-full">
        <SectionCard
          title="Booking Automation"
          description="Configure instant confirmations and client notifications."
          badge={<Badge variant="dashed-blue" size="xs">Recommended</Badge>}
          footer={
            <ActionFooter
              leading={<span>Changes sync across all kiosks</span>}
              secondaryLabel="Reset"
              primaryLabel="Save Settings"
              onSecondaryClick={() => {}}
              onPrimaryClick={() => {}}
            />
          }
        >
          <div className="p-5">
            <Switch
              checked={autoConfirm}
              onChange={setAutoConfirm}
              variant="spark"
              label="Auto-Confirm Online Bookings"
              description="Immediately reserve the calendar slot when deposit succeeds."
            />
          </div>
          <div className="p-5">
            <Switch
              checked={smsRemind}
              onChange={setSmsRemind}
              label="24-Hour SMS Reminders"
              description="Automatically text clients one day before their visit."
            />
          </div>
        </SectionCard>
      </div>
    );
  },
};
