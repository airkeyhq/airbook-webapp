'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Add24Filled, Phone24Regular, Clock24Regular } from '@fluentui/react-icons';

export const WalkInKioskModule: React.FC = () => {
  const { t } = useTranslation();
  const [queue, setQueue] = useState<Array<{
    id: string;
    name: string;
    service: string;
    barber: string;
    estWaitMins: number;
    status: string;
  }>>([]);

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');

  const fetchWaitlist = async () => {
    try {
      const res = await fetch('/api/waitlists');
      const data = await res.json();
      if (data.success && Array.isArray(data.waitlists)) {
        const mapped = data.waitlists.map((w: any, idx: number) => ({
          id: w.id,
          name: w.clientName,
          service: w.serviceName || 'Walk-in Haircut',
          barber: 'First Available',
          estWaitMins: (idx + 1) * 15,
          status: w.status === 'booked' ? 'In Chair' : 'Waiting',
        }));
        setQueue(mapped);
      }
    } catch (err) {
      console.warn('Failed to load waitlist from DB:', err);
    }
  };

  React.useEffect(() => {
    fetchWaitlist();
  }, []);

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const newName = clientName.trim();
    const newPhone = phone.trim();

    setQueue((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        name: newName,
        service: 'Walk-in Haircut',
        barber: 'First Available',
        estWaitMins: (prev.length + 1) * 12,
        status: 'Waiting',
      },
    ]);
    setClientName('');
    setPhone('');

    try {
      await fetch('/api/waitlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: newName,
          clientPhone: newPhone || undefined,
        }),
      });
      fetchWaitlist();
    } catch (err) {
      console.error('Failed to save walk-in to DB:', err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('kioskTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t('kioskDesc')}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold border border-green-500/20 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>{t('kioskActive')}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Check-in Form */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            <Phone24Regular className="w-4 h-4 text-blue-500" />
            <span>{t('walkInCheckIn')}</span>
          </h3>

          <form onSubmit={handleAddWalkIn} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                Client Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                Mobile Phone for SMS Alert
              </label>
              <input
                type="tel"
                placeholder="(555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md flex items-center justify-center gap-1.5"
            >
              <Add24Filled className="w-4 h-4" />
              <span>Add to Waitlist Queue</span>
            </motion.button>
          </form>
        </div>

        {/* Right: Live Waitlist Queue */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
            Active Shop Queue ({queue.length} Clients Waiting)
          </h3>

          {queue.length === 0 ? (
            <div className="min-h-[260px] p-8 rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-center space-y-2">
              <Clock24Regular className="w-8 h-8 text-[var(--text-muted)] mx-auto opacity-50" />
              <p className="text-xs font-bold text-[var(--text-secondary)]">No clients currently in queue</p>
              <p className="text-[11px] text-[var(--text-muted)]">Check in walk-in clients using the form to add them to the queue.</p>
            </div>
          ) : (
            queue.map((item, index) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.005 }}
                className="p-4 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center font-mono font-bold text-xs">
                    #{index + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">{item.name}</h4>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      {item.service} • Assigned to: <strong className="text-[var(--text-primary)]">{item.barber}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1">
                    <Clock24Regular className="w-3.5 h-3.5 text-blue-500" />
                    <span>~{item.estWaitMins}m wait</span>
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'In Chair'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
