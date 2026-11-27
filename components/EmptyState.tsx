'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }> | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  };
  className?: string;
}

function renderIcon(
  icon: React.ComponentType<{ className?: string }> | React.ReactNode,
  className: string
): React.ReactNode {
  if (!icon) return null;
  if (React.isValidElement<{ className?: string }>(icon)) {
    return React.cloneElement(icon, {
      className: [className, icon.props.className].filter(Boolean).join(' '),
    });
  }
  if (typeof icon === 'function' || (typeof icon === 'object' && '$$typeof' in icon)) {
    const IconComp = icon as React.ComponentType<{ className?: string }>;
    return <IconComp className={className} />;
  }
  return icon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`min-h-[300px] sm:min-h-[340px] p-8 sm:p-14 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-center space-y-2 bg-[var(--bg-primary)]/40 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[var(--text-muted)] opacity-60 mb-1">
        {renderIcon(icon, 'w-10 h-10')}
      </div>

      <h4 className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight max-w-sm">
        {title}
      </h4>

      {description && (
        <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {action && (
        <div className="pt-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            type="button"
            onClick={action.onClick}
            className="btn-primary"
          >
            {action.icon && renderIcon(action.icon, 'w-4 h-4 flex-shrink-0')}
            <span>{action.label}</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
