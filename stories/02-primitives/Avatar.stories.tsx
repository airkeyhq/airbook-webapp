import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup, type AvatarProps } from '@/components/primitives/Avatar';
import { getThumbsAvatarUrl, PROVIDER_COLOR_PALETTE } from '@/lib/avatars';

type AvatarStoryArgs = AvatarProps & {
  showOverflow?: boolean;
};

const meta: Meta<AvatarStoryArgs> = {
  title: 'Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    fallback: {
      control: 'text',
      description: 'Text or initials shown when image is missing or failed to load.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'U' },
      },
    },
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Proportional dimension size token.',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: 'md' },
      },
    },
    src: {
      control: 'text',
      description: 'The image URL for the avatar (custom photo or animated SVG).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
    alt: {
      control: 'text',
      description: 'Alt text for the avatar image.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
      },
    },
    status: {
      control: { type: 'select' },
      options: [undefined, 'online', 'busy', 'offline'],
      description: 'Live availability status indicator ring.',
      table: {
        type: { summary: 'union' },
        defaultValue: { summary: '-' },
      },
    },
    showTooltip: {
      control: 'boolean',
      description: 'Show tooltip when hovering over an avatar or avatar group.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    tooltip: {
      control: 'text',
      description: 'Custom tooltip content shown when `showTooltip` is true.',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: '-' },
      },
    },
    showOverflow: {
      control: 'boolean',
      description: 'Show the "+#" overflow avatar when there are additional items.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<AvatarStoryArgs>;

export const Default: Story = {
  args: {
    fallback: 'AL',
    size: 'md',
    alt: 'Alexia Laurent',
    status: 'online',
    showTooltip: false,
    showOverflow: false,
  },
  render: ({ showOverflow, ...avatarProps }) =>
    showOverflow ? (
      <AvatarGroup
        size={avatarProps.size}
        showTooltip={avatarProps.showTooltip}
        showOverflow={true}
        extraCount={8}
        items={[
          {
            src: avatarProps.src,
            alt: avatarProps.alt,
            fallback: avatarProps.fallback,
            status: avatarProps.status,
            tooltip: avatarProps.tooltip,
          },
        ]}
      />
    ) : (
      <Avatar {...avatarProps} />
    ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="XS" size="xs" />
      <Avatar fallback="SM" size="sm" />
      <Avatar fallback="MD" size="md" />
      <Avatar fallback="LG" size="lg" />
      <Avatar fallback="XL" size="xl" />
    </div>
  ),
};

export const AnimatedThumbsAvatars: Story = {
  render: () => {
    const specialists = [
      { name: 'Jessica Taylor', color: '#007AFF', role: 'Master Colorist' },
      { name: 'Valeria Morales', color: '#AF52DE', role: 'Balayage Specialist' },
      { name: 'Hannah Weber', color: '#34C759', role: 'Texture & Waves' },
      { name: 'Camille Moreau', color: '#FF2D55', role: 'Scalp Spa Director' },
    ];

    return (
      <div className="space-y-4 max-w-lg w-full">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Animated DiceBear Thumbs Avatars</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Auto-generated animated SVG thumbs synchronized with staff calendar colors.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {specialists.map((s) => (
            <div key={s.name} className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
              <Avatar
                src={getThumbsAvatarUrl(s.name, s.color, 'fast')}
                fallback={s.name.slice(0, 2)}
                size="md"
                status="online"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[var(--text-primary)] truncate">{s.name}</div>
                <div className="text-[10px] text-[var(--text-secondary)] truncate">{s.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const StackedAvatarGroup: Story = {
  args: {
    showTooltip: true,
    showOverflow: true,
    size: 'md',
  },
  render: (args) => {
    const seeds = ['Camille', 'Valeria', 'Jessica', 'Hannah', 'Elena'];
    return (
      <div className="space-y-3 text-center pt-6">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Stacked Specialist Group</h3>
        <AvatarGroup
          size={args.size}
          showTooltip={args.showTooltip}
          showOverflow={args.showOverflow}
          extraCount={8}
          items={seeds.map((seed, i) => ({
            id: seed,
            src: getThumbsAvatarUrl(seed, PROVIDER_COLOR_PALETTE[i % PROVIDER_COLOR_PALETTE.length]),
            alt: seed,
            fallback: seed.slice(0, 2),
          }))}
        />
      </div>
    );
  },
};
