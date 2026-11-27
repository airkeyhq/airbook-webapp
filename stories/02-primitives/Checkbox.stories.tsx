import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@/components/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    spark: {
      control: 'boolean',
      description: 'Releases a radial spark burst micro-interaction when toggled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(true);
    return (
      <div className="p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4 shadow-sm w-80">
        <Checkbox
          checked={checked}
          onChange={setChecked}
          label="Email Confirmation"
          description="Send automated appointment confirmation to client."
        />
      </div>
    );
  },
};

export const VariantsAndAccents: Story = {
  render: () => {
    const [c1, setC1] = React.useState(true);
    const [c2, setC2] = React.useState(true);
    const [c3, setC3] = React.useState(true);

    return (
      <div className="p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-5 shadow-sm w-96">
        <Checkbox
          checked={c1}
          onChange={setC1}
          variant="square-rounded"
          accent="primary"
          label="Electric Sky Accent (Primary)"
          description="Standard AirBook interactive checkbox"
        />
        <Checkbox
          checked={c2}
          onChange={setC2}
          variant="rounded"
          accent="emerald"
          label="Emerald Accent"
          description="Used for verified & completed items"
        />
        <Checkbox
          checked={c3}
          onChange={setC3}
          variant="circle"
          accent="dark"
          label="Circle Radio-Style Variant"
          description="Tactile circular checkbox control"
        />
      </div>
    );
  },
};

export const SparkVariant: Story = {
  args: {
    spark: true,
  },
  render: function SparkCheckbox(args) {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="p-6 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-4 shadow-sm w-80">
        <Checkbox
          checked={checked}
          onChange={setChecked}
          spark={args.spark}
          label="Instant Spark Confirmation"
          description="Releases a radial spark burst micro-interaction when toggled."
        />
      </div>
    );
  },
};
