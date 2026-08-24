'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
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
        <Icon className="w-10 h-10" />
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
            className="h-10 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {action.icon && <action.icon className="w-4 h-4 flex-shrink-0" />}
            <span>{action.label}</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
