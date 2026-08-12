'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Add24Filled, Dismiss24Filled, Clock24Regular, Money24Regular, Tag24Regular, Cut24Regular } from '@fluentui/react-icons';

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceCents: number;
  depositCents?: number;
  colorTag?: string;
  isActive?: boolean;
}

export const ServicesModule: React.FC = () => {
  const { t } = useTranslation();
  const [serviceList, setServiceList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hair');
  const [price, setPrice] = useState('75');
  const [duration, setDuration] = useState('45');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServiceList(data.services);
      }
    } catch (err) {
      console.warn('Failed to load services from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category: category.trim() || 'General',
          durationMinutes: Number(duration) || 45,
          priceCents: Math.round((Number(price) || 75) * 100),
          depositCents: Math.round((Number(price) || 75) * 20),
          colorTag: '#00C7BE',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setName('');
        setShowForm(false);
        fetchServices();
      }
    } catch (err) {
      console.error('Failed to create service:', err);
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
            {t('servicesTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t('servicesDesc')}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md hover:opacity-90 transition-opacity"
        >
          <Add24Filled className="w-4 h-4" />
          <span>{t('addService')}</span>
        </motion.button>
      </div>

      {/* Quick Service Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddService}
          className="p-5 rounded-3xl glass-panel bg-white/80 dark:bg-gray-900/80 border border-white/80 dark:border-white/10 space-y-3 shadow-md"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            {t('addService')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder={t('serviceName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
            />
            <input
              type="text"
              placeholder={t('category')}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
            />
            <input
              type="number"
              placeholder={t('priceDollars')}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
            />
            <input
              type="number"
              placeholder={t('durationMins')}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold text-[var(--text-secondary)]"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md disabled:opacity-50"
            >
              {submitting ? t('saving') : t('saveService')}
            </button>
          </div>
        </motion.form>
      )}

      {loading && (
        <div className="p-8 text-center text-xs text-[var(--text-muted)] animate-pulse">
          ...
        </div>
      )}

      {/* Services Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceList.length === 0 ? (
            <div className="col-span-3 p-8 rounded-3xl border border-dashed border-[var(--border-subtle)] text-center">
              <Cut24Regular className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[var(--text-secondary)]">{t('noServices')}</p>
            </div>
          ) : (
            serviceList.map((srv) => {
              const priceDollars = (srv.priceCents || 0) / 100;
              const depositDollars = srv.depositCents ? srv.depositCents / 100 : Math.round(priceDollars * 0.2);

              return (
                <motion.div
                  key={srv.id}
                  whileHover={{ y: -2 }}
                  className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                        style={{ backgroundColor: srv.colorTag || '#00C7BE' }}
                      >
                        {srv.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-[var(--text-muted)] flex items-center gap-1">
                        <Clock24Regular className="w-3 h-3" />
                        {srv.durationMinutes} mins
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{srv.name}</h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-3">
                    <div>
                      <span className="text-xs text-[var(--text-secondary)]">Price: </span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">${priceDollars}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-green-600 dark:text-green-400 font-semibold">
                        Deposit (${depositDollars})
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
