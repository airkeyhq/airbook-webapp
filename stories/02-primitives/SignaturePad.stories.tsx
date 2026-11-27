import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SignaturePad } from '@/components/primitives/SignaturePad';

const meta: Meta<typeof SignaturePad> = {
  title: 'Primitives/SignaturePad',
  component: SignaturePad,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Retina-scaled mouse & touch signature canvas for waivers, consent clauses, and POS receipts.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SignaturePad>;

export const Default: Story = {
  render: () => {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    return (
      <div className="w-[420px] max-w-full p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-3">
        <SignaturePad onChange={setDataUrl} />
        <div className="text-[11px] font-mono text-[var(--text-muted)]">
          Status: {dataUrl ? 'Captured PNG signature' : 'Waiting for signature'}
        </div>
      </div>
    );
  },
};
