'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import {
  Tag24Filled,
  Tag24Regular,
  GiftCard24Filled,
  GiftCard24Regular,
  Sparkle24Filled,
  Sparkle24Regular,
  Add24Filled,
  Copy24Filled,
  Checkmark24Filled,
  CheckmarkCircle24Filled,
  Dismiss24Filled,
  Edit24Filled,
  Delete24Filled,
  Money24Regular,
  Calendar24Regular,
  Mail24Regular,
  Person24Regular,
  ArrowTrending24Regular,
} from '@fluentui/react-icons';

interface GiftCard {
  id: string;
  code: string;
  initialBalanceCents: number;
  currentBalanceCents: number;
  recipientName?: string | null;
  recipientEmail?: string | null;
  senderName?: string | null;
  notes?: string | null;
  status: 'active' | 'redeemed' | 'expired';
  expiresAt?: string | null;
  createdAt: string;
}

interface Package {
  id: string;
  name: string;
  serviceId?: string | null;
  serviceName?: string | null;
  totalSessions: number;
  priceCents: number;
  discountPercent: number;
  validityDays: number;
  isActive: boolean;
  createdAt: string;
}

interface Membership {
  id: string;
  name: string;
  monthlyPriceCents: number;
  includedServicesCount: number;
  discountPercentRetail: number;
  perks?: string | null;
  isActive: boolean;
  createdAt: string;
}

export const PackagesModule: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'gift_cards' | 'packages' | 'memberships'>('gift_cards');

  // Data States
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [packagesList, setPackagesList] = useState<Package[]>([]);
  const [membershipsList, setMembershipsList] = useState<Membership[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [isGiftCardDrawerOpen, setIsGiftCardDrawerOpen] = useState(false);
  const [isPackageDrawerOpen, setIsPackageDrawerOpen] = useState(false);
  const [isMembershipDrawerOpen, setIsMembershipDrawerOpen] = useState(false);

  // Editing Entities
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [redeemingCard, setRedeemingCard] = useState<GiftCard | null>(null);
  const [redeemAmount, setRedeemAmount] = useState<string>('');

  // Gift Card Form
  const [gcAmount, setGcAmount] = useState<number>(100);
  const [gcCustomAmount, setGcCustomAmount] = useState<string>('');
  const [gcRecipientName, setGcRecipientName] = useState('');
  const [gcRecipientEmail, setGcRecipientEmail] = useState('');
  const [gcSenderName, setGcSenderName] = useState('');
  const [gcNotes, setGcNotes] = useState('');
  const [gcExpiresAt, setGcExpiresAt] = useState('');

  // Package Form
  const [pkgName, setPkgName] = useState('');
  const [pkgServiceName, setPkgServiceName] = useState('Haircut & Styling');
  const [pkgTotalSessions, setPkgTotalSessions] = useState<number>(5);
  const [pkgPrice, setPkgPrice] = useState<string>('225');
  const [pkgDiscountPercent, setPkgDiscountPercent] = useState<number>(15);
  const [pkgValidityDays, setPkgValidityDays] = useState<number>(365);

  // Membership Form
  const [memName, setMemName] = useState('');
  const [memPrice, setMemPrice] = useState<string>('120');
  const [memIncludedServices, setMemIncludedServices] = useState<number>(2);
  const [memDiscountRetail, setMemDiscountRetail] = useState<number>(15);
  const [memPerks, setMemPerks] = useState('');

  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load all initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [gcRes, pkgRes, memRes, srvRes] = await Promise.all([
        fetch('/api/gift-cards'),
        fetch('/api/packages'),
        fetch('/api/memberships'),
        fetch('/api/services'),
      ]);

      const [gcData, pkgData, memData, srvData] = await Promise.all([
        gcRes.json(),
        pkgRes.json(),
        memRes.json(),
        srvRes.json(),
      ]);

      if (gcData.success) setGiftCards(gcData.giftCards || []);
      if (pkgData.success) setPackagesList(pkgData.packages || []);
      if (memData.success) setMembershipsList(memData.memberships || []);
      if (srvData.success) setServicesList(srvData.services || []);
    } catch (err) {
      console.error('Error fetching packages data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Copy Code to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(t('codeCopied'), 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Issue Gift Card
  const handleIssueGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = gcCustomAmount ? Number(gcCustomAmount) : gcAmount;
    if (!finalAmount || finalAmount <= 0) return;

    try {
      setSaving(true);
      const res = await fetch('/api/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          recipientName: gcRecipientName,
          recipientEmail: gcRecipientEmail,
          senderName: gcSenderName,
          notes: gcNotes,
          expiresAt: gcExpiresAt || null,
        }),
      });

      const data = await res.json();
      if (data.success && data.giftCard) {
        setGiftCards((prev) => [data.giftCard, ...prev]);
        setIsGiftCardDrawerOpen(false);
        setGcCustomAmount('');
        setGcRecipientName('');
        setGcRecipientEmail('');
        setGcSenderName('');
        setGcNotes('');
        setGcExpiresAt('');
        addToast(t('giftCardIssued'), 'success');
      } else {
        addToast(data.error || 'Failed to issue gift card.', 'error');
      }
    } catch (err: any) {
      addToast('Network error issuing gift card.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Redeem Gift Card
  const handleRedeemGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemingCard) return;

    const amountToRedeem = Number(redeemAmount);
    if (!amountToRedeem || amountToRedeem <= 0) return;

    try {
      setSaving(true);
      const res = await fetch('/api/gift-cards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: redeemingCard.id,
          redeemAmountCents: Math.round(amountToRedeem * 100),
        }),
      });

      const data = await res.json();
      if (data.success && data.giftCard) {
        setGiftCards((prev) => prev.map((c) => (c.id === data.giftCard.id ? data.giftCard : c)));
        setRedeemingCard(null);
        setRedeemAmount('');
        addToast(t('giftCardRedeemed'), 'success');
      } else {
        addToast(data.error || 'Failed to redeem balance.', 'error');
      }
    } catch (err: any) {
      addToast('Network error redeeming gift card.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Save Package (Create or Update)
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) return;

    try {
      setSaving(true);
      if (editingPackage) {
        const res = await fetch('/api/packages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingPackage.id,
            name: pkgName,
            serviceName: pkgServiceName,
            totalSessions: pkgTotalSessions,
            price: Number(pkgPrice) || 100,
            discountPercent: pkgDiscountPercent,
            validityDays: pkgValidityDays,
          }),
        });

        const data = await res.json();
        if (data.success && data.package) {
          setPackagesList((prev) => prev.map((p) => (p.id === data.package.id ? data.package : p)));
          setIsPackageDrawerOpen(false);
          setEditingPackage(null);
          addToast(t('packageUpdated'), 'success');
        }
      } else {
        const res = await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: pkgName,
            serviceName: pkgServiceName,
            totalSessions: pkgTotalSessions,
            price: Number(pkgPrice) || 100,
            discountPercent: pkgDiscountPercent,
            validityDays: pkgValidityDays,
          }),
        });

        const data = await res.json();
        if (data.success && data.package) {
          setPackagesList((prev) => [data.package, ...prev]);
          setIsPackageDrawerOpen(false);
          addToast(t('packageCreated'), 'success');
        }
      }
    } catch (err: any) {
      addToast('Network error saving package.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Package
  const handleDeletePackage = async (id: string) => {
    try {
      const res = await fetch(`/api/packages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPackagesList((prev) => prev.filter((p) => p.id !== id));
        setIsPackageDrawerOpen(false);
        setEditingPackage(null);
        addToast(t('packageDeleted'), 'success');
      }
    } catch (err) {
      addToast('Failed to delete package.', 'error');
    }
  };

  // Save Membership (Create or Update)
  const handleSaveMembership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memName.trim()) return;

    try {
      setSaving(true);
      if (editingMembership) {
        const res = await fetch('/api/memberships', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingMembership.id,
            name: memName,
            monthlyPrice: Number(memPrice) || 100,
            includedServicesCount: memIncludedServices,
            discountPercentRetail: memDiscountRetail,
            perks: memPerks,
          }),
        });

        const data = await res.json();
        if (data.success && data.membership) {
          setMembershipsList((prev) => prev.map((m) => (m.id === data.membership.id ? data.membership : m)));
          setIsMembershipDrawerOpen(false);
          setEditingMembership(null);
          addToast(t('membershipUpdated'), 'success');
        }
      } else {
        const res = await fetch('/api/memberships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: memName,
            monthlyPrice: Number(memPrice) || 100,
            includedServicesCount: memIncludedServices,
            discountPercentRetail: memDiscountRetail,
            perks: memPerks,
          }),
        });

        const data = await res.json();
        if (data.success && data.membership) {
          setMembershipsList((prev) => [data.membership, ...prev]);
          setIsMembershipDrawerOpen(false);
          addToast(t('membershipCreated'), 'success');
        }
      }
    } catch (err: any) {
      addToast('Network error saving membership.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Membership
  const handleDeleteMembership = async (id: string) => {
    try {
      const res = await fetch(`/api/memberships?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMembershipsList((prev) => prev.filter((m) => m.id !== id));
        setIsMembershipDrawerOpen(false);
        setEditingMembership(null);
        addToast(t('membershipDeleted'), 'success');
      }
    } catch (err) {
      addToast('Failed to delete membership.', 'error');
    }
  };

  // Metrics Calculations
  const totalGiftCardBalance = giftCards.reduce((acc, c) => acc + (c.status === 'active' ? c.currentBalanceCents : 0), 0) / 100;
  const activeGiftCardsCount = giftCards.filter((c) => c.status === 'active').length;
  const activePackagesCount = packagesList.filter((p) => p.isActive).length;
  const activeMembershipsCount = membershipsList.filter((m) => m.isActive).length;
  const estimatedMRR = membershipsList.reduce((acc, m) => acc + (m.isActive ? m.monthlyPriceCents : 0), 0) / 100;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {t('packagesTitle')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase">
              Monetization
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl">
            {t('packagesDesc')}
          </p>
        </div>

        {/* Primary Action Button */}
        <div>
          {activeTab === 'gift_cards' && (
            <button
              type="button"
              onClick={() => {
                setGcAmount(100);
                setGcCustomAmount('');
                setGcRecipientName('');
                setGcRecipientEmail('');
                setGcSenderName('');
                setGcNotes('');
                setGcExpiresAt('');
                setIsGiftCardDrawerOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all duration-100 cursor-pointer"
            >
              <Add24Filled className="w-4 h-4" />
              <span>{t('issueGiftCard')}</span>
            </button>
          )}

          {activeTab === 'packages' && (
            <button
              type="button"
              onClick={() => {
                setEditingPackage(null);
                setPkgName('');
                setPkgServiceName(servicesList[0]?.name || 'Haircut & Styling');
                setPkgTotalSessions(5);
                setPkgPrice('225');
                setPkgDiscountPercent(15);
                setPkgValidityDays(365);
                setIsPackageDrawerOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all duration-100 cursor-pointer"
            >
              <Add24Filled className="w-4 h-4" />
              <span>{t('createPackage')}</span>
            </button>
          )}

          {activeTab === 'memberships' && (
            <button
              type="button"
              onClick={() => {
                setEditingMembership(null);
                setMemName('');
                setMemPrice('120');
                setMemIncludedServices(2);
                setMemDiscountRetail(15);
                setMemPerks('Priority Weekend Access · 15% Off Retail Products');
                setIsMembershipDrawerOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all duration-100 cursor-pointer"
            >
              <Add24Filled className="w-4 h-4" />
              <span>{t('createMembership')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
            <GiftCard24Regular className="w-4 h-4 text-pink-500" />
            <span>{t('totalOutstandingBalance')}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-black text-pink-600 dark:text-pink-400 font-mono">
              ${totalGiftCardBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] font-bold text-[var(--text-muted)]">
              {activeGiftCardsCount} {t('activeCards')}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
            <Tag24Regular className="w-4 h-4 text-purple-500" />
            <span>{t('activePackages')}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-black text-[var(--text-primary)] font-mono">
              {activePackagesCount}
            </p>
            <span className="text-[11px] font-bold text-[var(--text-muted)]">
              {packagesList.length} Total Bundles
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
            <Sparkle24Regular className="w-4 h-4 text-emerald-500" />
            <span>{t('recurringRevenueMRR')}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ${Math.round(estimatedMRR).toLocaleString()} / mo
            </p>
            <span className="text-[11px] font-bold text-[var(--text-muted)]">
              {activeMembershipsCount} {t('activeMemberships')}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('gift_cards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-100 cursor-pointer ${
            activeTab === 'gift_cards'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          <GiftCard24Regular className="w-4 h-4" />
          <span>{t('tabGiftCards')}</span>
          <span className="px-1.5 py-0.2 bg-black/20 dark:bg-white/20 rounded-full text-[10px]">
            {giftCards.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-100 cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          <Tag24Regular className="w-4 h-4" />
          <span>{t('tabServicePackages')}</span>
          <span className="px-1.5 py-0.2 bg-black/20 dark:bg-white/20 rounded-full text-[10px]">
            {packagesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('memberships')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-100 cursor-pointer ${
            activeTab === 'memberships'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:bg-black/10 dark:hover:bg-white/10'
          }`}
        >
          <Sparkle24Regular className="w-4 h-4" />
          <span>{t('tabMemberships')}</span>
          <span className="px-1.5 py-0.2 bg-black/20 dark:bg-white/20 rounded-full text-[10px]">
            {membershipsList.length}
          </span>
        </button>
      </div>

      {/* ─── TAB 1: GIFT CARDS ─── */}
      {activeTab === 'gift_cards' && (
        <div className="space-y-4">
          {giftCards.length === 0 ? (
            <div className="p-8 text-center bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl space-y-3">
              <GiftCard24Regular className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
              <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('noGiftCardsFound')}</h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">{t('noGiftCardsSub')}</p>
            </div>
          ) : (
            <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden divide-y divide-[var(--border-subtle)] shadow-xs">
              {giftCards.map((card) => {
                const isRedeemed = card.status === 'redeemed' || card.currentBalanceCents === 0;
                const isExpired = card.status === 'expired';

                return (
                  <div
                    key={card.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isRedeemed
                            ? 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                            : 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
                        }`}
                      >
                        <GiftCard24Filled className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(card.code)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-mono font-black text-[var(--text-primary)] transition-colors cursor-pointer"
                            title="Click to copy code"
                          >
                            <span>{card.code}</span>
                            {copiedCode === card.code ? (
                              <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy24Filled className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            )}
                          </button>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              isRedeemed
                                ? 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                                : isExpired
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {isRedeemed
                              ? t('giftCardStatusRedeemed')
                              : isExpired
                              ? t('giftCardStatusExpired')
                              : t('giftCardStatusActive')}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-[var(--text-primary)]">
                          {card.recipientName ? `To: ${card.recipientName}` : 'Digital Gift Certificate'}
                          {card.recipientEmail ? ` (${card.recipientEmail})` : ''}
                        </p>
                        {card.notes && (
                          <p className="text-[11px] text-[var(--text-secondary)] italic">
                            &quot;{card.notes}&quot; {card.senderName ? `— ${card.senderName}` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[var(--border-subtle)] pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <p className="text-base font-black text-[var(--text-primary)] font-mono">
                          ${(card.currentBalanceCents / 100).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] font-semibold">
                          of ${(card.initialBalanceCents / 100).toFixed(2)} initial
                        </p>
                      </div>

                      {card.status === 'active' && card.currentBalanceCents > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setRedeemingCard(card);
                            setRedeemAmount((card.currentBalanceCents / 100).toString());
                          }}
                          className="px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {t('redeemGiftCard')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: PACKAGES ─── */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          {packagesList.length === 0 ? (
            <div className="p-8 text-center bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl space-y-3">
              <Tag24Regular className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
              <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('noPackagesFound')}</h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">{t('noPackagesSub')}</p>
            </div>
          ) : (
            <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden divide-y divide-[var(--border-subtle)] shadow-xs">
              {packagesList.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => {
                    setEditingPackage(pkg);
                    setPkgName(pkg.name);
                    setPkgServiceName(pkg.serviceName || 'Haircut & Styling');
                    setPkgTotalSessions(pkg.totalSessions);
                    setPkgPrice((pkg.priceCents / 100).toString());
                    setPkgDiscountPercent(pkg.discountPercent);
                    setPkgValidityDays(pkg.validityDays);
                    setIsPackageDrawerOpen(true);
                  }}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                      <Tag24Filled className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{pkg.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-extrabold uppercase">
                          {t('sessionsCount', { count: pkg.totalSessions })}
                        </span>
                        {pkg.discountPercent > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                            Save {pkg.discountPercent}%
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--text-secondary)]">
                        {pkg.serviceName || 'Standard Service'} · Valid {pkg.validityDays} Days
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[var(--border-subtle)] pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-base font-black text-[var(--text-primary)] font-mono">
                        ${(pkg.priceCents / 100).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold">
                        ${(pkg.priceCents / (100 * pkg.totalSessions)).toFixed(2)} / session
                      </p>
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <Edit24Filled className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: MEMBERSHIPS ─── */}
      {activeTab === 'memberships' && (
        <div className="space-y-4">
          {membershipsList.length === 0 ? (
            <div className="p-8 text-center bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl space-y-3">
              <Sparkle24Regular className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
              <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('noMembershipsFound')}</h4>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">{t('noMembershipsSub')}</p>
            </div>
          ) : (
            <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden divide-y divide-[var(--border-subtle)] shadow-xs">
              {membershipsList.map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => {
                    setEditingMembership(mem);
                    setMemName(mem.name);
                    setMemPrice((mem.monthlyPriceCents / 100).toString());
                    setMemIncludedServices(mem.includedServicesCount);
                    setMemDiscountRetail(mem.discountPercentRetail);
                    setMemPerks(mem.perks || '');
                    setIsMembershipDrawerOpen(true);
                  }}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Sparkle24Filled className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{mem.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase">
                          {mem.includedServicesCount} Services/Mo
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold">
                          {mem.discountPercentRetail}% Retail Discount
                        </span>
                      </div>

                      {mem.perks && (
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                          {mem.perks}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[var(--border-subtle)] pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        ${(mem.monthlyPriceCents / 100).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold">
                        per month
                      </p>
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <Edit24Filled className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── DRAWER 1: ISSUE DIGITAL GIFT CARD ─── */}
      <AnimatePresence>
        {isGiftCardDrawerOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGiftCardDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

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

              {/* Header */}
              <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                    {t('issueGiftCard')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Generate instant digital certificate with redemption code.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGiftCardDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleIssueGiftCard} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {/* Amount Presets */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('initialBalance')} ($)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[25, 50, 100, 150].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setGcAmount(amt);
                            setGcCustomAmount('');
                          }}
                          className={`py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                            gcAmount === amt && !gcCustomAmount
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:bg-black/10'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <div className="pt-1">
                      <input
                        type="number"
                        placeholder="Or enter custom amount ($)"
                        value={gcCustomAmount}
                        onChange={(e) => setGcCustomAmount(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('recipientName')}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jessica Alba"
                        value={gcRecipientName}
                        onChange={(e) => setGcRecipientName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('recipientEmail')}
                      </label>
                      <input
                        type="email"
                        placeholder="jessica@example.com"
                        value={gcRecipientEmail}
                        onChange={(e) => setGcRecipientEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Sender & Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('senderName')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Michael Scott"
                      value={gcSenderName}
                      onChange={(e) => setGcSenderName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('personalGreeting')}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Happy Birthday! Enjoy your VIP session."
                      value={gcNotes}
                      onChange={(e) => setGcNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Side-to-Side Bottom Action Banner */}
                <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Add24Filled className="w-4 h-4" />
                    <span>{saving ? 'Issuing Gift Certificate…' : t('issueGiftCard')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: REDEEM GIFT CARD BALANCE ─── */}
      <AnimatePresence>
        {redeemingCard && (
          <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRedeemingCard(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                  {t('redeemGiftCard')}
                </h3>
                <button
                  type="button"
                  onClick={() => setRedeemingCard(null)}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">
                  {redeemingCard.code}
                </span>
                <p className="text-xs text-[var(--text-secondary)]">
                  Available Balance: ${(redeemingCard.currentBalanceCents / 100).toFixed(2)}
                </p>
              </div>

              <form onSubmit={handleRedeemGiftCard} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                    Amount to Deduct ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max={redeemingCard.currentBalanceCents / 100}
                    required
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    {saving ? 'Redeeming…' : t('redeemGiftCard')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRedeemingCard(null)}
                    className="w-full py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] text-xs font-bold hover:bg-black/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DRAWER 2: CREATE / EDIT SERVICE PACKAGE ─── */}
      <AnimatePresence>
        {isPackageDrawerOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPackageDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

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

              {/* Header */}
              <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                    {editingPackage ? 'Edit Service Package' : t('createPackage')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Prepaid multi-session service bundle.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPackageDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSavePackage} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('packageName')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5x Precision Haircut Bundle"
                      value={pkgName}
                      onChange={(e) => setPkgName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('serviceCovered')}
                    </label>
                    <select
                      value={pkgServiceName}
                      onChange={(e) => setPkgServiceName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {servicesList.length > 0 ? (
                        servicesList.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name} (${(s.priceCents / 100).toFixed(2)})
                          </option>
                        ))
                      ) : (
                        <option value="Haircut & Styling">Haircut & Styling</option>
                      )}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('totalSessions')}
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="50"
                        required
                        value={pkgTotalSessions}
                        onChange={(e) => setPkgTotalSessions(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('packagePrice')}
                      </label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={pkgPrice}
                        onChange={(e) => setPkgPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('savingsPercent')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={pkgDiscountPercent}
                        onChange={(e) => setPkgDiscountPercent(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('validityDays')}
                      </label>
                      <select
                        value={pkgValidityDays}
                        onChange={(e) => setPkgValidityDays(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={90}>90 Days (3 Months)</option>
                        <option value={180}>180 Days (6 Months)</option>
                        <option value={365}>365 Days (1 Year)</option>
                        <option value={730}>730 Days (2 Years)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Side-to-Side Bottom Action Banner */}
                <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Tag24Filled className="w-4 h-4" />
                    <span>{saving ? 'Saving…' : editingPackage ? 'Update Package' : t('createPackage')}</span>
                  </button>

                  {editingPackage && (
                    <button
                      type="button"
                      onClick={() => handleDeletePackage(editingPackage.id)}
                      className="w-full py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Delete Package
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── DRAWER 3: CREATE / EDIT MEMBERSHIP TIER ─── */}
      <AnimatePresence>
        {isMembershipDrawerOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMembershipDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

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

              {/* Header */}
              <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                    {editingMembership ? 'Edit Membership Tier' : t('createMembership')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Recurring monthly VIP pass tier.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMembershipDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSaveMembership} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('tierName')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. VIP Platinum Pass"
                      value={memName}
                      onChange={(e) => setMemName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('monthlyPrice')}
                      </label>
                      <input
                        type="number"
                        step="1"
                        required
                        value={memPrice}
                        onChange={(e) => setMemPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('servicesPerMonth')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={memIncludedServices}
                        onChange={(e) => setMemIncludedServices(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('retailDiscountPercent')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={memDiscountRetail}
                        onChange={(e) => setMemDiscountRetail(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('tierPerks')}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Priority Weekend Booking · 15% Off All Retail · Free Scalp Massage"
                      value={memPerks}
                      onChange={(e) => setMemPerks(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Side-to-Side Bottom Action Banner */}
                <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkle24Filled className="w-4 h-4" />
                    <span>{saving ? 'Saving…' : editingMembership ? 'Update Tier' : t('createMembership')}</span>
                  </button>

                  {editingMembership && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMembership(editingMembership.id)}
                      className="w-full py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Delete Tier
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
