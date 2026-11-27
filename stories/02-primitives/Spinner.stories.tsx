import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from '@/components/primitives/Spinner';
import { PullToRefresh } from '@/components/primitives/PullToRefresh';

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] flex items-center gap-6">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const PullToRefreshWindow: Story = {
  render: function PullToRefreshStory() {
    const [lastUpdated, setLastUpdated] = React.useState('Just now');
    const [count, setCount] = React.useState(0);

    const handleRefresh = async () => {
      await new Promise((r) => setTimeout(r, 1100));
      setCount((c) => c + 1);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    return (
      <div className="w-[340px] rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-xs font-black text-[var(--text-primary)]">Live Appointments</span>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            Synced {lastUpdated} ({count})
          </span>
        </div>

        <PullToRefresh onRefresh={handleRefresh} className="h-[320px]">
          <div className="p-3 space-y-2.5">
            <div className="text-[10px] text-center font-semibold text-[var(--text-muted)] py-1">
              Drag down anywhere in this window to refresh
            </div>
            {[
              { name: 'Camille Moreau', service: 'Balayage Refresh', time: '10:30 AM' },
              { name: 'Valeria Morales', service: 'Keratin Silk Treatment', time: '12:00 PM' },
              { name: 'Jessica Taylor', service: 'Gloss & Blowout', time: '2:15 PM' },
              { name: 'Hannah Weber', service: 'Scalp Spa Ritual', time: '4:00 PM' },
            ].map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">{item.name}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{item.service}</div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#2BB5FF]">{item.time}</span>
              </div>
            ))}
          </div>
        </PullToRefresh>
      </div>
    );
  },
};

export const PullToRefreshSpark: Story = {
  render: function PullToRefreshSparkStory() {
    const [lastUpdated, setLastUpdated] = React.useState('Just now');
    const [count, setCount] = React.useState(0);

    const handleRefresh = async () => {
      await new Promise((r) => setTimeout(r, 1100));
      setCount((c) => c + 1);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };

    return (
      <div className="w-[340px] rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-xs font-black text-[var(--text-primary)]">Tier 1 Spark Refresh</span>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            Synced {lastUpdated} ({count})
          </span>
        </div>

        <PullToRefresh onRefresh={handleRefresh} variant="spark" className="h-[320px]">
          <div className="p-3 space-y-2.5">
            <div className="text-[10px] text-center font-semibold text-[var(--text-muted)] py-1">
              Pull down to reveal Tier 1 Electric Sky & release for sparkles
            </div>
            {[
              { name: 'Camille Moreau', service: 'Balayage Refresh', time: '10:30 AM' },
              { name: 'Valeria Morales', service: 'Keratin Silk Treatment', time: '12:00 PM' },
              { name: 'Jessica Taylor', service: 'Gloss & Blowout', time: '2:15 PM' },
              { name: 'Hannah Weber', service: 'Scalp Spa Ritual', time: '4:00 PM' },
            ].map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">{item.name}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{item.service}</div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#2BB5FF]">{item.time}</span>
              </div>
            ))}
          </div>
        </PullToRefresh>
      </div>
    );
  },
};
