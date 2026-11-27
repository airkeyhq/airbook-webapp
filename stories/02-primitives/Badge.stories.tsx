import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/primitives/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Use **Badge** for static categories and status categories (e.g. `Confirmed`, `Pending Deposit`, `VIP Formula`). For transient counts or live status signals (online dot, new message), use **Indicator** / **InlineIndicator**.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The content or label to display inside the badge.',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'Active' },
      },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'danger', 'subtle', 'outline', 'dashed-blue', 'dashed-purple', 'dashed-emerald'],
      description: 'Visual status styling variant.',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md'],
      description: 'Size dimension token.',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: 'sm' },
      },
    },
    dot: {
      control: 'boolean',
      description: 'Whether to show an active indicator dot.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: 'Active Specialist',
    variant: 'default',
    size: 'sm',
    dot: true,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="p-8 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-6 max-w-xl">
      <div className="space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Core Statuses</h4>
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <Badge variant="default" dot>Confirmed</Badge>
          <Badge variant="success" dot>Completed</Badge>
          <Badge variant="warning" dot>Pending Deposit</Badge>
          <Badge variant="danger" dot>Cancelled</Badge>
          <Badge variant="subtle">Draft</Badge>
          <Badge variant="outline">Unassigned</Badge>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Mosaic Dashed Tags</h4>
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <Badge variant="dashed-blue" size="xs">Recommended</Badge>
          <Badge variant="dashed-purple" size="xs">VIP Formula</Badge>
          <Badge variant="dashed-emerald" size="xs" dot>Live Sync</Badge>
        </div>
      </div>
    </div>
  ),
};
