'use client';

import React, { useEffect, useState } from 'react';
import {
  Calendar24Regular,
  Payment24Regular,
  Mail24Regular,
  CheckmarkCircle24Filled,
  Note24Regular,
  Sparkle24Regular,
} from '@fluentui/react-icons';
import { Avatar } from '@/components/primitives/Avatar';
import { Icon } from '@/components/primitives/Icon';

export type ActivityType = 'booking' | 'payment' | 'message' | 'status' | 'note' | 'system';

export interface ActivityTimelineItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp: string;
  type?: ActivityType;
  icon?: React.ReactNode;
  actor?: {
    name: string;
    src?: string;
    fallback?: string;
  };
  badge?: React.ReactNode;
}

export interface ActivityTimelineProps {
  items: ActivityTimelineItem[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  /**
   * Responsive layout mode:
   * - 'auto': Adapts automatically to mobile (<640px), tablet (640-1023px), and desktop (>=1024px)
   * - 'desktop' | 'tablet' | 'mobile': Forces a specific layout
   * @default 'auto'
   */
  layoutMode?: 'auto' | 'desktop' | 'tablet' | 'mobile';
  className?: string;
}

const TYPE_STYLES: Record<ActivityType, { badgeClass: string; defaultIcon: React.ReactNode }> = {
  booking: {
    badgeClass: 'bg-[#2BB5FF]/10 text-[#2BB5FF] border-[#2BB5FF]/25',
    defaultIcon: <Icon regular={Calendar24Regular} size="md" />,
  },
  payment: {
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    defaultIcon: <Icon regular={Payment24Regular} size="md" />,
  },
  message: {
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25',
    defaultIcon: <Icon regular={Mail24Regular} size="md" />,
  },
  status: {
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    defaultIcon: <Icon filled={CheckmarkCircle24Filled} size="md" />,
  },
  note: {
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25',
    defaultIcon: <Icon regular={Note24Regular} size="md" />,
  },
  system: {
    badgeClass: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)]',
    defaultIcon: <Icon regular={Sparkle24Regular} size="md" />,
  },
};

/**
 * Ozone UI ActivityTimeline composite.
 * Displays chronological client, booking, payment, and system events.
 */
export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  items,
  title,
  subtitle,
  emptyMessage = 'No activity recorded yet.',
  layoutMode = 'auto',
  className = '',
}) => {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('tablet');

  useEffect(() => {
    if (layoutMode !== 'auto') {
      setViewportMode(layoutMode);
      return;
    }
    const update = () => {
      if (window.innerWidth < 640) setViewportMode('mobile');
      else if (window.innerWidth < 1024) setViewportMode('tablet');
      else setViewportMode('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [layoutMode]);

  const activeMode = layoutMode === 'auto' ? viewportMode : layoutMode;
  const isDesktop = activeMode === 'desktop';
  const isMobile = activeMode === 'mobile';

  return (
    <div
      className={`rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs ${
        isMobile ? 'p-4' : isDesktop ? 'p-6' : 'p-5'
      } ${className}`}
    >
      {(title || subtitle) && (
        <div className={`${isMobile ? 'pb-3 mb-3' : 'pb-4 mb-4'} border-b border-[var(--border-subtle)]`}>
          {title && (
            <h3 className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{subtitle}</p>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="py-8 text-center text-xs text-[var(--text-muted)]">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex flex-col" role="list">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const style = TYPE_STYLES[item.type || 'system'];

            return (
              <div
                key={item.id}
                className={`relative flex group ${isMobile ? 'gap-2.5' : 'gap-3.5'}`}
                role="listitem"
              >
                {/* Desktop Left Timestamp Column */}
                {isDesktop && (
                  <div className="w-20 pt-2 text-right flex-shrink-0">
                    <span className="text-[11px] font-mono font-semibold text-[var(--text-muted)]">
                      {item.timestamp}
                    </span>
                  </div>
                )}

                {/* Rail */}
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full border flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                      isMobile ? 'w-7 h-7' : 'w-8 h-8'
                    } ${style.badgeClass}`}
                  >
                    {item.icon || style.defaultIcon}
                  </div>
                  {!isLast && (
                    <div className="w-px flex-1 min-h-[20px] my-1.5 bg-[var(--border-subtle)]" />
                  )}
                </div>

                {/* Content */}
                <div className={`min-w-0 flex-1 ${isLast ? 'pb-0' : isMobile ? 'pb-3.5' : 'pb-5'} ${isDesktop ? '' : 'pt-0.5'}`}>
                  <div
                    className={
                      isDesktop
                        ? 'p-3.5 rounded-2xl bg-[var(--bg-secondary)]/45 group-hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)]/70 transition-colors'
                        : isMobile
                          ? 'p-2.5 rounded-2xl bg-[var(--bg-secondary)]/35 border border-[var(--border-subtle)]/50'
                          : ''
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          {item.title}
                        </span>
                        {item.badge}
                      </div>
                      {!isDesktop && (
                        <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0 pt-0.5">
                          {item.timestamp}
                        </span>
                      )}
                      {isDesktop && item.actor && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex-shrink-0">
                          <Avatar
                            size="xs"
                            src={item.actor.src}
                            alt={item.actor.name}
                            fallback={item.actor.fallback || item.actor.name.slice(0, 2).toUpperCase()}
                            className="!w-4 !h-4 !text-[8px]"
                          />
                          <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                            {item.actor.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {!isDesktop && item.actor && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <Avatar
                          size="xs"
                          src={item.actor.src}
                          alt={item.actor.name}
                          fallback={item.actor.fallback || item.actor.name.slice(0, 2).toUpperCase()}
                          className="!w-4 !h-4 !text-[8px]"
                        />
                        <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                          {item.actor.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
