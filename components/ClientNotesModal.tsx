'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Save24Filled, Dismiss24Filled, Camera24Filled, Cut24Regular, Checkmark24Regular } from '@fluentui/react-icons';

interface ClientNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName?: string;
  initialNotes?: string;
}

export const ClientNotesModal: React.FC<ClientNotesModalProps> = ({
  isOpen,
  onClose,
  clientName = 'Mikael from Amie',
  initialNotes = '#2 guard on sides, low taper fade, finger length top, foil shave neck.',
}) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState(initialNotes);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="relative w-full max-w-lg glass-panel rounded-[32px] p-6 shadow-2xl bg-white/95 dark:bg-gray-900/95 border border-white/80 dark:border-white/10 z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400"
          >
            <Dismiss24Filled className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <Cut24Regular className="w-4 h-4 text-pink-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-pink-500">
              {t('technicalSpecs')}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            {t('technicalSpecs')}: {clientName}
          </h3>

          <div className="space-y-4">
            {/* Barber Formula Notes */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                {t('haircutSpecs')}
              </label>
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. #2 guard sides, low taper fade, finger length top..."
                className="w-full p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[var(--text-primary)] focus:outline-none"
              />
            </div>

            {/* Before / After Photo Gallery */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2 block">
                {t('beforeAfterPhotos')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
                  <Camera24Filled className="w-5 h-5 mb-1" />
                  <span className="text-[10px]">{t('addPhoto')}</span>
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-black/5 flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                  {t('haircut')} #1
                </div>
                <div className="aspect-square rounded-2xl bg-gradient-to-tr from-pink-500/20 to-orange-500/20 border border-black/5 flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
                  {t('haircut')} #2
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleSave}
              className="w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md flex items-center justify-center gap-2"
            >
              {isSaved ? (
                <>
                  <Checkmark24Regular className="w-4 h-4 text-green-500" />
                  <span>{t('savedToProfile')}</span>
                </>
              ) : (
                <>
                  <Save24Filled className="w-4 h-4" />
                  <span>{t('saveNotes')}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
