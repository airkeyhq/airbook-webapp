'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { EmptyState } from '@/components/EmptyState';
import {
  Add24Filled,
  Dismiss24Filled,
  Person24Regular,
  Mail24Regular,
  Phone24Regular,
  ChevronRight24Regular,
  Search24Regular,
  Tag24Regular,
  Note24Regular,
  People24Regular,
  Money24Regular,
  Sparkle24Regular,
  ShieldCheckmark24Filled,
} from '@fluentui/react-icons';
import { getAvatarUrl } from '@/lib/avatars';
import { ClientNotesModal, CustomSpecItem } from '@/components/ClientNotesModal';

interface ClientItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  totalVisits: number;
  totalSpentCents: number;
  walletBalanceCents?: number;
  noShowCount?: number;
  notes?: string;
  preferences?: string;
  allergies?: string;
  tags?: string[];
  customSpecs?: CustomSpecItem[];
  isKycVerified?: boolean;
}

export const ClientsModule: React.FC = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);

  // Search & Tag Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Form State for Add Client Modal
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [preferences, setPreferences] = useState('');
  const [allergies, setAllergies] = useState('');
  const [initialTag, setInitialTag] = useState('VIP');
  const [submitting, setSubmitting] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (data.success && Array.isArray(data.clients)) {
        setClients(data.clients);
      }
    } catch (err) {
      console.warn('Failed to load clients from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Compute Unique Tags from Clients
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    clients.forEach((c) => (c.tags || []).forEach((tag) => set.add(tag)));
    return ['All', ...Array.from(set)];
  }, [clients]);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone?.includes(searchQuery) ||
        (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.preferences && c.preferences.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = selectedTag === 'All' || (c.tags && c.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [clients, searchQuery, selectedTag]);

  // Aggregate Stats
  const totalClientsCount = clients.length;
  const totalLifetimeRevenue = clients.reduce((acc, c) => acc + (c.totalSpentCents || 0), 0) / 100;
  const avgSpendPerClient = totalClientsCount > 0 ? totalLifetimeRevenue / totalClientsCount : 0;
  const vipCount = clients.filter((c) => (c.tags || []).includes('VIP') || (c.tags || []).includes('VIP Elite')).length;

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          notes: notes.trim() || undefined,
          preferences: preferences.trim() || undefined,
          allergies: allergies.trim() || undefined,
          tags: initialTag ? [initialTag] : [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
        setPreferences('');
        setAllergies('');
        fetchClients();
      }
    } catch (err) {
      console.error('Failed to create client:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('clientsTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t('clientsDesc')}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          <Add24Filled className="w-4 h-4" />
          <span>{t('addClient')}</span>
        </motion.button>
      </div>

      {/* Quick Metrics Header Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <People24Regular className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('metricTotalClients')}</span>
          </div>
          <p className="text-lg font-black text-[var(--text-primary)]">{totalClientsCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Sparkle24Regular className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('metricVipMembers')}</span>
          </div>
          <p className="text-lg font-black text-amber-600 dark:text-amber-400">{vipCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Money24Regular className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('metricTotalRevenue')}</span>
          </div>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">${totalLifetimeRevenue.toFixed(0)}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Tag24Regular className="w-4 h-4 text-purple-500" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t('metricAvgLifetimeValue')}</span>
          </div>
          <p className="text-lg font-black text-purple-600 dark:text-purple-400">${avgSpendPerClient.toFixed(0)}</p>
        </div>
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm">
          <Search24Regular className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchClientsPlaceholder')}
            className="bg-transparent text-xs font-semibold text-[var(--text-primary)] focus:outline-none w-full placeholder:text-[var(--text-secondary)]/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <Dismiss24Filled className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tag Filter Chips */}
        {allUniqueTags.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-[var(--text-secondary)] mr-1 flex-shrink-0">
              {t('filterByTag')}
            </span>
            {allUniqueTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between gap-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-3.5 w-full">
                <div className="w-12 h-12 rounded-2xl bg-black/10 dark:bg-white/10 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-36 rounded-lg bg-black/10 dark:bg-white/10" />
                  <div className="h-3 w-48 rounded-lg bg-black/5 dark:bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Structured Interactive Clients List */}
      {!loading && (
        <>
          {filteredClients.length === 0 ? (
            <EmptyState
              icon={Person24Regular}
              title={t('noClients')}
              description={t('noClientsSub')}
            />
          ) : (
            <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden bg-[var(--bg-primary)] shadow-sm">
              {filteredClients.map((cli) => {
                const avatarSrc = cli.avatarUrl || getAvatarUrl(cli.name);
                const specsCount = (cli.customSpecs || []).length;
                return (
                  <div
                    key={cli.id}
                    onClick={() => setSelectedClient(cli)}
                    className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <img
                        src={avatarSrc}
                        alt={cli.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-[var(--border-subtle)] shadow-sm group-hover:scale-105 transition-transform duration-100 ease-out flex-shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                            {cli.name}
                          </h3>

                          {(cli.tags || []).slice(0, 2).map((tVal) => (
                            <span
                              key={tVal}
                              className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold"
                            >
                              {tVal}
                            </span>
                          ))}

                          {specsCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold flex items-center gap-1">
                              <Note24Regular className="w-3 h-3" />
                              <span>{specsCount} {t('specs')}</span>
                            </span>
                          )}

                          {cli.isKycVerified && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                              <ShieldCheckmark24Filled className="w-3 h-3 text-emerald-500" />
                              <span>{t('idVerified')}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] flex flex-wrap items-center gap-x-3 gap-y-1">
                          {cli.email && (
                            <span className="flex items-center gap-1 truncate">
                              <Mail24Regular className="w-3 h-3 opacity-70" />
                              {cli.email}
                            </span>
                          )}
                          {cli.phone && (
                            <span className="flex items-center gap-1 truncate">
                              <Phone24Regular className="w-3 h-3 opacity-70" />
                              {cli.phone}
                            </span>
                          )}
                        </p>

                        {/* Quick Preferences Preview */}
                        {cli.preferences && (
                          <p className="text-[11px] text-[var(--text-secondary)] italic truncate max-w-md">
                            &quot;{cli.preferences}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          ${((cli.totalSpentCents || 0) / 100).toFixed(0)}
                        </p>
                        <p className="text-[10px] font-semibold text-[var(--text-secondary)]">
                          {cli.totalVisits} {t('visits')}
                        </p>
                      </div>

                      <ChevronRight24Regular className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Client Profile & Technical Specs Drawer */}
      <ClientNotesModal
        isOpen={!!selectedClient}
        onClose={() => {
          setSelectedClient(null);
          fetchClients();
        }}
        clientId={selectedClient?.id}
        clientName={selectedClient?.name}
        clientEmail={selectedClient?.email}
        clientPhone={selectedClient?.phone}
        totalVisits={selectedClient?.totalVisits}
        totalSpentCents={selectedClient?.totalSpentCents}
        walletBalanceCents={selectedClient?.walletBalanceCents}
        noShowCount={selectedClient?.noShowCount}
        initialNotes={selectedClient?.notes || ''}
        preferences={selectedClient?.preferences || ''}
        allergies={selectedClient?.allergies || ''}
        tags={selectedClient?.tags || []}
        customSpecs={selectedClient?.customSpecs || []}
        isKycVerified={selectedClient?.isKycVerified}
        onClientUpdated={fetchClients}
      />

      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
            >
              <form onSubmit={handleAddClient} className="flex flex-col h-full min-h-0 overflow-hidden">
                {/* Mobile Drag Handle */}
                <div className="w-full pt-3 pb-1 flex sm:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                </div>

                {/* Header Edge-to-Edge Bar */}
                <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)]">
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('addClient')}</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
                  >
                    <Dismiss24Filled className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

                {/* Form Body */}
                <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      {t('fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                        {t('phoneNumber')}
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

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      {t('preferencesTitle')}
                    </label>
                    <input
                      type="text"
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      placeholder="e.g. Early morning slots, sparkling water, quiet session"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      {t('notes')}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Initial consultation notes, service goals, technical specs..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Side-to-Side Bottom Action Banner */}
                <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 flex-shrink-0 z-30">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>{submitting ? t('saving') : t('saveClient')}</span>
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

