import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from '@/components/primitives/HoverCard';
import { Avatar } from '@/components/primitives/Avatar';
import { Badge } from '@/components/primitives/Badge';
import { getThumbsAvatarUrl } from '@/lib/avatars';

const meta: Meta<typeof HoverCard> = {
  title: 'Primitives/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[200px] flex items-start pt-4">
      <HoverCard
        trigger={
          <span className="text-xs font-bold text-[#2BB5FF] underline decoration-dashed underline-offset-4 cursor-pointer">
            @camille.moreau
          </span>
        }
      >
        <div className="flex items-start gap-3">
          <Avatar size="md" status="online" src={getThumbsAvatarUrl('Camille', '#2BB5FF')} fallback="CM" />
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-[var(--text-primary)]">Camille Moreau</span>
              <Badge variant="dashed-blue" size="xs">VIP</Badge>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              14 visits · Next: Tomorrow 10:30 AM (Balayage Refresh)
            </p>
          </div>
        </div>
      </HoverCard>
    </div>
  ),
};
