'use client';

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { CustomSelect } from "@/components/CustomSelect";
import {
  PIPELINE_STAGES,
  SalonDeal,
  DealStage,
  SalonSegment,
  CompetitorReplaced,
} from "./data";
import {
  Table24Regular,
  Grid24Regular,
  Clock24Regular,
  Search24Regular,
  Add24Filled,
  Dismiss24Filled,
  Sparkle24Regular,
  BuildingShop24Regular,
  People24Regular,
  ChevronRight24Regular,
  Send24Filled,
  ArrowSync24Filled,
  CheckmarkCircle24Filled,
  Warning24Regular,
  ArrowRight24Filled,
  ArrowLeft24Filled,
  Money24Regular,
} from "@fluentui/react-icons";

export default function CrmSalesPage() {
  const { t } = useTranslation();

  const [deals, setDeals] = useState<(SalonDeal & { isStripeVerified?: boolean; verifiedTransactionsCount?: number })[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isStripeLive, setIsStripeLive] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<"table" | "kanban" | "activity">("kanban");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("all");
  const [selectedIcpFilter, setSelectedIcpFilter] = useState<string>("all");
  const [selectedCompetitorFilter, setSelectedCompetitorFilter] = useState<string>("all");
  const [activeMobileStageTab, setActiveMobileStageTab] = useState<string>("all");

  const [activeDeal, setActiveDeal] = useState<(SalonDeal & { isStripeVerified?: boolean }) | null>(null);
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newNoteText, setNewNoteText] = useState<string>("");

  // Drag & Drop State
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<DealStage | null>(null);

  // New Deal Form State
  const [newSalonName, setNewSalonName] = useState<string>("");
  const [newOwnerName, setNewOwnerName] = useState<string>("");
  const [newOwnerEmail, setNewOwnerEmail] = useState<string>("");
  const [newOwnerPhone, setNewOwnerPhone] = useState<string>("");
  const [newCity, setNewCity] = useState<string>("");
  const [newSegment, setNewSegment] = useState<SalonSegment>("Hair Studio");
  const [newChairs, setNewChairs] = useState<number>(4);
  const [newGmv, setNewGmv] = useState<number>(0);
  const [newCompetitor, setNewCompetitor] = useState<CompetitorReplaced>("Fresha (20% Fee Trap)");
  const [newTier, setNewTier] = useState<"solo_pro_29" | "team_79" | "scale_199">("team_79");
  const [newNotes, setNewNotes] = useState<string>("");

  // Fetch real deals from PostgreSQL & Stripe API
  const fetchDeals = useCallback(async (syncWithStripe = false) => {
    try {
      if (syncWithStripe) {
        setIsSyncing(true);
      }
      const res = await fetch(`/api/crm/deals${syncWithStripe ? '?sync=true' : ''}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.deals)) {
        setDeals(data.deals);
        setIsStripeLive(Boolean(data.isStripeConfigured));
        setLastSyncedAt(data.syncedAt || new Date().toISOString());
        if (syncWithStripe) {
          setSyncToast(t('crmStripeSyncComplete'));
          setTimeout(() => setSyncToast(null), 4000);
        }
      }
    } catch (err) {
      console.warn('Could not fetch deals from live API, retaining active state:', err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDeals(false);
  }, [fetchDeals]);

  // Filtered Deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        searchQuery === "" ||
        deal.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.currentSoftware.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage =
        selectedStageFilter === "all" || deal.stage === selectedStageFilter;
      const matchesIcp =
        selectedIcpFilter === "all" || deal.icpScore === selectedIcpFilter;
      const matchesCompetitor =
        selectedCompetitorFilter === "all" ||
        deal.currentSoftware === selectedCompetitorFilter;

      return matchesSearch && matchesStage && matchesIcp && matchesCompetitor;
    });
  }, [deals, searchQuery, selectedStageFilter, selectedIcpFilter, selectedCompetitorFilter]);

  // Aggregate Real Pipeline Metrics
  const metrics = useMemo(() => {
    const verifiedDeals = deals.filter((d) => d.isStripeVerified);
    const unverifiedDeals = deals.filter((d) => !d.isStripeVerified);

    const verifiedArr = verifiedDeals.reduce((acc, d) => acc + d.arrValue, 0);
    const verifiedMrr = verifiedDeals.reduce((acc, d) => acc + d.mrrValue, 0);
    const totalRealizedGmv = deals.reduce((acc, d) => acc + d.monthlyGmvEst, 0);
    const totalSavingsDelivered = verifiedDeals.reduce(
      (acc, d) => acc + d.calculatedAnnualSavings,
      0
    );
    const activePilots = deals.filter((d) => d.stage === "trial_active").length;
    const winRate =
      deals.length > 0 ? Math.round((verifiedDeals.length / deals.length) * 100) : 0;

    return {
      verifiedArr,
      verifiedMrr,
      totalRealizedGmv,
      totalSavingsDelivered,
      activePilots,
      winRate,
      activeDealsCount: deals.length,
      verifiedCount: verifiedDeals.length,
      unverifiedCount: unverifiedDeals.length,
    };
  }, [deals]);

  // Update Deal Stage with real DB persistence
  const handleUpdateStage = async (dealId: string, newStage: DealStage) => {
    setDeals((prev) =>
      prev.map((d) => {
        if (d.id === dealId) {
          const updated = {
            ...d,
            stage: newStage,
            activities: [
              {
                id: "act-" + Date.now(),
                type: "deal_moved" as const,
                author: "Eduardo G.",
                timestamp: new Date().toISOString(),
                summary: "Stage updated to " + newStage.replace("_", " ").toUpperCase(),
              },
              ...d.activities,
            ],
          };
          if (activeDeal && activeDeal.id === dealId) {
            setActiveDeal(updated);
          }
          return updated;
        }
        return d;
      })
    );

    try {
      await fetch('/api/crm/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId, stage: newStage }),
      });
    } catch (err) {
      console.warn('Failed to update stage in database:', err);
    }
  };

  // Quick Move Previous/Next Stage (Touch-friendly Ergonomics)
  const handleQuickMove = (deal: SalonDeal, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === deal.stage);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < PIPELINE_STAGES.length) {
      handleUpdateStage(deal.id, PIPELINE_STAGES[targetIndex].id);
    }
  };

  // HTML5 Drag Handlers
  const handleDragStart = (dealId: string, e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedDealId(dealId);
  };

  const handleDragOver = (stageId: DealStage, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDrop = (stageId: DealStage, e: React.DragEvent) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      handleUpdateStage(dealId, stageId);
    }
    setDraggedDealId(null);
    setDragOverStageId(null);
  };

  // Add Note to Active Deal with DB persistence
  const handleAddNote = async () => {
    if (!activeDeal || !newNoteText.trim()) return;

    const noteContent = newNoteText.trim();
    const newActivity = {
      id: "act-" + Date.now(),
      type: "note" as const,
      author: "Eduardo G.",
      timestamp: new Date().toISOString(),
      summary: noteContent,
    };

    const updatedDeal = {
      ...activeDeal,
      notes: activeDeal.notes ? `${activeDeal.notes}\n• ${noteContent}` : noteContent,
      activities: [newActivity, ...activeDeal.activities],
    };

    setDeals((prev) =>
      prev.map((d) => (d.id === activeDeal.id ? updatedDeal : d))
    );
    setActiveDeal(updatedDeal);
    setNewNoteText("");

    try {
      await fetch('/api/crm/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: activeDeal.id, notes: updatedDeal.notes }),
      });
    } catch (err) {
      console.warn('Failed to persist note in database:', err);
    }
  };

  // Create New Deal in PostgreSQL & Stripe
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalonName.trim() || !newOwnerName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/crm/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonName: newSalonName.trim(),
          ownerName: newOwnerName.trim(),
          ownerEmail: newOwnerEmail.trim(),
          ownerPhone: newOwnerPhone.trim(),
          city: newCity.trim(),
          segment: newSegment,
          chairsCount: Number(newChairs) || 1,
          monthlyGmvEst: Number(newGmv) || 0,
          currentSoftware: newCompetitor,
          targetTier: newTier,
          notes: newNotes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchDeals(false);
        setIsNewDealModalOpen(false);

        // Reset Form
        setNewSalonName("");
        setNewOwnerName("");
        setNewOwnerEmail("");
        setNewOwnerPhone("");
        setNewCity("");
        setNewNotes("");
      }
    } catch (err) {
      console.error('Error creating deal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStageConfig = (stageId: DealStage) => {
    return (
      PIPELINE_STAGES.find((s) => s.id === stageId) || PIPELINE_STAGES[0]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16">
      {/* SYNC TOAST */}
      <AnimatePresence>
        {syncToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-4 sm:right-6 z-[1000] p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400/40"
          >
            <CheckmarkCircle24Filled className="w-5 h-5 flex-shrink-0" />
            <span>{syncToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BANNER */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] relative overflow-hidden shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <BuildingShop24Regular className="w-3.5 h-3.5" />
              <span>{t('crmLiveDb')} ({deals.length} Workspaces)</span>
            </div>

            <div className={"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border " + (metrics.verifiedCount > 0 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400")}>
              <span className={"w-2 h-2 rounded-full " + (metrics.verifiedCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
              <span>{metrics.verifiedCount > 0 ? `${metrics.verifiedCount} Stripe Verified` : 'Stripe: 0 Verified (Dev Test)'}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            {t('crmTitle')}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {t('crmSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Tactile Live Stripe Sync Button */}
          <button
            onClick={() => fetchDeals(true)}
            disabled={isSyncing}
            className="btn-secondary h-11 px-3.5 sm:px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh database records & sync live Stripe connected balances"
          >
            <ArrowSync24Filled className={`w-4 h-4 text-blue-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="truncate">{isSyncing ? 'Syncing...' : t('crmSyncStripe')}</span>
          </button>

          {/* New Salon Deal CTA */}
          <button
            onClick={() => setIsNewDealModalOpen(true)}
            className="btn-primary h-11 px-4 sm:px-5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Add24Filled className="w-4 h-4" />
            <span>{t('crmNewDeal')}</span>
          </button>
        </div>
      </div>

      {/* METRICS SCORECARD RIBBON (RESPONSIVE GRID WITH STRICT VALUES) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate">
            Verified ARR
          </span>
          <div className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-[var(--text-primary)]">
            {"$" + metrics.verifiedArr.toLocaleString()}
          </div>
          <span className="text-[10px] font-bold text-[var(--text-muted)] block truncate">
            {metrics.verifiedCount} Stripe Live
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate">
            {t('crmWonMrr')}
          </span>
          <div className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {"$" + metrics.verifiedMrr.toLocaleString()}
          </div>
          <span className="text-[10px] font-bold text-emerald-500 block truncate">
            {"$" + metrics.verifiedArr.toLocaleString()} Annual
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate">
            Realized GMV
          </span>
          <div className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-[#AF52DE]">
            {"$" + metrics.totalRealizedGmv.toLocaleString() + "/mo"}
          </div>
          <span className="text-[10px] font-bold text-[#AF52DE] block truncate">
            Real Paid Deposits
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate">
            {t('crmAnnualSavings')}
          </span>
          <div className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-amber-500">
            {"$" + metrics.totalSavingsDelivered.toLocaleString()}
          </div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block truncate">
            Stripe GMV Savings
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate">
            Dev/Test Leads
          </span>
          <div className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-blue-500">
            {metrics.unverifiedCount}
          </div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block truncate">
            Unverified in DB
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] block truncate">
            {t('crmWinRate')}
          </span>
          <div className="text-lg sm:text-xl lg:text-2xl font-black font-mono text-[var(--text-primary)]">
            {metrics.winRate}%
          </div>
          <span className="text-[10px] font-bold text-emerald-500 block truncate">
            Verified Conversion
          </span>
        </div>
      </div>

      {/* ATTIO CONTROL BAR (MOBILE-FIRST VIEWS + SEARCH + FILTERS) */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* View Switcher Tabs (3 Mobile Ergonomic Buttons) */}
          <div className="grid grid-cols-3 sm:inline-flex items-center p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-full md:w-auto">
            <button
              onClick={() => setActiveView("kanban")}
              className={"px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer " + (activeView === "kanban" ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
            >
              <Grid24Regular className="w-4 h-4" />
              <span>{t('crmViewKanban')}</span>
            </button>
            <button
              onClick={() => setActiveView("table")}
              className={"px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer " + (activeView === "table" ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
            >
              <Table24Regular className="w-4 h-4" />
              <span>{t('crmViewTable')}</span>
            </button>
            <button
              onClick={() => setActiveView("activity")}
              className={"px-3 py-2 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer " + (activeView === "activity" ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]")}
            >
              <Clock24Regular className="w-4 h-4" />
              <span>{t('crmViewActivity')}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search24Regular className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('crmSearchPlaceholder')}
              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Dropdowns (Responsive Stacking) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[var(--border-subtle)]">
          <CustomSelect
            label={t('crmFilterAllStages')}
            value={selectedStageFilter}
            onChange={setSelectedStageFilter}
            options={[
              { value: 'all', label: `${t('crmFilterAllStages')} (${deals.length})` },
              ...PIPELINE_STAGES.map((s) => ({
                value: s.id,
                label: `${s.label} (${deals.filter((d) => d.stage === s.id).length})`,
              })),
            ]}
          />

          <CustomSelect
            label={t('crmFilterAllIcp')}
            value={selectedIcpFilter}
            onChange={setSelectedIcpFilter}
            options={[
              { value: 'all', label: t('crmFilterAllIcp') },
              { value: 'Tier 1 (High Priority)', label: 'Tier 1 (High Priority)' },
              { value: 'Tier 2 (Strong Fit)', label: 'Tier 2 (Strong Fit)' },
              { value: 'Tier 3 (Emerging)', label: 'Tier 3 (Emerging)' },
            ]}
          />

          <CustomSelect
            label={t('crmFilterAllCompetitors')}
            value={selectedCompetitorFilter}
            onChange={setSelectedCompetitorFilter}
            options={[
              { value: 'all', label: t('crmFilterAllCompetitors') },
              { value: 'Fresha (20% Fee Trap)', label: 'Fresha (20% Fee Trap)' },
              { value: 'Vagaro (Add-on Creep)', label: 'Vagaro (Add-on Creep)' },
              { value: 'Boulevard ($175+ Base)', label: 'Boulevard ($175+ Base)' },
              { value: 'Booksy (Boost Tax)', label: 'Booksy (Boost Tax)' },
              { value: 'Square Appointments', label: 'Square Appointments' },
              { value: 'Phorest', label: 'Phorest' },
            ]}
          />
        </div>
      </div>

      {/* VIEW 1: KANBAN PIPELINE BOARD (RESPONSIVE HORIZONTAL SNAP TRACK + DRAG & DROP) */}
      {activeView === "kanban" && (
        <div className="space-y-4">
          {/* Mobile Stage Quick Select */}
          <div className="md:hidden">
            <CustomSelect
              label={t('crmFilterAllStages')}
              value={activeMobileStageTab}
              onChange={setActiveMobileStageTab}
              options={[
                { value: "all", label: `All Columns (${deals.length})` },
                ...PIPELINE_STAGES.map((s) => ({
                  value: s.id,
                  label: `${s.label} (${deals.filter((d) => d.stage === s.id).length})`,
                })),
              ]}
            />
          </div>

          {/* Kanban Columns Horizontal Flex Track */}
          <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 pt-1 px-0.5 no-scrollbar snap-x snap-mandatory">
            {PIPELINE_STAGES.filter((s) => activeMobileStageTab === "all" || activeMobileStageTab === s.id).map((stage) => {
              const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
              const stageVerifiedArr = stageDeals.reduce((acc, d) => acc + d.arrValue, 0);
              const isDropTarget = dragOverStageId === stage.id;

              return (
                <div
                  key={stage.id}
                  onDragOver={(e) => handleDragOver(stage.id, e)}
                  onDrop={(e) => handleDrop(stage.id, e)}
                  className={"w-[86vw] sm:w-[320px] md:w-[330px] flex-shrink-0 snap-start p-3.5 sm:p-4 rounded-3xl bg-[var(--bg-primary)] border transition-all space-y-3.5 shadow-xs flex flex-col " + (isDropTarget ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5 scale-[1.01]" : "border-[var(--border-subtle)]")}
                >
                  {/* Column Header with Stage Metadata */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={"inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border " + stage.badgeBg + " " + stage.badgeBorder + " " + stage.badgeText}>
                          {stage.label}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-[var(--text-muted)]">
                          ({stageDeals.length})
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)]">
                        {"$" + stageVerifiedArr.toLocaleString() + " Verified ARR"}
                      </div>
                    </div>
                  </div>

                  {/* Deal Cards Container */}
                  <div className="space-y-3 flex-1 min-h-[140px]">
                    {stageDeals.map((deal) => {
                      const isBeingDragged = draggedDealId === deal.id;

                      return (
                        <div
                          key={deal.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(deal.id, e)}
                          onDragEnd={() => {
                            setDraggedDealId(null);
                            setDragOverStageId(null);
                          }}
                          onClick={() => setActiveDeal(deal)}
                          className={"p-4 rounded-2xl bg-[var(--bg-secondary)] border transition-all cursor-grab active:cursor-grabbing space-y-3 group shadow-xs select-none " + (isBeingDragged ? "opacity-40 border-dashed border-blue-500 scale-95" : "border-[var(--border-subtle)] hover:border-blue-500/50 hover:shadow-md")}
                        >
                          {/* Card Top: Name & Savings */}
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-[var(--text-primary)] group-hover:text-blue-500 transition-colors leading-tight">
                              {deal.salonName}
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-emerald-500 flex-shrink-0">
                              {deal.calculatedAnnualSavings > 0 ? "+$" + deal.calculatedAnnualSavings + "/yr" : "$0"}
                            </span>
                          </div>

                          {/* Owner & City */}
                          <div className="text-[11px] text-[var(--text-secondary)] font-medium truncate">
                            {deal.ownerName} · {deal.city}
                          </div>

                          {/* Attribute Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] font-mono font-bold text-[var(--text-primary)]">
                              {deal.chairsCount} chairs
                            </span>
                            {deal.isStripeVerified ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                                Stripe Verified
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                                Dev / Unlinked
                              </span>
                            )}
                          </div>

                          {/* Bottom Row: Verified MRR & Touchpoint Controls */}
                          <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono">
                            <div className="space-y-0.5">
                              <span className="font-bold text-[var(--text-primary)] block">
                                {deal.isStripeVerified ? "$" + deal.mrrValue + "/mo" : "$0 Verified"}
                              </span>
                              <span className="text-[9px] text-[var(--text-muted)] block">
                                Target: {deal.targetTier.replace("_", " ").toUpperCase()}
                              </span>
                            </div>

                            {/* Mobile-Friendly Quick Stage Mover Buttons */}
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={(e) => handleQuickMove(deal, 'prev', e)}
                                title="Move to previous stage"
                                className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors active:scale-95"
                              >
                                <ArrowLeft24Filled className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleQuickMove(deal, 'next', e)}
                                title="Move to next stage"
                                className="w-7 h-7 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-blue-500 transition-colors active:scale-95"
                              >
                                <ArrowRight24Filled className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {stageDeals.length === 0 && (
                      <div className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)] flex flex-col items-center justify-center min-h-[120px] space-y-1">
                        <span className="font-medium">No deals in this stage</span>
                        <span className="text-[10px] text-[var(--text-muted)] opacity-70">Drag deal card here</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: ATTIO RELATIONAL SPREADSHEET TABLE (DESKTOP + RESPONSIVE MOBILE CARDS) */}
      {activeView === "table" && (
        <div className="space-y-4">
          {/* Mobile Card List (< md:) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredDeals.map((deal) => {
              const stageCfg = getStageConfig(deal.stage);
              const isVerified = deal.isStripeVerified;

              return (
                <div
                  key={deal.id}
                  onClick={() => setActiveDeal(deal)}
                  className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 cursor-pointer shadow-xs active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black text-[var(--text-primary)]">
                        {deal.salonName}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {deal.ownerName} · {deal.city}
                      </p>
                    </div>
                    {isVerified ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Dev / Test
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[var(--bg-secondary)] p-2.5 rounded-xl">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block">Stage</span>
                      <span className={"font-bold " + stageCfg.badgeText}>{stageCfg.label}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block">Verified ARR</span>
                      <span className="font-bold text-[var(--text-primary)]">{isVerified ? `$${deal.arrValue.toLocaleString()}` : '$0'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {deal.chairsCount} chairs · {deal.currentSoftware.split(" ")[0]}
                    </span>
                    <button className="text-blue-500 font-bold flex items-center gap-1">
                      <span>View Details</span>
                      <ChevronRight24Regular className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= md:) */}
          <div className="hidden md:block rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden shadow-xs">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--bg-secondary)]/70 border-b border-[var(--border-subtle)] text-[10px] font-mono font-black uppercase tracking-wider text-[var(--text-muted)]">
                    <th className="py-3.5 px-4">{t('crmSalonName')}</th>
                    <th className="py-3.5 px-4">Stripe Verification</th>
                    <th className="py-3.5 px-4">{t('crmFilterAllStages')}</th>
                    <th className="py-3.5 px-4">{t('crmChairs')} / Realized GMV</th>
                    <th className="py-3.5 px-4">{t('crmReplacing')}</th>
                    <th className="py-3.5 px-4">{t('crmAnnualSavings')}</th>
                    <th className="py-3.5 px-4">{t('crmAirBookTier')}</th>
                    <th className="py-3.5 px-4">Verified ARR</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs font-medium">
                  {filteredDeals.map((deal) => {
                    const stageCfg = getStageConfig(deal.stage);
                    const isVerified = deal.isStripeVerified;

                    return (
                      <tr
                        key={deal.id}
                        onClick={() => setActiveDeal(deal)}
                        className="hover:bg-[var(--bg-secondary)]/50 transition-colors cursor-pointer group"
                      >
                        {/* Salon & Owner */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <div className="font-black text-[var(--text-primary)] group-hover:text-blue-500 transition-colors flex items-center gap-1.5">
                              <span>{deal.salonName}</span>
                            </div>
                            <div className="text-[11px] text-[var(--text-secondary)]">
                              {deal.ownerName} · {deal.city}
                            </div>
                          </div>
                        </td>

                        {/* Stripe Verification Status */}
                        <td className="py-3.5 px-4">
                          {isVerified ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                              <CheckmarkCircle24Filled className="w-3 h-3" />
                              <span>Stripe Verified</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                              <Warning24Regular className="w-3 h-3" />
                              <span>Dev / Unverified</span>
                            </span>
                          )}
                        </td>

                        {/* Stage Dropdown */}
                        <td className="py-3.5 px-4 min-w-[170px]" onClick={(e) => e.stopPropagation()}>
                          <CustomSelect
                            compact={true}
                            value={deal.stage}
                            onChange={(val) =>
                              handleUpdateStage(deal.id, val as DealStage)
                            }
                            options={PIPELINE_STAGES.map((s) => ({
                              value: s.id,
                              label: s.label,
                            }))}
                          />
                        </td>

                        {/* Chairs / Realized GMV */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-[var(--text-primary)]">
                            {deal.chairsCount} chairs
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)]">
                            {"$" + deal.monthlyGmvEst.toLocaleString() + " GMV/mo"}
                          </div>
                        </td>

                        {/* Current Competitor Replaced */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                            {deal.currentSoftware.split(" ")[0]}
                          </span>
                        </td>

                        {/* Calculated Annual Savings */}
                        <td className="py-3.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {deal.calculatedAnnualSavings > 0 ? `+$${deal.calculatedAnnualSavings.toLocaleString()}/yr` : '$0 (Pending GMV)'}
                        </td>

                        {/* AirBook Tier */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                            {deal.targetTier.replace("_", " ").toUpperCase()}
                          </span>
                        </td>

                        {/* ARR */}
                        <td className="py-3.5 px-4 font-mono font-black text-[var(--text-primary)]">
                          {isVerified ? `$${deal.arrValue.toLocaleString()}` : '$0'}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setActiveDeal(deal)}
                            className="btn-tertiary h-7 w-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-auto"
                          >
                            <ChevronRight24Regular className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SALES ACTIVITY TIMELINE */}
      {activeView === "activity" && (
        <div className="max-w-3xl mx-auto rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-5 sm:p-7 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2">
              <Clock24Regular className="w-4 h-4 text-blue-500" />
              <span>{t('crmActivityHistory')}</span>
            </h3>
            <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
              Latest Live Events
            </span>
          </div>

          <div className="space-y-3.5">
            {deals.flatMap((d) =>
              d.activities.map((a) => ({
                ...a,
                salonName: d.salonName,
                dealId: d.id,
              }))
            )
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              )
              .map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {act.type.toUpperCase()}
                      </span>
                      <span className="text-xs font-black text-[var(--text-primary)]">
                        {act.salonName}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {new Date(act.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                    {act.summary}
                  </p>

                  {act.details && (
                    <p className="text-[11px] text-[var(--text-muted)] italic pt-1 border-t border-[var(--border-subtle)]">
                      {act.details}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* DEAL DETAIL SLIDE-OVER DRAWER (MOBILE-FIRST BOTTOM SHEET DRAWER) */}
      <AnimatePresence>
        {activeDeal && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDeal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative z-10 w-full md:max-w-2xl bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[90vh]"
            >
              {/* Mobile Drag Handle */}
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 md:hidden" />

              {/* Drawer Header */}
              <div className="p-4 sm:p-6 border-b border-[var(--border-subtle)] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-black text-[10px] uppercase">
                      {activeDeal.segment}
                    </span>
                    {activeDeal.isStripeVerified ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Stripe Verified Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Dev / Test Workspace
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)]">
                    {activeDeal.salonName}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveDeal(null)}
                  className="btn-tertiary w-9 h-9 rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] flex-shrink-0"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-4 sm:p-6 space-y-5 overflow-y-auto no-scrollbar flex-1">
                {/* Stage Updater Select */}
                <div>
                  <CustomSelect
                    label={t('crmFilterAllStages')}
                    value={activeDeal.stage}
                    onChange={(val) => handleUpdateStage(activeDeal.id, val as DealStage)}
                    options={PIPELINE_STAGES.map((st) => ({
                      value: st.id,
                      label: st.label,
                    }))}
                  />
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                  <div>
                    <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                      Realized GMV
                    </span>
                    <span className="text-sm font-black font-mono text-[var(--text-primary)]">
                      {"$" + activeDeal.monthlyGmvEst.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                      {t('crmChairs')}
                    </span>
                    <span className="text-sm font-black font-mono text-[var(--text-primary)]">
                      {activeDeal.chairsCount}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                      Verified MRR
                    </span>
                    <span className="text-sm font-black font-mono text-emerald-500">
                      {"$" + activeDeal.mrrValue + "/mo"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                      {t('crmAnnualSavings')}
                    </span>
                    <span className="text-sm font-black font-mono text-emerald-500">
                      {activeDeal.calculatedAnnualSavings > 0 ? "+$" + activeDeal.calculatedAnnualSavings.toLocaleString() + "/yr" : "$0"}
                    </span>
                  </div>
                </div>

                {/* Owner & Contact Information */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <People24Regular className="w-3.5 h-3.5" />
                    <span>{t('crmDecisionMaker')}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                        {t('crmOwnerName')}
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {activeDeal.ownerName}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                        Email
                      </span>
                      <span className="font-bold text-blue-500 break-all">
                        {activeDeal.ownerEmail}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                        Phone
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {activeDeal.ownerPhone}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-[var(--text-muted)]">
                        {t('crmCity')}
                      </span>
                      <span className="font-bold text-[var(--text-primary)]">
                        {activeDeal.city} ({activeDeal.country})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes & Migration Strategy */}
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkle24Regular className="w-3.5 h-3.5" />
                    <span>{t('crmMigrationRationale')}</span>
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium whitespace-pre-line">
                    {activeDeal.notes}
                  </p>
                </div>

                {/* Activity Log & Add Note */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Clock24Regular className="w-3.5 h-3.5" />
                    <span>{t('crmActivityHistory')} ({activeDeal.activities.length})</span>
                  </h4>

                  {/* Add Note Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                      placeholder={t('crmLogTouchpoint')}
                      className="flex-1 h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleAddNote}
                      className="btn-primary h-11 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    >
                      <Send24Filled className="w-3.5 h-3.5" />
                      <span>{t('crmLogBtn')}</span>
                    </button>
                  </div>

                  {/* Log List */}
                  <div className="space-y-2 pt-2">
                    {activeDeal.activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                          <span className="font-bold text-blue-500 uppercase">
                            {act.type} · {act.author}
                          </span>
                          <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-[var(--text-primary)] font-medium">
                          {act.summary}
                        </p>
                        {act.details && (
                          <p className="text-[11px] text-[var(--text-secondary)] italic">
                            {act.details}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW SALON DEAL CREATION MODAL */}
      <AnimatePresence>
        {isNewDealModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewDealModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative z-10 w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[90vh]"
            >
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 md:hidden" />

              <div className="p-4 sm:p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                  {t('crmLogNewDeal')}
                </h3>
                <button
                  onClick={() => setIsNewDealModalOpen(false)}
                  className="btn-tertiary w-8 h-8 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="p-4 sm:p-6 space-y-4 overflow-y-auto no-scrollbar flex-1">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] mb-1">
                    {t('crmSalonName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSalonName}
                    onChange={(e) => setNewSalonName(e.target.value)}
                    placeholder="e.g. Bespoke Hair Lounge"
                    className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] mb-1">
                      {t('crmOwnerName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newOwnerName}
                      onChange={(e) => setNewOwnerName(e.target.value)}
                      placeholder="e.g. Marco Rossi"
                      className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] mb-1">
                      {t('crmCity')}
                    </label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Miami, FL"
                      className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newOwnerEmail}
                      onChange={(e) => setNewOwnerEmail(e.target.value)}
                      placeholder="owner@salon.com"
                      className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newOwnerPhone}
                      onChange={(e) => setNewOwnerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <CustomSelect
                      label={t('crmReplacing')}
                      value={newCompetitor}
                      onChange={(val) => setNewCompetitor(val as CompetitorReplaced)}
                      options={[
                        { value: 'Fresha (20% Fee Trap)', label: 'Fresha (20% Fee Trap)' },
                        { value: 'Vagaro (Add-on Creep)', label: 'Vagaro (Add-on Creep)' },
                        { value: 'Boulevard ($175+ Base)', label: 'Boulevard ($175+ Base)' },
                        { value: 'Booksy (Boost Tax)', label: 'Booksy (Boost Tax)' },
                        { value: 'Square Appointments', label: 'Square Appointments' },
                        { value: 'Phorest', label: 'Phorest' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] mb-1">
                      {t('crmChairs')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={newChairs}
                      onChange={(e) => setNewChairs(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] mb-1">
                      {t('crmEstMonthlyGmv')} ($)
                    </label>
                    <input
                      type="number"
                      step={1000}
                      value={newGmv}
                      onChange={(e) => setNewGmv(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <CustomSelect
                      label={t('crmAirBookTier')}
                      value={newTier}
                      onChange={(val) => setNewTier(val as any)}
                      options={[
                        { value: 'solo_pro_29', label: 'Solo Pro ($29/mo)' },
                        { value: 'team_79', label: 'Team & Boutique ($79/mo)' },
                        { value: 'scale_199', label: 'Scale Multi-Location ($199/mo)' },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] mb-1">
                    {t('crmMigrationRationale')}
                  </label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Migration notes, pain points, custom requirements..."
                    className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsNewDealModalOpen(false)}
                    className="btn-secondary h-11 px-4 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {t('crmCancelBtn')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Add24Filled className="w-4 h-4" />
                    <span>{isSubmitting ? t('crmCreatingRecord') : t('crmCreateDealBtn')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
