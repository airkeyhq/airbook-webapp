import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from '@/components/primitives/Rating';

const meta: Meta<typeof Rating> = {
  title: 'Primitives/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  render: function RatingStory() {
    const [stars, setStars] = React.useState(4);
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-2">
        <Rating
          label="How was your visit with Camille?"
          value={stars}
          onChange={setStars}
          spark
        />
        <div className="text-[11px] text-[var(--text-muted)]">
          Click the 5th star for a gold sparkle burst.
        </div>
      </div>
    );
  },
};
