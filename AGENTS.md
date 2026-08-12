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
