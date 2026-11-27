import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from '@/components/primitives/SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Primitives/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: function SearchStory() {
    const [q, setQ] = React.useState('');
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs w-80">
        <SearchInput
          value={q}
          onChange={setQ}
          placeholder="Search clients, services, bookings..."
          shortcut="⌘K"
        />
      </div>
    );
  },
};
