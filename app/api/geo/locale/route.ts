import { NextRequest, NextResponse } from 'next/server';

const SPANISH_COUNTRIES = new Set([
  'MX', 'ES', 'CO', 'AR', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU',
  'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ'
]);

const GERMAN_COUNTRIES = new Set(['DE', 'AT', 'CH', 'LI']);

const FRENCH_COUNTRIES = new Set([
  'FR', 'BE', 'MC', 'SN', 'CI', 'MA', 'DZ', 'TN', 'LU', 'CD', 'CM', 'MG', 'ML'
]);

export async function GET(req: NextRequest) {
  try {
    // 1. Check geo-ip headers from Vercel, Cloudflare, AWS CloudFront, Google Cloud edge proxies
    let country = (
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-country-code') ||
      req.headers.get('cloudfront-viewer-country') ||
      req.headers.get('x-appengine-country') ||
      ''
    ).trim().toUpperCase();

    // 2. If no edge headers present (e.g. local dev, custom VPS, or direct IP), resolve via public IP lookup
    if (!country || country === 'XX' || country === 'UNKNOWN') {
      const forwarded = req.headers.get('x-forwarded-for');
      const clientIp = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '';
      
      try {
        const isLocalIp = !clientIp || clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.');
        const url = isLocalIp ? 'https://api.country.is/' : `https://api.country.is/${clientIp}`;
        const res = await fetch(url, {
          signal: AbortSignal.timeout(1500),
          next: { revalidate: 3600 },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.country && typeof data.country === 'string') {
            country = data.country.toUpperCase();
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    let detectedLanguage: 'en' | 'es' | 'de' | 'fr' = 'en';

    if (SPANISH_COUNTRIES.has(country)) {
      detectedLanguage = 'es';
    } else if (GERMAN_COUNTRIES.has(country)) {
      detectedLanguage = 'de';
    } else if (FRENCH_COUNTRIES.has(country)) {
      detectedLanguage = 'fr';
    } else {
      // 3. Fallback to Accept-Language header from browser
      const acceptLang = req.headers.get('accept-language')?.toLowerCase() || '';
      if (acceptLang.startsWith('es') || acceptLang.includes(',es')) {
        detectedLanguage = 'es';
      } else if (acceptLang.startsWith('de') || acceptLang.includes(',de')) {
        detectedLanguage = 'de';
      } else if (acceptLang.startsWith('fr') || acceptLang.includes(',fr')) {
        detectedLanguage = 'fr';
      }
    }

    return NextResponse.json({
      country: country || 'MX',
      language: detectedLanguage,
    });
  } catch {
    return NextResponse.json({ country: 'MX', language: 'es' });
  }
}
