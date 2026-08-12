'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkle24Regular,
  ArrowRight24Filled,
  Calendar24Regular,
  Person24Regular,
  Payment24Regular,
  CheckmarkCircle24Regular,
  Globe24Regular,
} from '@fluentui/react-icons';

export default function AmieMarketingWebsite() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0C0D12] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col justify-between selection:bg-pink-500 selection:text-white relative overflow-x-hidden font-sans">
      {/* Soft Floating Background Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-pink-400/20 via-purple-400/15 to-blue-500/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[800px] -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/15 to-emerald-400/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/80 dark:bg-[#0C0D12]/80 border-b border-slate-200 dark:border-white/10 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-base shadow-lg"
            >
              A
            </motion.div>
            <span className="font-extrabold text-lg tracking-tight text-[#0F172A] dark:text-white group-hover:opacity-80 transition-opacity">
              AirBook
            </span>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">
              How it Works
            </a>
            <a href="#crm" className="hover:text-black dark:hover:text-white transition-colors">
              Client Notes
            </a>
            <a href="#pos" className="hover:text-black dark:hover:text-white transition-colors">
              Payments & Deposits
            </a>
            <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/onboarding"
              className="px-5 py-2.5 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-md shadow-[#2BB5FF]/30 hover:scale-[1.02] transition-all flex items-center gap-1.5"
            >
              <span>Get Started Free</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24 pb-16 text-center relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-pink-600 dark:text-pink-400 shadow-sm mb-6"
        >
          <Sparkle24Regular className="w-4 h-4 text-pink-500" />
          <span>Designed specifically for stylists, estheticians, barbers & spa pros</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-7xl font-black tracking-tight leading-[1.08] text-[#0F172A] dark:text-[#F8FAFC]"
        >
          Book clients fast. <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Protect your time. Get paid seamlessly.
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-6 font-medium leading-relaxed"
        >
          Running your chair or studio should feel effortless. AirBook handles 24/7 online client booking, deposit protection so no-shows never cost you money, formula notes, and instant payouts.
        </motion.p>

        {/* Primary Hero CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <Link
            href="/onboarding"
            className="px-8 py-4 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-sm shadow-xl shadow-[#2BB5FF]/30 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Calendar24Regular className="w-4 h-4" />
            <span>Try AirBook Free</span>
            <ArrowRight24Filled className="w-4 h-4" />
          </Link>

          <Link
            href="/book/eduardos-lounge"
            className="px-7 py-4 rounded-2xl bg-white dark:bg-[#141720] border border-slate-200 dark:border-white/15 font-bold text-sm text-[#0F172A] dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-[#1E2230] hover:scale-105 transition-all flex items-center gap-2"
          >
            <Globe24Regular className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>See Live Client Booking Demo</span>
          </Link>
        </motion.div>

        {/* Hero Interactive App Mockup Preview */}
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-14 rounded-[36px] glass-panel bg-white/70 dark:bg-gray-900/70 border border-slate-200 dark:border-white/10 p-4 sm:p-6 shadow-2xl overflow-hidden max-w-4xl mx-auto text-left"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-mono font-bold text-slate-400">AirBook Pro Workspace • Eduardo's Lounge</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              Live Demo Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Today's Revenue</p>
              <p className="text-2xl font-black text-[#0F172A] dark:text-white">$840.00</p>
              <p className="text-[10px] text-emerald-500 font-semibold">+18% vs last week</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Bookings Today</p>
              <p className="text-2xl font-black text-[#0F172A] dark:text-white">12 Clients</p>
              <p className="text-[10px] text-blue-500 font-semibold">100% deposit protected</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Client Satisfaction</p>
              <p className="text-2xl font-black text-[#0F172A] dark:text-white">4.98 ★</p>
              <p className="text-[10px] text-pink-500 font-semibold">142 verified reviews</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-white/10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-pink-500">
            Built for beauty & wellness operators
          </span>
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Everything you need to run your suite or salon
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="p-8 rounded-[32px] bg-white dark:bg-[#141720] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">Effortless 24/7 Scheduling</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Let clients pick times and book online anytime. Easy drag-and-drop schedule, waitlist auto-fill, and automatic text reminders so everyone shows up on time.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="p-8 rounded-[32px] bg-white dark:bg-[#141720] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm hover:shadow-xl hover:border-pink-500/40 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Person24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">Remember Every Formula & Detail</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Keep hair color formulas, guard specs, skin notes, before/after photos, and intake waivers stored right under each client profile.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="p-8 rounded-[32px] bg-white dark:bg-[#141720] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Payment24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">Instant Cashout & Deposit Security</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Require deposits to lock in appointments, accept fast tap-to-pay checkouts with custom tip screens, and get cash sent straight to your card.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-white/10">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-500">
            Fair & Transparent
          </span>
          <h2 className="text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Simple plans built to help you grow.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pro Plan Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-[36px] bg-white dark:bg-[#141720] border border-slate-200 dark:border-white/10 space-y-6 shadow-md hover:shadow-2xl hover:border-blue-500/40 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Solo Stylist / Suite</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">For booth renters, independent barbers, estheticians & solo pros</p>
              </div>
              <span className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC]">$20 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mo</span></span>
            </div>
            <ul className="text-xs space-y-3 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" /> Unlimited 24/7 Online Client Bookings</li>
              <li className="flex items-center gap-2"><CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" /> Automatic Card Deposits & No-Show Protection</li>
              <li className="flex items-center gap-2"><CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" /> Client Formula Notes, Specs & Photo History</li>
              <li className="flex items-center gap-2"><CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" /> Instant Daily Cashout to your Debit Card</li>
            </ul>
            <Link
              href="/onboarding"
              className="block w-full py-3.5 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs text-center shadow-md shadow-[#2BB5FF]/30 hover:scale-[1.01] transition-all"
            >
              Start 7-Day Free Trial
            </Link>
          </motion.div>

          {/* Business Plan Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-[36px] bg-gradient-to-br from-blue-600 to-indigo-600 text-white space-y-6 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                  Most Popular
                </span>
                <h3 className="text-lg font-extrabold text-white">Salon & Spa Team</h3>
                <p className="text-xs text-blue-100 mt-0.5">For multi-chair shops, team studios & growing spa teams</p>
              </div>
              <span className="text-2xl font-black text-white">$40 <span className="text-xs font-normal text-blue-200">/mo</span></span>
            </div>
            <ul className="text-xs space-y-3 text-blue-100">
              <li className="flex items-center gap-2"><CheckmarkCircle24Regular className="w-4 h-4 text-amber-300" /> Everything in Solo + Full Team Scheduling</li>
              <li className="flex items-center gap-2"><CheckmarkCircle24Regular className="w-4 h-4 text-amber-300" /> Automated Chair Rent & Commission Payouts</li>
              <li className="flex items-center gap-2"><CheckmarkCircle24Regular className="w-4 h-4 text-amber-300" /> Smart 3-Week Client SMS Re-Booking Engine</li>
              <li className="flex items-center gap-2"><CheckmarkCircle24Regular className="w-4 h-4 text-amber-300" /> Digital Consultation Waivers & Client Forms</li>
            </ul>
            <Link
              href="/onboarding"
              className="block w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs text-center shadow-lg hover:bg-slate-100 transition-colors"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-[10px]">
            A
          </div>
          <span className="font-bold text-[#0F172A] dark:text-white">AirBook</span>
          <span>© 2026 AirBook</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <Link href="/dashboard" className="hover:underline">Operator App</Link>
          <Link href="/login" className="hover:underline">Sign In</Link>
          <Link href="/book/eduardos-lounge" className="hover:underline">Client Demo</Link>
        </div>
      </footer>
    </div>
  );
}
