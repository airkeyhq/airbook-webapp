import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@/components/primitives/DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Primitives/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: function DatePickerStory() {
    const [date, setDate] = React.useState(new Date());
    return (
      <div className="min-h-[360px] w-72 pt-4">
        <DatePicker label="Appointment Date" value={date} onChange={setDate} />
      </div>
    );
  },
};
