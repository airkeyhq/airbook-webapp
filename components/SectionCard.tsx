'use client';

import React from 'react';
import { Card } from '@/components/primitives/Card';

export interface SectionCardProps {
  title?: string;
  description?: string;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Ozone UI SectionCard composite.
 * Concentric envelope card with recessed outer tray and elevated inner white insert.
 */
export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  badge,
  footer,
  children,
  className = '',
}) => {
  return (
    <Card
      variant="envelope"
      className={className}
      innerClassName="!p-0 overflow-hidden"
      trayFooter={footer}
    >
      {(title || description) && (
        <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-start justify-between gap-3">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{title}</h3>
                {badge}
              </div>
            )}
            {description && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>
            )}
          </div>
        </div>
      )}

      <div className="divide-y divide-[var(--border-subtle)]">{children}</div>
    </Card>
  );
};
