import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup } from '@/components/primitives/ToggleGroup';
import { Icon } from '@/components/primitives/Icon';
import { CalendarDay24Filled, CalendarWeekNumbers24Filled, CalendarMonth24Filled } from '@fluentui/react-icons';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Primitives/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: { control: { type: 'radio' }, options: ['segmented', 'pills'] },
    size: { control: { type: 'radio' }, options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const SegmentedViewSwitcher: Story = {
  args: {
    variant: 'segmented',
    size: 'md',
  },
  render: function SegmentedStory(args) {
    const [view, setView] = React.useState<string | string[]>('week');
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
        <ToggleGroup
          {...args}
          value={view}
          onChange={setView}
          options={[
            { value: 'day', label: 'Day', icon: <Icon filled={CalendarDay24Filled} active /> },
            { value: 'week', label: 'Week', icon: <Icon filled={CalendarWeekNumbers24Filled} active /> },
            { value: 'month', label: 'Month', icon: <Icon filled={CalendarMonth24Filled} active /> },
          ]}
        />
      </div>
    );
  },
};

export const MultiSelectPills: Story = {
  render: function PillsStory() {
    const [days, setDays] = React.useState<string | string[]>(['mon', 'wed', 'fri']);
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-3">
        <div className="text-xs font-bold text-[var(--text-primary)]">Specialist Availability</div>
        <ToggleGroup
          type="multiple"
          variant="pills"
          size="sm"
          value={days}
          onChange={setDays}
          options={[
            { value: 'mon', label: 'Mon' },
            { value: 'tue', label: 'Tue' },
            { value: 'wed', label: 'Wed' },
            { value: 'thu', label: 'Thu' },
            { value: 'fri', label: 'Fri' },
            { value: 'sat', label: 'Sat' },
          ]}
        />
      </div>
    );
  },
};
