'use client';

import React, { useState } from 'react';
import {
  Eye24Filled,
  Checkmark24Filled,
  LockClosed24Regular,
  ReOrderDotsVertical24Regular,
} from '@fluentui/react-icons';
import { Popover } from '@/components/primitives/Popover';
import { Tooltip } from '@/components/primitives/Tooltip';
import { DndContext, DraggableItem, DroppableZone } from '@/components/primitives/Dnd';
import { Icon } from '@/components/primitives/Icon';

export interface ColumnVisibilityItem {
  id: string;
  label: string;
  required?: boolean;
  visible: boolean;
}

export interface ColumnVisibilityPopoverProps {
  columns: ColumnVisibilityItem[];
  onToggleColumn: (id: string) => void;
  onReorderColumns?: (activeIdsOrder: string[]) => void;
  trigger?: React.ReactNode;
  className?: string;
}

/**
 * Ozone UI ColumnVisibilityPopover composite (Mosaic-style table column manager).
 * Supports toggling visibility, locking required columns, and optional DnD reordering.
 */
export const ColumnVisibilityPopover: React.FC<ColumnVisibilityPopoverProps> = ({
  columns,
  onToggleColumn,
  onReorderColumns,
  trigger,
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  const activeColumns = columns.filter((c) => c.visible);
  const availableColumns = columns.filter((c) => !c.visible);

  const handleReorder = (itemId: string, toIndex: number) => {
    if (!onReorderColumns) return;
    const ids = activeColumns.map((c) => c.id);
    const fromIdx = ids.indexOf(itemId);
    if (fromIdx === -1) return;
    const next = [...ids];
    const [moved] = next.splice(fromIdx, 1);
    const adjusted = fromIdx < toIndex ? toIndex - 1 : toIndex;
    next.splice(Math.max(0, Math.min(adjusted, next.length)), 0, moved);
    onReorderColumns(next);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      preferredHorizontal="right"
      estimatedWidth={240}
      estimatedHeight={280}
      className={className}
      contentClassName="absolute z-[240]"
      trigger={
        trigger || (
          <Tooltip content="Columns">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Columns visibility"
              className="btn-secondary !w-8 !h-8 !p-0 !rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <Icon filled={Eye24Filled} size="md" />
            </button>
          </Tooltip>
        )
      }
    >
      <div className="w-60 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-2 shadow-2xl select-none">
        <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Active columns
        </div>

        <DndContext
          disabled={!onReorderColumns}
          onMove={({ itemId, toIndex }) => handleReorder(itemId, toIndex)}
        >
          <DroppableZone containerId="active-columns" itemCount={activeColumns.length} className="flex flex-col gap-0.5">
            {activeColumns.map((col, idx) => (
              <DraggableItem
                key={col.id}
                id={col.id}
                containerId="active-columns"
                index={idx}
                disabled={!onReorderColumns || col.required}
                onClick={() => !col.required && onToggleColumn(col.id)}
                className={`flex items-center justify-between rounded-xl px-2 py-1.5 text-xs font-semibold transition-colors ${
                  col.required
                    ? 'cursor-default text-[var(--text-muted)]'
                    : 'cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] ${
                      col.required
                        ? 'bg-[#2BB5FF]/35 border border-[#2BB5FF]/40 text-white'
                        : 'bg-[#2BB5FF] text-white shadow-[0_1px_4px_rgba(43,181,255,0.4)]'
                    }`}
                  >
                    <Icon filled={Checkmark24Filled} size="xs" />
                  </div>
                  <span className="truncate">{col.label}</span>
                </div>

                {col.required ? (
                  <Icon regular={LockClosed24Regular} size="sm" tone="muted" />
                ) : (
                  <Icon regular={ReOrderDotsVertical24Regular} size="sm" tone="muted" />
                )}
              </DraggableItem>
            ))}
          </DroppableZone>
        </DndContext>

        {availableColumns.length > 0 && (
          <>
            <div className="my-2 h-[1px] bg-[var(--border-subtle)] -mx-2" />
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Available columns
            </div>
            <div className="flex flex-col gap-0.5">
              {availableColumns.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => onToggleColumn(col.id)}
                  className="w-full text-left flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-[var(--border-subtle)] bg-[var(--bg-secondary)]" />
                  <span className="truncate">{col.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Popover>
  );
};
