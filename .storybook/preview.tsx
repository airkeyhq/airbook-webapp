import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'canvas-light',
      values: [
        { name: 'canvas-light', value: '#F2F4F8' },
        { name: 'pure-white', value: '#FFFFFF' },
        { name: 'canvas-dark', value: '#0F1117' },
        { name: 'surface-dark', value: '#141720' },
      ],
    },
    layout: 'padded',
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light Mode' },
          { value: 'dark', icon: 'moon', title: 'Dark Mode' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      useEffect(() => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      }, [theme]);

      return (
        <div
          data-theme={theme}
          className={`w-full min-h-full flex items-center justify-center p-6 ${theme === 'dark' ? 'dark' : ''}`}
          style={{
            color: theme === 'dark' ? 'var(--canvas-fg, #F8FAFC)' : 'var(--canvas-fg, #0F172A)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
