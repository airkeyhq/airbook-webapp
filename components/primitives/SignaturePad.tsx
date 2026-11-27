'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowReset24Filled, DocumentSignature24Regular } from '@fluentui/react-icons';
import { Icon } from './Icon';

export interface SignaturePadProps {
  label?: string;
  placeholder?: string;
  clearLabel?: string;
  penColor?: string;
  lineWidth?: number;
  disabled?: boolean;
  onChange?: (dataUrl: string | null) => void;
  className?: string;
}

/**
 * Ozone UI SignaturePad primitive.
 * Retina-scaled HTML5 canvas supporting mouse and touch drawing for waivers and POS receipts.
 */
export const SignaturePad: React.FC<SignaturePadProps> = ({
  label = 'Digital Signature',
  placeholder = 'Draw your signature here',
  clearLabel = 'Clear',
  penColor = '#2BB5FF',
  lineWidth = 2.5,
  disabled = false,
  onChange,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const setup = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth;
    };

    const timer = setTimeout(setup, 60);
    return () => clearTimeout(timer);
  }, [penColor, lineWidth]);

  const getPoint = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPoint(e, canvas);
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPoint(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (hasSignature && canvasRef.current) {
      onChange?.(canvasRef.current.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange?.(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
          <Icon regular={DocumentSignature24Regular} size="md" tone="accent" />
          <span>{label}</span>
        </span>

        <button
          type="button"
          onClick={clear}
          disabled={disabled || !hasSignature}
          className="text-[11px] font-bold text-rose-500 hover:text-rose-600 disabled:opacity-40 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
        >
          <Icon filled={ArrowReset24Filled} size="sm" />
          <span>{clearLabel}</span>
        </button>
      </div>

      <div
        className={`relative w-full h-36 rounded-2xl bg-[var(--bg-primary)] border-2 border-dashed border-[#2BB5FF]/40 overflow-hidden shadow-inner touch-none ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair block"
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-bold text-[#2BB5FF]/45 uppercase tracking-wider">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
