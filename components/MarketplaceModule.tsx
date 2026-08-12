'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Copy24Filled, Share24Filled, Globe24Regular, Code24Regular, Checkmark24Regular } from '@fluentui/react-icons';

import { useAirBookStore } from '@/lib/store';

export const MarketplaceModule: React.FC = () => {
  const { t } = useTranslation();
  const { workspaceName } = useAirBookStore();
  const [copied, setCopied] = useState(false);
  const slug = workspaceName ? workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') : 'my-business';
  const embedCode = `<iframe src="https://getairbook.com/embed/${slug}" width="100%" height="700px" frameborder="0"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {t('marketplaceTitle')}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {t('marketplaceDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marketplace Listing */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Globe24Regular className="w-4 h-4 text-blue-500" />
              <span>{t('marketplaceProfile')}</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold">
              {t('listedSeo')}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            {t('marketplaceProfileDesc')}
          </p>

          <button
            onClick={() => window.open(`/book/${slug}`, '_blank')}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
          >
            <span>{t('previewMarketplace')}</span>
            <Share24Filled className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Website Embed Widget */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Code24Regular className="w-4 h-4 text-purple-500" />
              <span>{t('websiteEmbedWidget')}</span>
            </h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)]">
            {t('embedDesc')}
          </p>

          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 font-mono text-[10px] text-gray-500 overflow-x-auto">
            <code>{embedCode}</code>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Checkmark24Regular className="w-4 h-4 text-green-500" />
                <span>{t('copiedHtml')}</span>
              </>
            ) : (
              <>
                <Copy24Filled className="w-4 h-4" />
                <span>{t('copyEmbedCode')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
