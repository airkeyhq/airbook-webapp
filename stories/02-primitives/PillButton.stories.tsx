import type { Meta, StoryObj } from '@storybook/react';
import { PillButton, PillGroup } from '../../components/primitives/PillButton';
import {
  Alert24Filled,
  Share24Filled,
  LockClosed24Filled,
  ChevronDown16Regular,
  Add16Regular,
  Delete16Regular,
  ArrowLeft16Filled,
  ArrowRight16Filled,
} from '@fluentui/react-icons';

const meta: Meta<typeof PillButton> = {
  title: 'Primitives/PillButton',
  component: PillButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['soft', 'primary', 'ghost', 'outline', 'danger'] },
    active: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PillButton>;

export const HeaderRibbon: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-3 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-black/5 dark:border-white/10">
      <PillButton iconOnly aria-label="Notifications">
        <Alert24Filled className="w-4 h-4" />
      </PillButton>
      <PillButton iconOnly aria-label="Share">
        <Share24Filled className="w-4 h-4" />
      </PillButton>
      <PillButton>
        <span className="text-sm leading-none">EN</span>
        <ChevronDown16Regular className="w-3.5 h-3.5 opacity-60" />
      </PillButton>
      <PillButton iconOnly aria-label="Lock">
        <LockClosed24Filled className="w-4 h-4" />
      </PillButton>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <PillButton variant="soft">Soft</PillButton>
      <PillButton variant="soft" active>
        Soft Active
      </PillButton>
      <PillButton variant="primary">
        <Add16Regular className="w-4 h-4" />
        Primary
      </PillButton>
      <PillButton variant="ghost">Ghost</PillButton>
      <PillButton variant="outline">Outline</PillButton>
      <PillButton variant="danger">
        <Delete16Regular className="w-4 h-4" />
        Danger
      </PillButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <PillButton size="sm">Small (h-8)</PillButton>
      <PillButton size="md">Medium (h-9)</PillButton>
      <PillButton size="lg">Large (h-10)</PillButton>
    </div>
  ),
};

export const SegmentedAndGrouped: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <PillGroup>
        <PillButton variant="ghost" size="sm">
          Day
        </PillButton>
        <PillButton
          variant="ghost"
          size="sm"
          active
          className="bg-white dark:bg-slate-800 shadow-sm text-[var(--text-primary)]"
        >
          Week
        </PillButton>
      </PillGroup>

      <PillButton>Today</PillButton>

      <PillGroup>
        <PillButton variant="ghost" size="sm" iconOnly aria-label="Previous">
          <ArrowLeft16Filled className="w-4 h-4" />
        </PillButton>
        <PillButton variant="ghost" size="sm" iconOnly aria-label="Next">
          <ArrowRight16Filled className="w-4 h-4" />
        </PillButton>
      </PillGroup>
    </div>
  ),
};

export const CircularIconOnly: Story = {
  args: {
    iconOnly: true,
    size: 'md',
    'aria-label': 'Notifications',
    children: <Alert24Filled className="w-4 h-4" />,
  },
};

export const LabeledPill: Story = {
  args: {
    iconOnly: false,
    size: 'md',
    children: (
      <>
        <span>EN</span>
        <ChevronDown16Regular className="w-3.5 h-3.5 opacity-60" />
      </>
    ),
  },
};
