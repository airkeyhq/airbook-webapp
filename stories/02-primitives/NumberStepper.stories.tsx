import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NumberStepper } from '@/components/primitives/NumberStepper';

const meta: Meta<typeof NumberStepper> = {
  title: 'Primitives/NumberStepper',
  component: NumberStepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    step: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NumberStepper>;

export const Default: Story = {
  args: {
    value: 2,
    min: 1,
    max: 12,
    step: 1,
    size: 'md',
    label: 'Party Size',
  },
  render: function DefaultStepper(args) {
    const [val, setVal] = React.useState(args.value);
    React.useEffect(() => setVal(args.value), [args.value]);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
        <NumberStepper {...args} value={val} onChange={setVal} />
      </div>
    );
  },
};

export const SizesAndUnits: Story = {
  render: function SizesStory() {
    const [qty, setQty] = React.useState(1);
    const [tip, setTip] = React.useState(25);
    const [mins, setMins] = React.useState(60);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col gap-5 w-80">
        <NumberStepper label="Compact (sm)" size="sm" value={qty} onChange={setQty} min={1} max={10} />
        <NumberStepper label="Tip Amount (md)" size="md" value={tip} onChange={setTip} min={0} max={500} step={5} prefix="$" />
        <NumberStepper label="Session Duration (lg)" size="lg" value={mins} onChange={setMins} min={15} max={240} step={15} suffix="m" />
      </div>
    );
  },
};
