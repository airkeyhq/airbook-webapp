'use client';

import React, { createContext, useContext, useState } from 'react';

export interface DndMoveEvent {
  itemId: string;
  fromContainerId: string;
  toContainerId: string;
  toIndex: number;
}

interface DragState {
  itemId: string;
  fromContainerId: string;
}

interface DropTarget {
  containerId: string;
  index: number;
}

interface DndContextValue {
  disabled: boolean;
  dragState: DragState | null;
  dropTarget: DropTarget | null;
  startDrag: (itemId: string, fromContainerId: string) => void;
  updateDropTarget: (containerId: string, index: number) => void;
  clearDropTargetForContainer: (containerId: string) => void;
  commitDrop: (toContainerId: string, fallbackIndex: number) => void;
  endDrag: () => void;
}

const DndContextInternal = createContext<DndContextValue | null>(null);

export function useDnd() {
  const ctx = useContext(DndContextInternal);
  if (!ctx) {
    throw new Error('useDnd must be used inside <DndContext>.');
  }
  return ctx;
}

export interface DndContextProps {
  children: React.ReactNode;
  onMove?: (event: DndMoveEvent) => void;
  disabled?: boolean;
}

/**
 * Ozone UI DndContext primitive.
 * Coordinates HTML5 drag-and-drop across single sortable lists or multi-container boards.
 */
export const DndContext: React.FC<DndContextProps> = ({
  children,
  onMove,
  disabled = false,
}) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const startDrag = (itemId: string, fromContainerId: string) => {
    if (disabled) return;
    setDragState({ itemId, fromContainerId });
  };

  const updateDropTarget = (containerId: string, index: number) => {
    if (disabled || !dragState) return;
    setDropTarget((prev) =>
      prev?.containerId === containerId && prev?.index === index
        ? prev
        : { containerId, index }
    );
  };

  const clearDropTargetForContainer = (containerId: string) => {
    setDropTarget((prev) => (prev?.containerId === containerId ? null : prev));
  };

  const endDrag = () => {
    setDragState(null);
    setDropTarget(null);
  };

  const commitDrop = (toContainerId: string, fallbackIndex: number) => {
    if (disabled || !dragState) return;
    const toIndex =
      dropTarget?.containerId === toContainerId ? dropTarget.index : fallbackIndex;
    onMove?.({
      itemId: dragState.itemId,
      fromContainerId: dragState.fromContainerId,
      toContainerId,
      toIndex,
    });
    endDrag();
  };

  return (
    <DndContextInternal.Provider
      value={{
        disabled,
        dragState,
        dropTarget,
        startDrag,
        updateDropTarget,
        clearDropTargetForContainer,
        commitDrop,
        endDrag,
      }}
    >
      {children}
    </DndContextInternal.Provider>
  );
};

export const DropIndicator: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`h-1 rounded-full bg-[#2BB5FF] mx-1 transition-all pointer-events-none ${className}`}
  />
);

export interface DroppableZoneProps {
  containerId: string;
  itemCount: number;
  children: React.ReactNode | ((state: { isOver: boolean }) => React.ReactNode);
  className?: string;
  activeClassName?: string;
}

/**
 * Drop target container for DndContext.
 */
export const DroppableZone: React.FC<DroppableZoneProps> = ({
  containerId,
  itemCount,
  children,
  className = '',
  activeClassName = '',
}) => {
  const { disabled, dragState, dropTarget, updateDropTarget, clearDropTargetForContainer, commitDrop } =
    useDnd();

  const isOver = !disabled && !!dragState && dropTarget?.containerId === containerId;

  return (
    <div
      data-dnd-over={isOver ? 'true' : 'false'}
      onDragOver={(e) => {
        if (disabled || !dragState) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dropTarget?.containerId !== containerId) {
          updateDropTarget(containerId, itemCount);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          clearDropTargetForContainer(containerId);
        }
      }}
      onDrop={(e) => {
        if (disabled || !dragState) return;
        e.preventDefault();
        commitDrop(containerId, itemCount);
      }}
      className={`${className} ${isOver ? activeClassName : ''}`}
    >
      {typeof children === 'function' ? children({ isOver }) : children}
    </div>
  );
};

export interface DraggableItemProps {
  id: string;
  containerId: string;
  index: number;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  draggingClassName?: string;
  showDropIndicator?: boolean;
}

/**
 * Draggable item primitive with automatic midpoint drop-index calculation.
 */
export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  containerId,
  index,
  children,
  disabled: itemDisabled = false,
  onClick,
  className = '',
  draggingClassName = 'opacity-45 scale-[0.98]',
  showDropIndicator = true,
}) => {
  const { disabled: ctxDisabled, dragState, dropTarget, startDrag, updateDropTarget, endDrag } =
    useDnd();
  const isDisabled = ctxDisabled || itemDisabled;
  const isDragging = dragState?.itemId === id;
  const showBefore =
    showDropIndicator &&
    !isDisabled &&
    dropTarget?.containerId === containerId &&
    dropTarget?.index === index &&
    dragState?.itemId !== id;

  return (
    <>
      {showBefore && <DropIndicator />}
      <div
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        draggable={!isDisabled}
        onDragStart={(e) => {
          if (isDisabled) return;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', id);
          startDrag(id, containerId);
        }}
        onDragOver={(e) => {
          if (isDisabled || !dragState) return;
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const insertAfter = e.clientY > rect.top + rect.height / 2;
          updateDropTarget(containerId, insertAfter ? index + 1 : index);
        }}
        onDragEnd={endDrag}
        onClick={onClick}
        onKeyDown={(e) => {
          if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
          }
        }}
        className={`${className} ${
          isDisabled ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
        } ${isDragging ? draggingClassName : ''}`}
      >
        {children}
      </div>
    </>
  );
};
