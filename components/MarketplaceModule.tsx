'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ShoppingBag24Filled, CheckmarkCircle24Regular } from '@fluentui/react-icons';

export const MarketplaceModule: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {t('marketplaceTitle')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono font-extrabold uppercase">
              {t('comingSoonV12')}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
            {t('marketplaceDesc')}
          </p>
        </div>
      </div>

      {/* Honest Roadmap Teaser Card */}
      <div className="p-8 rounded-3xl glass-panel bg-gradient-to-br from-blue-500/10 via-amber-500/5 to-indigo-500/10 border border-blue-500/20 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-3xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <ShoppingBag24Filled className="w-7 h-7" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">
            Mercado de Integraciones y Widgets
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Estamos diseñando un catálogo de extensiones para integrar AirBook con tu sitio web de WordPress, Wix o Shopify, además de sincronización multi-sucursal.
          </p>
        </div>

        <div className="pt-3 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-start gap-2.5">
            <CheckmarkCircle24Regular className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">Widget de Reserva Embebible</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Inserta el motor en cualquier web.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-start gap-2.5">
            <CheckmarkCircle24Regular className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">Directorio SEO de Salones</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Perfil público optimizado para Google.</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-extrabold">
            <ShoppingBag24Filled className="w-3.5 h-3.5" />
            <span>Programado para el lanzamiento de AirBook v1.2</span>
          </span>
        </div>
      </div>
    </div>
  );
};
