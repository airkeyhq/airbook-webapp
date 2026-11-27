import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/components/primitives/Icon';
import { Add24Filled, Sparkle24Filled, Dismiss24Filled } from '@fluentui/react-icons';

const meta: Meta = {
  title: 'Primitives/ButtonSystem',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const AllTiers: StoryObj = {
  render: () => (
    <div className="w-[480px] p-8 bg-[var(--bg-primary)] rounded-3xl border border-[var(--border-subtle)] space-y-6 shadow-sm">
      <div>
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">3-Tier Tactile Button System</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Strict tactile hierarchy: Tier 1 (.btn-primary), Tier 2 (.btn-secondary), and Tier 3 (.btn-tertiary).
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Tier 1: Electric Sky Blue Primary (.btn-primary)
          </div>
          <button className="btn-primary w-full h-11 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow-[0_4px_12px_-2px_rgba(43,181,255,0.5)]">
            <Icon filled={Sparkle24Filled} active size="md" />
            <span>Confirm & Book Appointment</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Tier 2: Surface Secondary (.btn-secondary)
          </div>
          <button className="btn-secondary w-full h-11 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[var(--text-primary)] border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)]">
            <Icon filled={Add24Filled} active size="md" />
            <span>Add Additional Service</span>
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Tier 3: Ghost Tertiary (.btn-tertiary)
          </div>
          <button className="btn-tertiary w-full h-10 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <Icon filled={Dismiss24Filled} active size="md" />
            <span>Dismiss or Cancel</span>
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
        <span className="text-[var(--text-muted)]">Paired Footer Layout:</span>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-9 px-4 rounded-xl text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border-subtle)]">
            Cancel
          </button>
          <button className="btn-primary h-9 px-4 rounded-xl text-xs font-bold text-white">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  ),
};
