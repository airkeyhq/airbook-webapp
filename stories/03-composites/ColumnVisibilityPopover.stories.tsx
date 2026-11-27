import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ColumnVisibilityPopover,
  type ColumnVisibilityItem,
} from '@/components/ColumnVisibilityPopover';

const meta: Meta<typeof ColumnVisibilityPopover> = {
  title: 'Composites/ColumnVisibilityPopover',
  component: ColumnVisibilityPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Mosaic-style column visibility manager with Active/Available groups, locked required columns, and optional DnD reordering.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColumnVisibilityPopover>;

export const Default: Story = {
  render: () => {
    const [columns, setColumns] = useState<ColumnVisibilityItem[]>([
      { id: 'client', label: 'Client', required: true, visible: true },
      { id: 'service', label: 'Service', visible: true },
      { id: 'status', label: 'Status', visible: true },
      { id: 'amount', label: 'Total', visible: true },
      { id: 'time', label: 'Time', visible: false },
      { id: 'notes', label: 'Notes', visible: false },
    ]);

    return (
      <div className="p-6 rounded-3xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)]">
        <ColumnVisibilityPopover
          columns={columns}
          onToggleColumn={(id) =>
            setColumns((prev) =>
              prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
            )
          }
          onReorderColumns={(activeIdsOrder) =>
            setColumns((prev) => {
              const activeMap = new Map(prev.filter((c) => c.visible).map((c) => [c.id, c]));
              const reordered = activeIdsOrder
                .map((id) => activeMap.get(id))
                .filter((c): c is ColumnVisibilityItem => Boolean(c));
              return [...reordered, ...prev.filter((c) => !c.visible)];
            })
          }
        />
      </div>
    );
  },
};
