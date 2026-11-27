import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RibbonBanner } from '@/components/RibbonBanner';
import { Badge } from '@/components/primitives/Badge';

const meta: Meta<typeof RibbonBanner> = {
  title: 'Composites/RibbonBanner',
  component: RibbonBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof RibbonBanner>;

export const Default: Story = {
  render: function RibbonStory() {
    const [visible, setVisible] = React.useState(true);
    if (!visible) {
      return (
        <button type="button" onClick={() => setVisible(true)} className="btn-secondary">
          Restore Banner
        </button>
      );
    }

    return (
      <div className="space-y-3 max-w-3xl mx-auto">
        <RibbonBanner
          variant="info"
          badge={<Badge variant="dashed-blue" size="xs">Booking Widget</Badge>}
          action="Configure domain"
          onDismiss={() => setVisible(false)}
        >
          Connect your custom domain to boost client booking conversion.
        </RibbonBanner>
        <RibbonBanner
          variant="warning"
          badge={<Badge variant="warning" size="xs">Stripe Payouts</Badge>}
          action="Verify identity"
        >
          Complete KYC verification to enable instant payouts.
        </RibbonBanner>
      </div>
    );
  },
};
