'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronUp24Regular,
  ChevronDown24Regular,
  Search24Regular,
  Table24Regular,
  Grid24Regular,
  Board24Regular,
  Timeline24Regular,
  GanttChart24Regular,
} from '@fluentui/react-icons';
import { SearchInput } from '@/components/primitives/SearchInput';
import { Pagination } from '@/components/primitives/Pagination';
import { ToggleGroup } from '@/components/primitives/ToggleGroup';
import { Tooltip } from '@/components/primitives/Tooltip';
import { FilterBar, type ActiveFilter, type FilterDefinition } from '@/components/FilterBar';
import { EmptyState } from '@/components/EmptyState';
import {
  ColumnVisibilityPopover,
  type ColumnVisibilityItem,
} from '@/components/ColumnVisibilityPopover';
import { KanbanBoard, type KanbanCardItem, type KanbanColumn } from '@/components/KanbanBoard';
import { ActivityTimeline, type ActivityTimelineItem } from '@/components/ActivityTimeline';
import { GanttChart, type GanttTask } from '@/components/GanttChart';
import { CardView, type CardViewItem } from '@/components/CardView';
import { Icon } from '@/components/primitives/Icon';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right';
  required?: boolean;
  defaultHidden?: boolean;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
}

export type DataTableView = 'table' | 'cards' | 'kanban' | 'timeline' | 'gantt';

export interface DataTableKanbanGroup {
  id: string;
  title: string;
  accent?: 'blue' | 'amber' | 'emerald' | 'subtle';
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  /** Optional FilterBar definitions integrated into the table toolbar */
  filters?: FilterDefinition[];
  initialFilters?: ActiveFilter[];
  activeFilters?: ActiveFilter[];
  onActiveFiltersChange?: (filters: ActiveFilter[]) => void;
  /** Custom matcher for active FilterBar chips; defaults to matching row[filter.id] */
  filterRow?: (row: T, activeFilters: ActiveFilter[]) => boolean;
  /** Show Mosaic-style ColumnVisibilityPopover in toolbar */
  columnVisibility?: boolean;
  /** Show the "{count} results" label in the toolbar @default true */
  showResultCount?: boolean;
  /** Enable modular view switcher (true = all views, or pass specific array e.g. ['table', 'kanban', 'gantt']) */
  views?: boolean | DataTableView[];
  defaultView?: DataTableView;
  view?: DataTableView;
  onViewChange?: (view: DataTableView) => void;
  /** Optional Kanban grouping config when kanban view is enabled */
  kanbanGroupKey?: string;
  kanbanGroups?: DataTableKanbanGroup[];
  mapRowToKanbanCard?: (row: T) => KanbanCardItem;
  /** Optional Timeline item mapper when timeline view is enabled */
  mapRowToTimelineItem?: (row: T) => ActivityTimelineItem;
  /** Optional Gantt task mapper & axis bounds when gantt view is enabled */
  mapRowToGanttTask?: (row: T, index: number) => GanttTask;
  ganttMin?: number;
  ganttMax?: number;
  /** Optional CardView item mapper when cards view is enabled */
  mapRowToCardItem?: (row: T) => CardViewItem;
  toolbarActions?: React.ReactNode;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  emptyAction?: { label: string; onClick: () => void };
  className?: string;
}

/**
 * Ozone UI DataTable composite.
 * Includes search filtering, optional Mosaic FilterBar, column sorting, pagination, and EmptyState.
 */
export function DataTable<T>({
  data,
  columns,
  getRowKey,
  searchable = true,
  searchPlaceholder = 'Filter rows...',
  searchFilter,
  filters,
  initialFilters = [],
  activeFilters: controlledFilters,
  onActiveFiltersChange,
  filterRow,
  columnVisibility = false,
  showResultCount = true,
  views = false,
  defaultView = 'table',
  view: controlledView,
  onViewChange,
  kanbanGroupKey = 'status',
  kanbanGroups,
  mapRowToKanbanCard,
  mapRowToTimelineItem,
  mapRowToGanttTask,
  ganttMin = 9,
  ganttMax = 19,
  mapRowToCardItem,
  toolbarActions,
  pageSize = 5,
  onRowClick,
  emptyMessage = 'No matching records found.',
  emptyDescription,
  emptyIcon = Search24Regular,
  emptyAction,
  className = '',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [uncontrolledFilters, setUncontrolledFilters] = useState<ActiveFilter[]>(initialFilters);
  const [uncontrolledView, setUncontrolledView] = useState<DataTableView>(defaultView);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const isViewControlled = controlledView !== undefined;
  const activeView = isViewControlled ? controlledView : uncontrolledView;
  const setActiveView = (next: DataTableView) => {
    if (!isViewControlled) setUncontrolledView(next);
    onViewChange?.(next);
  };

  const enabledViews = useMemo<DataTableView[]>(() => {
    if (!views) return ['table'];
    if (Array.isArray(views)) return views.length > 0 ? views : ['table'];
    return ['table', 'cards', 'kanban', 'timeline', 'gantt'];
  }, [views]);

  const showViewSwitcher = enabledViews.length > 1;
  const resolvedView = enabledViews.includes(activeView) ? activeView : enabledViews[0];
  const [columnItems, setColumnItems] = useState<ColumnVisibilityItem[]>(() =>
    columns.map((c) => ({
      id: c.key,
      label: c.header,
      required: c.required,
      visible: !c.defaultHidden,
    }))
  );

  const visibleColumns = useMemo(() => {
    if (!columnVisibility) return columns;
    const colMap = new Map(columns.map((c) => [c.key, c]));
    return columnItems
      .filter((ci) => ci.visible)
      .map((ci) => colMap.get(ci.id))
      .filter((c): c is DataTableColumn<T> => Boolean(c));
  }, [columnVisibility, columnItems, columns]);

  const isFiltersControlled = controlledFilters !== undefined;
  const activeFilters = isFiltersControlled ? controlledFilters : uncontrolledFilters;
  const setActiveFilters = (next: ActiveFilter[] | ((prev: ActiveFilter[]) => ActiveFilter[])) => {
    const resolved = typeof next === 'function' ? next(activeFilters) : next;
    if (!isFiltersControlled) setUncontrolledFilters(resolved);
    onActiveFiltersChange?.(resolved);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let result = data;

    const q = query.trim().toLowerCase();
    if (q) {
      result = searchFilter
        ? result.filter((row) => searchFilter(row, q))
        : result.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
    }

    const populatedFilters = activeFilters.filter((f) => f.value && f.value.trim() !== '');
    if (populatedFilters.length > 0) {
      if (filterRow) {
        result = result.filter((row) => filterRow(row, populatedFilters));
      } else {
        result = result.filter((row) => {
          const record = row as Record<string, unknown>;
          return populatedFilters.every((f) => {
            const raw = record[f.id];
            if (raw === undefined || raw === null) return false;
            const val = String(raw).toLowerCase();
            const target = (f.value || '').trim().toLowerCase();
            return f.type === 'select' ? val === target : val.includes(target);
          });
        });
      }
    }

    return result;
  }, [data, query, searchFilter, activeFilters, filterRow]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return filtered;
    const getter = col.sortValue;
    return [...filtered].sort((a, b) => {
      const av = getter(a);
      const bv = getter(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const derivedKanbanColumns = useMemo<KanbanColumn[]>(() => {
    if (!views) return [];

    const toCard = (row: T): KanbanCardItem => {
      if (mapRowToKanbanCard) return mapRowToKanbanCard(row);
      const record = row as Record<string, unknown>;
      const firstCol = columns[0];
      const secondCol = columns[1];
      return {
        id: getRowKey(row),
        title: String(record[firstCol?.key || 'id'] ?? getRowKey(row)),
        subtitle: secondCol ? String(record[secondCol.key] ?? '') : undefined,
        meta: record.time ? String(record.time) : record.amount !== undefined ? `$${record.amount}` : undefined,
      };
    };

    if (kanbanGroups && kanbanGroups.length > 0) {
      return kanbanGroups.map((g) => ({
        ...g,
        items: sorted
          .filter((row) => String((row as Record<string, unknown>)[kanbanGroupKey] ?? '').toLowerCase() === g.id.toLowerCase())
          .map(toCard),
      }));
    }

    const groupMap = new Map<string, T[]>();
    sorted.forEach((row) => {
      const key = String((row as Record<string, unknown>)[kanbanGroupKey] ?? 'Other');
      const list = groupMap.get(key) || [];
      list.push(row);
      groupMap.set(key, list);
    });

    const accentFor = (key: string): KanbanColumn['accent'] => {
      const k = key.toLowerCase();
      if (k.includes('confirm') || k.includes('done') || k.includes('complete')) return 'emerald';
      if (k.includes('pend') || k.includes('wait')) return 'amber';
      if (k.includes('active') || k.includes('chair') || k.includes('progress')) return 'blue';
      return 'subtle';
    };

    return Array.from(groupMap.entries()).map(([key, rows]) => ({
      id: key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      accent: accentFor(key),
      items: rows.map(toCard),
    }));
  }, [views, sorted, columns, getRowKey, kanbanGroupKey, kanbanGroups, mapRowToKanbanCard]);

  const derivedTimelineItems = useMemo<ActivityTimelineItem[]>(() => {
    if (!enabledViews.includes('timeline')) return [];
    return sorted.map((row) => {
      if (mapRowToTimelineItem) return mapRowToTimelineItem(row);
      const record = row as Record<string, unknown>;
      const firstCol = columns[0];
      const secondCol = columns[1];
      return {
        id: getRowKey(row),
        title: String(record[firstCol?.key || 'id'] ?? getRowKey(row)),
        description: secondCol ? String(record[secondCol.key] ?? '') : undefined,
        timestamp: String(record.time ?? record.createdAt ?? ''),
        type: 'booking',
      };
    });
  }, [enabledViews, sorted, columns, getRowKey, mapRowToTimelineItem]);

  const derivedCardItems = useMemo<CardViewItem[]>(() => {
    if (!enabledViews.includes('cards')) return [];
    return sorted.map((row) => {
      if (mapRowToCardItem) return mapRowToCardItem(row);
      const record = row as Record<string, unknown>;
      const firstCol = columns[0];
      const secondCol = columns[1];
      const title = String(record[firstCol?.key || 'id'] ?? getRowKey(row));
      const statusRaw = record.status ? String(record.status) : undefined;
      const statusLower = (statusRaw || '').toLowerCase();
      const statusVariant: NonNullable<CardViewItem['status']>['variant'] = statusLower.includes('confirm')
        ? 'success'
        : statusLower.includes('pend')
          ? 'warning'
          : statusLower.includes('cancel')
            ? 'danger'
            : 'default';
      return {
        id: getRowKey(row),
        title,
        subtitle: secondCol ? String(record[secondCol.key] ?? '') : undefined,
        avatarFallback: title.slice(0, 2).toUpperCase(),
        status: statusRaw ? { label: statusRaw, variant: statusVariant } : undefined,
        metadata: [
          ...(record.time ? [{ label: 'Time', value: String(record.time) }] : []),
          ...(record.amount !== undefined ? [{ label: 'Total', value: `$${record.amount}` }] : []),
        ],
      };
    });
  }, [enabledViews, sorted, columns, getRowKey, mapRowToCardItem]);

  const derivedGanttTasks = useMemo<GanttTask[]>(() => {
    if (!enabledViews.includes('gantt')) return [];
    return sorted.map((row, idx) => {
      if (mapRowToGanttTask) return mapRowToGanttTask(row, idx);
      const record = row as Record<string, unknown>;
      const firstCol = columns[0];
      const secondCol = columns[1];
      const start =
        typeof record.start === 'number'
          ? record.start
          : ganttMin + ((idx * 1.5) % Math.max(2, ganttMax - ganttMin - 2));
      const end = typeof record.end === 'number' ? record.end : start + 1.5;
      const status = String(record.status ?? '').toLowerCase();
      const color: GanttTask['color'] = status.includes('confirm')
        ? 'emerald'
        : status.includes('pend')
          ? 'amber'
          : status.includes('cancel')
            ? 'rose'
            : 'blue';
      return {
        id: getRowKey(row),
        title: String(record[firstCol?.key || 'id'] ?? getRowKey(row)),
        subtitle: secondCol ? String(record[secondCol.key] ?? '') : undefined,
        start,
        end,
        color,
        meta: record.time ? String(record.time) : undefined,
      };
    });
  }, [enabledViews, sorted, columns, getRowKey, mapRowToGanttTask, ganttMin, ganttMax]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div
      className={`w-full max-w-full min-w-0 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs overflow-visible ${className}`}
    >
      {(searchable || columnVisibility || showViewSwitcher || (filters && filters.length > 0) || toolbarActions) && (
        <div className="p-3 sm:p-4 border-b border-[var(--border-subtle)] space-y-2.5 sm:space-y-3">
          {(searchable || columnVisibility || showViewSwitcher || toolbarActions) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1 min-w-0">
                {searchable && (
                  <div className="flex-1 sm:flex-initial sm:w-full sm:max-w-xs min-w-0">
                    <SearchInput
                      value={query}
                      onChange={(v) => {
                        setQuery(v);
                        setPage(1);
                      }}
                      placeholder={searchPlaceholder}
                      shortcut=""
                    />
                  </div>
                )}
                {columnVisibility && resolvedView === 'table' && (
                  <ColumnVisibilityPopover
                    columns={columnItems}
                    onToggleColumn={(id) =>
                      setColumnItems((prev) =>
                        prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
                      )
                    }
                    onReorderColumns={(activeIdsOrder) =>
                      setColumnItems((prev) => {
                        const activeMap = new Map(prev.filter((c) => c.visible).map((c) => [c.id, c]));
                        const reordered = activeIdsOrder
                          .map((id) => activeMap.get(id))
                          .filter((c): c is ColumnVisibilityItem => Boolean(c));
                        return [...reordered, ...prev.filter((c) => !c.visible)];
                      })
                    }
                  />
                )}
                {filters && filters.length > 0 && (
                  <FilterBar
                    hideChips
                    availableFilters={filters}
                    activeFilters={activeFilters}
                    onAddFilter={(f) =>
                      setActiveFilters((prev) => [
                        ...prev,
                        { ...f, operator: f.type === 'date' ? 'between' : undefined, value: '' },
                      ])
                    }
                    onRemoveFilter={(id) =>
                      setActiveFilters((prev) => prev.filter((f) => f.id !== id))
                    }
                    onUpdateFilter={(id, updates) =>
                      setActiveFilters((prev) =>
                        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
                      )
                    }
                    onClearAll={() => setActiveFilters([])}
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                {showViewSwitcher && (
                  <ToggleGroup
                    size="sm"
                    value={resolvedView}
                    onChange={(val) => setActiveView(val as DataTableView)}
                    options={[
                      ...(enabledViews.includes('table')
                        ? [
                            {
                              value: 'table',
                              label: (
                                <Tooltip content="Table view">
                                  <span className="inline-flex items-center justify-center" aria-label="Table view">
                                    <Icon regular={Table24Regular} size="md" />
                                  </span>
                                </Tooltip>
                              ),
                            },
                          ]
                        : []),
                      ...(enabledViews.includes('cards')
                        ? [
                            {
                              value: 'cards',
                              label: (
                                <Tooltip content="Card view">
                                  <span className="inline-flex items-center justify-center" aria-label="Card view">
                                    <Icon regular={Grid24Regular} size="md" />
                                  </span>
                                </Tooltip>
                              ),
                            },
                          ]
                        : []),
                      ...(enabledViews.includes('kanban')
                        ? [
                            {
                              value: 'kanban',
                              label: (
                                <Tooltip content="Kanban view">
                                  <span className="inline-flex items-center justify-center" aria-label="Kanban view">
                                    <Icon regular={Board24Regular} size="md" />
                                  </span>
                                </Tooltip>
                              ),
                            },
                          ]
                        : []),
                      ...(enabledViews.includes('timeline')
                        ? [
                            {
                              value: 'timeline',
                              label: (
                                <Tooltip content="Timeline view">
                                  <span className="inline-flex items-center justify-center" aria-label="Timeline view">
                                    <Icon regular={Timeline24Regular} size="md" />
                                  </span>
                                </Tooltip>
                              ),
                            },
                          ]
                        : []),
                      ...(enabledViews.includes('gantt')
                        ? [
                            {
                              value: 'gantt',
                              label: (
                                <Tooltip content="Gantt view">
                                  <span className="inline-flex items-center justify-center" aria-label="Gantt view">
                                    <Icon regular={GanttChart24Regular} size="md" />
                                  </span>
                                </Tooltip>
                              ),
                            },
                          ]
                        : []),
                    ]}
                  />
                )}
                {showResultCount && (
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {sorted.length} results
                  </span>
                )}
                {toolbarActions}
              </div>
            </div>
          )}

          {filters && filters.length > 0 && activeFilters.length > 0 && (
            <FilterBar
              hideTrigger
              availableFilters={filters}
              activeFilters={activeFilters}
              onAddFilter={(f) =>
                setActiveFilters((prev) => [
                  ...prev,
                  { ...f, operator: f.type === 'date' ? 'between' : undefined, value: '' },
                ])
              }
              onRemoveFilter={(id) =>
                setActiveFilters((prev) => prev.filter((f) => f.id !== id))
              }
              onUpdateFilter={(id, updates) =>
                setActiveFilters((prev) =>
                  prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
                )
              }
              onClearAll={() => setActiveFilters([])}
            />
          )}
        </div>
      )}

      {resolvedView === 'cards' && (
        <div className="p-3 sm:p-4 w-full max-w-full min-w-0">
          {sorted.length === 0 ? (
            <EmptyState
              icon={emptyIcon}
              title={emptyMessage}
              description={
                emptyDescription ??
                (query.trim() || activeFilters.some((f) => f.value)
                  ? 'Try adjusting or clearing your search and active filters.'
                  : undefined)
              }
              action={
                emptyAction ??
                (query.trim() || activeFilters.some((f) => f.value)
                  ? {
                      label: 'Clear filters',
                      onClick: () => {
                        setQuery('');
                        setActiveFilters([]);
                        setPage(1);
                      },
                    }
                  : undefined)
              }
              className="!min-h-[220px] !border-0 !bg-transparent"
            />
          ) : (
            <CardView
              items={derivedCardItems}
              onItemClick={(item) => {
                const match = sorted.find((r) => getRowKey(r) === item.id);
                if (match) onRowClick?.(match);
              }}
            />
          )}
        </div>
      )}

      {resolvedView === 'kanban' && (
        <div className="p-3 sm:p-4 w-full max-w-full min-w-0">
          {sorted.length === 0 ? (
            <EmptyState
              icon={emptyIcon}
              title={emptyMessage}
              description={
                emptyDescription ??
                (query.trim() || activeFilters.some((f) => f.value)
                  ? 'Try adjusting or clearing your search and active filters.'
                  : undefined)
              }
              action={
                emptyAction ??
                (query.trim() || activeFilters.some((f) => f.value)
                  ? {
                      label: 'Clear filters',
                      onClick: () => {
                        setQuery('');
                        setActiveFilters([]);
                        setPage(1);
                      },
                    }
                  : undefined)
              }
              className="!min-h-[220px] !border-0 !bg-transparent"
            />
          ) : (
            <KanbanBoard
              columns={derivedKanbanColumns}
              onCardClick={(item) => {
                const match = sorted.find((r) => getRowKey(r) === item.id);
                if (match) onRowClick?.(match);
              }}
            />
          )}
        </div>
      )}

      {resolvedView === 'timeline' && (
        <div className="p-3 sm:p-4 w-full max-w-full min-w-0">
          {sorted.length === 0 ? (
            <EmptyState
              icon={emptyIcon}
              title={emptyMessage}
              description={
                emptyDescription ??
                (query.trim() || activeFilters.some((f) => f.value)
                  ? 'Try adjusting or clearing your search and active filters.'
                  : undefined)
              }
              action={
                emptyAction ??
                (query.trim() || activeFilters.some((f) => f.value)
                  ? {
                      label: 'Clear filters',
                      onClick: () => {
                        setQuery('');
                        setActiveFilters([]);
                        setPage(1);
                      },
                    }
                  : undefined)
              }
              className="!min-h-[220px] !border-0 !bg-transparent"
            />
          ) : (
            <ActivityTimeline items={derivedTimelineItems} />
          )}
        </div>
      )}

      {resolvedView === 'gantt' && (
        <div className="p-3 sm:p-4 w-full max-w-full min-w-0">
          {sorted.length === 0 ? (
            <EmptyState
              icon={emptyIcon}
              title={emptyMessage}
              description={
                emptyDescription ??
                (query.trim() || activeFilters.some((f) => f.value)
                  ? 'Try adjusting or clearing your search and active filters.'
                  : undefined)
              }
              action={
                emptyAction ??
                (query.trim() || activeFilters.some((f) => f.value)
                  ? {
                      label: 'Clear filters',
                      onClick: () => {
                        setQuery('');
                        setActiveFilters([]);
                        setPage(1);
                      },
                    }
                  : undefined)
              }
              className="!min-h-[220px] !border-0 !bg-transparent"
            />
          ) : (
            <GanttChart
              tasks={derivedGanttTasks}
              min={ganttMin}
              max={ganttMax}
              onTaskClick={(task) => {
                const match = sorted.find((r) => getRowKey(r) === task.id);
                if (match) onRowClick?.(match);
              }}
            />
          )}
        </div>
      )}

      {resolvedView === 'table' && (
        <>
          {/* Mobile Card List (<640px) */}
          <div className="sm:hidden divide-y divide-[var(--border-subtle)]">
            {pageRows.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={emptyIcon}
                  title={emptyMessage}
                  description={
                    emptyDescription ??
                    (query.trim() || activeFilters.some((f) => f.value)
                      ? 'Try adjusting or clearing your search and active filters.'
                      : undefined)
                  }
                  action={
                    emptyAction ??
                    (query.trim() || activeFilters.some((f) => f.value)
                      ? {
                          label: 'Clear filters',
                          onClick: () => {
                            setQuery('');
                            setActiveFilters([]);
                            setPage(1);
                          },
                        }
                      : undefined)
                  }
                  className="!min-h-[200px] !border-0 !bg-transparent"
                />
              </div>
            ) : (
              pageRows.map((row) => {
                const primaryCol = visibleColumns[0];
                const detailCols = visibleColumns.slice(1);
                return (
                  <div
                    key={getRowKey(row)}
                    onClick={() => onRowClick?.(row)}
                    className={`p-3.5 space-y-2.5 ${
                      onRowClick ? 'cursor-pointer active:bg-[var(--bg-secondary)]/60' : ''
                    }`}
                  >
                    {primaryCol && (
                      <div className="text-xs font-bold text-[var(--text-primary)]">
                        {primaryCol.render(row)}
                      </div>
                    )}
                    {detailCols.length > 0 && (
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1.5 border-t border-[var(--border-subtle)]/60">
                        {detailCols.map((col) => (
                          <div key={col.key} className="min-w-0">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                              {col.header}
                            </div>
                            <div className="text-xs text-[var(--text-primary)] truncate mt-0.5">
                              {col.render(row)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Tablet & Desktop Table (>=640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={`px-4 py-3 text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] select-none ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.sortable ? 'cursor-pointer hover:text-[var(--text-primary)]' : ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? (
                        <Icon regular={ChevronUp24Regular} size="sm" tone="accent" />
                      ) : (
                        <Icon regular={ChevronDown24Regular} size="sm" tone="accent" />
                      )
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-4">
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyMessage}
                    description={
                      emptyDescription ??
                      (query.trim() || activeFilters.some((f) => f.value)
                        ? 'Try adjusting or clearing your search and active filters.'
                        : undefined)
                    }
                    action={
                      emptyAction ??
                      (query.trim() || activeFilters.some((f) => f.value)
                        ? {
                            label: 'Clear filters',
                            onClick: () => {
                              setQuery('');
                              setActiveFilters([]);
                              setPage(1);
                            },
                          }
                        : undefined)
                    }
                    className="!min-h-[220px] !border-0 !bg-transparent"
                  />
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-[var(--bg-secondary)]/60' : ''
                  }`}
                >
                  {visibleColumns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-xs text-[var(--text-primary)] ${
                        col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

          {totalPages > 1 && (
            <div className="px-3 sm:px-4 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Page {safePage} of {totalPages}
              </span>
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
