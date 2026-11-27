import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Mentions, MentionText, type MentionOption } from '@/components/primitives/Mentions';
import { getThumbsAvatarUrl } from '@/lib/avatars';

const meta: Meta<typeof Mentions> = {
  title: 'Primitives/Mentions',
  component: Mentions,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Textarea with `@` mention trigger detection, space-smart suggestion popover (`useSmartPosition`), and keyboard navigation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Mentions>;

const TEAM_OPTIONS: MentionOption[] = [
  {
    id: 'm1',
    label: 'Valeria Morales',
    handle: 'valeria',
    subtitle: 'Master Colorist',
    avatarSrc: getThumbsAvatarUrl('Valeria Morales', '#AF52DE'),
  },
  {
    id: 'm2',
    label: 'Hannah Weber',
    handle: 'hannah',
    subtitle: 'Stylist & Scalp Spa',
    avatarSrc: getThumbsAvatarUrl('Hannah Weber', '#34C759'),
  },
  {
    id: 'm3',
    label: 'Camille Moreau',
    handle: 'camille',
    subtitle: 'Studio Lead',
    avatarSrc: getThumbsAvatarUrl('Camille Moreau', '#2BB5FF'),
  },
  {
    id: 'm4',
    label: 'Front Desk',
    handle: 'frontdesk',
    subtitle: 'Reception & POS',
  },
];

export const Default: Story = {
  render: () => {
    const [note, setNote] = useState('Prep gloss formula for @valeria before @camille arrives.');

    return (
      <div className="w-[440px] max-w-full p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <Mentions
          label="Internal Booking Note"
          value={note}
          onChange={setNote}
          options={TEAM_OPTIONS}
        />

        <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)]/60 border border-[var(--border-subtle)] space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Rendered Preview (Hover @mention)
          </div>
          <MentionText text={note} options={TEAM_OPTIONS} />
        </div>
      </div>
    );
  },
};
