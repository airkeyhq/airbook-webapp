'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getAvatarUrl } from '@/lib/avatars';
import { useAirBookStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import {
  Save24Filled,
  Dismiss24Filled,
  Note24Regular,
  Person24Regular,
  Mail24Regular,
  Phone24Regular,
  Calendar24Filled,
  Calendar24Regular,
  Delete24Filled,
  Shield24Filled,
  DocumentSignature24Regular,
  DocumentSignature24Filled,
  DocumentBulletList24Regular,
  Add24Filled,
  Warning24Regular,
  Clock24Regular,
  ShieldCheckmark24Regular,
  ShieldCheckmark24Filled,
  Camera24Regular,
  Camera24Filled,
  Image24Regular,
  Eye24Filled,
  Sparkle24Filled,
} from '@fluentui/react-icons';
import { WaiverPadModal } from '@/components/WaiverPadModal';
import { FloatingInput, FloatingTextarea } from '@/components/FloatingInput';
import { KYCVerificationModal } from '@/components/KYCVerificationModal';
import { EmptyState } from '@/components/EmptyState';
import { CustomSelect } from '@/components/CustomSelect';
import { INDUSTRY_SPEC_CATEGORIES } from '@/lib/presets/technicalSpecs';

export interface CustomSpecItem {
  id: string;
  label: string;
  value: string;
  date?: string;
}

export interface ClientPhotoItem {
  id: string;
  beforeUrl?: string;
  afterUrl?: string;
  title?: string;
  date?: string;
  notes?: string;
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
  photos?: ClientPhotoItem[];
  isKycVerified?: boolean;
  onClientUpdated?: () => void;
}

const PRESET_TAG_KEYS = [
  { key: 'tagVip', defaultLabel: 'VIP' },
  { key: 'tagPrefersQuiet', defaultLabel: 'Prefers Quiet' },
  { key: 'tagEarlyBird', defaultLabel: 'Early Bird' },
  { key: 'tagLoyalMember', defaultLabel: 'Loyal Member' },
  { key: 'tagAllergyAlert', defaultLabel: 'Allergy Alert' },
  { key: 'tagCashlessOnly', defaultLabel: 'Cashless Only' },
  { key: 'tagExecutive', defaultLabel: 'Executive' },
  { key: 'tagHighSensitivity', defaultLabel: 'High Sensitivity' },
] as const;

const splitClientName = (fullName: string) => {
  const parts = (fullName || '').trim().split(/\s+/);
  const first = parts[0] || '';
  const last = parts.slice(1).join(' ') || '';
  return { first, last };
};

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
  photos: initialPhotos = [],
  isKycVerified = false,
  onClientUpdated,
}) => {
  const { t } = useTranslation();
  const { appointments } = useAirBookStore();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'specs' | 'photos' | 'waivers' | 'contact' | 'history'>('specs');
  const initialNameParts = useMemo(() => splitClientName(clientName), [clientName]);
  const [firstName, setFirstName] = useState(initialNameParts.first);
  const [lastName, setLastName] = useState(initialNameParts.last);
  const displayName = `${firstName.trim()} ${lastName.trim()}`.trim() || clientName || 'Client';
  const [email, setEmail] = useState(clientEmail);
  const [phone, setPhone] = useState(clientPhone);
  const [notes, setNotes] = useState(initialNotes);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [allergies, setAllergies] = useState(initialAllergies);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [customSpecs, setCustomSpecs] = useState<CustomSpecItem[]>(initialSpecs);
  const [photos, setPhotos] = useState<ClientPhotoItem[]>(initialPhotos);

  const [signedWaivers, setSignedWaivers] = useState<any[]>([]);
  const [isWaiverModalOpen, setIsWaiverModalOpen] = useState(false);
  const [isKycVerifiedState, setIsKycVerifiedState] = useState(!!isKycVerified);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const [selectedIndustry, setSelectedIndustry] = useState<'hair' | 'barber' | 'spa' | 'nails' | 'medspa' | 'custom'>('hair');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('hair-formula');
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [isAddingSpec, setIsAddingSpec] = useState(false);

  const activeCategory = useMemo(
    () => INDUSTRY_SPEC_CATEGORIES.find((c) => c.id === selectedIndustry) || INDUSTRY_SPEC_CATEGORIES[0],
    [selectedIndustry]
  );

  const activePreset = useMemo(
    () => activeCategory.presets.find((p) => p.id === selectedPresetId) || activeCategory.presets[0],
    [activeCategory, selectedPresetId]
  );

  const handleSelectIndustry = (catId: 'hair' | 'barber' | 'spa' | 'nails' | 'medspa' | 'custom') => {
    setSelectedIndustry(catId);
    if (catId === 'custom') {
      setNewSpecLabel('');
      setNewSpecValue('');
    } else {
      const cat = INDUSTRY_SPEC_CATEGORIES.find((c) => c.id === catId);
      if (cat && cat.presets.length > 0) {
        setSelectedPresetId(cat.presets[0].id);
        setNewSpecLabel(t(cat.presets[0].labelKey as any));
        setNewSpecValue('');
      }
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = activeCategory.presets.find((x) => x.id === presetId);
    if (p) {
      setNewSpecLabel(t(p.labelKey as any));
    }
  };

  const handleOpenAddSpec = () => {
    if (selectedIndustry !== 'custom' && activePreset) {
      setNewSpecLabel(t(activePreset.labelKey as any));
    }
    setIsAddingSpec(true);
  };

  // Photos State
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoNotes, setPhotoNotes] = useState('');
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<{ url: string; title: string; type: 'before' | 'after' } | null>(null);

  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const parts = splitClientName(clientName);
    setFirstName(parts.first);
    setLastName(parts.last);
    setEmail(clientEmail);
    setPhone(clientPhone);
    setNotes(initialNotes);
    setPreferences(initialPreferences);
    setAllergies(initialAllergies);
    setTags(initialTags || []);
    setCustomSpecs(initialSpecs || []);
    setPhotos(initialPhotos || []);
    setActiveTab('specs');
    setIsAddingSpec(false);
    setIsAddingPhoto(false);
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
    initialPhotos,
  ]);

  if (!mounted) return null;

  const handleAddSpec = async () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    const newSpec: CustomSpecItem = {
      id: `spec-${Date.now()}`,
      label: newSpecLabel.trim(),
      value: newSpecValue.trim(),
      date: new Date().toISOString().split('T')[0],
    };
    const updatedSpecs = [newSpec, ...customSpecs];
    setCustomSpecs(updatedSpecs);
    setNewSpecValue('');
    setIsAddingSpec(false);

    if (clientId) {
      try {
        await fetch('/api/clients', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: clientId,
            customSpecs: updatedSpecs,
          }),
        });
        onClientUpdated?.();
      } catch (err) {
        console.error('Failed to auto-save technical spec:', err);
      }
    }
    addToast(t('savedToProfile'), 'success');
  };

  const handleDeleteSpec = async (specId: string) => {
    const updatedSpecs = customSpecs.filter((s) => s.id !== specId);
    setCustomSpecs(updatedSpecs);
    if (clientId) {
      try {
        await fetch('/api/clients', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: clientId,
            customSpecs: updatedSpecs,
          }),
        });
        onClientUpdated?.();
      } catch (err) {
        console.error('Failed to auto-save technical spec deletion:', err);
      }
    }
    addToast(t('savedToProfile'), 'success');
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

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (type === 'before') setBeforeImage(reader.result);
        else setAfterImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoRecord = async () => {
    if (!beforeImage && !afterImage) {
      addToast(t('uploadBeforeAfterPhoto'), 'error');
      return;
    }
    const newRecord: ClientPhotoItem = {
      id: `photo-${Date.now()}`,
      beforeUrl: beforeImage || undefined,
      afterUrl: afterImage || undefined,
      title: photoTitle.trim() || 'Transformation Session',
      date: photoDate,
      notes: photoNotes.trim() || undefined,
    };
    const updatedPhotos = [newRecord, ...photos];
    setPhotos(updatedPhotos);
    setIsAddingPhoto(false);
    setBeforeImage(null);
    setAfterImage(null);
    setPhotoTitle('');
    setPhotoNotes('');

    if (clientId) {
      try {
        await fetch('/api/clients', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: clientId,
            photos: updatedPhotos,
          }),
        });
        onClientUpdated?.();
      } catch (err) {
        console.error('Failed to auto-save photos:', err);
      }
    }
    addToast(t('savedToProfile'), 'success');
  };

  const handleDeletePhotoRecord = async (id: string) => {
    const updatedPhotos = photos.filter((p) => p.id !== id);
    setPhotos(updatedPhotos);
    if (clientId) {
      try {
        await fetch('/api/clients', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: clientId,
            photos: updatedPhotos,
          }),
        });
        onClientUpdated?.();
      } catch (err) {
        console.error('Failed to auto-save photo deletion:', err);
      }
    }
    addToast(t('savedToProfile'), 'success');
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
          name: displayName,
          email: email.trim() || null,
          phone: phone.trim() || null,
          notes: notes.trim() || null,
          preferences: preferences.trim() || null,
          allergies: allergies.trim() || null,
          tags,
          customSpecs,
          photos,
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
    (a) => a.clientName?.toLowerCase() === displayName.toLowerCase()
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
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
                src={getAvatarUrl(displayName)}
                alt={displayName}
                className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border border-[var(--border-subtle)] shadow-xs flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-extrabold text-[var(--text-primary)] truncate">
                    {displayName}
                  </h3>
                  {tags.includes('VIP') && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)] text-[9px] font-extrabold uppercase tracking-wider">
                      VIP
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                    {totalVisits} {t('visits')}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">·</span>
                  <span className="text-[11px] font-bold text-[var(--text-primary)]">
                    ${(totalSpentCents / 100).toFixed(0)} {t('lifetimeSpend')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="w-9 h-9 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center"
                  title={`Call ${phone}`}
                >
                  <Phone24Regular className="w-4 h-4" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="w-9 h-9 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center"
                  title={`Email ${email}`}
                >
                  <Mail24Regular className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center cursor-pointer"
              >
                <Dismiss24Filled className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unified Design System Segmented Control Tabs */}
          <div className="px-5 md:px-6 pt-4 pb-1 bg-[var(--bg-primary)] flex-shrink-0">
            <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-full">
              {[
                {
                  id: 'specs',
                  label: t('tabSpecs'),
                  icon: Note24Regular,
                  badge: customSpecs.length > 0 ? customSpecs.length : undefined,
                },
                {
                  id: 'photos',
                  label: t('tabPhotos'),
                  icon: Camera24Regular,
                  badge: photos.length > 0 ? photos.length : undefined,
                },
                {
                  id: 'waivers',
                  label: t('tabConsents'),
                  icon: DocumentSignature24Regular,
                  dot: isKycVerifiedState || signedWaivers.length > 0,
                },
                {
                  id: 'contact',
                  label: t('tabProfile'),
                  icon: Person24Regular,
                },
                {
                  id: 'history',
                  label: t('tabHistory'),
                  icon: Calendar24Regular,
                  badge: totalVisits > 0 ? totalVisits : undefined,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-2 rounded-xl text-xs transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold border border-black/5 dark:border-white/10'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] font-semibold'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate text-[10px] sm:text-xs font-bold">{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-[9px] font-mono font-black">
                        {tab.badge}
                      </span>
                    )}
                    {tab.dot && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg-primary)] flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
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
                        {t('specsSub')}
                      </p>
                    </div>
                    {customSpecs.length > 0 && !isAddingSpec && (
                      <button
                        type="button"
                        onClick={handleOpenAddSpec}
                        className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                      >
                        <Add24Filled className="w-3.5 h-3.5" />
                        <span>{t('addCustomSpec')}</span>
                      </button>
                    )}
                  </div>

                  {isAddingSpec && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                      {/* Industry Specialty Pills */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
                          {t('selectProfessionPreset')}
                        </span>
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {INDUSTRY_SPEC_CATEGORIES.map((cat) => {
                            const isSelected = selectedIndustry === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleSelectIndustry(cat.id)}
                                className={`h-8 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                                    : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                              >
                                <span>{t(cat.nameKey as any)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Parameter Selector / Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {selectedIndustry !== 'custom' ? (
                          <CustomSelect
                            label={t('selectPresetField')}
                            value={selectedPresetId}
                            onChange={handleSelectPreset}
                            options={activeCategory.presets.map((p) => ({
                              value: p.id,
                              label: t(p.labelKey as any),
                            }))}
                          />
                        ) : (
                          <FloatingInput
                            label={t('customParamLabel')}
                            value={newSpecLabel}
                            onChange={(e) => setNewSpecLabel(e.target.value)}
                            placeholder="e.g. Blade Setting / Formula"
                          />
                        )}

                        <FloatingInput
                          label={t('customParamValue')}
                          value={newSpecValue}
                          onChange={(e) => setNewSpecValue(e.target.value)}
                          placeholder={
                            selectedIndustry !== 'custom' && activePreset
                              ? t(activePreset.placeholderKey as any)
                              : 'e.g. Redken 09P + 09V'
                          }
                        />
                      </div>

                      {/* Smart Recommendation Chips */}
                      {selectedIndustry !== 'custom' && activePreset?.suggestedValues && activePreset.suggestedValues.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                            <Sparkle24Filled className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">
                              {t('smartSuggestions')}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {activePreset.suggestedValues.map((sug, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setNewSpecValue(sug)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all text-left cursor-pointer border ${
                                  newSpecValue === sug
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-blue-500/50 hover:bg-blue-500/5'
                                }`}
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Form Footer Actions */}
                      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingSpec(false);
                            setNewSpecValue('');
                          }}
                          className="btn-secondary py-2 px-4 text-xs"
                        >
                          {t('cancel')}
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSpec}
                          className="btn-primary py-2 px-4 text-xs"
                        >
                          <Add24Filled className="w-3.5 h-3.5" />
                          <span>{t('addCustomSpec')}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {customSpecs.length > 0 ? (
                    <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-primary)]">
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
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors flex-shrink-0 cursor-pointer"
                            title="Delete Spec"
                          >
                            <Delete24Filled className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={DocumentBulletList24Regular}
                      title={t('noSpecsTitle')}
                      description={t('noSpecsDesc')}
                      action={{
                        label: t('addCustomSpec'),
                        onClick: () => setIsAddingSpec(true),
                        icon: Add24Filled,
                      }}
                      className="min-h-[140px] sm:min-h-[150px] p-5 space-y-2"
                    />
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
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <Add24Filled className="w-3 h-3" />
                      <span>{t('addCustomTag')}</span>
                    </button>
                  </div>

                  {isAddingTag && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        placeholder={t('tagPlaceholder')}
                        className="bg-transparent text-xs font-semibold text-[var(--text-primary)] focus:outline-none w-full px-2"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTag}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                      >
                        {t('add')}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TAG_KEYS.map((tagObj) => {
                      const tagLabel = (t as any)(tagObj.key) || tagObj.defaultLabel;
                      const isSelected = tags.includes(tagLabel) || tags.includes(tagObj.defaultLabel);
                      return (
                        <button
                          key={tagObj.key}
                          type="button"
                          onClick={() => handleToggleTag(tagLabel)}
                          className={`px-3 py-1 rounded-xl text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs font-bold border border-transparent'
                              : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] font-medium'
                          }`}
                        >
                          {tagLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <FloatingInput
                  label={t('preferencesTitle')}
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder={t('preferencesPlaceholder')}
                />

                <FloatingInput
                  label={t('allergiesTitle')}
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder={t('allergiesPlaceholder')}
                />

                <FloatingTextarea
                  label={t('notes')}
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('notesPlaceholder')}
                />
              </div>
            )}

            {/* ─── TAB: BEFORE & AFTER TRANSFORMATION PHOTOS ─── */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                      {t('clientPhotosTitle')}
                    </h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {t('clientPhotosSub')}
                    </p>
                  </div>

                  {photos.length > 0 && !isAddingPhoto && (
                    <button
                      type="button"
                      onClick={() => setIsAddingPhoto(true)}
                      className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
                    >
                      <Camera24Filled className="w-3.5 h-3.5" />
                      <span>{t('addBeforeAfterPhoto')}</span>
                    </button>
                  )}
                </div>

                {/* Add Photo Form Card */}
                {isAddingPhoto && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FloatingInput
                        label={t('transformationTitle')}
                        placeholder={t('transformationTitlePlaceholder')}
                        value={photoTitle}
                        onChange={(e) => setPhotoTitle(e.target.value)}
                      />
                      <FloatingInput
                        label={t('sessionDate')}
                        type="date"
                        value={photoDate}
                        onChange={(e) => setPhotoDate(e.target.value)}
                      />
                    </div>

                    {/* Dual Upload Area (Before & After) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Before Photo Box */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
                          {t('photoBefore')}
                        </span>
                        {beforeImage ? (
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-subtle)] group bg-black/5 dark:bg-white/5">
                            <img src={beforeImage} alt="Before" className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-white font-black text-[9px] backdrop-blur-xs">
                              {t('beforeBadge')}
                            </span>
                            <button
                              type="button"
                              onClick={() => setBeforeImage(null)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <Dismiss24Filled className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-[var(--border-subtle)] hover:border-blue-500/50 bg-[var(--bg-primary)] hover:bg-blue-500/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all p-4 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageFile(e, 'before')}
                            />
                            <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--text-muted)] group-hover:text-blue-500">
                              <Camera24Regular className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[var(--text-primary)]">{t('photoBefore')}</p>
                              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{t('clickToUpload')}</p>
                            </div>
                          </label>
                        )}
                      </div>

                      {/* After Photo Box */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                          {t('photoAfter')}
                        </span>
                        {afterImage ? (
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-blue-500/30 ring-1 ring-blue-500/20 group bg-black/5 dark:bg-white/5">
                            <img src={afterImage} alt="After" className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[9px] shadow-xs">
                              {t('afterBadge')}
                            </span>
                            <button
                              type="button"
                              onClick={() => setAfterImage(null)}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <Dismiss24Filled className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-blue-500/30 hover:border-blue-500 bg-blue-500/5 hover:bg-blue-500/10 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all p-4 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageFile(e, 'after')}
                            />
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                              <Sparkle24Filled className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[var(--text-primary)]">{t('photoAfter')}</p>
                              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{t('clickToUpload')}</p>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>

                    <FloatingTextarea
                      label={t('photoNotes')}
                      rows={2}
                      placeholder={t('photoNotesPlaceholder')}
                      value={photoNotes}
                      onChange={(e) => setPhotoNotes(e.target.value)}
                    />

                    <div className="flex items-center justify-end gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingPhoto(false);
                          setBeforeImage(null);
                          setAfterImage(null);
                          setPhotoTitle('');
                          setPhotoNotes('');
                        }}
                        className="btn-secondary py-2 px-4 text-xs"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="button"
                        onClick={handleAddPhotoRecord}
                        className="btn-primary py-2 px-4 text-xs"
                      >
                        <Camera24Filled className="w-3.5 h-3.5" />
                        <span>{t('addBeforeAfterPhoto')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Empty State vs Photo Comparison Cards */}
                {!isAddingPhoto && (
                  <>
                    {photos.length === 0 ? (
                      <EmptyState
                        icon={Camera24Regular}
                        title={t('noPhotosTitle')}
                        description={t('noPhotosDesc')}
                        action={{
                          label: t('uploadBeforeAfterPhoto'),
                          onClick: () => setIsAddingPhoto(true),
                          icon: Camera24Filled,
                        }}
                        className="min-h-[180px] sm:min-h-[200px] p-6 space-y-2"
                      />
                    ) : (
                      <div className="space-y-4">
                        {photos.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] space-y-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="text-xs font-extrabold text-[var(--text-primary)]">
                                  {item.title || 'Transformation Session'}
                                </h5>
                                {item.date && (
                                  <p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">
                                    {item.date}
                                  </p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeletePhotoRecord(item.id)}
                                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                title={t('deletePhotoConfirm')}
                              >
                                <Delete24Filled className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Dual Side-by-Side Comparison */}
                            <div className="grid grid-cols-2 gap-3">
                              {item.beforeUrl ? (
                                <div
                                  onClick={() => setViewingPhoto({ url: item.beforeUrl!, title: `${item.title || ''} (${t('beforeBadge')})`, type: 'before' })}
                                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--border-subtle)] group cursor-zoom-in bg-black/5 dark:bg-white/5"
                                >
                                  <img src={item.beforeUrl} alt="Before" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-white font-black text-[9px] backdrop-blur-xs">
                                    {t('beforeBadge')}
                                  </span>
                                </div>
                              ) : (
                                <div className="aspect-[4/3] rounded-xl border border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-[var(--text-muted)] text-[10px] font-semibold">
                                  <span>{t('photoBefore')} N/A</span>
                                </div>
                              )}

                              {item.afterUrl ? (
                                <div
                                  onClick={() => setViewingPhoto({ url: item.afterUrl!, title: `${item.title || ''} (${t('afterBadge')})`, type: 'after' })}
                                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-blue-500/40 ring-1 ring-blue-500/20 group cursor-zoom-in bg-black/5 dark:bg-white/5"
                                >
                                  <img src={item.afterUrl} alt="After" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[9px] shadow-xs">
                                    {t('afterBadge')}
                                  </span>
                                </div>
                              ) : (
                                <div className="aspect-[4/3] rounded-xl border border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-[var(--text-muted)] text-[10px] font-semibold">
                                  <span>{t('photoAfter')} N/A</span>
                                </div>
                              )}
                            </div>

                            {item.notes && (
                              <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-[11px] text-[var(--text-secondary)] flex items-start gap-1.5 leading-relaxed">
                                <Note24Regular className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span>{item.notes}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* ─── TAB: ESIGN WAIVERS & COMPLIANCE LOGS ─── */}
            {activeTab === 'waivers' && (
              <div className="space-y-4">
                {/* KYC Biometric Identity Verification Card */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isKycVerifiedState
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                      {isKycVerifiedState ? (
                        <ShieldCheckmark24Filled className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Shield24Filled className="w-5 h-5 text-[#2BB5FF]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-[var(--text-primary)]">
                          {t('kycTitle')}
                        </h5>
                        {isKycVerifiedState ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-extrabold uppercase tracking-wider">
                            {t('idVerified')}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[9px] font-extrabold uppercase tracking-wider">
                            {t('statusPending')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                        {isKycVerifiedState ? t('kycVerifiedSuccess') : t('kycModalDesc')}
                      </p>
                    </div>
                  </div>

                  {!isKycVerifiedState && (
                    <button
                      type="button"
                      onClick={() => setIsKycModalOpen(true)}
                      className="btn-primary py-2 px-3.5 text-xs flex-shrink-0 self-start sm:self-center"
                    >
                      <ShieldCheckmark24Filled className="w-3.5 h-3.5" />
                      <span>{t('verifyIdentity')}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                      {t('complianceLog')}
                    </h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {t('complianceLogSub')}
                    </p>
                  </div>

                  {signedWaivers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsWaiverModalOpen(true)}
                      className="btn-primary py-1.5 px-3 text-xs"
                    >
                      <DocumentSignature24Filled className="w-3.5 h-3.5" />
                      <span>{t('signNewWaiver')}</span>
                    </button>
                  )}
                </div>

                {signedWaivers.length === 0 ? (
                  <EmptyState
                    icon={ShieldCheckmark24Regular}
                    title={t('noSignedWaivers')}
                    description={t('noSignedWaiversSub')}
                    action={{
                      label: t('signWaiver'),
                      onClick: () => setIsWaiverModalOpen(true),
                      icon: DocumentSignature24Filled,
                    }}
                    className="min-h-[180px] sm:min-h-[200px] p-6 space-y-2"
                  />
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
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FloatingInput
                    label={t('firstName')}
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={t('firstNamePlaceholder')}
                  />

                  <FloatingInput
                    label={t('lastName')}
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={t('lastNamePlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FloatingInput
                    label={t('emailAddressLabel')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('clientEmailPlaceholder')}
                  />

                  <FloatingInput
                    label={t('phoneLabel')}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 019-2834"
                  />
                </div>

                {/* Lifetime Metrics Summary Card */}
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] grid grid-cols-2 gap-3 text-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                      {t('totalCompletedVisits')}
                    </p>
                    <p className="text-lg font-black text-[var(--text-primary)] mt-0.5">{totalVisits}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">
                      {t('noShowCounter')}
                    </p>
                    <p className={`text-lg font-black mt-0.5 ${noShowCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {noShowCount}
                    </p>
                  </div>
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
                  <EmptyState
                    icon={Calendar24Regular}
                    title={t('noPastAppointmentsTitle')}
                    description={t('noPastAppointmentsDesc')}
                    className="min-h-[130px] sm:min-h-[140px] p-4 sm:p-5 space-y-1"
                  />
                )}
              </div>
            )}
          </div>

          {/* Side-to-Side Bottom Action Banner (Grouped Actions for Editable Profile & Specs) */}
          {(activeTab === 'specs' || activeTab === 'contact') && !isAddingSpec && (
            <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 md:p-5 flex-shrink-0 z-30 flex flex-col gap-2.5">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveClient}
                className="btn-primary w-full disabled:opacity-50"
              >
                <Save24Filled className="w-4 h-4" />
                <span>{isSaving ? t('saving') : t('save')}</span>
              </button>

              {/* Grouped Secondary / Destructive Action */}
              {activeTab === 'contact' && clientId && (
                <button
                  type="button"
                  onClick={handleDeleteClient}
                  className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    confirmDelete
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                      : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}
                >
                  <Delete24Filled className="w-3.5 h-3.5" />
                  <span>{confirmDelete ? t('confirmDeleteClient') : t('deleteClientRecord')}</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
      )}

      {/* Embedded Digital Waiver Signing Pad */}
      <WaiverPadModal
        isOpen={isWaiverModalOpen}
        onClose={() => setIsWaiverModalOpen(false)}
        clientId={clientId}
        initialClientName={displayName}
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
          clientName={displayName}
          clientEmail={email}
          onVerificationComplete={() => {
            setIsKycVerifiedState(true);
            if (onClientUpdated) {
              onClientUpdated();
            }
          }}
        />
      )}

      {/* Before/After Photo Zoom Lightbox Modal */}
      {viewingPhoto && (
        <div
          onClick={() => setViewingPhoto(null)}
          className="fixed inset-0 z-[400] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] bg-[var(--bg-primary)] rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-2 flex flex-col"
          >
            <div className="p-3 flex items-center justify-between">
              <p className="text-xs font-bold text-[var(--text-primary)]">{viewingPhoto.title}</p>
              <button
                type="button"
                onClick={() => setViewingPhoto(null)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer"
              >
                <Dismiss24Filled className="w-4 h-4" />
              </button>
            </div>
            <img
              src={viewingPhoto.url}
              alt="Zoomed preview"
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
