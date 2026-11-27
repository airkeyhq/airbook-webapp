import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/primitives/Card';
import { Icon } from '@/components/primitives/Icon';
import { Sparkle24Regular, Sparkle24Filled } from '@fluentui/react-icons';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '### AirBook Card Hierarchy',
          '- **Level 1 — `envelope` (Section Frame):** Top-level panels for dashboards, POS checkout, billing, and grouped settings (`trayHeader` + inner card + `trayFooter`).',
          '- **Level 2 — `surface` / `interactive` (Item Cards):** Individual bookings, services, clients, and clickable records placed directly on a page or inside an `envelope` tray.',
          '- **Special — `glass`:** Floating panels and overlays above canvas/calendar/map views.',
          '- **Special — `dashed`:** Upload dropzones (`FileDropzone`) and `EmptyState` placeholders.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-[600px]">
      <Card variant="surface" className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon regular={Sparkle24Regular} size="md" className="text-[#2BB5FF]" />
          <h4 className="text-sm font-bold text-[var(--text-primary)]">Surface Card</h4>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Standard opaque surface card with subtle border token and micro shadow.
        </p>
      </Card>

      <Card variant="interactive" className="space-y-2">
        <h4 className="text-sm font-bold text-[var(--text-primary)]">Interactive Card</h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Hover border highlight (#2BB5FF) with tactile click response.
        </p>
      </Card>

      <Card variant="glass" className="space-y-2">
        <h4 className="text-sm font-bold text-[var(--text-primary)]">Glassmorphism Card</h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Backdrop-blur panel suited for floating modules and overlays.
        </p>
      </Card>

      <Card variant="dashed" className="space-y-2">
        <h4 className="text-sm font-bold text-[var(--text-primary)]">Dashed Dropzone Card</h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Used for transformation photo uploads and file imports.
        </p>
      </Card>

      <Card
        variant="envelope"
        className="sm:col-span-2"
        trayHeader={
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span>Envelope / Tray Variant</span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">Concentric</span>
          </div>
        }
        trayFooter={
          <div className="flex items-center gap-1.5">
            <Icon regular={Sparkle24Regular} size="sm" className="text-[#2BB5FF]" />
            <span>Outer tray frame with nested surface card — matching MetricsDashboard</span>
          </div>
        }
        innerClassName="space-y-1.5"
      >
        <h4 className="text-sm font-bold text-[var(--text-primary)]">Studio Summary</h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Concentric envelope tray for dashboards, billing panels, and grouped metric views.
        </p>
      </Card>
    </div>
  ),
};
