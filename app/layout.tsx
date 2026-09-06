import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#007AFF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://getairbook.com'),
  title: 'AirBook — The Frictionless Workspace for Independent Pros',
  description: 'Clean, lightweight, mobile-first booking & scheduling infrastructure for salons, spas, barbershops, and independent beauty and wellness pros.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AirBook',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://getairbook.com',
    siteName: 'AirBook',
    title: 'AirBook — The Frictionless Workspace for Independent Pros',
    description: 'Modern booking & scheduling infrastructure with 24/7 online calendar, instant Tap-to-Pay checkout, automated reminders, and client CRM records.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AirBook — The Frictionless Workspace for Independent Pros',
    description: 'Modern booking & scheduling infrastructure with 24/7 online calendar, instant Tap-to-Pay checkout, automated reminders, and client CRM records.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
