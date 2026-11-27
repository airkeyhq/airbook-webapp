import { create } from 'storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: 'Ozone UI — AirBook Design System',
  brandUrl: 'https://airbook.studio',
  brandTarget: '_self',
  colorPrimary: '#2BB5FF',
  colorSecondary: '#2BB5FF',

  // UI
  appBg: '#F8FAFC',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#F2F4F8',
  appBorderColor: '#E2E8F0',
  appBorderRadius: 16,

  // Typography
  fontBase: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

  // Text colors
  textColor: '#0F172A',
  textInverseColor: '#FFFFFF',

  // Toolbar default and active colors
  barTextColor: '#475569',
  barSelectedColor: '#2BB5FF',
  barHoverColor: '#1A8EFF',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#E2E8F0',
  inputTextColor: '#0F172A',
  inputBorderRadius: 12,
});
