'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { EmptyState } from './EmptyState';
import { FloatingInput } from './FloatingInput';
import { useAirBookStore } from '@/lib/store';
import { Add24Filled, Dismiss24Filled, Save24Filled, Clock24Regular, Money24Regular, Tag24Regular, Sparkle24Filled } from '@fluentui/react-icons';

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

  // Smart Dynamic Pricing State
  const [peakPricingEnabled, setPeakPricingEnabled] = useState(true);
  const [weekendSurgePercent, setWeekendSurgePercent] = useState('15');
  const [offPeakDiscountPercent, setOffPeakDiscountPercent] = useState('10');

  const isDemoMode = useAirBookStore((s) => s.isDemoMode);
  const demoServices = useAirBookStore((s) => s.services);

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
    if (isDemoMode) {
      setServiceList(demoServices as any);
    } else {
      fetchServices();
    }
  }, [isDemoMode, demoServices]);

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
          className="btn-primary self-start sm:self-auto"
        >
          <Add24Filled className="w-4 h-4" />
          <span>{t('addService')}</span>
        </motion.button>
      </div>

      {/* Smart Dynamic Pricing Control Card - Roadmap Teaser */}
      <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Money24Regular className="w-5 h-5 text-[var(--text-secondary)]" />
            <div>
              <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                {t('smartDynamicPricingTitle')}
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {t('smartDynamicPricingDesc')}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] text-[10px] font-mono font-extrabold uppercase whitespace-nowrap">
            {t('comingSoonV11')}
          </span>
        </div>
      </div>
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddService}
          className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3.5 shadow-sm"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
            {t('addService')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FloatingInput
              label={t('serviceName')}
              required
              placeholder={t('serviceName')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FloatingInput
              label={t('category')}
              placeholder={t('category')}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <FloatingInput
              label={t('priceDollars')}
              type="number"
              placeholder={t('priceDollars')}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <FloatingInput
              label={t('durationMins')}
              type="number"
              placeholder={t('durationMins')}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
            >
              <Save24Filled className="w-4 h-4" />
              <span>{submitting ? t('saving') : t('save')}</span>
            </button>
          </div>
        </motion.form>
      )}

      {/* Catalog Section: Services List / Empty State */}
      <div className="space-y-3.5">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-4 shadow-xs animate-pulse"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 w-16 rounded-full bg-black/10 dark:bg-white/10" />
                    <div className="h-4 w-12 rounded-lg bg-black/10 dark:bg-white/10" />
                  </div>
                  <div className="h-4 w-4/5 rounded-lg bg-black/10 dark:bg-white/10 mb-2" />
                  <div className="h-3 w-full rounded-md bg-black/5 dark:bg-white/5" />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                  <div className="h-3 w-20 rounded-md bg-black/5 dark:bg-white/5" />
                  <div className="h-3 w-16 rounded-md bg-black/5 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && serviceList.length === 0 && (
          <EmptyState
            icon={Tag24Regular}
            title={t('noServices')}
            description={t('noServicesSub')}
            action={{
              label: t('addService'),
              onClick: () => setShowForm(true),
              icon: Add24Filled,
            }}
          />
        )}

        {!loading && serviceList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {serviceList.map((srv) => {
              const priceDollars = (srv.priceCents || 0) / 100;
              const depositDollars = srv.depositCents ? srv.depositCents / 100 : Math.round(priceDollars * 0.2);

              return (
                <motion.div
                  key={srv.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                  className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-4 shadow-xs transition-all duration-100 ease-out"
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
                        {srv.durationMinutes} {t('minsSuffix')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{srv.name}</h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-3">
                    <div>
                      <span className="text-xs text-[var(--text-secondary)]">{t('priceLabel')}: </span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">${priceDollars}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-green-600 dark:text-green-400 font-semibold">
                        {t('depositLabel')} (${depositDollars})
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
