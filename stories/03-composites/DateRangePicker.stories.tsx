import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker, type DateRange } from '@/components/DateRangePicker';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Composites/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: function DateRangeStory() {
    const [range, setRange] = React.useState<DateRange>(() => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      return { start, end };
    });

    return (
      <div className="min-h-[380px] flex items-start pt-4">
        <DateRangePicker value={range} onChange={setRange} />
      </div>
    );
  },
};
