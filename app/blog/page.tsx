'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { BLOG_POSTS, BlogPost } from '@/lib/blog/articles';
import {
  Sparkle24Regular,
  ArrowRight24Filled,
  Clock24Regular,
  Calendar24Regular,
  Bot24Regular,
  Rss24Regular,
  Tag24Regular,
  Filter24Regular,
} from '@fluentui/react-icons';

export default function BlogIndexPage() {
  const { t, language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t('blogCategoryAll') },
    { id: 'operations', label: t('blogCategoryOps') },
    { id: 'security', label: t('blogCategorySec') },
    { id: 'finance', label: t('blogCategoryFin') },
    { id: 'retention', label: t('blogCategoryRet') },
  ];

  const filteredPosts = selectedCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((post) => post.category === selectedCategory);

  const featuredPost = BLOG_POSTS.find((post) => post.featured) || BLOG_POSTS[0];
  const regularPosts = filteredPosts.filter((post) => selectedCategory !== 'all' || post.slug !== featuredPost.slug);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white font-sans">
      {/* Persistent Header */}
      <MarketingHeader />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12 sm:space-y-16 flex-1 w-full">
        {/* Editorial Hero Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#2BB5FF] text-xs font-black uppercase tracking-wider border border-[#2BB5FF]/20 shadow-xs">
              <Sparkle24Regular className="w-3.5 h-3.5 text-[#2BB5FF]" />
              <span>{t('blogTitle')}</span>
            </span>

            {/* Machine-Readable AI & RSS Quick Badges */}
            <div className="flex items-center gap-2">
              <Link
                href="/feed.xml"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-secondary)] hover:text-[#2BB5FF] hover:border-[#2BB5FF]/40 transition-colors shadow-xs"
                title="RSS 2.0 Feed"
              >
                <Rss24Regular className="w-3 h-3 text-amber-500" />
                <span>{t('rssFeed')}</span>
              </Link>
              <Link
                href="/llms.txt"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-secondary)] hover:text-[#2BB5FF] hover:border-[#2BB5FF]/40 transition-colors shadow-xs"
                title="Standard Plaintext AI Index"
              >
                <Bot24Regular className="w-3 h-3 text-[#2BB5FF]" />
                <span>{t('llmsTxt')}</span>
              </Link>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-[1.15]">
            {t('blogTitle')}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl font-medium">
            {t('blogSubtitle')}
          </p>
        </header>

        {/* Category Navigation Pills */}
        <nav aria-label="Blog Categories" className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                  isSelected
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Featured Story Lead Card (Rendered when 'all' is active) */}
        {selectedCategory === 'all' && (
          <section aria-labelledby="featured-story-title">
            <article className="p-6 sm:p-10 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[#2BB5FF]/40 transition-all shadow-md group relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20 whitespace-nowrap shadow-2xs">
                      <Sparkle24Regular className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{t('featuredArticle')}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#0284C7] dark:text-[#2BB5FF] text-[10px] font-black uppercase tracking-wider border border-[#2BB5FF]/20 whitespace-nowrap shadow-2xs">
                      <Tag24Regular className="w-3.5 h-3.5 flex-shrink-0 text-[#2BB5FF]" />
                      <span>{featuredPost.categoryLabel[language]}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] whitespace-nowrap shadow-2xs">
                      <Clock24Regular className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{featuredPost.readTime[language]}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] whitespace-nowrap shadow-2xs">
                      <Calendar24Regular className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{featuredPost.date}</span>
                    </span>
                  </div>

                  <h2 id="featured-story-title" className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] group-hover:text-[#2BB5FF] transition-colors leading-tight">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title[language]}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                    {featuredPost.excerpt[language]}
                  </p>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)] shadow-xs"
                      />
                      <div>
                        <div className="text-xs font-black text-[var(--text-primary)]">
                          {featuredPost.author.name}
                        </div>
                        <div className="text-[11px] font-medium text-[var(--text-muted)]">
                          {featuredPost.author.role[language]}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="btn-primary px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-md flex-shrink-0"
                    >
                      <span>{t('readPlaybook')}</span>
                      <ArrowRight24Filled className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Visual Direct Answer / Key Takeaways Preview Snippet */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3">
                  <div className="text-xs font-black text-[var(--text-primary)] flex items-center gap-2">
                    <Sparkle24Regular className="w-3.5 h-3.5 text-[#2BB5FF]" />
                    <span>{t('keyTakeawaysTitle')}</span>
                  </div>
                  <ul className="text-xs space-y-2 text-[var(--text-secondary)] font-medium leading-relaxed">
                    {featuredPost.keyTakeaways[language].slice(0, 3).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#2BB5FF] font-black text-xs mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section aria-label="Editorial Articles Grid" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post.slug}
                className="p-6 rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[#2BB5FF]/40 transition-all flex flex-col justify-between space-y-5 shadow-xs hover:shadow-md group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2 min-h-[26px]">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#0284C7] dark:text-[#2BB5FF] font-black uppercase text-[10px] tracking-wider border border-[#2BB5FF]/20 shadow-2xs whitespace-nowrap">
                      <Tag24Regular className="w-3.5 h-3.5 flex-shrink-0 text-[#2BB5FF]" />
                      <span>{post.categoryLabel[language]}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-muted)] bg-[var(--bg-primary)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)] shadow-2xs whitespace-nowrap">
                      <Clock24Regular className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{post.readTime[language]}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] group-hover:text-[#2BB5FF] transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title[language]}
                    </Link>
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium line-clamp-3">
                    {post.excerpt[language]}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--border-subtle)] flex-shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-black text-[var(--text-primary)] truncate">
                        {post.author.name}
                      </div>
                      <div className="text-[10px] font-medium text-[var(--text-muted)] truncate">
                        {post.date}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 flex-shrink-0 shadow-2xs"
                  >
                    <span>{t('readPlaybook')}</span>
                    <ArrowRight24Filled className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom Conversion & Machine AI Guarantee Ribbon */}
        <section className="p-8 sm:p-12 rounded-[36px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center space-y-6 relative overflow-hidden shadow-lg">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {t('readyToElevate')}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
              {t('readyToElevateDesc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="btn-primary w-full sm:w-auto px-6 h-12 rounded-2xl text-xs font-black flex items-center justify-center gap-2"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/help"
              className="btn-secondary w-full sm:w-auto px-6 h-12 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2"
            >
              <span>{t('navHelpCenterTitle')}</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] max-w-lg mx-auto">
            <p className="text-[11px] text-[var(--text-muted)] font-medium flex items-center justify-center gap-1.5">
              <Bot24Regular className="w-3.5 h-3.5 text-[#2BB5FF] flex-shrink-0" />
              <span>{t('aiMachineReadableNote')}</span>
            </p>
          </div>
        </section>
      </main>

      {/* Persistent Footer */}
      <MarketingFooter />
    </div>
  );
}
