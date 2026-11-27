import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from '@/components/primitives/RadioGroup';
import { Badge } from '@/components/primitives/Badge';

const meta: Meta<typeof RadioGroup> = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['list', 'cards'],
    },
    spark: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const DefaultList: Story = {
  args: {
    variant: 'list',
    spark: true,
  },
  render: function ListStory(args) {
    const [val, setVal] = React.useState('sms');
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs w-80">
        <RadioGroup
          {...args}
          value={val}
          onChange={setVal}
          label="Reminder Channel"
          options={[
            { value: 'sms', label: 'SMS Text Message', description: 'Instant delivery 24h before appointment.' },
            { value: 'email', label: 'Email Notification', description: 'Includes calendar invite & prep guide.' },
            { value: 'none', label: 'No Automated Reminder', disabled: false },
          ]}
        />
      </div>
    );
  },
};

export const CardSelection: Story = {
  render: function CardsStory() {
    const [val, setVal] = React.useState('balayage');
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs w-96">
        <RadioGroup
          variant="cards"
          spark
          value={val}
          onChange={setVal}
          label="Select Treatment Tier"
          options={[
            {
              value: 'express',
              label: 'Express Gloss & Blowout',
              description: '45 min · Shine glaze + signature styling',
              meta: '$85',
            },
            {
              value: 'balayage',
              label: 'Full Dimensional Balayage',
              description: '150 min · Hand-painted highlights & bond repair',
              badge: <Badge variant="dashed-blue" size="xs">Popular</Badge>,
              meta: '$240',
            },
            {
              value: 'vip',
              label: 'Scalp Spa + Couture Color',
              description: '180 min · Steam ritual, massage & gloss',
              meta: '$320',
            },
          ]}
        />
      </div>
    );
  },
};
