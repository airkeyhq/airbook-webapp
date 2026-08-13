'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Add24Filled, Dismiss24Filled, Person24Regular, Comment24Regular, Mail24Regular, Phone24Regular } from '@fluentui/react-icons';
import { getAvatarUrl } from '@/lib/avatars';
import { ClientNotesModal } from '@/components/ClientNotesModal';

interface ClientItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  totalVisits: number;
  noShowCount?: number;
  notes?: string;
}

export const ClientsModule: React.FC = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
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
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
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
      <div className="flex items-center justify-between">
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
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md hover:opacity-90 transition-opacity"
        >
          <Add24Filled className="w-4 h-4" />
          <span>{t('addClient')}</span>
        </motion.button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 flex items-center justify-between gap-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-3.5 w-full">
                <div className="w-10 h-10 rounded-2xl bg-black/10 dark:bg-white/10 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-36 rounded-lg bg-black/10 dark:bg-white/10" />
                  <div className="h-3 w-48 rounded-lg bg-black/5 dark:bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clients List */}
      {!loading && (
        <div className="space-y-3">
          {clients.length === 0 ? (
            <div className="min-h-[380px] sm:min-h-[480px] p-8 sm:p-12 rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-center">
              <Person24Regular className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-sm font-bold text-[var(--text-secondary)]">{t('noClients')}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{t('noClientsSub')}</p>
            </div>
          ) : (
            clients.map((cli) => {
              const avatarSrc = getAvatarUrl(cli.name);
              return (
                <motion.div
                  key={cli.id}
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                  onClick={() => setSelectedClient(cli)}
                  className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-blue-500/40 hover:shadow-md cursor-pointer transition-all duration-100 ease-out group"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={avatarSrc}
                      alt={cli.name}
                      className="w-11 h-11 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-100 ease-out flex-shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span>{cli.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                          {cli.totalVisits} {t('visits')}
                        </span>
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-2">
                        {cli.email && <span className="flex items-center gap-1"><Mail24Regular className="w-3 h-3" />{cli.email}</span>}
                        {cli.phone && <span className="flex items-center gap-1"><Phone24Regular className="w-3 h-3" />{cli.phone}</span>}
                      </p>

                      {/* Preference Notes */}
                      {cli.notes && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-xl">
                          <Comment24Regular className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                          <span className="truncate italic">"{cli.notes}"</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {t('noShows')}: <strong className={(cli.noShowCount || 0) > 0 ? 'text-red-500' : 'text-green-500'}>{cli.noShowCount || 0}</strong>
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Client Profile & Technical Specs Modal */}
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
        noShowCount={selectedClient?.noShowCount}
        initialNotes={selectedClient?.notes || ''}
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
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors">
                    <Dismiss24Filled className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

                {/* Form Body */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('fullName')} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 019-2834"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('notes')}</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Prefers low fade, sensitive skin, morning visits"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                </div>

                {/* Side-to-Side Bottom Action Banner */}
                <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
