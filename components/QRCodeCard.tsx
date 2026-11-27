'use client';

import React, { useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Checkmark24Filled, Copy24Filled, Open24Filled } from '@fluentui/react-icons';
import { DownloadButton } from '@/components/primitives/Download';
import { Icon } from '@/components/primitives/Icon';

export interface QRCodeCardProps {
  /** URL or text represented by the QR card */
  url?: string;
  /** Optional caption shown above the QR card */
  description?: string;
  /** Copy button label */
  copyLabel?: string;
  copiedLabel?: string;
  /** Open link button label */
  openLabel?: string;
  /** Href for the open link button (defaults to url) */
  openHref?: string;
  onCopy?: () => void;
  /** Show an SVG download button @default false */
  downloadable?: boolean;
  downloadFileName?: string;
  className?: string;
}

/**
 * Ozone UI QRCodeCard composite.
 * Unified vector QR card with copy, open, and SVG download actions.
 */
export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  url,
  description,
  copyLabel = 'Copy Link',
  copiedLabel = 'Copied',
  openLabel = 'Open Page',
  openHref,
  onCopy,
  downloadable = false,
  downloadFileName = 'airbook-qr.svg',
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [copied, setCopied] = useState(false);

  const qrMatrix = useMemo(() => {
    const target = url?.trim() || 'https://getairbook.com';
    const qr = QRCode.create(target, { errorCorrectionLevel: 'M' });
    return {
      size: qr.modules.size,
      data: qr.modules.data,
    };
  }, [url]);

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
    } else if (url && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getSvgBlob = () => {
    const markup = svgRef.current?.outerHTML || '';
    return new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
  };

  return (
    <div className={`space-y-3 text-center ${className}`}>
      {description && (
        <p className="text-xs text-[var(--text-secondary)]">{description}</p>
      )}

      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-md mx-auto w-48 h-48">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${qrMatrix.size + 4} ${qrMatrix.size + 4}`}
          className="w-40 h-40"
          shapeRendering="crispEdges"
        >
          <rect x={0} y={0} width={qrMatrix.size + 4} height={qrMatrix.size + 4} fill="white" />
          {Array.from({ length: qrMatrix.size * qrMatrix.size }, (_, idx) => {
            if (!qrMatrix.data[idx]) return null;
            const x = (idx % qrMatrix.size) + 2;
            const y = Math.floor(idx / qrMatrix.size) + 2;
            return <rect key={idx} x={x} y={y} width={1} height={1} fill="#0F172A" />;
          })}
        </svg>
      </div>

      {url && (
        <p className="text-[11px] font-mono text-[#2BB5FF] font-bold truncate">
          {url}
        </p>
      )}

      <div className="space-y-2 pt-1">
        <div className={`grid gap-2 ${downloadable ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary !h-9 w-full justify-center cursor-pointer"
          >
            {copied ? (
              <Icon filled={Checkmark24Filled} size="sm" tone="success" />
            ) : (
              <Icon filled={Copy24Filled} size="sm" />
            )}
            <span>{copied ? copiedLabel : copyLabel}</span>
          </button>

          {downloadable && (
            <DownloadButton
              label="Save SVG"
              fileName={downloadFileName}
              source={getSvgBlob}
              variant="secondary"
              size="md"
              className="!h-9 w-full justify-center"
            />
          )}
        </div>

        {(openHref || url) && (
          <a
            href={openHref || url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !h-10 w-full justify-center"
          >
            <Icon filled={Open24Filled} size="sm" />
            <span>{openLabel}</span>
          </a>
        )}
      </div>
    </div>
  );
};
