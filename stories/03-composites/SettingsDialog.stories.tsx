import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SettingsDialog } from '@/components/SettingsDialog';
import { ActionFooter } from '@/components/primitives/ActionFooter';
import { FloatingInput } from '@/components/FloatingInput';
import { Switch } from '@/components/primitives/Switch';
import { Icon } from '@/components/primitives/Icon';
import { Building24Filled, Payment24Filled, People24Filled } from '@fluentui/react-icons';

const meta: Meta<typeof SettingsDialog> = {
  title: 'Composites/SettingsDialog',
  component: SettingsDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SettingsDialog>;

export const Default: Story = {
  render: function SettingsStory() {
    const [open, setOpen] = React.useState(false);
    const [studioName, setStudioName] = React.useState('Aurelia Salon Studio');
    const [instantPayouts, setInstantPayouts] = React.useState(true);

    return (
      <div>
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">
          Open Studio Settings
        </button>

        <SettingsDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Studio Settings"
          subtitle="Manage workspace & billing."
          footer={
            <ActionFooter
              secondaryLabel="Close"
              primaryLabel="Save Changes"
              onSecondaryClick={() => setOpen(false)}
              onPrimaryClick={() => setOpen(false)}
            />
          }
          tabs={[
            {
              id: 'general',
              label: 'General',
              icon: <Icon filled={Building24Filled} active />,
              content: (
                <div className="space-y-4">
                  <FloatingInput
                    label="Studio Name"
                    value={studioName}
                    onChange={(e) => setStudioName(e.target.value)}
                  />
                </div>
              ),
            },
            {
              id: 'payouts',
              label: 'Payouts',
              icon: <Icon filled={Payment24Filled} active />,
              content: (
                <Switch
                  checked={instantPayouts}
                  onChange={setInstantPayouts}
                  variant="spark"
                  label="Instant Stripe Payouts"
                  description="Transfer settled card payments within 30 minutes."
                />
              ),
            },
            {
              id: 'team',
              label: 'Specialists',
              icon: <Icon filled={People24Filled} active />,
              content: (
                <p className="text-xs text-[var(--text-secondary)]">
                  12 active specialists synced with calendar availability.
                </p>
              ),
            },
          ]}
        />
      </div>
    );
  },
};
