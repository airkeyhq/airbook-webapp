import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TimeSlotPicker } from '@/components/primitives/TimeSlotPicker';

const meta: Meta<typeof TimeSlotPicker> = {
  title: 'Primitives/TimeSlotPicker',
  component: TimeSlotPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TimeSlotPicker>;

export const Default: Story = {
  render: function TimeSlotStory() {
    const [slot, setSlot] = React.useState('10:30');
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs w-[400px] max-w-full">
        <TimeSlotPicker
          label="Available Times · Tomorrow"
          value={slot}
          onChange={setSlot}
          slots={[
            { value: '09:00', label: '9:00 AM', available: true },
            { value: '09:45', label: '9:45 AM', available: false },
            { value: '10:30', label: '10:30 AM', available: true },
            { value: '11:15', label: '11:15 AM', available: true },
            { value: '12:00', label: '12:00 PM', available: false },
            { value: '13:30', label: '1:30 PM', available: true },
            { value: '14:15', label: '2:15 PM', available: true },
            { value: '15:00', label: '3:00 PM', available: true },
          ]}
        />
      </div>
    );
  },
};
