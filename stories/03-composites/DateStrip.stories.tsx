import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateStrip } from '@/components/DateStrip';

const meta: Meta<typeof DateStrip> = {
  title: 'Composites/DateStrip',
  component: DateStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Horizontal week/day navigation strip with staff filter pills and Today red indicator.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateStrip>;

export const Default: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto">
      <DateStrip />
    </div>
  ),
};
