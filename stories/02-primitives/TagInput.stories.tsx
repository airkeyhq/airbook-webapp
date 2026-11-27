import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TagInput } from '@/components/primitives/TagInput';

const meta: Meta<typeof TagInput> = {
  title: 'Primitives/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: function TagStory() {
    const [tags, setTags] = React.useState(['VIP', 'Balayage', 'Sensitive Scalp']);
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs w-96">
        <TagInput
          label="Client Profile Tags"
          tags={tags}
          onChange={setTags}
          maxTags={6}
        />
      </div>
    );
  },
};
