'use client';

import { useState, useEffect, useLayoutEffect, useCallback, RefObject } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type VerticalPlacement = 'top' | 'bottom';
export type HorizontalPlacement = 'left' | 'right' | 'center';

export interface UseSmartPositionOptions {
  isOpen: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  floatingRef?: RefObject<HTMLElement | null>;
  estimatedWidth?: number;
  estimatedHeight?: number;
  preferredVertical?: VerticalPlacement;
  preferredHorizontal?: HorizontalPlacement;
  offset?: number;
  viewportPadding?: number;
}

export interface SmartPositionResult {
  vertical: VerticalPlacement;
  horizontal: HorizontalPlacement;
  /** Framer Motion initial/exit Y offset so floating UI emerges away from trigger */
  motionY: number;
  /** Maximum height that fits on the chosen vertical side */
  maxHeight: number;
  /** Tailwind positioning classes for vertical & horizontal placement */
  positionClass: string;
}

export function useSmartPosition({
  isOpen,
  triggerRef,
  floatingRef,
  estimatedWidth = 280,
  estimatedHeight = 320,
  preferredVertical = 'bottom',
  preferredHorizontal = 'left',
  offset = 8,
  viewportPadding = 12,
}: UseSmartPositionOptions): SmartPositionResult {
  const [vertical, setVertical] = useState<VerticalPlacement>(preferredVertical);
  const [horizontal, setHorizontal] = useState<HorizontalPlacement>(preferredHorizontal);
  const [maxHeight, setMaxHeight] = useState<number>(estimatedHeight);

  const computePosition = useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl || typeof window === 'undefined') return;

    const triggerRect = triggerEl.getBoundingClientRect();
    const floatingRect = floatingRef?.current?.getBoundingClientRect();

    const width = floatingRect?.width || estimatedWidth;
    const height = floatingRect?.height || estimatedHeight;

    // Check closest scrollable ancestor if inside a modal/drawer/scroll area
    const scrollParent = triggerEl.closest('.overflow-y-auto, .overflow-auto') as HTMLElement | null;
    const bounds = scrollParent
      ? scrollParent.getBoundingClientRect()
      : {
          top: 0,
          bottom: window.innerHeight,
          left: 0,
          right: window.innerWidth,
        };

    const spaceAbove = Math.min(triggerRect.top, triggerRect.top - bounds.top) - viewportPadding;
    const spaceBelow =
      Math.min(window.innerHeight - triggerRect.bottom, bounds.bottom - triggerRect.bottom) -
      viewportPadding;

    let nextVertical: VerticalPlacement = preferredVertical;
    if (preferredVertical === 'bottom') {
      if (spaceBelow < height + offset && spaceAbove > spaceBelow) {
        nextVertical = 'top';
      }
    } else {
      if (spaceAbove < height + offset && spaceBelow > spaceAbove) {
        nextVertical = 'bottom';
      }
    }

    const spaceRightFromLeftEdge =
      Math.min(window.innerWidth - triggerRect.left, bounds.right - triggerRect.left) -
      viewportPadding;
    const spaceLeftFromRightEdge =
      Math.min(triggerRect.right, triggerRect.right - bounds.left) - viewportPadding;

    let nextHorizontal: HorizontalPlacement = preferredHorizontal;
    if (preferredHorizontal === 'left') {
      if (spaceRightFromLeftEdge < width && spaceLeftFromRightEdge > spaceRightFromLeftEdge) {
        nextHorizontal = 'right';
      }
    } else if (preferredHorizontal === 'right') {
      if (spaceLeftFromRightEdge < width && spaceRightFromLeftEdge > spaceLeftFromRightEdge) {
        nextHorizontal = 'left';
      }
    } else if (preferredHorizontal === 'center') {
      const centerX = triggerRect.left + triggerRect.width / 2;
      const halfWidth = width / 2;
      const minLeft = Math.max(0, bounds.left) + viewportPadding;
      const maxRight = Math.min(window.innerWidth, bounds.right) - viewportPadding;
      if (centerX - halfWidth < minLeft) {
        nextHorizontal = 'left';
      } else if (centerX + halfWidth > maxRight) {
        nextHorizontal = 'right';
      }
    }

    const chosenSpace = nextVertical === 'bottom' ? spaceBelow : spaceAbove;
    setVertical(nextVertical);
    setHorizontal(nextHorizontal);
    setMaxHeight(Math.max(160, Math.floor(chosenSpace - offset)));
  }, [
    triggerRef,
    floatingRef,
    estimatedWidth,
    estimatedHeight,
    preferredVertical,
    preferredHorizontal,
    offset,
    viewportPadding,
  ]);

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;
    computePosition();
    const raf = requestAnimationFrame(computePosition);
    window.addEventListener('resize', computePosition);
    window.addEventListener('scroll', computePosition, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', computePosition);
      window.removeEventListener('scroll', computePosition, true);
    };
  }, [isOpen, computePosition]);

  const verticalClass = vertical === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2';
  const horizontalClass =
    horizontal === 'left'
      ? 'left-0'
      : horizontal === 'right'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';

  return {
    vertical,
    horizontal,
    motionY: vertical === 'bottom' ? -6 : 6,
    maxHeight,
    positionClass: `${verticalClass} ${horizontalClass}`,
  };
}
