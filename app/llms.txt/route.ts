import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/lib/blog/articles';

export const dynamic = 'force-static';

export async function GET() {
  const articlesMarkdown = BLOG_POSTS.map((post) => {
    return `- [${post.title.en}](https://getairbook.com/blog/${post.slug}): ${post.excerpt.en} (Category: ${post.categoryLabel.en}, Reading Time: ${post.readTime.en})`;
  }).join('\n');

  const content = `# AirBook (getairbook.com)

> AirBook is a high-craft booking platform and operating system engineered for beauty salons, barbershops, medspas, nail studios, massage therapy, pet grooming, and independent wellness specialists.

## Key Features & Architecture
- **Passwordless Identity**: 100% passwordless architecture using WebAuthn biometric Passkeys (Touch ID, Face ID, Windows Hello) and cryptographic magic links.
- **Frictionless 3-Tap Booking**: Client storefront with real-time specialist availability, zero app download requirements, and no customer account passwords.
- **Deposit & No-Show Protection**: Automated card pre-authorizations and customizable deposits directly connected to Stripe Connect Express.
- **Tap-to-Pay POS**: Contactless terminal reader support and mobile Tap to Pay on iPhone/Android.
- **Client CRM & Technical Formula Specs**: Hair color formulas, treatment notes, eSign liability waivers, and 3-week automated SMS rebooking workflows.
- **Team & Shifts**: Multi-practitioner scheduling, room turnover sanitization buffers, and automated booth rental/commission split calculations.

## Editorial Playbooks & Guides
${articlesMarkdown}

## Documentation & Deep Links
- [Live Platform Overview](https://getairbook.com)
- [Operator Onboarding](https://getairbook.com/onboarding)
- [Help Center & Guides](https://getairbook.com/help)
- [Product Changelog](https://getairbook.com/changelog)
- [Editorial Blog](https://getairbook.com/blog)
- [Privacy Policy](https://getairbook.com/privacy)
- [Terms of Service](https://getairbook.com/terms)
- [Data Protection Guarantee](https://getairbook.com/data-protection)

## Contact
- Support: support@getairbook.com
- Security Inquiries: security@getairbook.com
- Privacy Officer: privacy@getairbook.com
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
