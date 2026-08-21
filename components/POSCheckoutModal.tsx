'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Payment24Filled,
  CheckmarkCircle24Filled,
  Dismiss24Filled,
  Print24Filled,
  Mail24Filled,
  Money24Filled,
  Receipt24Regular,
  Person24Regular,
  Sparkle24Filled,
  Sparkle24Regular,
} from '@fluentui/react-icons';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { useAirBookStore } from '@/lib/store';

interface POSCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  serviceName?: string;
  totalPrice?: number;
  depositPaid?: number;
  staffName?: string;
  commissionPercent?: number;
  onCheckoutComplete?: (invoice: any) => void;
}

export const POSCheckoutModal: React.FC<POSCheckoutModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  clientId,
  clientName = 'Walk-in Client',
  clientEmail = '',
  serviceName = 'Service',
  totalPrice = 0,
  depositPaid = 0,
  staffName = 'Staff Specialist',
  commissionPercent = 70,
  onCheckoutComplete,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { updateAppointmentStatus } = useAirBookStore();

  // Dynamic Cart State
  const [editablePrice, setEditablePrice] = useState<number>(totalPrice);
  const [editableClientName, setEditableClientName] = useState<string>(clientName);
  const [editableEmail, setEditableEmail] = useState<string>(clientEmail);

  // Tip State
  const [tipPercent, setTipPercent] = useState<number>(20);
  const [customTip, setCustomTip] = useState<string>('');

  // Tender & Cash Math
  const [paymentMethod, setPaymentMethod] = useState<'stripe_terminal' | 'stripe_card' | 'cash' | 'split' | 'gift_card'>('stripe_terminal');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [splitCardAmount, setSplitCardAmount] = useState<string>('');

  // Processing & Completed State
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedReceiptNumber, setCompletedReceiptNumber] = useState<string>('');
  const [emailSent, setEmailSent] = useState(false);

  // Retail Products in Cart
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [cartProducts, setCartProducts] = useState<{ id: string; name: string; retailPriceCents: number; qty: number }[]>([]);
  const [showProductPicker, setShowProductPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.products)) {
            setCatalogProducts(data.products.filter((p: any) => p.isRetail && p.stockQuantity > 0));
          }
        })
        .catch((err) => console.warn('Failed to load products for POS:', err));
    }
  }, [isOpen]);

  useEffect(() => {
    setEditablePrice(totalPrice > 0 ? totalPrice : 50);
    setEditableClientName(clientName);
    setEditableEmail(clientEmail);
    setTipPercent(20);
    setCustomTip('');
    setCashTendered('');
    setSplitCardAmount('');
    setCartProducts([]);
    setShowProductPicker(false);
    setIsCompleted(false);
    setEmailSent(false);
    setCompletedReceiptNumber('');
  }, [totalPrice, clientName, clientEmail, isOpen]);

  if (!isOpen) return null;

  // Math Calculations
  const retailItemsTotal = cartProducts.reduce((acc, p) => acc + (p.retailPriceCents * p.qty) / 100, 0);
  const subtotal = (Number(editablePrice) || 0) + retailItemsTotal;
  const depositCredit = Number(depositPaid) || 0;
  const taxableSubtotal = Math.max(0, subtotal - depositCredit);
  const estimatedTax = Math.round(taxableSubtotal * 0.0825 * 100) / 100; // 8.25% standard

  const tipAmount = customTip !== ''
    ? Math.max(0, Number(customTip) || 0)
    : tipPercent > 0
    ? Math.round(((subtotal * tipPercent) / 100) * 100) / 100
    : 0;

  const finalTotal = Math.max(0, Math.round((taxableSubtotal + estimatedTax + tipAmount) * 100) / 100);

  // Cash Change Math
  const cashGiven = Number(cashTendered) || 0;
  const changeDue = Math.max(0, Math.round((cashGiven - finalTotal) * 100) / 100);

  // Staff Commission Calculation
  const staffEarnings = Math.round(((subtotal * commissionPercent) / 100 + tipAmount) * 100) / 100;
  const shopCut = Math.max(0, Math.round((finalTotal - staffEarnings) * 100) / 100);

  const handleProcessPayment = async () => {
    try {
      setSubmitting(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointmentId || undefined,
          clientId: clientId || undefined,
          clientName: editableClientName.trim() || undefined,
          items: [
            { name: serviceName, priceCents: Math.round((Number(editablePrice) || 0) * 100), quantity: 1 },
            ...cartProducts.map((p) => ({ productId: p.id, name: p.name, priceCents: p.retailPriceCents, quantity: p.qty })),
          ],
          subtotalCents: Math.round(subtotal * 100),
          tipCents: Math.round(tipAmount * 100),
          taxCents: Math.round(estimatedTax * 100),
          discountCents: Math.round(depositCredit * 100),
          totalCents: Math.round(finalTotal * 100),
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompletedReceiptNumber(data.receiptNumber || `REC-${Date.now().toString(36).toUpperCase()}`);
        setIsCompleted(true);
        if (appointmentId) {
          updateAppointmentStatus(appointmentId, 'completed');
        }
        addToast(t('paymentSuccessTitle'), 'success');
        onCheckoutComplete?.(data.invoice);
      } else {
        addToast(data.error || 'Payment failed.', 'error');
      }
    } catch (err: any) {
      console.error('POS Checkout error:', err);
      addToast('Network error during checkout.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    const printWin = window.open('', '_blank', 'width=420,height=650');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - ${completedReceiptNumber || 'AirBook POS'}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Courier New", monospace; padding: 24px; text-align: center; width: 300px; margin: auto; color: #111; }
              .logo { font-size: 18px; font-weight: 900; letter-spacing: -0.5px; }
              .sub { font-size: 11px; color: #666; margin-top: 2px; }
              .divider { border-top: 1px dashed #ccc; margin: 12px 0; }
              .row { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
              .bold { font-weight: 800; font-size: 14px; }
              .highlight { color: #007AFF; }
              .footer { font-size: 10px; color: #888; margin-top: 18px; }
            </style>
          </head>
          <body>
            <div class="logo">AIRBOOK POS</div>
            <div class="sub">RECEIPT #${completedReceiptNumber || Date.now().toString().slice(-6)}</div>
            <div class="sub">${new Date().toLocaleString()}</div>
            <div class="divider"></div>
            <div class="row"><span>CLIENT:</span><strong>${editableClientName}</strong></div>
            <div class="row"><span>SPECIALIST:</span><span>${staffName}</span></div>
            <div class="divider"></div>
            <div class="row"><span>${serviceName}</span><span>$${subtotal.toFixed(2)}</span></div>
            ${depositCredit > 0 ? `<div class="row"><span>Deposit Credited</span><span>-$${depositCredit.toFixed(2)}</span></div>` : ''}
            <div class="row"><span>Estimated Tax</span><span>$${estimatedTax.toFixed(2)}</span></div>
            <div class="row"><span>Tip</span><span>$${tipAmount.toFixed(2)}</span></div>
            <div class="divider"></div>
            <div class="row bold"><span>TOTAL PAID</span><span>$${finalTotal.toFixed(2)}</span></div>
            <div class="row"><span>METHOD</span><span>${paymentMethod.toUpperCase()}</span></div>
            ${paymentMethod === 'cash' && cashGiven > 0 ? `
              <div class="row"><span>CASH TENDERED</span><span>$${cashGiven.toFixed(2)}</span></div>
              <div class="row"><span>CHANGE DUE</span><span>$${changeDue.toFixed(2)}</span></div>
            ` : ''}
            <div class="divider"></div>
            <div class="footer">THANK YOU FOR YOUR VISIT!<br/>Powered by AirBook Universal POS</div>
          </body>
        </html>
      `);
      printWin.document.close();
      printWin.focus();
      printWin.print();
    }
  };

  const handleSendEmailReceipt = () => {
    setEmailSent(true);
    addToast(t('receiptSent'), 'success');
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
          className="relative w-full max-w-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
        >
          {/* Mobile Drag Handle */}
          <div className="w-full pt-3 pb-1 flex sm:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Header Edge-to-Edge Bar */}
          <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)]">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider">
                AirBook Express POS
              </span>
              <h3 className="text-lg font-extrabold text-[var(--text-primary)] mt-1 tracking-tight">
                {isCompleted ? t('paymentSuccessTitle') : `Checkout: ${editableClientName}`}
              </h3>
              {!isCompleted && (
                <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">
                  {serviceName} · Specialist: {staffName}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* ─── SCREEN 2: DIGITAL RECEIPT COMPLETED ─── */}
            {isCompleted ? (
              <div className="py-4 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                  <CheckmarkCircle24Filled className="w-10 h-10" />
                </div>

                <div>
                  <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 font-mono font-bold text-xs text-[var(--text-secondary)]">
                    {completedReceiptNumber}
                  </span>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] mt-2">
                    ${finalTotal.toFixed(2)} Paid
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs mx-auto">
                    ${staffEarnings.toFixed(2)} allocated to {staffName.split(' ')[0]} (includes ${tipAmount.toFixed(2)} tip).
                  </p>
                </div>

                {/* Cash Change Banner */}
                {paymentMethod === 'cash' && cashGiven > 0 && (
                  <div className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {t('changeDue')}
                    </p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ${changeDue.toFixed(2)}
                    </p>
                  </div>
                )}

                {/* Receipt Actions */}
                <div className="flex flex-col gap-2.5 w-full pt-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Print24Filled className="w-4 h-4" />
                    <span>{t('printThermalReceipt')}</span>
                  </button>

                  <button
                    type="button"
                    disabled={emailSent}
                    onClick={handleSendEmailReceipt}
                    className="w-full py-3.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Mail24Filled className="w-4 h-4 text-blue-500" />
                    <span>{emailSent ? t('receiptSent') : t('emailReceipt')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </div>
            ) : (
              /* ─── SCREEN 1: CHECKOUT & TENDER SELECTION ─── */
              <div className="space-y-4">
                {/* Walk-in Client Name Input (if walkin) */}
                {!appointmentId && (
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                      Client Name
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                      <Person24Regular className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
                      <input
                        type="text"
                        value={editableClientName}
                        onChange={(e) => setEditableClientName(e.target.value)}
                        placeholder="e.g. Walk-in Guest"
                        className="bg-transparent text-xs font-bold text-[var(--text-primary)] focus:outline-none w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Itemized Bill Breakdown */}
                <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[var(--border-subtle)] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] font-semibold">{serviceName}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[var(--text-primary)]">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={editablePrice}
                        onChange={(e) => setEditablePrice(Number(e.target.value))}
                        className="w-16 px-1.5 py-0.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] font-bold text-xs text-right text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Cart Retail Products */}
                  {cartProducts.map((cp, idx) => (
                    <div key={cp.id} className="flex justify-between items-center text-xs py-1 border-t border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCartProducts((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          ✕
                        </button>
                        <span className="text-[var(--text-primary)] font-medium">{cp.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">x{cp.qty}</span>
                      </div>
                      <span className="font-bold text-[var(--text-primary)] font-mono">
                        ${((cp.retailPriceCents * cp.qty) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {/* Add Retail Product Button & Dropdown */}
                  {catalogProducts.length > 0 && (
                    <div className="pt-1">
                      {!showProductPicker ? (
                        <button
                          type="button"
                          onClick={() => setShowProductPicker(true)}
                          className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          + Add Retail Product
                        </button>
                      ) : (
                        <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 space-y-1.5">
                          <p className="text-[10px] font-bold uppercase text-[var(--text-secondary)]">Select Product to Add:</p>
                          <div className="max-h-28 overflow-y-auto space-y-1">
                            {catalogProducts.map((prod) => (
                              <div
                                key={prod.id}
                                onClick={() => {
                                  setCartProducts((prev) => {
                                    const existing = prev.find((p) => p.id === prod.id);
                                    if (existing) {
                                      return prev.map((p) => (p.id === prod.id ? { ...p, qty: p.qty + 1 } : p));
                                    }
                                    return [...prev, { id: prod.id, name: prod.name, retailPriceCents: prod.retailPriceCents, qty: 1 }];
                                  });
                                  setShowProductPicker(false);
                                }}
                                className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 flex justify-between items-center cursor-pointer text-xs"
                              >
                                <span className="font-medium text-[var(--text-primary)]">{prod.name}</span>
                                <span className="font-bold text-blue-600 font-mono">${(prod.retailPriceCents / 100).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowProductPicker(false)}
                            className="text-[10px] text-[var(--text-muted)] hover:underline block text-right"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {depositCredit > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                      <span className="font-semibold">{t('depositDeductionLabel')}</span>
                      <span className="font-bold">-${depositCredit.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] font-semibold">{t('taxLabel')} (8.25%)</span>
                    <span className="font-bold text-[var(--text-primary)]">${estimatedTax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] font-semibold">{t('tipLabel')}</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">+${tipAmount.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-[var(--border-subtle)] pt-2.5 flex justify-between items-center font-extrabold text-sm">
                    <span className="text-[var(--text-primary)]">Total Due</span>
                    <span className="text-lg text-[var(--text-primary)]">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Dynamic Tip Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      {t('selectTip')} for {staffName.split(' ')[0]}
                    </label>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                      ${tipAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {[15, 20, 25].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setTipPercent(pct);
                          setCustomTip('');
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          tipPercent === pct && customTip === ''
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setTipPercent(0);
                        setCustomTip('0');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        customTip === '0' || (tipPercent === 0 && customTip === '')
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {t('noTip')}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTipPercent(0);
                        setCustomTip(customTip && customTip !== '0' ? customTip : '10');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        customTip !== '' && customTip !== '0'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Custom $
                    </button>
                  </div>

                  {customTip !== '' && customTip !== '0' && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <span className="text-xs font-bold text-blue-600">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={customTip}
                        onChange={(e) => setCustomTip(e.target.value)}
                        placeholder="Custom tip amount"
                        className="bg-transparent text-xs font-bold text-[var(--text-primary)] focus:outline-none w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Tender Method Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                    {t('stripePaymentMethod')}
                  </label>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe_terminal')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'stripe_terminal'
                          ? 'border-blue-500 bg-blue-500/10 text-[var(--text-primary)] shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{t('stripeTapToPay')}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                        NFC Reader Active
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe_card')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'stripe_card'
                          ? 'border-blue-500 bg-blue-500/10 text-[var(--text-primary)] shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{t('stripeCreditCard')}</span>
                      <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)]">Manual Entry</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)] shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Money24Filled className="w-4 h-4 text-emerald-500" />
                        <span>{t('cashPayment')}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        Change Calculator
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('split')}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'split'
                          ? 'border-purple-500 bg-purple-500/10 text-[var(--text-primary)] shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{t('splitPayment')}</span>
                      <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">Card + Cash</span>
                    </button>
                  </div>
                </div>

                {/* Cash Tendered Calculator (when cash selected) */}
                {paymentMethod === 'cash' && (
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[var(--text-primary)]">
                        {t('amountTendered')}
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-emerald-600">$</span>
                        <input
                          type="number"
                          min={finalTotal}
                          step="1"
                          value={cashTendered}
                          onChange={(e) => setCashTendered(e.target.value)}
                          placeholder={finalTotal.toFixed(0)}
                          className="w-24 px-2 py-1 rounded-xl bg-[var(--bg-primary)] border border-emerald-500/30 text-xs font-bold text-right text-[var(--text-primary)] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Bill Cash Shortcuts */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[Math.ceil(finalTotal), 20, 50, 100].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setCashTendered(val.toString())}
                          className="flex-1 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] hover:bg-emerald-500/20 transition-colors cursor-pointer"
                        >
                          ${val}
                        </button>
                      ))}
                    </div>

                    {cashGiven >= finalTotal && (
                      <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{t('changeDue')}:</span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          ${changeDue.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Stripe Tap to Pay Animated Callout */}
                {paymentMethod === 'stripe_terminal' && (
                  <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Sparkle24Filled className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        {t('tapToPayPrompt')}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        Supports Apple Pay, Google Pay, and contactless chip cards.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side-to-Side Bottom Action Banner (Only when checkout active) */}
          {!isCompleted && (
            <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 flex-shrink-0 z-30">
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={submitting}
                onClick={handleProcessPayment}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Payment24Filled className="w-4 h-4" />
                <span>
                  {submitting ? 'Processing Payment…' : `Charge $${finalTotal.toFixed(2)}`}
                </span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

