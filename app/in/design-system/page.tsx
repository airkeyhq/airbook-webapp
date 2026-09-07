'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Language } from '@/lib/i18n/translations';
import { FloatingInput } from '@/components/FloatingInput';
import { CustomSelect } from '@/components/CustomSelect';
import { ColorPicker } from '@/components/ColorPicker';
import { EmptyState } from '@/components/EmptyState';
import { GoToAppPill } from '@/components/GoToAppPill';
import {
  Sparkle24Regular,
  Sparkle24Filled,
  CheckmarkCircle24Regular,
  CheckmarkCircle24Filled,
  Add24Filled,
  Copy24Filled,
  Delete24Filled,
  Flash24Filled,
  Globe24Regular,
  Key24Regular,
  Key24Filled,
  LockClosed24Regular,
  Mail24Regular,
  Tag24Regular,
  Calendar24Filled,
  Calendar24Regular,
  Warning24Regular,
  Info24Regular,
  People24Regular,
  Clock24Regular,
  ChevronRight24Regular,
  ChevronDown24Regular,
  Folder24Regular,
  FolderOpen24Regular,
  Document24Regular,
  Search24Regular,
  Dismiss24Filled,
  Navigation24Filled,
  Code24Regular,
  Eye24Regular,
  ShieldCheckmark24Regular,
  Checkmark24Filled,
  Color24Regular,
} from '@fluentui/react-icons';

interface TreeCategory {
  id: string;
  label: string;
  items: {
    id: string;
    label: string;
    tag?: string;
    description: string;
  }[];
}

const TREE_DATA: TreeCategory[] = [
  {
    id: 'feedback',
    label: 'Feedback & Indicators',
    items: [
      {
        id: 'status-pure',
        label: 'Pure Pulsing Indicators',
        tag: 'Invariant',
        description: 'Quiet, borderless pulsing dots for healthy states with instant custom floating tooltips. Unhealthy states display companion banners.',
      },
      {
        id: 'tooltips',
        label: 'Custom Floating Tooltips',
        tag: 'No-Lag',
        description: 'Instant zero-delay floating tooltips with crisp caret arrows, high contrast dark pill container, and clean positioning.',
      },
      {
        id: 'alerts',
        label: 'Companion Alert Banners',
        tag: 'Priority',
        description: 'Prominent contextual alert banners rendered strictly when status degrades to Warning (amber-500) or Critical (rose-500).',
      },
    ],
  },
  {
    id: 'iconography',
    label: 'Iconography & Checkmarks',
    items: [
      {
        id: 'icons-rules',
        label: '*Filled (CTAs) vs *Regular (Display)',
        tag: 'Rule',
        description: '*Filled icons are strictly reserved for clickable interactive action triggers. *Regular icons are strictly used for display labels, headers, and metadata.',
      },
      {
        id: 'checkmarks-system',
        label: 'AirBook Checkmark Taxonomy',
        tag: 'Standard',
        description: 'Standardized checkmark taxonomy across 5 core archetypes: Action Confirmation (Checkmark24Filled), Feature Checklists (CheckmarkCircle24Regular), Security & Passkey Guarantees (ShieldCheckmark24Regular), Tactile Spring Checkboxes, and Dropdown Selection Badges.',
      },
      {
        id: 'zero-emojis',
        label: 'Zero Emoji Invariant',
        tag: 'Strict',
        description: 'Emojis are strictly prohibited in buttons, headers, titles, or status tags. Always use Fluent vector icons.',
      },
    ],
  },
  {
    id: 'buttons',
    label: 'Actions & Buttons',
    items: [
      {
        id: 'btn-primary',
        label: 'Tier 1: .btn-primary (Electric Blue)',
        tag: 'CTA',
        description: 'Electric sky blue (#2BB5FF) conversion CTA with ambient inner highlight, signature glow shadow, and tactile micro-spring physics.',
      },
      {
        id: 'btn-secondary',
        label: 'Tier 2: .btn-secondary (Surface Pill)',
        tag: 'Action',
        description: 'Tactile surface pill with subtle border and crisp hover highlight for secondary, exploratory, or complementary actions.',
      },
      {
        id: 'btn-tertiary',
        label: 'Tier 3: .btn-tertiary (Ghost Aux)',
        tag: 'Utility',
        description: 'Borderless ghost pill for auxiliary actions, dismissal triggers, and compact utility controls.',
      },
      {
        id: 'gotoapp-pill',
        label: 'Concentric Capsule: <GoToAppPill />',
        tag: 'Concentric R',
        description: 'Concentric nested user navigation capsule adhering to Outer Radius (20px) = Inner Radius (14px) + Padding (6px) geometric harmony.',
      },
    ],
  },
  {
    id: 'forms',
    label: 'Atomic Form Controls',
    items: [
      {
        id: 'floating-input',
        label: 'Floating Input Physics (52px)',
        tag: 'Atomic',
        description: '52px uniform height, animated floating label physics, zero redundant placeholder clutter, and embedded vector accessories.',
      },
      {
        id: 'custom-select',
        label: 'Custom Select Popovers',
        tag: 'Popover',
        description: 'Custom-coded select menu with popover container isolation, smooth spring animations, and zero native OS delegation.',
      },
      {
        id: 'color-picker',
        label: 'AirBook Color Studio DNA',
        tag: 'Custom HSL',
        description: '100% custom-coded color picker with 2D spectrum canvas, rainbow hue slider, luxury salon presets, eyedropper, and zero native OS delegation.',
      },
      {
        id: 'range-slider',
        label: 'Electric Range Sliders',
        tag: 'Controls',
        description: 'Electric blue slider with dynamic progress track fill, tactile pill handle, and numerical badge readouts.',
      },
    ],
  },
  {
    id: 'tokens',
    label: 'Design Tokens & CSS Variables',
    items: [
      {
        id: 'tokens-colors',
        label: 'Structural Color Tokens',
        tag: 'Theming',
        description: 'Complete palette of CSS custom properties powering light/dark mode theming across all surfaces and containers.',
      },
      {
        id: 'tokens-borders',
        label: 'Border & Surface Radius',
        tag: 'Geometry',
        description: 'System of corner radiuses from rounded-xl (12px) to rounded-3xl (24px) ensuring visual rhythm across all viewports.',
      },
    ],
  },
  {
    id: 'layout',
    label: 'Layout & Empty States',
    items: [
      {
        id: 'empty-states',
        label: 'Mandatory Standard Empty State',
        tag: 'Pattern',
        description: 'Dashed border container with centered *Regular vector icon, bold title, helpful subtitle, and optional primary CTA.',
      },
      {
        id: 'badge-pills',
        label: 'Non-Wrapping Pill Badges',
        tag: 'Typography',
        description: 'Single-word and punchy phrase status badges with mandatory whitespace-nowrap flex-shrink-0 to prevent line breaks.',
      },
    ],
  },
];

export default function DesignSystemTokenLabPage() {
  const { t, language, setLanguage } = useTranslation();

  // Tree Nav State
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    feedback: true,
    iconography: true,
    buttons: true,
    forms: true,
    tokens: true,
    layout: true,
  });
  const [activeItemId, setActiveItemId] = useState<string>('status-pure');
  const [treeQuery, setTreeQuery] = useState('');
  const [isMobileTreeOpen, setIsMobileTreeOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Interactive Playground States
  const [statusMode, setStatusMode] = useState<'healthy' | 'warning' | 'critical'>('healthy');
  const [statusHovered, setStatusHovered] = useState(false);
  const [demoPinging, setDemoPinging] = useState(false);
  const [inputText, setInputText] = useState('Hair Balayage & Glaze');
  const [emptyInputText, setEmptyInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('hair');
  const [demoChecks, setDemoChecks] = useState<Record<string, boolean>>({
    smsAlerts: true,
    passkeyAuth: true,
    stripeDeposit: true,
    quietSession: false,
    googleCalendarSync: true,
  });
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<'standard' | 'pro'>('pro');
  const [sliderVal, setSliderVal] = useState(45);
  const [btnLoading, setBtnLoading] = useState(false);
  const [demoColor, setDemoColor] = useState('#2BB5FF');

  const categories = [
    { value: 'hair', label: 'Hair & Color' },
    { value: 'nails', label: 'Nails & Manicure' },
    { value: 'skin', label: 'Esthetics & Facial' },
    { value: 'massage', label: 'Therapeutic Massage' },
  ];

  const colorTokens = [
    { name: '--bg-primary', cssVar: 'var(--bg-primary)', desc: 'Primary card & layout surface' },
    { name: '--bg-secondary', cssVar: 'var(--bg-secondary)', desc: 'Interactive inputs & secondary wells' },
    { name: '--text-primary', cssVar: 'var(--text-primary)', desc: 'High-contrast titles & body' },
    { name: '--text-secondary', cssVar: 'var(--text-secondary)', desc: 'Subtitles & metadata microcopy' },
    { name: '--text-muted', cssVar: 'var(--text-muted)', desc: 'Placeholders & disabled elements' },
    { name: '--border-subtle', cssVar: 'var(--border-subtle)', desc: 'Tactile container outlines' },
    { name: '--color-accent-primary', cssVar: 'var(--color-accent-primary)', desc: 'Electric sky blue (#2BB5FF)' },
  ];

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleSelectItem = (itemId: string) => {
    setActiveItemId(itemId);
    setIsMobileTreeOpen(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const filteredTree = useMemo(() => {
    if (!treeQuery.trim()) return TREE_DATA;
    const q = treeQuery.toLowerCase();
    return TREE_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (it) => it.label.toLowerCase().includes(q) || cat.label.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [treeQuery]);

  // Find active item & parent category details
  const activeItemData = useMemo(() => {
    for (const cat of TREE_DATA) {
      const found = cat.items.find((it) => it.id === activeItemId);
      if (found) {
        return { category: cat, item: found };
      }
    }
    return { category: TREE_DATA[0], item: TREE_DATA[0].items[0] };
  }, [activeItemId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6 pb-20">
      {/* ─── HERO LAB HEADER ─── */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Living Design System & Token Lab v2.5</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
              Design System & Viewport Canvas
            </h1>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Isolated component viewports enforcing strict UI invariants, live interactive controls, props playground, and copyable design tokens.
            </p>
          </div>

          {/* 4-Language Live Stress Test Picker */}
          <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 flex-shrink-0 self-start lg:self-auto">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
              Live Language Stress Test
            </span>
            <div className="flex items-center gap-1">
              {(['en', 'es', 'de', 'fr'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                    language === lang
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN LAYOUT: TREE NAVIGATION + ISOLATED VIEWPORT CANVAS ─── */}
      <div className="flex flex-col lg:flex-row items-start gap-6 relative">
        {/* Mobile Tree Nav Trigger Button */}
        <div className="lg:hidden w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Navigation24Filled className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold text-[var(--text-primary)]">
              {activeItemData.category.label} / {activeItemData.item.label}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileTreeOpen(!isMobileTreeOpen)}
            className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold"
          >
            {isMobileTreeOpen ? 'Close Menu' : 'Browse Tree'}
          </button>
        </div>

        {/* ─── TREE NAVIGATION SIDEBAR ─── */}
        <aside
          className={`w-full lg:w-72 flex-shrink-0 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-4 space-y-3 shadow-xs sticky top-24 z-30 transition-all ${
            isMobileTreeOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Tree Search Box */}
          <div className="relative">
            <Search24Regular className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={treeQuery}
              onChange={(e) => setTreeQuery(e.target.value)}
              placeholder="Search components & tokens…"
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
            />
            {treeQuery && (
              <button
                type="button"
                onClick={() => setTreeQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <Dismiss24Filled className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tree Structure */}
          <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {filteredTree.map((category) => {
              const isOpen = !!openFolders[category.id] || !!treeQuery;
              return (
                <div key={category.id} className="space-y-1">
                  {/* Category Folder Row */}
                  <button
                    type="button"
                    onClick={() => toggleFolder(category.id)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      {isOpen ? (
                        <FolderOpen24Regular className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Folder24Regular className="w-4 h-4 text-[var(--text-muted)]" />
                      )}
                      <span className="tracking-tight">{category.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {category.items.length}
                      </span>
                      {isOpen ? (
                        <ChevronDown24Regular className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      ) : (
                        <ChevronRight24Regular className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      )}
                    </div>
                  </button>

                  {/* Leaf Item List */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-5 space-y-0.5 overflow-hidden"
                      >
                        {category.items.map((item) => {
                          const isSelected = activeItemId === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectItem(item.id)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left group ${
                                isSelected
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <Document24Regular className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-500' : 'text-[var(--text-muted)]'}`} />
                                <span className="truncate">{item.label}</span>
                              </div>

                              {item.tag && (
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${
                                  isSelected
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                                }`}>
                                  {item.tag}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ─── DEDICATED ISOLATED VIEWPORT CANVAS ─── */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItemId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* ─── VIEWPORT HEADER & BREADCRUMB ─── */}
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                    <span>{activeItemData.category.label}</span>
                    <span>/</span>
                    <span className="text-blue-500 font-bold">{activeItemData.item.label}</span>
                  </div>

                  {activeItemData.item.tag && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                      #{activeItemData.item.tag}
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-[var(--text-primary)] tracking-tight">
                  {activeItemData.item.label}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {activeItemData.item.description}
                </p>
              </div>

              {/* ─── ISOLATED VIEWPORT VIEW SWITCHER ─── */}
              {activeItemId === 'status-pure' && (
                <div className="space-y-6">
                  {/* Live Stage */}
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                        <Eye24Regular className="w-4 h-4 text-blue-500" />
                        <span>Live Stage Preview</span>
                      </div>

                      {/* Interactive Mode Picker */}
                      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setStatusMode('healthy')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            statusMode === 'healthy' ? 'bg-emerald-500 text-white shadow-xs' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          Healthy
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusMode('warning')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            statusMode === 'warning' ? 'bg-amber-500 text-white shadow-xs' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          Degraded
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatusMode('critical')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            statusMode === 'critical' ? 'bg-rose-500 text-white shadow-xs' : 'text-[var(--text-secondary)]'
                          }`}
                        >
                          Critical
                        </button>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Pure Pulsing Dot with Instant Tooltip */}
                        <div
                          className="relative flex items-center justify-center cursor-help py-1"
                          onMouseEnter={() => setStatusHovered(true)}
                          onMouseLeave={() => setStatusHovered(false)}
                        >
                          <div className="relative flex items-center justify-center w-3 h-3">
                            <span
                              className={`animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75 ${
                                statusMode === 'healthy'
                                  ? 'bg-emerald-400'
                                  : statusMode === 'warning'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-400'
                              }`}
                            />
                            <span
                              className={`relative inline-flex rounded-full h-2 w-2 ${
                                statusMode === 'healthy'
                                  ? 'bg-emerald-500'
                                  : statusMode === 'warning'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                          </div>

                          {/* Instant Custom React Tooltip */}
                          <AnimatePresence>
                            {statusHovered && (
                              <motion.div
                                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                transition={{ duration: 0.08 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
                              >
                                <div className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xl whitespace-nowrap border border-slate-700/50 flex items-center gap-1.5">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      statusMode === 'healthy'
                                        ? 'bg-emerald-400'
                                        : statusMode === 'warning'
                                        ? 'bg-amber-400'
                                        : 'bg-rose-400'
                                    }`}
                                  />
                                  <span>
                                    {statusMode === 'healthy'
                                      ? t('mcpStatusActive')
                                      : statusMode === 'warning'
                                      ? 'High Latency / Degraded'
                                      : 'MCP Server Offline'}
                                  </span>
                                </div>
                                <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700/50" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          AirBook MCP Production Cluster
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={demoPinging}
                        onClick={() => {
                          setDemoPinging(true);
                          setTimeout(() => setDemoPinging(false), 800);
                        }}
                        className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto"
                      >
                        <Flash24Filled className={`w-4 h-4 text-blue-500 ${demoPinging ? 'animate-spin' : ''}`} />
                        <span>{demoPinging ? 'Pinging Cluster…' : 'Ping Endpoint'}</span>
                      </button>
                    </div>

                    {/* Companion Banner Preview */}
                    {statusMode !== 'healthy' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 font-semibold ${
                          statusMode === 'warning'
                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200'
                            : 'bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200'
                        }`}
                      >
                        <Warning24Regular className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {statusMode === 'warning'
                            ? 'Degraded Performance: Response latency is exceeding 800ms.'
                            : 'Critical Alert: MCP endpoint unreachable. Rotate API secret keys immediately.'}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Code Snippet & Invariant Guide */}
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Code24Regular className="w-4 h-4 text-blue-500" />
                        <span>Implementation Pattern</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            `<div className="relative flex items-center justify-center cursor-help py-1" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>\n  <div className="relative flex items-center justify-center w-3 h-3">\n    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75" />\n    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />\n  </div>\n</div>`
                          )
                        }
                        className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        {copiedSnippet ? <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" /> : <Copy24Filled className="w-3.5 h-3.5" />}
                        <span>{copiedSnippet ? 'Copied' : 'Copy JSX'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto text-[11px] font-mono text-[var(--text-primary)] leading-relaxed">
{`// Pure Pulsing Status Dot (No container badge clutter)
<div className="relative flex items-center justify-center cursor-help"
     onMouseEnter={() => setHovered(true)}
     onMouseLeave={() => setHovered(false)}>
  <div className="relative flex items-center justify-center w-3 h-3">
    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
  </div>
</div>`}
                    </pre>
                  </div>
                </div>
              )}

              {activeItemId === 'tooltips' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                      <Eye24Regular className="w-4 h-4 text-blue-500" />
                      <span>Custom React Tooltip Physics</span>
                    </div>

                    <div className="p-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-around gap-8">
                      {/* Top Tooltip */}
                      <div className="relative group">
                        <button type="button" className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold">
                          Hover for Top Tooltip
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                          <div className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xl whitespace-nowrap border border-slate-700/50">
                            Instant floating tooltip
                          </div>
                          <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700/50" />
                        </div>
                      </div>

                      {/* Bottom Tooltip */}
                      <div className="relative group">
                        <button type="button" className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold">
                          Hover for Bottom Tooltip
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block z-50 pointer-events-none">
                          <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 mx-auto -mb-1 border-l border-t border-slate-700/50" />
                          <div className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xl whitespace-nowrap border border-slate-700/50">
                            High-contrast caret physics
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'alerts' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                      <Eye24Regular className="w-4 h-4 text-blue-500" />
                      <span>Priority Companion Banners</span>
                    </div>

                    <div className="space-y-4">
                      {/* Warning Banner */}
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-3">
                        <Warning24Regular className="w-5 h-5 flex-shrink-0 text-amber-500" />
                        <div>
                          <p className="font-bold">Degraded Performance (Warning)</p>
                          <p className="text-[11px] opacity-80 mt-0.5">Response times are higher than expected. Background jobs are queued.</p>
                        </div>
                      </div>

                      {/* Critical Banner */}
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-3">
                        <Dismiss24Filled className="w-5 h-5 flex-shrink-0 text-rose-500" />
                        <div>
                          <p className="font-bold">Service Disrupted (Critical)</p>
                          <p className="text-[11px] opacity-80 mt-0.5">Authentication endpoint failed. Check database and API credentials.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'icons-rules' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Correct */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border-2 border-emerald-500/30 space-y-4 shadow-xs">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                        <CheckmarkCircle24Regular className="w-4 h-4" />
                        <span>CORRECT (*Filled CTAs & *Regular Labels)</span>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <Calendar24Regular className="w-4 h-4 text-[var(--text-muted)]" />
                            <span>Schedule Header (*Regular)</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            Display Only
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-between">
                          <button type="button" className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                            <Add24Filled className="w-3.5 h-3.5" />
                            <span>Book Appointment (*Filled)</span>
                          </button>
                          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            Interactive CTA
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Prohibited */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border-2 border-rose-500/30 space-y-4 shadow-xs opacity-80">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-xs">
                        <Warning24Regular className="w-4 h-4" />
                        <span>PROHIBITED (Rule Violations)</span>
                      </div>

                      <div className="space-y-3">
                        <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 line-through text-rose-500">
                            <Calendar24Filled className="w-4 h-4 text-rose-500" />
                            <span>*Filled Icon on Static Label</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-md">
                            Violates Invariant
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-primary)] line-through text-rose-500">
                            📅 Emoji in Button Text
                          </span>
                          <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-md">
                            Zero Emojis
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'checkmarks-system' && (
                <div className="space-y-6">
                  {/* ─── LIVE STAGE: 4 CORE CHECKMARK ARCHETYPES ─── */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                        <Eye24Regular className="w-4 h-4 text-blue-500" />
                        <span>Interactive Checkmark Taxonomy & Controls</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase self-start sm:self-auto">
                        5 Active Archetypes
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ARCHETYPE 1: Action Confirmation Button (*Filled) */}
                      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[var(--text-primary)]">
                              1. Action Confirmation Pill
                            </span>
                            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-md">
                              *Filled (CTA)
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            Strictly reserved for clickable triggers where the checkmark represents an affirmative action (e.g. <em>Mark all read</em>, <em>Copy snippet</em>, <em>Confirm reservation</em>).
                          </p>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActionConfirmed(true);
                              setTimeout(() => setActionConfirmed(false), 2000);
                            }}
                            className={`w-full h-10 px-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                              actionConfirmed
                                ? 'bg-emerald-500 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5)]'
                                : 'btn-primary'
                            }`}
                          >
                            <Checkmark24Filled className="w-4 h-4" />
                            <span>{actionConfirmed ? 'All Notifications Marked Read!' : 'Mark All Read (*Filled)'}</span>
                          </button>
                        </div>
                      </div>

                      {/* ARCHETYPE 2: Feature Bullet & Checklist Manifest (*Regular) */}
                      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[var(--text-primary)]">
                              2. Feature Bullet & Checklist
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md">
                              *Regular (Display)
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            Used for read-only feature checklists on comparative pricing tiers, package inclusions, and service capabilities with normalized baseline heights.
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {[
                            'Unlimited 24/7 client online self-booking',
                            'Automated 2-way SMS reminders & reviews',
                            'Zero-fee Tap to Pay iPhone/Android POS',
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                              <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ARCHETYPE 3: Security & Passkey Guarantee */}
                      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[var(--text-primary)]">
                              3. Security & Compliance Seal
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                              Trust Shield
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            Dedicated to biometric WebAuthn passkey identity, Stripe deposit guard, and HIPAA / SOC2 audit compliance seals.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-emerald-500/30 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                              <ShieldCheckmark24Regular className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-black text-[var(--text-primary)] truncate">
                                100% Passwordless Security
                              </h4>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">
                                Zero stored credentials in database
                              </p>
                            </div>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                        </div>
                      </div>

                      {/* ARCHETYPE 4: Custom Tactile Animated Checkbox */}
                      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[var(--text-primary)]">
                              4. Tactile Spring Checkbox
                            </span>
                            <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-500/10 px-2 py-0.5 rounded-md">
                              Custom Coded
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                            100% custom-coded React control with snappy spring animation, electric blue fill (#2BB5FF), and zero browser native delegation.
                          </p>
                        </div>

                        <div className="space-y-2 pt-1">
                          {[
                            { key: 'smsAlerts', label: 'Automated 24h SMS Reminders' },
                            { key: 'stripeDeposit', label: 'Stripe Deposit Protection' },
                            { key: 'quietSession', label: 'Quiet Chair Preference' },
                          ].map(({ key, label }) => {
                            const isChecked = Boolean(demoChecks[key]);
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() =>
                                  setDemoChecks((prev) => ({ ...prev, [key]: !prev[key] }))
                                }
                                className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-blue-500/40 transition-colors text-left cursor-pointer"
                              >
                                <span className="text-xs font-bold text-[var(--text-primary)] select-none">
                                  {label}
                                </span>
                                <div
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                                    isChecked
                                      ? 'bg-[#2BB5FF] text-white shadow-xs scale-100'
                                      : 'bg-black/5 dark:bg-white/10 border border-[var(--border-subtle)] text-transparent scale-95'
                                  }`}
                                >
                                  <motion.div
                                    initial={false}
                                    animate={{ scale: isChecked ? 1 : 0 }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                                  >
                                    <Checkmark24Filled className="w-3.5 h-3.5 text-white" />
                                  </motion.div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─── CHECKMARK TAXONOMY RULES & INVARIANTS ─── */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                    <h3 className="text-sm font-black text-[var(--text-primary)] tracking-tight">
                      Checkmark Invariant Rules & Guidelines
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <Checkmark24Filled className="w-4 h-4" />
                          <span>Actions & Triggers</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Always use <code>&lt;Checkmark24Filled /&gt;</code> inside interactive buttons. Translation strings must never contain literal &apos;+&apos; or check symbols.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-500">
                          <CheckmarkCircle24Regular className="w-4 h-4" />
                          <span>Display Manifests</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Always use <code>&lt;CheckmarkCircle24Regular /&gt;</code> for static feature bullets and pricing checklists to prevent false affordances.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-purple-500">
                          <ShieldCheckmark24Regular className="w-4 h-4" />
                          <span>Trust & Identity</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Always use <code>&lt;ShieldCheckmark24Regular /&gt;</code> for passkey, biometric identity, and zero-password guarantees.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ─── COPYABLE IMPLEMENTATION SNIPPET ─── */}
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Code24Regular className="w-4 h-4 text-blue-500" />
                        <span>Tactile Custom Checkbox Component Code</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            `// Tactile Custom Checkbox (Zero Browser Delegation)\n<button type="button" onClick={() => setChecked(!checked)} className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-blue-500/40 transition-colors">\n  <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>\n  <div className={\`w-5 h-5 rounded-lg flex items-center justify-center transition-all \${checked ? 'bg-[#2BB5FF] text-white shadow-xs' : 'bg-black/5 dark:bg-white/10 border border-[var(--border-subtle)]'}\`}>\n    {checked && <Checkmark24Filled className="w-3.5 h-3.5 text-white" />}\n  </div>\n</button>`
                          )
                        }
                        className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        {copiedSnippet ? <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" /> : <Copy24Filled className="w-3.5 h-3.5" />}
                        <span>{copiedSnippet ? 'Copied' : 'Copy JSX'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto text-[11px] font-mono text-[var(--text-primary)] leading-relaxed">
{`// AirBook Tactile Checkbox Component Pattern
<button
  type="button"
  onClick={() => setChecked(!checked)}
  className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-blue-500/40 transition-colors"
>
  <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>
  <div className={\`w-5 h-5 rounded-lg flex items-center justify-center transition-all \${
    checked
      ? 'bg-[#2BB5FF] text-white shadow-xs'
      : 'bg-black/5 dark:bg-white/10 border border-[var(--border-subtle)]'
  }\`}>
    {checked && <Checkmark24Filled className="w-3.5 h-3.5 text-white" />}
  </div>
</button>`}
                    </pre>
                  </div>
                </div>
              )}

              {activeItemId === 'zero-emojis' && (
                <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                    <ShieldCheckmark24Regular className="w-4 h-4 text-emerald-500" />
                    <span>Strict Zero Emoji Policy</span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                    <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                      Emojis render inconsistently across Apple, Windows, and Android devices. AirBook enforces 100% Fluent vector icons for pristine cross-platform fidelity.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)]">
                        <Sparkle24Regular className="w-3.5 h-3.5 text-blue-500" />
                        <span>AI Assistant</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)]">
                        <Clock24Regular className="w-3.5 h-3.5 text-amber-500" />
                        <span>45 min Buffer</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)]">
                        <LockClosed24Regular className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Passwordless</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'btn-primary' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                        <Eye24Regular className="w-4 h-4 text-blue-500" />
                        <span>Tactile Electric Blue Conversion CTA</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBtnLoading(true);
                          setTimeout(() => setBtnLoading(false), 1200);
                        }}
                        className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold"
                      >
                        {btnLoading ? 'Simulating…' : 'Trigger Loading State'}
                      </button>
                    </div>

                    <div className="p-10 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center">
                      <button
                        type="button"
                        disabled={btnLoading}
                        className="btn-primary h-12 px-8 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg"
                      >
                        <Add24Filled className={`w-4 h-4 ${btnLoading ? 'animate-spin' : ''}`} />
                        <span>{btnLoading ? 'Confirming Booking…' : 'Get Started Free'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'btn-secondary' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                      <Eye24Regular className="w-4 h-4 text-blue-500" />
                      <span>Tactile Surface Secondary Pill</span>
                    </div>

                    <div className="p-10 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center">
                      <button type="button" className="btn-secondary h-12 px-8 rounded-2xl text-xs font-bold flex items-center gap-2">
                        <Copy24Filled className="w-4 h-4 text-[var(--text-secondary)]" />
                        <span>Explore Live Storefront</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'btn-tertiary' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                      <Eye24Regular className="w-4 h-4 text-blue-500" />
                      <span>Ghost Auxiliary & Dismissal Pill</span>
                    </div>

                    <div className="p-10 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center">
                      <button type="button" className="btn-tertiary h-12 px-8 rounded-2xl text-xs font-bold flex items-center gap-2 text-rose-500">
                        <Delete24Filled className="w-4 h-4" />
                        <span>Revoke Secret Key</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'gotoapp-pill' && (
                <div className="space-y-6">
                  {/* Live Interactive Stage */}
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                        <Eye24Regular className="w-4 h-4 text-blue-500" />
                        <span>Concentric Nested Capsule Live Stage</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-xl">
                        R_outer = R_inner + Padding
                      </span>
                    </div>

                    {/* Live Demos */}
                    <div className="p-10 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-around gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[11px] font-bold text-[var(--text-muted)]">Default Authenticated User</span>
                        <GoToAppPill
                          name="Elena Rostova"
                          email="elena@solaris-spa.de"
                          image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                        />
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[11px] font-bold text-[var(--text-muted)]">Fallback Initials Avatar</span>
                        <GoToAppPill
                          name="Marcus Vance"
                          email="marcus@vance-barbershop.com"
                          image={null}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Concentric Geometric Formula Anatomy Breakdown */}
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-5 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                      <Sparkle24Filled className="w-4 h-4 text-[#2BB5FF]" />
                      <span>Concentric Geometry Anatomy &amp; Radius Invariant</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Outer Capsule */}
                      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[var(--text-primary)]">Outer Capsule</span>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">
                            Height: 40px
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Height <code className="text-xs font-mono font-bold text-[var(--text-primary)]">40px (h-10)</code> with <code className="text-xs font-mono font-bold text-[var(--text-primary)]">rounded-full</code> yields an Outer Corner Radius of <strong className="text-blue-500">20px</strong>.
                        </p>
                      </div>

                      {/* Uniform Inset Padding */}
                      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[var(--text-primary)]">Uniform Inset</span>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
                            Padding: 6px
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Uniform <code className="text-xs font-mono font-bold text-[var(--text-primary)]">p-[6px]</code> on all 4 sides creates exact mathematical concentric alignment for all inner children.
                        </p>
                      </div>

                      {/* Inner Button Pill */}
                      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[var(--text-primary)]">Nested CTA Pill</span>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-500">
                            Height: 28px
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          Height <code className="text-xs font-mono font-bold text-[var(--text-primary)]">28px (!h-7)</code> with <code className="text-xs font-mono font-bold text-[var(--text-primary)]">!rounded-full</code> yields an Inner Corner Radius of <strong className="text-purple-500">14px</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Mathematical Formula Proof Card */}
                    <div className="p-4 rounded-2xl bg-[#2BB5FF]/10 border border-[#2BB5FF]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div>
                        <p className="text-xs font-extrabold text-[#0284C7] dark:text-[#2BB5FF]">
                          Concentric Radius Formula
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-0.5">
                          Guarantees 1:1 circular curve parallel symmetry with zero optical distortion.
                        </p>
                      </div>
                      <div className="font-mono text-xs font-black px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] whitespace-nowrap shadow-xs">
                        Outer R (20px) = Inner R (14px) + Padding (6px)
                      </div>
                    </div>
                  </div>

                  {/* Code Snippet & Implementation Pattern */}
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Code24Regular className="w-4 h-4 text-blue-500" />
                        <span>Implementation Pattern</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            `<GoToAppPill\n  name={session.user.name}\n  image={session.user.image}\n  email={session.user.email}\n  href="/dashboard"\n/>`
                          )
                        }
                        className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        {copiedSnippet ? <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" /> : <Copy24Filled className="w-3.5 h-3.5" />}
                        <span>{copiedSnippet ? 'Copied' : 'Copy JSX'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto text-[11px] font-mono text-[var(--text-primary)] leading-relaxed">
{`import { GoToAppPill } from '@/components/GoToAppPill';

// Rendered in Marketing Header & Public Pages when session?.user is active
{session?.user ? (
  <GoToAppPill
    name={session.user.name}
    image={session.user.image}
    email={session.user.email}
    href="/dashboard"
  />
) : (
  <Link href="/onboarding" className="btn-primary">
    <span>Get Started Free</span>
  </Link>
)}`}
                    </pre>
                  </div>
                </div>
              )}

              {activeItemId === 'floating-input' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                      <Eye24Regular className="w-4 h-4 text-blue-500" />
                      <span>52px Atomic Floating Label Physics</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingInput
                        id="stage-filled-input"
                        label="Service Title (Filled)"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        icon={<Sparkle24Regular className="w-4 h-4 text-[var(--text-muted)]" />}
                      />

                      <FloatingInput
                        id="stage-empty-input"
                        label="Practitioner Formula Notes (Empty)"
                        value={emptyInputText}
                        onChange={(e) => setEmptyInputText(e.target.value)}
                        icon={<Tag24Regular className="w-4 h-4 text-[var(--text-muted)]" />}
                        rightElement={
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600">
                            Auto-Save
                          </span>
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'custom-select' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                      <Eye24Regular className="w-4 h-4 text-blue-500" />
                      <span>Custom Select Popover Container</span>
                    </div>

                    <div className="max-w-md">
                      <CustomSelect
                        label="Service Category"
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        options={categories}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'color-picker' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                        <Eye24Regular className="w-4 h-4 text-blue-500" />
                        <span>AirBook Color Studio DNA (Custom HSL Spectrum)</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-xl">
                        Active: {demoColor}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <div className="space-y-4">
                        <ColorPicker
                          label="Primary Brand Color"
                          value={demoColor}
                          onChange={setDemoColor}
                        />

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          100% custom-coded React control eliminating native browser delegators. Features 2D HSL saturation/brightness crosshair spectrum, continuous rainbow hue slider, Eyedropper API, curated salon presets, and manual hex validation.
                        </p>
                      </div>

                      {/* Live Brand Preview Card */}
                      <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4 shadow-inner">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
                          Real-time Storefront Accent Simulation
                        </span>
                        <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-[var(--text-primary)]">
                              Balayage & Glaze Deluxe
                            </span>
                            <span
                              className="px-2.5 py-1 rounded-xl text-xs font-black text-white shadow-xs"
                              style={{ backgroundColor: demoColor }}
                            >
                              $185
                            </span>
                          </div>
                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-transform active:scale-97"
                            style={{ backgroundColor: demoColor }}
                          >
                            Book with Selected Accent
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code Snippet */}
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Code24Regular className="w-4 h-4 text-blue-500" />
                        <span>Implementation Pattern</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            `<ColorPicker\n  label="Primary Brand Accent"\n  value={brandColor}\n  onChange={setBrandColor}\n/>`
                          )
                        }
                        className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        {copiedSnippet ? <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" /> : <Copy24Filled className="w-3.5 h-3.5" />}
                        <span>{copiedSnippet ? 'Copied' : 'Copy JSX'}</span>
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto text-[11px] font-mono text-[var(--text-primary)] leading-relaxed">
{`import { ColorPicker } from '@/components/ColorPicker';

<ColorPicker
  label="Primary Brand Accent"
  value={brandColor}
  onChange={setBrandColor}
  presets={DEFAULT_AIRBOOK_PRESETS}
/>`}
                    </pre>
                  </div>
                </div>
              )}

              {activeItemId === 'range-slider' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                        <Eye24Regular className="w-4 h-4 text-blue-500" />
                        <span>Electric Range Slider with Duration Readout</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-xl">
                        {sliderVal} minutes
                      </span>
                    </div>

                    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                      <input
                        type="range"
                        min="0"
                        max="90"
                        step="5"
                        value={sliderVal}
                        onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                        <span>0 min</span>
                        <span>45 min</span>
                        <span>90 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeItemId === 'tokens-colors' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {colorTokens.map((tok) => (
                      <div
                        key={tok.name}
                        className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 shadow-xs"
                      >
                        <div
                          className="w-full h-12 rounded-xl border border-[var(--border-subtle)] shadow-inner flex items-center justify-center font-mono text-[10px] font-extrabold"
                          style={{ backgroundColor: tok.cssVar }}
                        >
                          {tok.name}
                        </div>
                        <div>
                          <code className="text-xs font-mono font-bold text-[var(--text-primary)]">
                            {tok.name}
                          </code>
                          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                            {tok.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeItemId === 'tokens-borders' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-2">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)]">rounded-xl (12px)</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Inner cards & interactive list items</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-2">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)]">rounded-2xl (16px)</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Buttons & form controls (h-10 / h-12 / h-13)</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-2">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)]">rounded-3xl (24px)</span>
                    <p className="text-[11px] text-[var(--text-secondary)]">Major section panels & modal dialogs</p>
                  </div>
                </div>
              )}

              {activeItemId === 'empty-states' && (
                <div className="space-y-6">
                  <EmptyState
                    icon={Key24Regular}
                    title="No Connected AI Agents"
                    description="Generate an AirBook API Key to connect autonomous phone receptionists, Claude Desktop, or Cursor to your workspace."
                    action={{
                      label: "Create Secret API Key",
                      onClick: () => {},
                    }}
                  />
                </div>
              )}

              {activeItemId === 'badge-pills' && (
                <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                    <Tag24Regular className="w-4 h-4 text-blue-500" />
                    <span>Non-Wrapping Microcopy Badges</span>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-wrap gap-2.5">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap flex-shrink-0">
                      Live Sync
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap flex-shrink-0">
                      Passwordless
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap flex-shrink-0">
                      High Latency
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 whitespace-nowrap flex-shrink-0">
                      MCP v1.2
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

