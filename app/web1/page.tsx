'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar24Filled,
  Calendar24Regular,
  Payment24Filled,
  Payment24Regular,
  Person24Regular,
  Tag24Regular,
  Sparkle24Filled,
  Sparkle24Regular,
  Clock24Regular,
  CheckmarkCircle24Filled,
  ShieldCheckmark24Filled,
  Globe24Regular,
  ArrowRight24Filled,
  ChevronDown24Filled,
  Star24Filled,
  LockClosed24Regular,
  Chat24Regular,
  People24Regular,
  Phone24Regular,
  Share24Regular,
} from '@fluentui/react-icons';

// ─── FAQ ACCORDION COMPONENT ───
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-neutral-200/80 dark:border-white/10 py-5 transition-colors">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
      >
        <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#2BB5FF] transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 flex-shrink-0"
        >
          <ChevronDown24Filled className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Web1LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How quickly can I switch from my existing booking app?',
      a: 'In less than 3 minutes. You can import your existing client list (CSV/Excel), add your services, and start accepting online appointments instantly with zero downtime.',
    },
    {
      q: 'Are client deposits and no-show protection included?',
      a: 'Yes. AirBook integrates Stripe Connect Express natively. You can require full prepayments or custom percentage deposits (e.g. 25% or 50%) at checkout to eliminate no-shows entirely.',
    },
    {
      q: 'Do I need a separate credit card terminal for in-person payments?',
      a: 'No extra hardware is required. With Tap to Pay on iPhone, you can accept physical contactless cards, Apple Pay, and Google Pay directly on your phone.',
    },
    {
      q: 'Is AirBook passwordless and secure?',
      a: '100%. AirBook uses Passkeys (Face ID / Touch ID) and instant Magic Links. Zero passwords are stored in our database, protecting your salon from credential leaks.',
    },
    {
      q: 'Can I use my own custom domain or booking URL?',
      a: 'Yes. You get a clean, memorable public link like getairbook.com/book/your-studio, and you can also connect your own custom domain in Settings with automated SSL certificates.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0C] text-neutral-900 dark:text-white font-sans antialiased selection:bg-[#2BB5FF]/20 selection:text-[#2BB5FF]">
      {/* ─── STICKY FLOATING HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pt-4 pb-2">
        <div className="max-w-6xl mx-auto rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          {/* Brand Logo */}
          <Link href="/web1" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-sm tracking-tight shadow-xs group-hover:scale-105 transition-transform">
              AB
            </div>
            <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
              AirBook
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            <a href="#challenge" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Why AirBook
            </a>
            <a href="#benefits" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Benefits
            </a>
            <a href="#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              FAQs
            </a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/onboarding"
              className="btn-primary h-9 px-4 sm:px-5 rounded-full text-xs font-bold flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#2BB5FF]/10 blur-3xl pointer-events-none -z-10" />

        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 text-[11px] font-bold text-neutral-600 dark:text-neutral-400 shadow-2xs mb-6"
        >
          <Sparkle24Filled className="w-3.5 h-3.5 text-[#2BB5FF]" />
          <span>The Modern Studio Operating System</span>
        </motion.div>

        {/* Hero Title with Subtle Dual-Tone */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.08] max-w-4xl mx-auto"
        >
          <span className="text-neutral-400 dark:text-neutral-500 font-bold block sm:inline">
            Run your salon or spa{' '}
          </span>
          <span className="text-black dark:text-white">
            on pure autopilot.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="mt-6 text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Effortless 24/7 online bookings, instant Tap to Pay POS, automated SMS reminders, and client formula tracking — all in one passwordless app.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link
            href="/onboarding"
            className="btn-primary h-12 px-7 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight24Filled className="w-4 h-4" />
          </Link>
          <Link
            href="/book/eduardos-lounge"
            className="btn-secondary h-12 px-7 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>Explore Live Demo</span>
          </Link>
        </motion.div>

        {/* ─── HERO MOCKUPS (PLACEHOLDER FRAMES PRESERVED) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="mt-14 sm:mt-20 relative flex items-center justify-center"
        >
          <div className="relative flex items-center justify-center max-w-4xl mx-auto gap-4 sm:gap-8">
            {/* Left Phone Frame Mockup */}
            <div className="w-[220px] sm:w-[300px] h-[440px] sm:h-[600px] rounded-[36px] sm:rounded-[48px] overflow-hidden border-4 border-neutral-800 shadow-2xl -rotate-6 transform hover:rotate-0 transition-transform duration-500 bg-neutral-900 relative">
              <img
                src="/web1/assets/images/ZAGmE9Elu4B1Thfoz84pJUOo.png"
                alt="AirBook Calendar Mockup Placeholder"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Phone Frame Mockup */}
            <div className="w-[220px] sm:w-[300px] h-[440px] sm:h-[600px] rounded-[36px] sm:rounded-[48px] overflow-hidden border-4 border-neutral-800 shadow-2xl rotate-6 transform hover:rotate-0 transition-transform duration-500 bg-neutral-900 relative">
              <img
                src="/web1/assets/images/ROIk4ZUDVQvbkfcxPMbVYDKtTV0.png"
                alt="AirBook Booking Flow Mockup Placeholder"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 2. THE CHALLENGE (SUBTLE DUAL-TONE CONTRAST) ─── */}
      <section id="challenge" className="py-20 sm:py-32 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="space-y-6">
          {/* Eyebrow */}
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            The Challenge
          </span>

          {/* Heading with Distinct Subtle Tone Split */}
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.25]">
            <span className="text-neutral-400 dark:text-neutral-500 font-medium">
              Managing appointments, no-shows, deposits, and client formulas across scattered apps slows you down.{' '}
            </span>
            <span className="text-neutral-900 dark:text-white font-black">
              AirBook brings everything into one intelligent studio workflow.
            </span>
          </h2>
        </div>
      </section>

      {/* ─── 3. KEY BENEFITS SECTION ─── */}
      <section id="benefits" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="space-y-4 mb-12 sm:mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Key Benefits
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500 font-bold">Smarter </span>
            <span className="text-neutral-900 dark:text-white">Studio Management</span>
          </h2>
        </div>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#2BB5FF]">
                <Calendar24Filled className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Zero Overbooking
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                Real-time conflict detection and dynamic turnover buffer times ensure your staff and stations never get crowded.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-neutral-400">
              <span>Automatic Buffers</span>
              <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-emerald-500">
                <Payment24Filled className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Instant Deposit Holds
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                Stripe Express integration locks in card holds or partial prepayments at booking to safeguard your salon revenue.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-neutral-400">
              <span>Stripe Protected</span>
              <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="p-8 rounded-[32px] bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#AF52DE]">
                <Tag24Regular className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Formula & Note Vault
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                Color formulas, patch test waivers, and client preferences sync directly to each appointment ticket automatically.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-neutral-400">
              <span>Encrypted Records</span>
              <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. FEATURES SHOWCASE ─── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="space-y-4 mb-12 sm:mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Features
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500 font-bold">All the tools </span>
            <span className="text-neutral-900 dark:text-white">you need to scale</span>
          </h2>
        </div>

        {/* Feature Bento Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Tile 1: Tap to Pay */}
          <div className="p-8 sm:p-10 rounded-[36px] bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 flex flex-col justify-between overflow-hidden relative">
            <div className="space-y-3 z-10">
              <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-extrabold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Point of Sale
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                Tap to Pay on iPhone
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed max-w-sm">
                Accept credit cards, Apple Pay, and contactless payments straight from your phone with no dongles or bulky hardware.
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="w-[200px] h-[280px] rounded-t-[32px] bg-neutral-900 p-3 pt-2 text-white border-2 border-neutral-700/60 shadow-xl space-y-2">
                <div className="w-14 h-3 bg-black rounded-full mx-auto" />
                <div className="rounded-xl bg-neutral-800 p-3 text-center space-y-1">
                  <p className="text-[10px] text-neutral-400 font-bold">Total Due</p>
                  <p className="text-lg font-black text-white">$120.00</p>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold">
                    Hold Near Phone
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tile 2: Automated 2-Way SMS */}
          <div className="p-8 sm:p-10 rounded-[36px] bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 flex flex-col justify-between overflow-hidden relative">
            <div className="space-y-3 z-10">
              <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-extrabold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Retention Engine
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                Smart SMS &amp; Reviews
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed max-w-sm">
                Dispatch 24h reminders and post-service Google Review requests automatically to keep your chairs full and reputation shining.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs space-y-1.5 border border-neutral-200 dark:border-white/5">
                <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400">
                  <span>AirBook SMS</span>
                  <span>10:45 AM</span>
                </div>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  &ldquo;Hi Sarah! Your haircut appointment with Marcus is confirmed for tomorrow at 2:00 PM.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. INTEGRATIONS & CONNECT ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="space-y-4 mb-12 sm:mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Connect
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500 font-bold">Sync with </span>
            <span className="text-neutral-900 dark:text-white">your favorite tools</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Apple Calendar', desc: 'Instant 2-way sync' },
            { name: 'Google Calendar', desc: 'Real-time schedule check' },
            { name: 'Stripe Express', desc: 'Direct daily payouts' },
            { name: 'Instagram & TikTok', desc: '1-tap bio booking link' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 text-center space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 mx-auto flex items-center justify-center text-[#2BB5FF]">
                <Globe24Regular className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{item.name}</h4>
              <p className="text-[11px] text-neutral-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. SOCIAL PROOF / REVIEWS ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="space-y-4 mb-12 sm:mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Hear from the people
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500 font-bold">Loved by </span>
            <span className="text-neutral-900 dark:text-white">beauty &amp; wellness pros</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'AirBook saved me 5 hours a week in booking DMs and cut our no-shows down to zero with deposit holds.',
              name: 'Elena Rostova',
              role: 'Founder, L’Élégance Spa',
            },
            {
              quote: 'Tap to Pay right on my phone is a game changer. No clunky card reader or cables on my workstation.',
              name: 'Marcus Vance',
              role: 'Master Barber & Studio Owner',
            },
            {
              quote: 'The formula ticket vault makes color formulations seamless between our team of 6 stylists.',
              name: 'Sophia Chen',
              role: 'Lead Colorist, Atelier Hair',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-[32px] bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star24Filled key={i} className="w-4 h-4" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{item.name}</h4>
                <p className="text-[11px] text-neutral-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. 4 EASY STEPS ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="space-y-4 mb-12 sm:mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            4 Easy steps to get started
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500 font-bold">Launch in </span>
            <span className="text-neutral-900 dark:text-white">minutes, not days</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { num: '01', title: 'Claim your link', desc: 'Choose your unique studio handle and branding.' },
            { num: '02', title: 'Add your menu', desc: 'Set prices, buffer durations, and deposit tiers.' },
            { num: '03', title: 'Share everywhere', desc: 'Add your link to Instagram, TikTok, and WhatsApp.' },
            { num: '04', title: 'Get paid instantly', desc: 'Collect cards, deposits, and tips with 0 friction.' },
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 space-y-3"
            >
              <span className="w-8 h-8 rounded-xl bg-[#2BB5FF]/10 text-[#2BB5FF] font-black text-xs flex items-center justify-center">
                {step.num}
              </span>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{step.title}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. PRICING & PLANS ─── */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="space-y-4 mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500 font-bold">Simple, transparent </span>
            <span className="text-neutral-900 dark:text-white">pricing</span>
          </h2>
        </div>

        {/* Billing Switcher Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-full bg-neutral-200/70 dark:bg-neutral-800 border border-neutral-300/50 dark:border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-neutral-900 text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-neutral-900 text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>Yearly</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1: Solo Creator */}
          <div className="p-8 rounded-[36px] bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Solo</span>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white">Independent</h3>
              <p className="text-xs text-neutral-500">For solo stylists, barbers, and aesthetic practitioners.</p>
              <div className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
                {billingCycle === 'yearly' ? '$19' : '$24'}
                <span className="text-xs font-normal text-neutral-400"> /month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 pt-4 border-t border-neutral-100 dark:border-white/5">
                <li className="flex items-center gap-2">✓ Unlimited Online Bookings</li>
                <li className="flex items-center gap-2">✓ Tap to Pay on Phone</li>
                <li className="flex items-center gap-2">✓ Automated SMS Reminders</li>
                <li className="flex items-center gap-2">✓ Deposit &amp; No-Show Guard</li>
              </ul>
            </div>
            <Link
              href="/onboarding"
              className="btn-secondary w-full h-11 rounded-2xl text-xs font-bold flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>

          {/* Plan 2: Pro Studio (Featured) */}
          <div className="p-8 rounded-[36px] bg-black text-white dark:bg-white dark:text-black border border-neutral-900 dark:border-white space-y-6 flex flex-col justify-between relative shadow-xl">
            <div className="space-y-4">
              <span className="px-2.5 py-1 rounded-full bg-white/20 dark:bg-black/10 text-[10px] font-extrabold uppercase tracking-wider text-[#2BB5FF]">
                Most Popular
              </span>
              <h3 className="text-2xl font-black">Studio Pro</h3>
              <p className="text-xs opacity-70">For growing salons, spas, and boutique teams.</p>
              <div className="text-3xl sm:text-4xl font-black">
                {billingCycle === 'yearly' ? '$49' : '$59'}
                <span className="text-xs font-normal opacity-70"> /month</span>
              </div>
              <ul className="space-y-2.5 text-xs opacity-90 pt-4 border-t border-white/20 dark:border-black/10">
                <li className="flex items-center gap-2">✓ Up to 5 Team Members</li>
                <li className="flex items-center gap-2">✓ Multi-Station Dispatch Roster</li>
                <li className="flex items-center gap-2">✓ Custom Domain (SSL Included)</li>
                <li className="flex items-center gap-2">✓ Formula Vault &amp; Waiver Pad</li>
              </ul>
            </div>
            <Link
              href="/onboarding"
              className="btn-primary w-full h-11 rounded-2xl text-xs font-bold flex items-center justify-center"
            >
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Plan 3: Multi-Location Business */}
          <div className="p-8 rounded-[36px] bg-white dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">Enterprise</span>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-white">Business</h3>
              <p className="text-xs text-neutral-500">For multi-location studios and high-volume chains.</p>
              <div className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
                {billingCycle === 'yearly' ? '$99' : '$119'}
                <span className="text-xs font-normal text-neutral-400"> /month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300 pt-4 border-t border-neutral-100 dark:border-white/5">
                <li className="flex items-center gap-2">✓ Unlimited Staff &amp; Chairs</li>
                <li className="flex items-center gap-2">✓ Multi-Location Management</li>
                <li className="flex items-center gap-2">✓ Dedicated Account Manager</li>
                <li className="flex items-center gap-2">✓ Priority 24/7 Phone Support</li>
              </ul>
            </div>
            <Link
              href="/onboarding"
              className="btn-secondary w-full h-11 rounded-2xl text-xs font-bold flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 9. FAQs ─── */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="space-y-4 mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            FAQs
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            <span className="text-neutral-400 dark:text-neutral-500 font-bold">Frequently Asked </span>
            <span className="text-neutral-900 dark:text-white">Questions</span>
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.q}
              answer={faq.a}
              isOpen={openFAQ === index}
              onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
            />
          ))}
        </div>
      </section>

      {/* ─── 10. FINAL CTA BANNER ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-16 rounded-[44px] bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#2BB5FF]/20 to-[#AF52DE]/20 opacity-30 pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to upgrade your studio booking experience?
          </h2>
          <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto font-medium">
            Join hundreds of beauty, wellness, and salon professionals saving hours every day with AirBook.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="btn-primary h-12 px-8 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight24Filled className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-4 sm:px-8 border-t border-neutral-200/80 dark:border-white/10 text-center text-xs text-neutral-500 font-medium">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AirBook Technologies, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/help" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
