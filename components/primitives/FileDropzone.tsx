'use client';

import React, { useRef, useState } from 'react';
import { ArrowUpload24Regular, Document24Regular, Dismiss24Filled } from '@fluentui/react-icons';
import { SparkleBurst } from './SparkleBurst';
import { Icon } from './Icon';

export interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  onFilesSelected?: (files: File[]) => void;
  spark?: boolean;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Ozone UI FileDropzone primitive.
 */
export const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept = 'image/*,.pdf',
  multiple = true,
  label = 'Upload Studio Media or Documents',
  hint = 'Drag & drop files here, or click to browse (PNG, JPG, PDF)',
  onFilesSelected,
  spark = true,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [burstKey, setBurstKey] = useState(0);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    const list = Array.from(incoming);
    const next = multiple ? [...files, ...list] : [list[0]];
    setFiles(next);
    if (spark) setBurstKey((k) => k + 1);
    onFilesSelected?.(next);
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative rounded-3xl border-2 border-dashed p-6 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-[#2BB5FF] bg-[#2BB5FF]/10 scale-[1.01]'
            : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 hover:border-[#2BB5FF]/50 hover:bg-[var(--bg-secondary)]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="w-10 h-10 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center mx-auto mb-2.5">
          <Icon regular={ArrowUpload24Regular} size="lg" />
        </div>
        <div className="text-xs font-extrabold text-[var(--text-primary)]">{label}</div>
        <p className="text-[11px] text-[var(--text-secondary)] mt-1">{hint}</p>

        {spark && (
          <SparkleBurst
            burstKey={burstKey}
            shape="square-rounded"
            particle="mixed"
            tone="electric"
            distanceScale={1.4}
          />
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-1.5">
          {files.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="px-3 py-2 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Icon regular={Document24Regular} size="md" tone="accent" />
                <span className="font-semibold text-[var(--text-primary)] truncate">{f.name}</span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0">
                  {formatBytes(f.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-rose-500 cursor-pointer"
              >
                <Icon filled={Dismiss24Filled} size="sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
