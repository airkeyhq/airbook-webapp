import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DndContext, DraggableItem, DroppableZone, DropIndicator, useDnd } from '@/components/primitives/Dnd';
import { InlineIndicator } from '@/components/primitives/Indicator';
import { Icon } from '@/components/primitives/Icon';
import { ReOrderDotsVertical24Regular } from '@fluentui/react-icons';

const meta: Meta<typeof DndContext> = {
  title: 'Primitives/Dnd',
  component: DndContext,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Composable HTML5 drag-and-drop primitives (`DndContext`, `DroppableZone`, `DraggableItem`, `DropIndicator`) for sortable lists and multi-column boards.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DndContext>;

function TrailingDrop({ containerId, count }: { containerId: string; count: number }) {
  const { dragState, dropTarget } = useDnd();
  if (!dragState || dropTarget?.containerId !== containerId || dropTarget?.index !== count || count === 0) {
    return null;
  }
  return <DropIndicator />;
}

export const SortableList: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: 's1', name: 'Silk Press & Trim', duration: '60m' },
      { id: 's2', name: 'Dimensional Balayage', duration: '120m' },
      { id: 's3', name: 'Gloss & Blowout', duration: '45m' },
      { id: 's4', name: 'Keratin Treatment', duration: '90m' },
    ]);

    return (
      <div className="w-80 p-4 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-[var(--text-primary)]">Service Order</span>
          <InlineIndicator value={items.length} variant="outlined" />
        </div>

        <DndContext
          onMove={({ itemId, toIndex }) => {
            setItems((prev) => {
              const fromIdx = prev.findIndex((i) => i.id === itemId);
              if (fromIdx === -1) return prev;
              const next = [...prev];
              const [moved] = next.splice(fromIdx, 1);
              const adjusted = fromIdx < toIndex ? toIndex - 1 : toIndex;
              next.splice(Math.max(0, Math.min(adjusted, next.length)), 0, moved);
              return next;
            });
          }}
        >
          <DroppableZone
            containerId="services"
            itemCount={items.length}
            className="space-y-2 rounded-2xl transition-colors"
            activeClassName="ring-1 ring-[#2BB5FF]/40"
          >
            {items.map((item, idx) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                containerId="services"
                index={idx}
                className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 shadow-xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon regular={ReOrderDotsVertical24Regular} size="md" className="text-[var(--text-muted)] flex-shrink-0" />
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {item.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                  {item.duration}
                </span>
              </DraggableItem>
            ))}
            <TrailingDrop containerId="services" count={items.length} />
          </DroppableZone>
        </DndContext>
      </div>
    );
  },
};
