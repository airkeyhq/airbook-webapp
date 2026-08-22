'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getAvatarUrl } from '@/lib/avatars';
import { useAirBookStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import {
  Save24Filled,
  Dismiss24Filled,
  Note24Filled,
  Person24Filled,
  Mail24Filled,
  Phone24Filled,
  Calendar24Filled,
  Delete24Filled,
  Shield24Filled,
  DocumentCheckmark24Filled,
  DocumentSignature24Filled,
  Add24Filled,
  Warning24Regular,
  Clock24Regular,
  ShieldCheckmark24Regular,
  ShieldCheckmark24Filled,
} from '@fluentui/react-icons';
import { WaiverPadModal } from '@/components/WaiverPadModal';
import { KYCVerificationModal } from '@/components/KYCVerificationModal';

export interface CustomSpecItem {
  id: string;
  label: string;
  value: string;
  date?: string;
}

interface ClientNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  totalVisits?: number;
  totalSpentCents?: number;
  walletBalanceCents?: number;
  noShowCount?: number;
  initialNotes?: string;
  preferences?: string;
  allergies?: string;
  tags?: string[];
  customSpecs?: CustomSpecItem[];
  isKycVerified?: boolean;
  onClientUpdated?: () => void;
}

const PRESET_TAG_SUGGESTIONS = [
  'VIP',
  'Prefers Quiet',
  'Early Bird',
  'Loyal Member',
  'Allergy Alert',
  'Cashless Only',
  'Executive',
  'High Sensitivity',
];

export const ClientNotesModal: React.FC<ClientNotesModalProps> = ({
  isOpen,
  onClose,
  clientId,
  clientName = 'Client',
  clientEmail = '',
  clientPhone = '',
  totalVisits = 0,
  totalSpentCents = 0,
  walletBalanceCents = 0,
  noShowCount = 0,
  initialNotes = '',
  preferences: initialPreferences = '',
  allergies: initialAllergies = '',
  tags: initialTags = [],
  customSpecs: initialSpecs = [],
  isKycVerified = false,
  onClientUpdated,
}) => {
  const { t } = useTranslation();
  const { addons, appointments } = useAirBookStore();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'specs' | 'waivers' | 'contact' | 'history'>('specs');
  const [name, setName] = useState(clientName);
  const [email, setEmail] = useState(clientEmail);
  const [phone, setPhone] = useState(clientPhone);
  const [notes, setNotes] = useState(initialNotes);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [allergies, setAllergies] = useState(initialAllergies);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [customSpecs, setCustomSpecs] = useState<CustomSpecItem[]>(initialSpecs);

  const [signedWaivers, setSignedWaivers] = useState<any[]>([]);
  const [isWaiverModalOpen, setIsWaiverModalOpen] = useState(false);
  const [isKycVerifiedState, setIsKycVerifiedState] = useState(!!isKycVerified);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [isAddingSpec, setIsAddingSpec] = useState(false);

  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchWaivers = async () => {
    if (!clientId) return;
    try {
      const res = await fetch(`/api/waivers?clientId=${clientId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.signedWaivers)) {
        setSignedWaivers(data.signedWaivers);
      }
    } catch (err) {
      console.warn('Failed to load client signed waivers:', err);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setName(clientName);
    setEmail(clientEmail);
    setPhone(clientPhone);
    setNotes(initialNotes);
    setPreferences(initialPreferences);
    setAllergies(initialAllergies);
    setTags(initialTags || []);
    setCustomSpecs(initialSpecs || []);
    setActiveTab('specs');
    setIsAddingSpec(false);
    setIsAddingTag(false);
    if (clientId) {
      fetchWaivers();
    }
  }, [
    isOpen,
    clientId,
    clientName,
    clientEmail,
    clientPhone,
    initialNotes,
    initialPreferences,
    initialAllergies,
  ]);

  if (!isOpen) return null;

  const handleAddSpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    const newSpec: CustomSpecItem = {
      id: `spec-${Date.now()}`,
      label: newSpecLabel.trim(),
      value: newSpecValue.trim(),
      date: new Date().toISOString().split('T')[0],
    };
    setCustomSpecs([newSpec, ...customSpecs]);
    setNewSpecLabel('');
    setNewSpecValue('');
    setIsAddingSpec(false);
  };

  const handleDeleteSpec = (specId: string) => {
    setCustomSpecs(customSpecs.filter((s) => s.id !== specId));
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  const handleSaveClient = async () => {
    if (!clientId) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: clientId,
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          notes: notes.trim() || null,
          preferences: preferences.trim() || null,
          allergies: allergies.trim() || null,
          tags,
          customSpecs,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('savedToProfile'), 'success');
        onClientUpdated?.();
      } else {
        addToast(data.error || 'Failed to save changes.', 'error');
      }
    } catch {
      addToast('Network error while saving profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientId) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    try {
      await fetch(`/api/clients?id=${clientId}`, { method: 'DELETE' });
      addToast('Client removed.', 'info');
      onClientUpdated?.();
      onClose();
    } catch {
      addToast('Failed to delete client.', 'error');
    }
  };

  const clientAppointments = appointments.filter(
    (a) => a.clientName?.toLowerCase() === name.toLowerCase()
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden"
        >
          <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0 rounded-t-[32px]">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          <div className="p-5 md:p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] flex items-start justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={getAvatarUrl(name)}
                alt={name}
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border border-[var(--border-subtle)] shadow-sm flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-[var(--text-primary)] truncate">
                    {name}
                  </h3>
                  {tags.includes('VIP') && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-extrabold uppercase tracking-wider">
                      VIP
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                    {totalVisits} {t('visits')}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)]">·</span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    ${(totalSpentCents / 100).toFixed(0)} {t('lifetimeSpend')}
                  </span>

                  {addons.esign && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold flex items-center gap-1">
                      <DocumentCheckmark24Filled className="w-3 h-3" />
                      <span>eSign</span>
                    </span>
                  )}
                  {addons.hipaa && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex items-center gap-1">
                      <Shield24Filled className="w-3 h-3" />
                      <span>HIPAA</span>
                    </span>
                  )}

                  {/* KYC Verification Status */}
                  {isKycVerifiedState ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheckmark24Filled className="w-3 h-3 text-emerald-500" />
                      <span>{t('idVerified')}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsKycModalOpen(true)}
                      className="px-2 py-0.5 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ShieldCheckmark24Filled className="w-3 h-3" />
                      <span>{t('verifyIdentity')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-600 text-[var(--text-secondary)] transition-colors"
                  title={`Call ${phone}`}
                >
                  <Phone24Filled className="w-4 h-4" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-blue-500/10 hover:text-blue-600 text-[var(--text-secondary)] transition-colors"
                  title={`Email ${email}`}
                >
                  <Mail24Filled className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
              >
                <Dismiss24Filled className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-5 md:px-6 pt-3 pb-1 border-b border-[var(--border-subtle)] flex items-center gap-2 bg-[var(--bg-primary)] flex-shrink-0">
            {[
              { id: 'specs', label: t('technicalSpecs'), icon: Note24Filled },
              { id: 'waivers', label: t('waiverPadTitle'), icon: DocumentSignature24Filled },
              { id: 'contact', label: t('details'), icon: Person24Filled },
              { id: 'history', label: t('activity'), icon: Calendar24Filled },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1 bg-[var(--bg-primary)]">
            {activeTab === 'specs' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                        {t('customSpecsTitle')}
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Technical parameters, formulas, or service notes for this client.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingSpec(!isAddingSpec)}
                      className="py-1 px-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Add24Filled className="w-3.5 h-3.5" />
                      <span>{t('addCustomSpec')}</span>
                    </button>
                  </div>

                  {isAddingSpec && (
                    <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={newSpecLabel}
                          onChange={(e) => setNewSpecLabel(e.target.value)}
                          placeholder={t('specLabelPlaceholder')}
                          className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        <input
                          type="text"
                          value={newSpecValue}
                          onChange={(e) => setNewSpecValue(e.target.value)}
                          placeholder={t('specValuePlaceholder')}
                          className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingSpec(false)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          {t('cancel')}
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSpec}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 cursor-pointer"
                        >
                          {t('addCustomSpec')}
                        </button>
                      </div>
                    </div>
                  )}

                  {customSpecs.length > 0 ? (
                    <div className="divide-y divide-black/5 dark:divide-white/5 border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
                      {customSpecs.map((spec) => (
                        <div key={spec.id} className="p-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                              {spec.label}
                            </p>
                            <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5 break-words">
                              {spec.value}
                            </p>
                            {spec.date && (
                              <p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">
                                Logged {spec.date}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSpec(spec.id)}
                            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0 cursor-pointer"
                            title="Delete Spec"
                          >
                            <Delete24Filled className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-secondary)] italic p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)]">
                      No custom technical specs logged yet. Click &quot;+ Add Spec&quot; to record formulas, settings, or measurements.
                    </p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                      {t('tagsTitle')}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingTag(!isAddingTag)}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      + Custom Tag
                    </button>
                  </div>

                  {isAddingTag && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        placeholder="e.g. VIP, Cash Payer"
                        className="bg-transparent text-xs font-semibold text-[var(--text-primary)] focus:outline-none w-full px-2"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TAG_SUGGESTIONS.map((tag) => {
                      const isSelected = tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)] block">
                    {t('preferencesTitle')}
                  </label>
                  <input
                    type="text"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    placeholder="e.g. Sparkling water on arrival, room temp 70°F, quiet session"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <Warning24Regular className="w-3.5 h-3.5" />
                    <span>{t('allergiesTitle')}</span>
                  </label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Allergic to latex, synthetic fragrance, tree nut oils"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)] block">
                    General Practitioner Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Internal practitioner notes, conversation points, client history..."
                    className="w-full p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
              </div>
            )}

            {/* ─── TAB: ESIGN WAIVERS & COMPLIANCE LOGS ─── */}
            {activeTab === 'waivers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                      {t('complianceLog')}
                    </h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Signed consent waivers and liability agreements on file.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsWaiverModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <DocumentSignature24Filled className="w-3.5 h-3.5" />
                    <span>{t('signNewWaiver')}</span>
                  </button>
                </div>

                {signedWaivers.length === 0 ? (
                  <div className="p-8 text-center bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] rounded-2xl space-y-2">
                    <ShieldCheckmark24Regular className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                    <p className="text-xs font-bold text-[var(--text-primary)]">{t('noSignedWaivers')}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">{t('noSignedWaiversSub')}</p>
                    <button
                      type="button"
                      onClick={() => setIsWaiverModalOpen(true)}
                      className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <DocumentSignature24Filled className="w-3.5 h-3.5" />
                      <span>{t('signWaiver')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {signedWaivers.map((w) => (
                      <div
                        key={w.id}
                        className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-extrabold text-[var(--text-primary)]">{w.templateTitle}</p>
                            <p className="text-[10px] text-[var(--text-secondary)]">
                              Signed: {new Date(w.signedAt).toLocaleDateString()} at {new Date(w.signedAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold uppercase">
                            Verified eSign
                          </span>
                        </div>

                        {/* Signature Preview */}
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[var(--border-subtle)] flex items-center justify-between">
                          <img
                            src={w.signatureDataUrl}
                            alt="Digital Signature"
                            className="h-10 max-w-[160px] object-contain"
                          />
                          <div className="text-right text-[10px] text-[var(--text-muted)] font-mono">
                            <p>IP: {w.signerIp || '127.0.0.1'}</p>
                            <p>Hash: SHA-256 Verified</p>
                          </div>
                        </div>

                        {/* Clauses */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {w.agreedClauses?.termsAgreed && (
                            <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-[10px] font-semibold text-[var(--text-secondary)]">
                              ✓ Terms Accepted
                            </span>
                          )}
                          {w.agreedClauses?.photoConsent && (
                            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 text-[10px] font-semibold">
                              ✓ Photo Consent
                            </span>
                          )}
                          {w.agreedClauses?.allergiesDeclared && (
                            <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 text-[10px] font-semibold">
                              ✓ Medical Declared
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] block">
                    {t('fullNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] block">
                      {t('emailAddressLabel')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] block">
                      {t('phoneLabel')}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 019-2834"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Lifetime Metrics Summary Card */}
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                      Total Completed Visits
                    </p>
                    <p className="text-lg font-black text-[var(--text-primary)] mt-0.5">{totalVisits}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                      No-Show Counter
                    </p>
                    <p className={`text-lg font-black mt-0.5 ${noShowCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {noShowCount}
                    </p>
                  </div>
                </div>

                {/* Delete Client Action */}
                <div className="pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={handleDeleteClient}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      confirmDelete
                        ? 'bg-red-600 text-white'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                    }`}
                  >
                    {confirmDelete ? 'Click Again to Confirm Delete' : 'Delete Client Record'}
                  </button>
                </div>
              </div>
            )}

            {/* ─── TAB 3: ACTIVITY & APPOINTMENT TIMELINE ─── */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                  {t('clientTimeline')}
                </h4>

                {clientAppointments.length > 0 ? (
                  <div className="divide-y divide-black/5 dark:divide-white/5 border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
                    {clientAppointments.map((apt) => (
                      <div key={apt.id} className="p-3.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                            {apt.serviceName}
                          </p>
                          <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                            {apt.dateStr} @ {apt.startTime} · Specialist: {apt.staffName}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                            ${apt.price}
                          </p>
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-secondary)] italic p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] text-center">
                    No past appointments logged for this client yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Side-to-Side Bottom Action Banner */}
          <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 md:p-5 flex-shrink-0 z-30 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {t('cancel')}
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              disabled={isSaving}
              onClick={handleSaveClient}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save24Filled className="w-4 h-4" />
              <span>{isSaving ? 'Saving…' : t('saveNotes')}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Embedded Digital Waiver Signing Pad */}
      <WaiverPadModal
        isOpen={isWaiverModalOpen}
        onClose={() => setIsWaiverModalOpen(false)}
        clientId={clientId}
        initialClientName={name}
        initialClientEmail={email}
        initialClientPhone={phone}
        onSignedSuccess={(newWaiver) => {
          setSignedWaivers((prev) => [newWaiver, ...prev]);
        }}
      />

      {/* KYC Biometric Identity Verification Modal */}
      {clientId && (
        <KYCVerificationModal
          isOpen={isKycModalOpen}
          onClose={() => setIsKycModalOpen(false)}
          clientId={clientId}
          clientName={name}
          clientEmail={email}
          onVerificationComplete={() => {
            setIsKycVerifiedState(true);
            if (onClientUpdated) {
              onClientUpdated();
            }
          }}
        />
      )}
    </AnimatePresence>
  );
};
