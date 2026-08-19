'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Payment24Filled, CheckmarkCircle24Filled, Dismiss24Filled, Print24Filled } from '@fluentui/react-icons';
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
  clientName = 'Client',
  serviceName = 'Service',
  totalPrice = 0,
  staffName = 'Staff Specialist',
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
      <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* POS Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
        >
          {/* Mobile Drag Handle */}
          <div className="w-full pt-3 pb-1 flex sm:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Header Edge-to-Edge Bar */}
          <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)]">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                AirBook POS Terminal
              </span>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
                {isCompleted ? 'Payment Successful' : `Checkout: ${clientName}`}
              </h3>
              {!isCompleted && (
                <p className="text-xs font-bold text-[var(--text-secondary)] mt-0.5">
                  {serviceName} with {staffName}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors"
            >
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {isCompleted ? (
              <div className="py-6 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <CheckmarkCircle24Filled className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Payment Successful!</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  ${finalTotal} charged via {paymentMethod === 'cash' ? 'Cash' : 'Stripe'}. ${staffEarnings} allocated to {staffName.split(' ')[0]}.
                </p>
              </div>

              {/* Action Buttons: Print Thermal Receipt & Close */}
              <div className="flex flex-col gap-2.5 w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const printWin = window.open('', '_blank', 'width=400,height=600');
                    if (printWin) {
                      printWin.document.write(`
                        <html>
                          <head>
                            <title>Receipt - ${clientName}</title>
                            <style>
                              body { font-family: monospace; padding: 20px; text-align: center; width: 280px; margin: auto; }
                              .divider { border-top: 1px dashed #000; margin: 10px 0; }
                              .flex { display: flex; justify-content: space-between; font-size: 12px; }
                              .bold { font-weight: bold; }
                              .title { font-size: 16px; font-weight: bold; }
                            </style>
                          </head>
                          <body>
                            <div class="title">AIRBOOK POS</div>
                            <div>RECEIPT #${Date.now().toString().slice(-6)}</div>
                            <div>${new Date().toLocaleString()}</div>
                            <div class="divider"></div>
                            <div class="flex"><span>CLIENT:</span><span>${clientName}</span></div>
                            <div class="flex"><span>STAFF:</span><span>${staffName}</span></div>
                            <div class="divider"></div>
                            <div class="flex"><span>${serviceName}</span><span>$${totalPrice}</span></div>
                            <div class="flex"><span>TIP</span><span>$${tipAmount}</span></div>
                            <div class="divider"></div>
                            <div class="flex bold" style="font-size: 14px;"><span>TOTAL PAID</span><span>$${finalTotal}</span></div>
                            <div class="flex"><span>METHOD</span><span>${paymentMethod.toUpperCase()}</span></div>
                            <div class="divider"></div>
                            <div style="font-size: 10px; margin-top: 15px;">THANK YOU FOR YOUR VISIT!</div>
                          </body>
                        </html>
                      `);
                      printWin.document.close();
                      printWin.focus();
                      printWin.print();
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <Print24Filled className="w-4 h-4" />
                  <span>Print Thermal Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-bold text-[var(--text-primary)]"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">

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
            </div>
          )}
        </div>

          {/* Side-to-Side Bottom Action Banner (Only when not completed) */}
          {!isCompleted && (
            <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30">
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={submitting}
                onClick={handlePay}
                className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
