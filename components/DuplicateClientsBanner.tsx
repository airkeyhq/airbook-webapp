'use client';

import React, { useState } from 'react';
import { Sparkle24Regular, ChevronRight24Filled } from '@fluentui/react-icons';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { DuplicateGroup, ClientItemLike } from '@/lib/client-duplicates';
import { MergeClientsModal } from './MergeClientsModal';

export interface DuplicateClientsBannerProps<T extends ClientItemLike = ClientItemLike> {
  groups: DuplicateGroup<T>[];
  currency?: string;
  isDemoMode?: boolean;
  onMergeSuccess?: () => void;
  onLocalMerge?: (targetId: string, sourceIds: string[]) => void;
}

export const DuplicateClientsBanner = <T extends ClientItemLike>({
  groups,
  currency = 'USD',
  isDemoMode = false,
  onMergeSuccess,
  onLocalMerge,
}: DuplicateClientsBannerProps<T>) => {
  const { t } = useTranslation();
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);

  if (!groups || groups.length === 0) return null;

  const currentGroup = activeGroupIndex !== null ? groups[activeGroupIndex] : null;

  return (
    <>
      <div className="rounded-2xl border border-[#2BB5FF]/30 bg-[#2BB5FF]/5 p-4 shadow-xs animate-in fade-in-0 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="rounded-full bg-[#2BB5FF]/20 p-2 text-[#2BB5FF] shrink-0 mt-0.5">
              <Sparkle24Regular className="w-5 h-5 text-[#2BB5FF]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm text-[var(--text-primary)] tracking-tight">
                {t('duplicateBannerTitle')}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {t('duplicateBannerDesc')}
              </p>

              {/* Group Badges Preview */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {groups.map((g, idx) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGroupIndex(idx)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#2BB5FF]/30 bg-[#2BB5FF]/10 hover:bg-[#2BB5FF]/20 px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <span className="truncate max-w-[150px]">{g.matchKey}</span>
                    <span className="rounded-full bg-[#2BB5FF] text-white px-1.5 py-0.2 text-[10px] font-extrabold">
                      {g.clients.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex sm:self-center">
            <button
              type="button"
              onClick={() => setActiveGroupIndex(0)}
              className="btn-primary text-xs h-9 px-3.5 w-full sm:w-auto flex items-center justify-center gap-1.5"
            >
              <span>{t('reviewAndMerge')}</span>
              <ChevronRight24Filled className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {currentGroup && (
        <MergeClientsModal<T>
          open={activeGroupIndex !== null}
          onClose={() => setActiveGroupIndex(null)}
          clientsToMerge={currentGroup.clients}
          currency={currency}
          isDemoMode={isDemoMode}
          onLocalMerge={onLocalMerge}
          onSuccess={() => {
            onMergeSuccess?.();
            // If there's another duplicate group, prompt the next one, or close
            if (activeGroupIndex !== null && activeGroupIndex + 1 < groups.length) {
              setActiveGroupIndex(activeGroupIndex + 1);
            } else {
              setActiveGroupIndex(null);
            }
          }}
        />
      )}
    </>
  );
};
