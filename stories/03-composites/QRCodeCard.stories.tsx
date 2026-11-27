import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QRCodeCard } from '@/components/QRCodeCard';

const meta: Meta<typeof QRCodeCard> = {
  title: 'Composites/QRCodeCard',
  component: QRCodeCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Unified QR vector card with copy link, open live page, and SVG download actions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof QRCodeCard>;

export const Default: Story = {
  render: () => (
    <div className="w-80 max-w-full p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
      <QRCodeCard
        description="Scan to open your studio's live online booking page."
        url="https://getairbook.com/book/atelier-lumiere"
        downloadable
      />
    </div>
  ),
};
