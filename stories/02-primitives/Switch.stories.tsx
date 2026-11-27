import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@/components/primitives/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'The controlled checked state of the switch.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Primary text label displayed next to switch.',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    description: {
      control: 'text',
      description: 'Secondary caption explaining the setting behavior.',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Size dimension token.',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: 'md' },
      },
    },
    variant: {
      control: { type: 'radio' },
      options: ['default', 'spark'],
      description: 'Visual micro-interaction variant (`spark` releases radial sparks when pressed).',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    checked: true,
    size: 'md',
    variant: 'default',
    label: 'Auto-Confirm Online Bookings',
    description: 'Instantly reserve calendar slot when paid.',
    disabled: false,
  },
  render: function DefaultSwitch(args) {
    const [checked, setChecked] = React.useState(args.checked);

    React.useEffect(() => {
      setChecked(args.checked);
    }, [args.checked]);

    return (
      <Switch
        {...args}
        checked={checked}
        onChange={(next) => {
          setChecked(next);
          args.onChange?.(next);
        }}
      />
    );
  },
};

export const SparkVariant: Story = {
  args: {
    checked: false,
    size: 'md',
    variant: 'spark',
    label: 'Enable Instant Spark Mode',
    description: 'Releases a radial spark burst micro-interaction when toggled.',
    disabled: false,
  },
  render: function SparkSwitch(args) {
    const [checked, setChecked] = React.useState(args.checked);

    React.useEffect(() => {
      setChecked(args.checked);
    }, [args.checked]);

    return (
      <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
        <Switch
          {...args}
          checked={checked}
          onChange={(next) => {
            setChecked(next);
            args.onChange?.(next);
          }}
        />
      </div>
    );
  },
};
