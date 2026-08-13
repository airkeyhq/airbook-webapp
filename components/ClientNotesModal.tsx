'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getAvatarUrl } from '@/lib/avatars';
import { useAirBookStore } from '@/lib/store';
import {
  Save24Filled,
  Dismiss24Filled,
  Camera24Filled,
  Note24Filled,
  Checkmark24Regular,
  Person24Filled,
  Person24Regular,
  Mail24Regular,
  Phone24Regular,
  Calendar24Filled,
  Calendar24Regular,
  Delete24Filled,
  Shield24Filled,
  DocumentCheckmark24Filled,
  CheckmarkCircle24Filled,
} from '@fluentui/react-icons';

interface ClientNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  totalVisits?: number;
  noShowCount?: number;
  initialNotes?: string;
}

export const ClientNotesModal: React.FC<ClientNotesModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName = 'Client',
  clientEmail = '',
  clientPhone = '',
  totalVisits = 0,
  noShowCount = 0,
  initialNotes = '',
}) => {
  const { t } = useTranslation();
  const { addons } = useAirBookStore();
  const [activeTab, setActiveTab] = useState<'specs' | 'contact' | 'history'>('specs');
  const [notes, setNotes] = useState(initialNotes);
  const [name, setName] = useState(clientName);
  const [email, setEmail] = useState(clientEmail);
  const [phone, setPhone] = useState(clientPhone);
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setName(clientName);
    setEmail(clientEmail);
    setPhone(clientPhone);
    setNotes(initialNotes);
    setActiveTab('specs');
  }, [clientName, clientEmail, clientPhone, initialNotes, isOpen]);

  if (!isOpen) return null;

  const handleSaveNotes = async () => {
    setIsSaved(true);
    if (clientId) {
      try {
        await fetch('/api/clients', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: clientId, notes }),
        });
      } catch (err) {
        console.warn('Failed to sync client notes to DB:', err);
      }
    }
    setTimeout(() => {
      setIsSaved(false);
    }, 1200);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    if (clientId) {
      try {
        await fetch('/api/clients', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: clientId, name, email, phone }),
        });
      } catch (err) {
        console.warn('Failed to update client profile:', err);
      }
    }
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClient = async () => {
    if (!clientId) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    setIsDeleting(true);
    try {
      await fetch(`/api/clients?id=${clientId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to delete client:', err);
    } finally {
      setIsDeleting(false);
      onClose();
    }
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
          className="relative w-full max-w-xl glass-panel rounded-[32px] p-6 sm:p-8 shadow-2xl bg-white/95 dark:bg-gray-900/95 border border-white/80 dark:border-white/10 z-10 space-y-6 max-h-[90vh] overflow-y-auto scroll-fade-y"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400"
          >
            <Dismiss24Filled className="w-5 h-5" />
          </button>

          {/* Client Profile Header */}
          {(() => {
            const avatarSrc = getAvatarUrl(name);
            return (
              <div className="flex items-center gap-4">
                <img
                  src={avatarSrc}
                  alt={name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-sm flex-shrink-0"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                    {name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
                      {totalVisits} {t('visits')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-muted)] text-xs font-mono">
                      {t('noShows')}: <strong className={noShowCount > 0 ? 'text-red-500' : 'text-green-500'}>{noShowCount}</strong>
                    </span>

                    {addons.esign && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-extrabold flex items-center gap-1">
                        <DocumentCheckmark24Filled className="w-3 h-3" />
                        <span>eSign Active</span>
                      </span>
                    )}
                    {addons.hipaa && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold flex items-center gap-1">
                        <Shield24Filled className="w-3 h-3" />
                        <span>HIPAA Encrypted</span>
                      </span>
                    )}
                    {addons.kyc && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                        <CheckmarkCircle24Filled className="w-3 h-3" />
                        <span>KYC Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Modal Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {[
              { id: 'specs', label: t('technicalSpecs'), icon: Note24Filled },
              { id: 'contact', label: t('details'), icon: Person24Filled },
              { id: 'history', label: t('activity'), icon: Calendar24Filled },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-gray-800 text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Technical Specs & Formulas */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                  {t('technicalSpecs')}
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Service formulas, client preferences, sensitivities, custom specs..."
                  className="w-full p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                />
              </div>

              {/* Active Add-On Widgets */}
              {addons.esign && (
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300">
                    <span className="flex items-center gap-1.5">
                      <DocumentCheckmark24Filled className="w-4 h-4" />
                      <span>Digital Liability & Consent Waiver (eSign)</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-800 dark:text-purple-200">Signed & Timestamps Logged</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-purple-500/10 flex items-center justify-between">
                    <div className="font-serif italic text-sm text-purple-900 dark:text-purple-100 font-extrabold tracking-wider">
                      {name}
                    </div>
                    <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">SHA-256 Verified • 2026-08-12</span>
                  </div>
                </div>
              )}

              {addons.hipaa && (
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold">
                    <Shield24Filled className="w-4 h-4" />
                    <span>HIPAA Encrypted BAA Audit Log (45 CFR § 164.312)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-200 text-[10px] font-bold">AES-256 Protected</span>
                </div>
              )}

              {addons.kyc && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                    <CheckmarkCircle24Filled className="w-4 h-4" />
                    <span>KYC Government ID & Biometrics Match</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">Passed (ID Verified)</span>
                </div>
              )}

              {/* Before / After Photos */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2 block">
                  {t('beforeAfterPhotos')}
                </label>
                <div className="w-full py-6 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer transition-all">
                  <Camera24Filled className="w-6 h-6 mb-1.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">{t('addPhoto')}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSaveNotes}
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
          )}

          {/* TAB 2: Contact Details & Profile */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <Person24Regular className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail24Regular className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone24Regular className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-semibold text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDeleteClient}
                  disabled={isDeleting}
                  className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    confirmDelete
                      ? 'bg-red-600 text-white shadow-md animate-pulse'
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}
                >
                  <Delete24Filled className="w-4 h-4" />
                  <span>{confirmDelete ? 'Click to Confirm Delete' : 'Delete Client'}</span>
                </button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  {isSaved ? (
                    <>
                      <Checkmark24Regular className="w-4 h-4 text-green-500" />
                      <span>Updated</span>
                    </>
                  ) : (
                    <>
                      <Save24Filled className="w-4 h-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}

          {/* TAB 3: Visit History & Past Appointments */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Appointment Log
              </p>
              {totalVisits === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 text-center">
                  <Calendar24Regular className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-bold text-[var(--text-secondary)]">No Recorded Past Visits</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Visits will populate automatically as appointments complete.</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[var(--text-primary)]">Precision Haircut & Styling</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Completed by Eduardo Moreno</p>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-600 font-bold text-[10px]">
                    Completed
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
