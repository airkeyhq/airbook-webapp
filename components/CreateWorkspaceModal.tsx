'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAirBookStore } from '@/lib/store';
import { useSession } from '@/lib/auth-client';
import { useToast } from '@/components/Toast';
import { CustomSelect } from '@/components/CustomSelect';
import { FloatingInput } from '@/components/FloatingInput';
import {
  Sparkle24Filled,
  Dismiss24Filled,
  Add24Filled,
} from '@fluentui/react-icons';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkspaceCreated?: (workspace: any) => void;
}

export const CreateWorkspaceModal: React.FC<CreateWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onWorkspaceCreated,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const { setWorkspaceId, setWorkspaceName, setWorkspaceSlug } = useAirBookStore();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [businessType, setBusinessType] = useState('salon');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: finalSlug,
          businessType,
          phone: phone.trim() || undefined,
          ownerName: session?.user?.name || 'Owner',
          email: session?.user?.email || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.workspace) {
        setWorkspaceId(data.workspace.id);
        setWorkspaceName(data.workspace.name);
        setWorkspaceSlug(data.workspace.slug);
        addToast(t('workspaceCreatedSuccess'), 'success');
        onWorkspaceCreated?.(data.workspace);
        onClose();
        setName('');
        setSlug('');
        setPhone('');
      } else {
        addToast(data.error || 'Failed to create workspace.', 'error');
      }
    } catch (err) {
      console.error('Failed to create workspace:', err);
      addToast('Network error creating workspace.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
          >
            {/* Mobile & Tablet Drag Handle */}
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 mb-1 md:hidden flex-shrink-0" />

            {/* Header */}
            <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Sparkle24Filled className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                    {t('createNewWorkspace')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {t('createNewWorkspaceDesc')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
              >
                <Dismiss24Filled className="w-5 h-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-3.5 flex-1">
              <FloatingInput
                label={t('workspaceName')}
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Aurelia Hair & Spa"
              />

              <FloatingInput
                label={t('workspaceSlugLabel')}
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="aurelia-studio"
                className="font-mono font-bold"
              />

              <CustomSelect
                label={t('businessTypeLabel')}
                value={businessType}
                onChange={(val) => setBusinessType(val)}
                options={[
                  { value: 'salon', label: t('tradeHairSalons') },
                  { value: 'barbershop', label: t('tradeBarbershops') },
                  { value: 'spa', label: t('tradeSpas') },
                  { value: 'wellness', label: t('tradeWellness') },
                  { value: 'aesthetics', label: t('tradeAesthetics') },
                ]}
              />

              <FloatingInput
                label={t('workspacePhoneLabel')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 234-5678"
              />

              {/* Action Footer */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="w-full h-12 btn-primary rounded-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Add24Filled className="w-4 h-4" />
                  <span>{isSubmitting ? '...' : t('createWorkspaceBtn')}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
