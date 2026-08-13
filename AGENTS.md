<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mandatory Frontend i18n Rule

All frontend code in this application MUST be fully internationalized without exception.

1. **Zero Hardcoded Text**: Every single user-facing string (headings, subtitles, buttons, tab labels, form field labels, placeholders, dropdown options, status tags, badges, alert dialogs, toast messages, empty states) MUST be routed through `useTranslation()` from `@/lib/i18n/useTranslation`. Never write plain text strings inside JSX elements or component props.
2. **4-Language Translation Maintenance**: When adding or modifying UI text, update all 4 supported language dictionaries in `lib/i18n/translations.ts`: English (`en`), Spanish (`es`), German (`de`), and French (`fr`).
3. **Flag Icon System**: All language pickers MUST use circular vector flags from `hatscripts/circle-flags` (`https://hatscripts.github.io/circle-flags/flags/{flagCode}.svg`).
4. **Tone & Positioning**: Address beauty, spa, salon, and barber shop operators in a warm, friendly tone. Avoid generic developer/SaaS boilerplate jargon.

# Mandatory Mobile-First Responsive Rule

All frontend code in this application MUST be designed and implemented Mobile-First without exception.

1. **Mobile-First Priority**: Always design, structure, and test component layouts for small screens (`< 640px`) first, using Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to enhance the layout for larger viewports.
2. **Zero Overflow Glitches**: Mobile viewports must NEVER exhibit unintended horizontal overflow (`overflow-x-hidden`), overlapping text, or squished touch targets.
3. **Touch-Friendly Controls**: Interactive elements (buttons, inputs, dropdowns, calendar slots, dock triggers) must maintain comfortable tap target areas (minimum 44x44px or rounded pill padding) on touch devices.
4. **Adaptive View Modes**: Complex data-dense views (like the calendar) must automatically adapt to screen constraints (e.g., single-day view on mobile, multi-day/week view on desktop) without requiring horizontal scrolling.

# Mandatory UI Design Principles & Perception System

1. **Iconography System (`*Filled` vs `*Regular`) & Zero Emojis**:
   - **Interactive Actions / CTAs**: MUST strictly use `*Filled` vector icons (e.g. `CheckmarkCircle24Filled`, `Calendar24Filled`, `Add24Filled`, `Sparkle24Filled`).
   - **Display Labels / Metadata**: MUST strictly use `*Regular` vector icons (e.g. `People24Regular`, `Clock24Regular`, `Money24Regular`, `Color24Regular`).
   - **Zero Emojis**: Emojis are strictly prohibited in buttons, headers, titles, or status tags.

2. **Vertical Button Stacking & Overflow Trigger**:
   - **3+ Action Grouping**: NEVER stack 3 or more action buttons horizontally; ALWAYS stack them vertically (`flex flex-col gap-2.5 w-full`).
   - **"More" Overflow Pattern**: When a dialog has more than 2 actions, use the "Más Acciones..." collapsible overflow trigger (`<MoreHorizontal24Filled />`).

3. **Mobile-First Bottom Sheet Drawers & Single Dismissal**:
   - Dialogs MUST automatically adapt as Bottom Sheet Drawers on small viewports (`< 768px`) with a top drag-handle pull bar (`w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto md:hidden`).
   - Avoid redundant bottom "Cancelar" buttons when top-right `X` icon and top drag-handle pull-bars are present.

4. **Side-to-Side Bottom Action Banner**:
   - Bottom action bars MUST be flat side-to-side banners flush to the bottom of the drawer panel (`w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 md:p-5 rounded-none flex-shrink-0 z-30`) without rounded bottom drop gaps.

5. **Single-Column Responsive Form Input Fields**:
   - Form input grids MUST use single-column vertical stacking on mobile/tablet viewports (`grid-cols-1 md:grid-cols-2 gap-3.5`) for touch target ergonomics and zero text truncation.

6. **Snappy Micro-Animations & Custom Range Sliders**:
   - Hover transitions MUST be fast (`100ms ease-out` / `duration: 0.08`).
   - Range sliders MUST use custom electric blue pill handles with `< >` vector arrows (`width: 48px`, `height: 26px`) and dynamic `linear-gradient` progress track fill.

7. **Custom Select Dropdown Control Pattern**:
   - **Zero Native Browser Chevrons**: All `<select>` controls MUST use `appearance-none` to strip default OS arrows that collide with rounded pill edges.
   - **Right Padding & Relative Wrapper**: `<select>` elements MUST be wrapped in a `relative` container with right padding (`pl-4 pr-10 py-2.5 rounded-2xl`).
   - **Vector Line Chevron**: Dropdowns MUST feature an absolute-positioned `<ChevronDown24Regular className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />` icon for pixel-perfect spacing.

# Mandatory UI Integrity & Feature Evaluation System

1. **Honest UI & Zero Dark Patterns**:
   - NEVER simulate functionality with fake submit buttons, dummy toggles, or mocked forms that lead nowhere.
   - Maintain 100% transparency with the user regarding feature readiness.

2. **Essential vs. Roadmap Evaluation Rule**:
   - Evaluate every feature with the logic: *Is it essential for MVP launch?*
     - **YES** -> MUST be built with full production functionality.
     - **NO** -> MUST be roadmapped for future releases with zero fake controls.

3. **"Próximamente" / "SOON" Badging System**:
   - Non-essential roadmapped navigation items MUST display a `Próximamente` / `SOON` badge (`soon: true`).
   - Roadmapped module pages MUST render an honest Roadmap Teaser Card (e.g. *Próximamente en v1.1*) detailing planned capabilities without fake interactive inputs.

# Mandatory Design Tokens & Theming Rule

All UI styling MUST rely on CSS custom properties (design tokens) for structural colors.

1. **Zero Hardcoded Colors for Structure**: NEVER use hardcoded Tailwind structural colors (e.g., `bg-white dark:bg-gray-900`, `text-gray-800 dark:text-gray-100`, `border-gray-200`) for primary containers, text, or borders.
2. **Always Use Tokens**: MUST use established CSS variables (e.g., `bg-[var(--bg-primary)]`, `bg-[var(--bg-secondary)]`, `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`, `border-[var(--border-subtle)]`) to ensure perfect theming and dark mode support.
