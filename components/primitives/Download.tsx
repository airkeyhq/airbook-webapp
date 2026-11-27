'use client';

import React, { useState } from 'react';
import {
  ArrowDownload24Filled,
  Checkmark24Filled,
  Document24Regular,
  DocumentPdf24Regular,
  Image24Regular,
} from '@fluentui/react-icons';
import { Badge } from './Badge';
import { Spinner } from './Spinner';
import { Icon } from './Icon';

export type DownloadSource = string | Blob | (() => string | Blob | Promise<string | Blob>);

/**
 * Triggers a browser file download from a URL, Blob, or async factory.
 */
export async function triggerDownload(source: DownloadSource, fileName: string): Promise<void> {
  const resolved = typeof source === 'function' ? await source() : source;
  const isBlob = resolved instanceof Blob;
  const href = isBlob ? URL.createObjectURL(resolved) : resolved;

  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = fileName;
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  if (isBlob) {
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
}

export interface DownloadButtonProps {
  label?: string;
  fileName?: string;
  source?: DownloadSource;
  onDownload?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

/**
 * Ozone UI DownloadButton primitive with loading and downloaded confirmation states.
 */
export const DownloadButton: React.FC<DownloadButtonProps> = ({
  label = 'Download',
  fileName = 'download',
  source,
  onDownload,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  className = '',
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleClick = async () => {
    if (disabled || status === 'loading') return;
    setStatus('loading');
    try {
      if (onDownload) {
        await onDownload();
      } else if (source) {
        await triggerDownload(source, fileName);
      }
      setStatus('done');
      setTimeout(() => setStatus('idle'), 1800);
    } catch {
      setStatus('idle');
    }
  };

  const variantClass =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'ghost'
        ? 'btn-tertiary'
        : 'btn-secondary';

  const sizeClass = size === 'sm' ? '!h-8 !px-3 text-xs' : '!h-10 !px-4 text-xs';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || status === 'loading'}
      className={`${variantClass} ${sizeClass} inline-flex items-center gap-1.5 whitespace-nowrap ${className}`}
    >
      {status === 'loading' ? (
        <Spinner size="xs" />
      ) : status === 'done' ? (
        <Icon filled={Checkmark24Filled} size="sm" tone="success" />
      ) : (
        <Icon filled={ArrowDownload24Filled} size="sm" />
      )}
      <span>{status === 'done' ? 'Downloaded' : label}</span>
    </button>
  );
};

export interface FileDownloadProps {
  fileName: string;
  fileSize?: string;
  fileType?: string;
  description?: string;
  source?: DownloadSource;
  onDownload?: () => void | Promise<void>;
  icon?: React.ReactNode;
  variant?: 'card' | 'compact';
  disabled?: boolean;
  className?: string;
}

function getDefaultFileIcon(fileName: string, fileType?: string) {
  const ext = (fileType || fileName.split('.').pop() || '').toLowerCase();
  if (ext === 'pdf') return <Icon regular={DocumentPdf24Regular} size="lg" tone="danger" />;
  if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) {
    return <Icon regular={Image24Regular} size="lg" tone="accent" />;
  }
  return <Icon regular={Document24Regular} size="lg" tone="accent" />;
}

/**
 * Ozone UI FileDownload primitive (counterpart to FileDropzone).
 * Displays file metadata and a stateful download trigger.
 */
export const FileDownload: React.FC<FileDownloadProps> = ({
  fileName,
  fileSize,
  fileType,
  description,
  source,
  onDownload,
  icon,
  variant = 'card',
  disabled = false,
  className = '',
}) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleDownload = async () => {
    if (disabled || status === 'loading') return;
    setStatus('loading');
    try {
      if (onDownload) {
        await onDownload();
      } else if (source) {
        await triggerDownload(source, fileName);
      }
      setStatus('done');
      setTimeout(() => setStatus('idle'), 1800);
    } catch {
      setStatus('idle');
    }
  };

  const extLabel = (fileType || fileName.split('.').pop() || '').toUpperCase();

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] transition-colors hover:border-[#2BB5FF]/40 ${
        variant === 'compact' ? 'px-3 py-2' : 'p-3.5 shadow-xs'
      } ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 ${
            variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'
          }`}
        >
          {icon ?? getDefaultFileIcon(fileName, fileType)}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-[var(--text-primary)] truncate">
              {fileName}
            </span>
            {extLabel && (
              <Badge size="xs" variant="subtle">
                {extLabel}
              </Badge>
            )}
          </div>
          {(description || fileSize) && (
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mt-0.5 truncate">
              {fileSize && <span className="font-mono">{fileSize}</span>}
              {fileSize && description && <span>•</span>}
              {description && <span className="truncate">{description}</span>}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={disabled || status === 'loading'}
        aria-label={`Download ${fileName}`}
        className="btn-secondary !h-8 !px-3 text-xs inline-flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
      >
        {status === 'loading' ? (
          <Spinner size="xs" />
        ) : status === 'done' ? (
          <Icon filled={Checkmark24Filled} size="sm" tone="success" />
        ) : (
          <Icon filled={ArrowDownload24Filled} size="sm" />
        )}
        <span>{status === 'done' ? 'Saved' : 'Download'}</span>
      </button>
    </div>
  );
};
