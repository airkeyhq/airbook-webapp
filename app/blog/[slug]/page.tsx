'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { BLOG_POSTS, BlogPost } from '@/lib/blog/articles';
import {
  Sparkle24Regular,
  Clock24Regular,
  Calendar24Regular,
  Share24Filled,
  Checkmark24Filled,
  ArrowLeft24Filled,
  ArrowRight24Filled,
  Tag24Regular,
  BookOpen24Regular,
  Bot24Regular,
  Lightbulb24Regular,
  ShieldCheckmark24Regular,
} from '@fluentui/react-icons';

export default function BlogPostReaderPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Structured Data Schema for AI Agents and Search Bots
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title[language] || post.title.en,
    description: post.excerpt[language] || post.excerpt.en,
    datePublished: post.isoDate,
    dateModified: post.isoDate,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role[language] || post.author.role.en,
      image: post.author.avatar,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AirBook',
      url: 'https://getairbook.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://getairbook.com/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://getairbook.com/blog/${post.slug}`,
    },
    articleSection: post.categoryLabel[language] || post.categoryLabel.en,
    keywords: `${post.category}, salon management, booking software, airbook playbooks`,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white font-sans">
      {/* Inject Structured Data for AI & Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Persistent Header */}
      <MarketingHeader />

      {/* Main Article Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 flex-1 w-full">
        {/* Back Link & Meta Header */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/blog"
            className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
          >
            <ArrowLeft24Filled className="w-3.5 h-3.5" />
            <span>{t('backToBlog')}</span>
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="btn-secondary px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">{t('linkCopied')}</span>
              </>
            ) : (
              <>
                <Share24Filled className="w-3.5 h-3.5" />
                <span>{t('shareArticle')}</span>
              </>
            )}
          </button>
        </div>

        {/* Article Header & Typography */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#0284C7] dark:text-[#2BB5FF] font-black uppercase text-[10px] tracking-wider border border-[#2BB5FF]/20 shadow-xs whitespace-nowrap">
              <Tag24Regular className="w-3.5 h-3.5 flex-shrink-0 text-[#2BB5FF]" />
              <span>{post.categoryLabel[language]}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] whitespace-nowrap shadow-2xs">
              <Clock24Regular className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{post.readTime[language]}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-muted)] whitespace-nowrap shadow-2xs">
              <Calendar24Regular className="w-3.5 h-3.5 flex-shrink-0" />
              <time dateTime={post.isoDate}>{post.date}</time>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-[1.15]">
            {post.title[language]}
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
            {post.excerpt[language]}
          </p>

          {/* Author Badge */}
          <div className="pt-2 flex items-center gap-3.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[var(--border-subtle)] shadow-xs"
            />
            <div>
              <div className="text-xs font-black text-[var(--text-primary)]">
                {post.author.name}
              </div>
              <div className="text-[11px] font-medium text-[var(--text-muted)]">
                {post.author.role[language]}
              </div>
            </div>
          </div>
        </header>

        {/* Direct Answer BLUF Card (Optimized for AI Citations and Busy Operators) */}
        <section
          aria-labelledby="key-takeaways-heading"
          className="p-6 sm:p-8 rounded-[28px] bg-[var(--bg-secondary)] border-2 border-[#2BB5FF]/30 shadow-md space-y-3.5"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#2BB5FF]">
            <Sparkle24Regular className="w-4 h-4" />
            <span id="key-takeaways-heading">{t('keyTakeawaysTitle')}</span>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
            {post.keyTakeaways[language].map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#2BB5FF]/10 text-[#2BB5FF] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Table of Contents */}
        {post.sections.length > 1 && (
          <nav
            aria-label="Table of Contents"
            className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5"
          >
            <div className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <BookOpen24Regular className="w-3.5 h-3.5" />
              <span>{t('tableOfContents')}</span>
            </div>
            <ul className="text-xs space-y-1.5 font-bold">
              {post.sections.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="text-[var(--text-secondary)] hover:text-[#2BB5FF] transition-colors flex items-center gap-1.5"
                  >
                    <span>•</span>
                    <span>{sec.heading[language]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Article Body Sections */}
        <article className="space-y-10">
          {post.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4 pt-2 scroll-mt-24">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                {section.heading[language]}
              </h2>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                {section.content[language]}
              </p>

              {/* Data Table if present */}
              {section.table && (
                <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xs my-4">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/50">
                        {section.table.headers[language].map((head, hIdx) => (
                          <th
                            key={hIdx}
                            className="p-3.5 font-black text-[var(--text-primary)] uppercase tracking-wider text-[10px]"
                          >
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)]">
                      {section.table.rows[language].map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[var(--bg-primary)]/40 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`p-3.5 text-[var(--text-secondary)] font-semibold ${
                                cIdx === 0 ? 'text-[var(--text-primary)] font-bold' : ''
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Actionable Callout Box if present */}
              {section.callout && (
                <aside
                  className={`p-5 rounded-2xl border ${
                    section.callout.type === 'tip'
                      ? 'bg-blue-500/5 border-blue-500/20 text-blue-900 dark:text-blue-100'
                      : section.callout.type === 'stat'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-900 dark:text-emerald-100'
                      : 'bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-100'
                  } space-y-1.5 shadow-2xs`}
                >
                  <div className="text-xs font-black flex items-center gap-1.5">
                    {section.callout.type === 'tip' && <Lightbulb24Regular className="w-4 h-4 text-blue-500" />}
                    {section.callout.type === 'stat' && <ShieldCheckmark24Regular className="w-4 h-4 text-emerald-500" />}
                    {section.callout.type === 'playbook' && <Sparkle24Regular className="w-4 h-4 text-amber-500" />}
                    <span>{section.callout.title[language]}</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {section.callout.text[language]}
                  </p>
                </aside>
              )}
            </section>
          ))}
        </article>

        {/* Bottom Conversion CTA Card */}
        <section className="p-8 sm:p-10 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center space-y-5 shadow-md">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
              {t('readyToElevate')}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
              {t('readyToElevateDesc')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="btn-primary w-full sm:w-auto px-6 h-11 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/blog"
              className="btn-secondary w-full sm:w-auto px-5 h-11 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ArrowLeft24Filled className="w-3.5 h-3.5" />
              <span>{t('backToBlog')}</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Persistent Footer */}
      <MarketingFooter />
    </div>
  );
}
