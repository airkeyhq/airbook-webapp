import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Indicator, InlineIndicator } from '@/components/primitives/Indicator';
import { Icon } from '@/components/primitives/Icon';
import { Alert24Filled, Chat24Filled, Cart24Filled, Sparkle24Regular, People24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof Indicator> = {
  title: 'Primitives/Indicator',
  component: Indicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use **Indicator** and **InlineIndicator** for transient amounts that come and go (unread notifications, item counts) and live status signals (online dot, incoming message pulse). For static categories and status categories (e.g. `Confirmed`, `VIP Formula`), use **Badge**.',
      },
    },
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'danger', 'success', 'warning', 'neutral'],
    },
    ping: { control: 'boolean' },
    rolling: { control: 'boolean' },
    show: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Indicator>;

export const Default: Story = {
  args: {
    label: '5',
    color: 'danger',
    position: 'top-right',
    ping: true,
    show: true,
  },
  render: (args) => (
    <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex items-center gap-6">
      <Indicator {...args}>
        <button type="button" className="btn-secondary !w-10 !h-10 !px-0">
          <Icon filled={Alert24Filled} active size="lg" />
        </button>
      </Indicator>

      <Indicator label="12" color="primary">
        <button type="button" className="btn-secondary !w-10 !h-10 !px-0">
          <Icon filled={Chat24Filled} active size="lg" />
        </button>
      </Indicator>

      <Indicator color="success" ping>
        <button type="button" className="btn-secondary !w-10 !h-10 !px-0">
          <Icon filled={Cart24Filled} active size="lg" />
        </button>
      </Indicator>
    </div>
  ),
};

export const SideBySideVariants: Story = {
  render: () => {
    const [count, setCount] = useState(18);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-5 max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
              Inline Indicator Variants &amp; RollingNumber
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Structured count pills (`outlined`, `pill-solid`, `pill-muted`) with optional `rolling` odometer animation.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCount((c) => Math.max(0, c - 1))}
              className="btn-secondary !h-7 !px-2.5 text-xs"
            >
              -1
            </button>
            <button
              type="button"
              onClick={() => setCount((c) => c + 1)}
              className="btn-secondary !h-7 !px-2.5 text-xs"
            >
              +1
            </button>
            <button
              type="button"
              onClick={() => setCount((c) => c + 10)}
              className="btn-primary !h-7 !px-2.5 text-xs"
            >
              +10
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[var(--text-primary)]">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Waiting Lounge</span>
              <InlineIndicator value={count} variant="outlined" rolling />
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">outlined</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-black border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] shadow-xs">
              <Icon regular={Sparkle24Regular} size="sm" />
              <span>Services</span>
              <InlineIndicator value={count} variant="pill-solid" rolling />
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">pill-solid</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--text-secondary)]">
              <Icon regular={People24Regular} size="sm" />
              <span>Clients</span>
              <InlineIndicator value={count + 124} variant="pill-muted" rolling />
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">pill-muted</span>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Indicator label={count} color="danger" rolling ping>
                <button type="button" className="btn-secondary !w-9 !h-9 !px-0">
                  <Icon filled={Alert24Filled} active size="md" />
                </button>
              </Indicator>
              <span className="text-xs font-bold text-[var(--text-primary)]">Live Corner</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Indicator + rolling</span>
          </div>
        </div>
      </div>
    );
  },
};
