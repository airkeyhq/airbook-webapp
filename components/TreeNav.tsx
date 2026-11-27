'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight24Regular } from '@fluentui/react-icons';
import { InlineIndicator } from '@/components/primitives/Indicator';
import { Icon } from '@/components/primitives/Icon';

export interface TreeNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  count?: number | string;
  children?: TreeNavItem[];
}

export interface TreeNavProps {
  items: TreeNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  defaultExpandedIds?: string[];
  className?: string;
}

/**
 * Ozone UI TreeNav composite.
 */
export const TreeNav: React.FC<TreeNavProps> = ({
  items,
  activeId,
  onSelect,
  defaultExpandedIds = [],
  className = '',
}) => {
  const [expanded, setExpanded] = useState<string[]>(defaultExpandedIds);

  const toggle = (id: string) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderNodes = (nodes: TreeNavItem[], depth = 0) =>
    nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const isExpanded = expanded.includes(node.id);
      const isActive = activeId === node.id;

      return (
        <div key={node.id}>
          <button
            type="button"
            onClick={() => {
              if (hasChildren) toggle(node.id);
              onSelect(node.id);
            }}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer select-none ${
              isActive
                ? 'bg-[#2BB5FF]/10 text-[#2BB5FF] font-bold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            <span className="flex items-center gap-2 min-w-0">
              {hasChildren && (
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.16 }}
                  className="text-[var(--text-muted)] flex-shrink-0"
                >
                  <Icon regular={ChevronRight24Regular} size="sm" />
                </motion.span>
              )}
              {node.icon && (
                <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 [&>svg]:w-full [&>svg]:h-full">
                  {node.icon}
                </span>
              )}
              <span className="truncate">{node.label}</span>
            </span>
            {node.count !== undefined ? (
              <InlineIndicator value={node.count} variant={isActive ? 'pill-solid' : 'pill-muted'} />
            ) : (
              node.badge
            )}
          </button>

          <AnimatePresence initial={false}>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden ml-4 pl-2.5 border-l border-[var(--border-subtle)] space-y-0.5 mt-0.5"
              >
                {renderNodes(node.children!, depth + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });

  return (
    <nav className={`p-2 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-0.5 ${className}`}>
      {renderNodes(items)}
    </nav>
  );
};
