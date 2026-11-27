/**
 * Ozone UI — AirBook Design System Tokens (Single Source of Truth)
 * Combining Apple SF Pro minimalism, luxury salon & spa ergonomics, and Astryx/Mosaic principles.
 */

export const typography = {
  hero: {
    fontSize: '32px',
    lineHeight: '38px',
    fontWeight: '900',
    letterSpacing: '-0.03em',
    role: 'Hero banners, marketing titles, key landing headers',
  },
  display: {
    fontSize: '24px',
    lineHeight: '28px',
    fontWeight: '800',
    letterSpacing: '-0.025em',
    role: 'Section titles, modal headers, major dashboard metrics',
  },
  title: {
    fontSize: '18px',
    lineHeight: '22px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    role: 'Card headers, drawer section titles, service names',
  },
  subhead: {
    fontSize: '14px',
    lineHeight: '18px',
    fontWeight: '600',
    letterSpacing: '-0.01em',
    role: 'Interactive button labels, tab titles, table column headers',
  },
  body: {
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '400',
    letterSpacing: '0em',
    role: 'Standard body text, client notes, descriptions',
  },
  caption: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: '400',
    letterSpacing: '0em',
    role: 'Secondary metadata, timestamps, price disclaimers',
  },
  micro: {
    fontSize: '10.5px',
    lineHeight: '14px',
    fontWeight: '500',
    letterSpacing: '0.01em',
    role: 'Status badges, compact pills, breadcrumb items',
  },
  overline: {
    fontSize: '10px',
    lineHeight: '14px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    role: 'FloatingInput labels, category overlines, section markers',
  },
  mono: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: '400',
    letterSpacing: '-0.01em',
    role: 'HEX color values, time slots, order IDs, system tokens',
  },
} as const;

export const fontWeights = [
  { name: 'Regular', weight: '400', class: 'font-normal', use: 'Body copy, descriptions' },
  { name: 'Medium', weight: '500', class: 'font-medium', use: 'Form placeholders, table cells' },
  { name: 'Semibold', weight: '600', class: 'font-semibold', use: 'Subheadings, secondary buttons' },
  { name: 'Bold', weight: '700', class: 'font-bold', use: 'Primary CTAs, section titles, overlines' },
  { name: 'Extrabold', weight: '800', class: 'font-extrabold', use: 'Dashboard KPIs, key metrics' },
  { name: 'Black', weight: '900', class: 'font-black', use: 'Hero headlines, luxury branding' },
] as const;

export const shadows = {
  milled: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.95)',
  milledDark: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
  sphere: '0 2px 8px rgba(43, 181, 255, 0.38), 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.38)',
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
  dropdown: '0 4px 16px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
  modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

export const sizeTokens = {
  control: {
    micro: { value: '28px', px: 28, rem: '1.75rem', use: 'Nested inner pills, table action chips' },
    sm: { value: '32px', px: 32, rem: '2.0rem', use: 'Compact buttons, inline tags, small inputs' },
    md: { value: '36px', px: 36, rem: '2.25rem', use: 'Header pills, segmented toolbar controls' },
    base: { value: '40px', px: 40, rem: '2.5rem', use: 'Standard buttons (.btn-primary), CustomSelect, DateStrip' },
    floatingInput: { value: '52px', px: 52, rem: '3.25rem', use: 'Mandatory atomic <FloatingInput /> & <FloatingTextarea />' },
    lg: { value: '56px', px: 56, rem: '3.5rem', use: 'Kiosk oversized CTAs, checkout pay buttons' },
  },
  icons: {
    xs: { value: '12px', px: 12, tw: 'w-3 h-3', use: 'Inline badge dots, micro chevron tags' },
    sm: { value: '14px', px: 14, tw: 'w-3.5 h-3.5', use: 'Sub-action buttons, dropdown arrows' },
    base: { value: '16px', px: 16, tw: 'w-4 h-4', use: 'Standard CTA icons (*Filled), input leading icons' },
    md: { value: '20px', px: 20, tw: 'w-5 h-5', use: 'Navigation dock triggers, tab bar icons' },
    lg: { value: '24px', px: 24, tw: 'w-6 h-6', use: 'Header actions, modal close dismiss triggers' },
    xl: { value: '32px', px: 32, tw: 'w-8 h-8', use: 'Empty state illustrations, avatar fallbacks' },
  },
  avatars: {
    xs: { value: '24px', px: 24, tw: 'w-6 h-6', use: 'Dense appointment rows, stacked group heads' },
    sm: { value: '32px', px: 32, tw: 'w-8 h-8', use: 'Header profile trigger, table specialist cells' },
    md: { value: '40px', px: 40, tw: 'w-10 h-10', use: 'Default client card, review author avatars' },
    lg: { value: '48px', px: 48, tw: 'w-12 h-12', use: 'Drawer client profile hero' },
    xl: { value: '64px', px: 64, tw: 'w-16 h-16', use: 'Walk-in kiosk specialist selection card' },
  },
  touchTargets: {
    minimumTouchArea: { value: '44px', px: 44, use: 'Minimum touch area for mobile buttons & calendar slots' },
    dockItem: { value: '48px', px: 48, use: 'Floating dock tactile target' },
    kioskAction: { value: '56px', px: 56, use: 'Touchscreen kiosk full-width primary trigger' },
  },
} as const;

export const spacingTokens = {
  scale: {
    '1': { value: '4px', rem: '0.25rem', tw: 'p-1 / gap-1', use: 'Micro inline gaps, badge padding' },
    '2': { value: '8px', rem: '0.5rem', tw: 'p-2 / gap-2', use: 'Compact list gap, tag margins' },
    '3': { value: '12px', rem: '0.75rem', tw: 'p-3 / gap-3', use: 'Modal sub-item padding, inner drawer cards' },
    '3.5': { value: '14px', rem: '0.875rem', tw: 'p-3.5 / gap-3.5', use: 'Proximity grouping: Form grid fields, filter bars' },
    '4': { value: '16px', rem: '1.0rem', tw: 'p-4 / gap-4', use: 'Standard card padding, toolbar gaps' },
    '6': { value: '24px', rem: '1.5rem', tw: 'p-6 / gap-6', use: 'Container padding, drawer margins, section spacing' },
    '8': { value: '32px', rem: '2.0rem', tw: 'p-8 / gap-8', use: 'Module section separation, hero card margins' },
    '12': { value: '48px', rem: '3.0rem', tw: 'p-12 / gap-12', use: 'Landing page section breaks' },
  },
} as const;

export const radiusTokens = {
  scale: {
    sm: { value: '12px', tw: 'rounded-xl', use: 'Inner pills, badges, secondary indicators' },
    md: { value: '16px', tw: 'rounded-2xl', use: 'Unified buttons, standard cards, dropdown popovers' },
    lg: { value: '24px', tw: 'rounded-3xl', use: 'Large modals, bottom sheet drawers, empty state containers' },
    pill: { value: '9999px', tw: 'rounded-full', use: 'Buttons, dock controls, avatars, concentric navigation pills' },
  },
  concentricFormula: 'Outer Radius = Inner Radius + Padding',
} as const;

export const colorTokens = {
  brand: {
    accentPrimary: '#2BB5FF',
    accentHover: '#1A8EFF',
    accentFg: '#FFFFFF',
    indicatorToday: '#FF3B30',
  },
  surfaces: {
    canvasLight: '#F2F4F8',
    canvasDark: '#0F1117',
    bgPrimaryLight: '#FFFFFF',
    bgPrimaryDark: '#141720',
    bgSecondaryLight: '#F8FAFC',
    bgSecondaryDark: '#1B1E2B',
  },
  status: {
    success: {
      default: '#10B981',
      subtle: 'rgba(16, 185, 129, 0.1)',
      border: 'rgba(16, 185, 129, 0.2)',
      cssVar: '--color-status-success',
      name: 'Emerald 500',
      use: 'Confirmed bookings, online presence, completed checkouts',
    },
    warning: {
      default: '#F59E0B',
      subtle: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.2)',
      cssVar: '--color-status-warning',
      name: 'Amber 500',
      use: 'Pending deposits, busy status, upcoming reminders',
    },
    danger: {
      default: '#F43F5E',
      subtle: 'rgba(244, 63, 94, 0.1)',
      border: 'rgba(244, 63, 94, 0.2)',
      cssVar: '--color-status-danger',
      name: 'Rose 500',
      use: 'Cancellations, no-shows, destructive actions & errors',
    },
    info: {
      default: '#2BB5FF',
      subtle: 'rgba(43, 181, 255, 0.1)',
      border: 'rgba(43, 181, 255, 0.2)',
      cssVar: '--color-status-info',
      name: 'Electric Sky',
      use: 'System notices, dashed-blue badges, informational banners',
    },
  },
} as const;

export const tokens = {
  typography,
  fontWeights,
  shadows,
  sizeTokens,
  spacingTokens,
  radiusTokens,
  colorTokens,
} as const;
