import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RollingNumber } from '@/components/primitives/RollingNumber';
import { NumberStepper } from '@/components/primitives/NumberStepper';

const meta: Meta<typeof RollingNumber> = {
  title: 'Primitives/RollingNumber',
  component: RollingNumber,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'text' },
    animated: { control: 'boolean' },
    durationMs: { control: 'number' },
    delayMs: { control: 'number' },
    staggerMs: { control: 'number' },
    direction: {
      control: { type: 'select' },
      options: ['up', 'down'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RollingNumber>;

export const Default: Story = {
  args: {
    value: 8,
    animated: true,
    durationMs: 900,
    delayMs: 40,
    staggerMs: 45,
    direction: 'up',
  },
  render: (args) => (
    <div className="p-8 flex flex-col gap-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
      <div className="font-mono text-4xl font-black tracking-tight text-[var(--text-primary)]">
        <RollingNumber {...args} />
      </div>
      <p className="text-xs text-[var(--text-secondary)]">
        Change controls below to preview the mechanical odometer roll.
      </p>
    </div>
  ),
};

export const CurrencyAndMetrics: Story = {
  render: function MetricsStory() {
    const [revenue, setRevenue] = React.useState(24850);
    const [bookings, setBookings] = React.useState(142);

    return (
      <div className="space-y-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-xs flex flex-col gap-1">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Monthly Revenue</span>
            <div className="font-mono text-3xl font-black tracking-tight text-[var(--text-primary)]">
              <RollingNumber value={revenue.toLocaleString()} prefix="$" durationMs={1000} />
            </div>
            <span className="text-[11px] font-semibold text-emerald-500">+18.2% vs last month</span>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-xs flex flex-col gap-1">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Client Retention</span>
            <div className="font-mono text-3xl font-black tracking-tight text-[var(--text-primary)]">
              <RollingNumber value="94.2%" durationMs={900} />
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">After 8 weeks</span>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-xs flex flex-col gap-1">
            <span className="text-xs text-[var(--text-secondary)] font-semibold">Confirmed Bookings</span>
            <div className="font-mono text-3xl font-black tracking-tight text-[#2BB5FF]">
              <RollingNumber value={bookings} durationMs={850} />
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">Across 12 specialists</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setRevenue((r) => r + 245);
              setBookings((b) => b + 1);
            }}
            className="btn-primary !h-9 text-xs"
          >
            + Add Booking ($245)
          </button>
          <button
            type="button"
            onClick={() => {
              setRevenue(24850);
              setBookings(142);
            }}
            className="btn-secondary !h-9 text-xs"
          >
            Reset
          </button>
        </div>
      </div>
    );
  },
};

export const TypographyScales: Story = {
  render: () => (
    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col gap-3">
      <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
        text-xs: <RollingNumber value="1,248" />
      </div>
      <div className="font-mono text-sm font-bold text-[var(--text-primary)]">
        text-sm: <RollingNumber value="1,248" />
      </div>
      <div className="font-mono text-base font-bold text-[var(--text-primary)]">
        text-base: <RollingNumber value="1,248" />
      </div>
      <div className="font-mono text-xl font-bold text-[var(--text-primary)]">
        text-xl: <RollingNumber value="1,248" />
      </div>
      <div className="font-mono text-3xl font-black text-[var(--text-primary)]">
        text-3xl: <RollingNumber value="1,248" />
      </div>
      <div className="font-mono text-5xl font-black text-[var(--text-primary)]">
        text-5xl: <RollingNumber value="1,248" durationMs={1200} />
      </div>
    </div>
  ),
};

export const StepperAmountControl: Story = {
  render: function StepperStory() {
    const [guests, setGuests] = React.useState(2);
    const [tip, setTip] = React.useState(25);
    const [minutes, setMinutes] = React.useState(60);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col gap-5 w-80">
        <NumberStepper
          label="Party Size"
          value={guests}
          onChange={setGuests}
          min={1}
          max={12}
          step={1}
        />
        <NumberStepper
          label="Tip Amount"
          value={tip}
          onChange={setTip}
          min={0}
          max={500}
          step={5}
          prefix="$"
        />
        <NumberStepper
          label="Session Duration"
          value={minutes}
          onChange={setMinutes}
          min={15}
          max={240}
          step={15}
          suffix="m"
        />
      </div>
    );
  },
};
