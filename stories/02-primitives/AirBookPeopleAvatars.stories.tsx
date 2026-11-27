import type { Meta, StoryObj } from '@storybook/react';
import { AirBookPeopleAvatars } from '@/components/AirBookPeopleAvatars';

const meta: Meta<typeof AirBookPeopleAvatars> = {
  title: 'Primitives/AirBookPeopleAvatars',
  component: AirBookPeopleAvatars,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 28, max: 96, step: 4 },
      description: 'Pixel diameter for each animated claymorphic cloud character.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '48' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AirBookPeopleAvatars>;

export const Default: Story = {
  args: {
    size: 48,
  },
  render: (args) => (
    <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col items-center gap-4 shadow-sm">
      <div className="text-center space-y-1">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Signature Claymorphic Animated Cloud Avatars</h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Interactive spring micro-animations on hover with soft 3D specular depth.
        </p>
      </div>
      <AirBookPeopleAvatars {...args} />
    </div>
  ),
};

export const InLandingHeadline: Story = {
  render: () => (
    <div className="max-w-xl p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-4 shadow-sm">
      <h2 className="text-2xl font-black tracking-tight text-[var(--text-primary)] leading-tight">
        Trusted by luxury stylists & over{' '}
        <AirBookPeopleAvatars size={38} className="align-middle inline-flex my-1" />{' '}
        12,000 satisfied clients
      </h2>
      <p className="text-xs text-[var(--text-secondary)]">
        Demonstrates the inline headline embedding pattern used across AirBook's conversion pages.
      </p>
    </div>
  ),
};
