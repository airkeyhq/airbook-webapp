import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { typography, fontWeights, shadows, sizeTokens, spacingTokens, radiusTokens, colorTokens } from '@/lib/tokens';
import { Badge } from '@/components/primitives/Badge';
import { Icon } from '@/components/primitives/Icon';
import { Sparkle24Filled } from '@fluentui/react-icons';

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Typography: StoryObj = {
  render: () => (
    <div className="space-y-10 max-w-5xl select-none mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Typography Scale</h1>
          <Badge variant="dashed-blue" size="xs">Ozone UI</Badge>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Ozone UI pre-configured text sizes with lockstep line heights, letter spacing, and semantic roles.
        </p>
      </div>

      {/* 1. Complete Lockstep Typography Table with Clean Grid Alignment */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 shadow-xs overflow-x-auto">
        <div className="min-w-[760px] divide-y divide-[var(--border-subtle)]">
          {/* Header Row */}
          <div className="grid grid-cols-12 pb-3 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <div className="col-span-2">Token</div>
            <div className="col-span-6">Specimen Preview</div>
            <div className="col-span-2">Semantic Role</div>
            <div className="col-span-2 text-right">Size / Height (Weight)</div>
          </div>

          {/* Rows */}
          {Object.entries(typography).map(([name, spec]) => (
            <div key={name} className="grid grid-cols-12 py-3.5 items-center gap-2">
              {/* Token Name */}
              <div className="col-span-2">
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  text-{name}
                </span>
              </div>

              {/* Preview */}
              <div className="col-span-6 pr-4">
                <div
                  style={{
                    fontSize: spec.fontSize,
                    lineHeight: spec.lineHeight,
                    fontWeight: spec.fontWeight,
                    letterSpacing: spec.letterSpacing,
                    textTransform: (spec as any).textTransform || 'none',
                    fontFamily: (spec as any).fontFamily || 'inherit',
                  }}
                  className="text-[var(--text-primary)] truncate"
                  title="The quick brown fox jumps over the lazy dog"
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>

              {/* Semantic Role */}
              <div className="col-span-2">
                <span className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-tight">
                  {(spec as any).role}
                </span>
              </div>

              {/* Specs */}
              <div className="col-span-2 text-right">
                <div className="text-[11px] font-mono text-[var(--text-muted)]">
                  {spec.fontSize} / {spec.lineHeight}
                </div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] opacity-80">
                  ({spec.fontWeight})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Expressive Font Weight Scale */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">Expressive Font Weight Scale</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Full weight spectrum (400 Regular through 900 Black) for luxury salon headlines, KPI numbers, and overline badges.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {fontWeights.map((fw) => (
            <div
              key={fw.weight}
              className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] font-mono text-[var(--text-muted)]">{fw.weight}</div>
                <div className={`text-xl text-[var(--text-primary)] ${fw.class} mt-1`}>
                  Aa
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">{fw.name}</div>
                <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight">{fw.use}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Gaps & Milled Specular Shadows */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)]">Gaps & Milled Specular Shadows</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Hairline drop shadows and milled light reflections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[18px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-xs flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Envelope Card Shadow</span>
            <span className="text-xs text-[var(--text-secondary)]">shadow-card with concentric 18px radius</span>
          </div>

          <div className="p-6 rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-md flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Floating Dropdown Shadow</span>
            <span className="text-xs text-[var(--text-secondary)]">shadow-dropdown for popovers and menus</span>
          </div>

          <div className="p-6 rounded-[22px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-xl flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Settings Dialog Shadow</span>
            <span className="text-xs text-[var(--text-secondary)]">shadow-modal for high-elevation modals</span>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Roundness: StoryObj = {
  render: () => (
    <div className="space-y-8 max-w-5xl select-none mx-auto">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Concentric Radii & Roundness</h1>
          <Badge variant="dashed-blue" size="xs">Ozone UI</Badge>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Ozone mathematical curve matching: Outer Radius = Inner Radius + Padding. All cards maintain uniform standard structure.
        </p>
      </div>

      {/* Grid of standard uniform cards where only the inner elements demonstrate roundness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { token: 'rounded-sm (6px)', radius: '6px', name: 'sm', desc: 'Dropdown items, micro buttons, small tabs' },
          { token: 'rounded-md (8px)', radius: '8px', name: 'md', desc: 'Default buttons, filter chips, input accessories' },
          { token: 'rounded-xl (12px)', radius: '12px', name: 'xl', desc: 'Inner pills, badges, secondary cards' },
          { token: 'rounded-2xl (16px)', radius: '16px', name: '2xl', desc: 'Standard cards, modals, appointment blocks' },
          { token: 'rounded-3xl (24px)', radius: '24px', name: '3xl', desc: 'Bottom sheets, modal dialogs, empty states' },
          { token: 'envelope (18px)', radius: '18px', name: 'envelope', desc: 'Concentric card: 12px inner + 6px padding' },
          { token: 'envelope-lg (20px)', radius: '20px', name: 'envelope-lg', desc: 'Outer popover & section tray envelope' },
          { token: 'rounded-full (9999px)', radius: '9999px', name: 'full', desc: 'Full pill buttons, dock triggers, avatars' },
        ].map((item) => (
          <div
            key={item.name}
            className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-xs flex flex-col items-center justify-between gap-4 text-center"
          >
            <div
              style={{ borderRadius: item.radius }}
              className="h-16 w-16 bg-[#2BB5FF]/10 border-2 border-[#2BB5FF] flex items-center justify-center text-[11px] font-mono font-bold text-[#2BB5FF] shadow-xs select-none"
            >
              {item.radius === '9999px' ? 'pill' : item.radius}
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold font-mono text-[var(--text-primary)]">{item.token}</div>
              <div className="text-[11px] text-[var(--text-secondary)] leading-snug">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Interactive Envelope Capsule Demonstration */}
      <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Concentric Nested Capsule Live Demonstration</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
            When nesting rounded elements, inner and outer radii adhere to:
            <code className="mx-1 px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[#2BB5FF] font-mono font-bold">
              Outer Radius = Inner Radius + Padding
            </code>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center">
          <div className="inline-flex items-center gap-2 p-[6px] h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs">
            <div className="w-7 h-7 rounded-full bg-[#2BB5FF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AB
            </div>
            <span className="text-xs font-bold px-2 text-[var(--text-primary)]">Aurelia Studio</span>
            <button className="h-7 px-3 rounded-full bg-white dark:bg-black text-[var(--text-primary)] border border-[var(--border-subtle)] text-[11px] font-bold shadow-xs hover:border-[#2BB5FF]/40">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div className="space-y-10 max-w-5xl select-none mx-auto">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Ozone Size Tokens</h1>
          <Badge variant="dashed-blue" size="xs">Ozone UI</Badge>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Standardized heights, icon footprints, avatar dimensions, and mobile tap targets.
        </p>
      </div>

      {/* 1. Component & Control Heights */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
            1. Control Heights (Unified Alignment)
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Inputs, buttons, dropdowns, and date pickers share strict mathematical heights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(sizeTokens.control).map(([key, item]) => (
            <div
              key={key}
              className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)] capitalize">{key}</span>
                <span className="text-xs font-mono font-bold text-[#2BB5FF] px-2 py-0.5 rounded-full bg-[#2BB5FF]/10">
                  {item.value}
                </span>
              </div>
              <div
                style={{ height: item.value }}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-center text-[11px] font-semibold text-[var(--text-secondary)]"
              >
                Sample control ({item.value})
              </div>
              <div className="text-[11px] text-[var(--text-muted)] leading-tight">{item.use}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Vector Icon Sizes */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
            2. Icon Size Tokens
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Pixel-aligned grid bounding boxes for Fluent vector icons.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(sizeTokens.icons).map(([key, item]) => (
            <div
              key={key}
              className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center gap-2 shadow-xs"
            >
              <div
                style={{ width: item.value, height: item.value }}
                className="bg-[#2BB5FF]/15 border border-[#2BB5FF] rounded-lg flex items-center justify-center text-[#2BB5FF]"
              >
                <Icon filled={Sparkle24Filled} active className="w-full h-full p-0.5" />
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)]">{key}</div>
              <div className="text-[10px] font-mono text-[var(--text-muted)]">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Avatar Scale */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
            3. Avatar Scale Tokens
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Client, specialist, and salon brand avatar proportions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-wrap items-end gap-6 shadow-xs">
          {Object.entries(sizeTokens.avatars).map(([key, item]) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <div
                style={{ width: item.value, height: item.value }}
                className="rounded-full bg-[#2BB5FF] text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_8px_-1px_rgba(43,181,255,0.4)]"
              >
                {key.toUpperCase()}
              </div>
              <div className="text-[11px] font-bold text-[var(--text-primary)]">{key}</div>
              <div className="text-[10px] font-mono text-[var(--text-muted)]">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Mobile Tap Targets */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
            4. Mobile Tap Targets & Touch Ergonomics
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Guaranteed touch envelopes complying with the mobile-first ergonomics rule (min 44x44px).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(sizeTokens.touchTargets).map(([key, item]) => (
            <div
              key={key}
              className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">{key}</span>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {item.value}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)]">{item.use}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Colors: StoryObj = {
  render: () => (
    <div className="space-y-8 max-w-5xl select-none mx-auto">
      <div className="border-b border-[var(--border-subtle)] pb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Color Tokens</h1>
          <Badge variant="dashed-blue" size="xs">Ozone UI</Badge>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Ozone core brand, semantic surface, and text color tokens for AirBook.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Brand & Accent</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2BB5FF] shadow-[0_4px_12px_-2px_rgba(43,181,255,0.5)] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">--color-accent-primary</div>
              <div className="text-xs text-[var(--text-secondary)]">#2BB5FF (Electric Sky)</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">Primary actions & active tabs</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1A8EFF] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">--color-accent-primary-hover</div>
              <div className="text-xs text-[var(--text-secondary)]">#1A8EFF (Deep Sky)</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">Primary button hover/active</div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF3B30] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">--color-indicator-today</div>
              <div className="text-xs text-[var(--text-secondary)]">#FF3B30 (Signature Red)</div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">Today badge & live clock marker</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Surfaces & Canvases</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
            <div className="h-12 w-full rounded-xl bg-[var(--canvas-bg)] border border-[var(--border-subtle)]" />
            <div className="text-xs font-bold text-[var(--text-primary)]">--canvas-bg</div>
            <div className="text-[10px] text-[var(--text-muted)]">Background canvas backing</div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
            <div className="h-12 w-full rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]" />
            <div className="text-xs font-bold text-[var(--text-primary)]">--bg-primary</div>
            <div className="text-[10px] text-[var(--text-muted)]">Elevated cards & sheets</div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
            <div className="h-12 w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]" />
            <div className="text-xs font-bold text-[var(--text-primary)]">--bg-secondary</div>
            <div className="text-[10px] text-[var(--text-muted)]">Input backings & pill strips</div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
            <div className="h-12 w-full rounded-xl bg-[var(--grid-bg)] border border-[var(--border-subtle)]" />
            <div className="text-xs font-bold text-[var(--text-primary)]">--grid-bg</div>
            <div className="text-[10px] text-[var(--text-muted)]">Calendar timegrid lane surface</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">Status & Feedback</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(colorTokens.status).map(([key, item]) => (
            <div
              key={key}
              className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex-shrink-0 border"
                  style={{
                    backgroundColor: item.default,
                    borderColor: item.border,
                  }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] capitalize">{key}</div>
                  <div className="text-[11px] font-mono text-[var(--text-secondary)]">
                    {item.default} ({item.name})
                  </div>
                </div>
              </div>

              <div
                className="px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center justify-between"
                style={{
                  backgroundColor: item.subtle,
                  borderColor: item.border,
                  color: item.default,
                }}
              >
                <span className="font-mono">{item.cssVar}</span>
                <span>10%</span>
              </div>

              <div className="text-[10px] text-[var(--text-muted)] leading-snug">{item.use}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const SpacingAndGaps: StoryObj = {
  render: () => (
    <div className="space-y-8 max-w-4xl select-none mx-auto">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">Spacing & Gaps Scale</h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Micro inline padding, tight list item proximity, and layout separation tokens.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { token: '--space-1 (4px / 0.25rem)', size: 'h-4 w-1', label: 'Micro inline padding, icon-text spacing' },
          { token: '--space-2 (8px / 0.5rem)', size: 'h-4 w-2', label: 'Compact list gap, tag margins' },
          { token: '--space-3 (12px / 0.75rem)', size: 'h-4 w-3', label: 'Standard form control spacing, modal sub-items' },
          { token: 'space-3.5 (14px / 0.875rem)', size: 'h-4 w-3.5', label: 'Proximity grouping: Form grid fields, filter bars' },
          { token: '--space-4 (16px / 1.0rem)', size: 'h-4 w-4', label: 'Card padding, toolbar gaps, grid gutters' },
          { token: '--space-6 (24px / 1.5rem)', size: 'h-4 w-6', label: 'Container padding, drawer margins' },
          { token: '--space-8 (32px / 2.0rem)', size: 'h-4 w-8', label: 'Module section separation, hero section breaks' },
        ].map((item, index) => (
          <div
            key={index}
            className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold font-mono text-[var(--text-primary)]">{item.token}</div>
              <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{item.label}</div>
            </div>
            <div className={`${item.size} bg-[#2BB5FF] rounded-full`} />
          </div>
        ))}
      </div>
    </div>
  ),
};
