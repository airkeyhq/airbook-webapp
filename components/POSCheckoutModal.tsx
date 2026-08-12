'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Payment24Filled, CheckmarkCircle24Regular, Dismiss24Filled } from '@fluentui/react-icons';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface POSCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  clientName?: string;
  serviceName?: string;
  totalPrice?: number;
  staffName?: string;
  commissionPercent?: number;
}

export const POSCheckoutModal: React.FC<POSCheckoutModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  clientName = 'Mikael from Amie',
  serviceName = 'Haircut & Precision Styling',
  totalPrice = 75,
  staffName = 'Eduardo Moreno',
  commissionPercent = 70,
}) => {
  const { t } = useTranslation();
  const [tipPercent, setTipPercent] = useState<number>(20);
  const [customTip, setCustomTip] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'stripe_terminal' | 'stripe_card' | 'cash'>('stripe_terminal');

  if (!isOpen) return null;

  const tipAmount = customTip ? Number(customTip) || 0 : Math.round((totalPrice * tipPercent) / 100);
  const finalTotal = totalPrice + tipAmount;

  // Revenue Split Calculation
  const staffEarnings = Math.round((totalPrice * commissionPercent) / 100) + tipAmount;
  const shopCut = finalTotal - staffEarnings;

  const handlePay = async () => {
    try {
      setSubmitting(true);
      await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: '00000000-0000-0000-0000-000000000001',
          clientId: '00000000-0000-0000-0000-000000000004',
          appointmentId: appointmentId || undefined,
          totalCents: Math.round(finalTotal * 100),
          paymentMethod: paymentMethod,
        }),
      });

      setIsCompleted(true);
      setTimeout(() => {
        setIsCompleted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('POS Checkout error:', err);
    } finally {
      setSubmitting(false);
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
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* POS Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="relative w-full max-w-md glass-panel rounded-[36px] p-6 shadow-2xl bg-white/95 dark:bg-gray-900/95 border border-white/80 dark:border-white/10 z-10 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400"
          >
            <Dismiss24Filled className="w-5 h-5" />
          </button>

          {isCompleted ? (
            <div className="py-8 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <CheckmarkCircle24Regular className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Payment Successful!</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                ${finalTotal} charged via {paymentMethod === 'cash' ? 'Cash' : 'Stripe'}. ${staffEarnings} deposited to {staffName.split(' ')[0]}'s balance.
              </p>
            </div>
          ) : (
            <div className="stack-md">
              {/* Header */}
              <div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  AirBook POS Terminal
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-1">
                  Checkout: {clientName}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {serviceName} with {staffName}
                </p>
              </div>

              {/* Bill Breakout */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Subtotal:</span>
                  <span className="font-bold text-[var(--text-primary)]">${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Tip:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">+${tipAmount}</span>
                </div>
                <div className="border-t border-black/10 dark:border-white/10 pt-2 flex justify-between font-extrabold text-sm">
                  <span>Total Due:</span>
                  <span>${finalTotal}</span>
                </div>
              </div>

              {/* Stripe Payment Method Selection */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 block">
                  {t('stripePaymentMethod')}
                </label>
                <div className="stack-sm">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe_terminal')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'stripe_terminal'
                        ? 'border-[#2BB5FF] bg-[#2BB5FF]/10 text-[var(--text-primary)] shadow-sm'
                        : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t('stripeTapToPay')}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-500">Stripe Terminal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe_card')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'stripe_card'
                        ? 'border-[#2BB5FF] bg-[#2BB5FF]/10 text-[var(--text-primary)] shadow-sm'
                        : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                    }`}
                  >
                    <span>{t('stripeCreditCard')}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">Card / Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)] shadow-sm'
                        : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                    }`}
                  >
                    <span>{t('cashPayment')}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-500">Manual</span>
                  </button>
                </div>
              </div>

              {/* Tip Selection */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 block">
                  Select Tip Amount for {staffName.split(' ')[0]}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 25, 30].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => {
                        setTipPercent(pct);
                        setCustomTip('');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        tipPercent === pct && !customTip
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-primary)] hover:bg-black/10'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Powered by Stripe Trust Footer */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[var(--text-muted)] py-1">
                <svg className="w-3.5 h-3.5 fill-[#635BFF]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.752.709 15.064 0 12.203 0 6.64 0 2.87 2.898 2.87 7.426c0 5.485 7.452 5.753 7.452 8.718 0 1.056-.913 1.542-2.227 1.542-2.31 0-5.347-1.077-7.234-2.164l-.942 5.707C2.08 22.427 5.099 23.36 8.351 23.36c6.035 0 9.873-2.909 9.873-7.592 0-5.787-7.502-6.196-7.502-8.913 0-.75.602-1.222 1.654-1.222 1.488 0 3.328.513 4.6 1.258l1.000-5.741z" />
                </svg>
                <span>{t('poweredByStripe')}</span>
              </div>

              {/* Pay Button (control-lg token) */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={submitting}
                onClick={handlePay}
                className="control-lg w-full rounded-2xl btn-primary flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Payment24Filled className="w-4 h-4" />
                <span>{submitting ? 'Processing…' : `Process Payment ($${finalTotal})`}</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
