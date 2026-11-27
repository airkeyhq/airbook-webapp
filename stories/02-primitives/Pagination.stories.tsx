import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '@/components/primitives/Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Primitives/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: function PaginationStory() {
    const [page, setPage] = React.useState(2);
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
        <Pagination page={page} totalPages={5} onChange={setPage} />
      </div>
    );
  },
};
