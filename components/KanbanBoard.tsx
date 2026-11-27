'use client';

import React, { useEffect, useState } from 'react';
import { Avatar } from '@/components/primitives/Avatar';
import { InlineIndicator } from '@/components/primitives/Indicator';
import {
  DndContext,
  DraggableItem,
  DroppableZone,
  DropIndicator,
  useDnd,
  type DndMoveEvent,
} from '@/components/primitives/Dnd';

export interface KanbanCardItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  assignee?: { name: string; src?: string };
  meta?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  accent?: 'blue' | 'amber' | 'emerald' | 'subtle';
  items: KanbanCardItem[];
}

export type KanbanCardMoveEvent = DndMoveEvent;

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onColumnsChange?: (columns: KanbanColumn[]) => void;
  onCardMove?: (event: KanbanCardMoveEvent) => void;
  onCardClick?: (item: KanbanCardItem, columnId: string) => void;
  /** Enable drag-and-drop between and within columns @default true */
  draggable?: boolean;
  className?: string;
}

const ACCENT_DOT: Record<NonNullable<KanbanColumn['accent']>, string> = {
  blue: 'bg-[#2BB5FF]',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  subtle: 'bg-slate-400',
};

function moveCard(
  columns: KanbanColumn[],
  { itemId, fromContainerId, toContainerId, toIndex }: DndMoveEvent
): KanbanColumn[] {
  const sourceCol = columns.find((c) => c.id === fromContainerId);
  if (!sourceCol) return columns;
  const sourceIndex = sourceCol.items.findIndex((i) => i.id === itemId);
  if (sourceIndex === -1) return columns;

  const movingItem = sourceCol.items[sourceIndex];
  const adjustedIndex =
    fromContainerId === toContainerId && sourceIndex < toIndex ? toIndex - 1 : toIndex;

  return columns.map((col) => {
    if (col.id === fromContainerId && col.id === toContainerId) {
      const nextItems = col.items.filter((i) => i.id !== itemId);
      nextItems.splice(Math.max(0, Math.min(adjustedIndex, nextItems.length)), 0, movingItem);
      return { ...col, items: nextItems };
    }
    if (col.id === fromContainerId) {
      return { ...col, items: col.items.filter((i) => i.id !== itemId) };
    }
    if (col.id === toContainerId) {
      const nextItems = [...col.items];
      nextItems.splice(Math.max(0, Math.min(toIndex, nextItems.length)), 0, movingItem);
      return { ...col, items: nextItems };
    }
    return col;
  });
}

function TrailingColumnDrop({ columnId, count }: { columnId: string; count: number }) {
  const { dragState, dropTarget } = useDnd();
  if (!dragState || dropTarget?.containerId !== columnId || dropTarget?.index !== count || count === 0) {
    return null;
  }
  return <DropIndicator />;
}

/**
 * Ozone UI KanbanBoard composite built on the Dnd primitive.
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onColumnsChange,
  onCardMove,
  onCardClick,
  draggable = true,
  className = '',
}) => {
  const [boardColumns, setBoardColumns] = useState<KanbanColumn[]>(columns);

  useEffect(() => {
    setBoardColumns(columns);
  }, [columns]);

  const handleMove = (event: DndMoveEvent) => {
    const next = moveCard(boardColumns, event);
    setBoardColumns(next);
    onColumnsChange?.(next);
    onCardMove?.(event);
  };

  return (
    <DndContext disabled={!draggable} onMove={handleMove}>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 ${className}`}>
        {boardColumns.map((col) => (
          <DroppableZone
            key={col.id}
            containerId={col.id}
            itemCount={col.items.length}
            className="rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-2.5 sm:p-3 flex flex-col gap-2 sm:gap-2.5 transition-colors"
            activeClassName="!border-[#2BB5FF] bg-[#2BB5FF]/[0.04]"
          >
            {({ isOver }) => (
              <>
                <div className="px-2 py-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${ACCENT_DOT[col.accent || 'subtle']}`} />
                    <span className="text-xs font-extrabold text-[var(--text-primary)]">{col.title}</span>
                  </div>
                  <InlineIndicator value={col.items.length} variant="outlined" rolling />
                </div>

                <div className="space-y-2 min-h-[72px]">
                  {col.items.length === 0 && (
                    <div
                      className={`h-[72px] rounded-2xl border border-dashed flex items-center justify-center text-[11px] font-semibold transition-colors ${
                        isOver
                          ? 'border-[#2BB5FF] text-[#2BB5FF] bg-[#2BB5FF]/5'
                          : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      Drop card here
                    </div>
                  )}

                  {col.items.map((item, idx) => (
                    <DraggableItem
                      key={item.id}
                      id={item.id}
                      containerId={col.id}
                      index={idx}
                      onClick={onCardClick ? () => onCardClick(item, col.id) : undefined}
                      className="w-full text-left p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 shadow-xs transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-[var(--text-primary)]">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.subtitle}</div>
                          )}
                        </div>
                        {item.badge}
                      </div>

                      {(item.assignee || item.meta) && (
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]/60">
                          {item.assignee ? (
                            <div className="flex items-center gap-1.5">
                              <Avatar
                                size="xs"
                                src={item.assignee.src}
                                fallback={item.assignee.name.slice(0, 2).toUpperCase()}
                                className="!w-5 !h-5 !text-[9px]"
                              />
                              <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                                {item.assignee.name}
                              </span>
                            </div>
                          ) : (
                            <span />
                          )}
                          {item.meta && (
                            <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                              {item.meta}
                            </span>
                          )}
                        </div>
                      )}
                    </DraggableItem>
                  ))}

                  <TrailingColumnDrop columnId={col.id} count={col.items.length} />
                </div>
              </>
            )}
          </DroppableZone>
        ))}
      </div>
    </DndContext>
  );
};
