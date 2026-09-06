import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/lib/blog/articles';

export const dynamic = 'force-static';

export async function GET() {
  const siteUrl = 'https://getairbook.com';

  const itemsXml = BLOG_POSTS.map((post) => {
    return `
    <item>
      <title><![CDATA[${post.title.en}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt.en}]]></description>
      <pubDate>${new Date(post.isoDate).toUTCString()}</pubDate>
      <author><![CDATA[${post.author.name}]]></author>
      <category><![CDATA[${post.categoryLabel.en}]]></category>
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AirBook Editorial &amp; Operator Playbooks</title>
    <link>${siteUrl}/blog</link>
    <description>Tactical playbooks, studio finance benchmarks, and modern software craft for salons, spas, and barbers.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
