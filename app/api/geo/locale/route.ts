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
    // 1. Check geo-ip headers from Vercel / Cloudflare / edge proxies
    const country = (
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-country-code') ||
      ''
    ).toUpperCase();

    let detectedLanguage: 'en' | 'es' | 'de' | 'fr' = 'en';

    if (SPANISH_COUNTRIES.has(country)) {
      detectedLanguage = 'es';
    } else if (GERMAN_COUNTRIES.has(country)) {
      detectedLanguage = 'de';
    } else if (FRENCH_COUNTRIES.has(country)) {
      detectedLanguage = 'fr';
    } else {
      // 2. Fallback to Accept-Language header from browser
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
      country: country || 'GLOBAL',
      language: detectedLanguage,
    });
  } catch (error) {
    return NextResponse.json({ country: 'GLOBAL', language: 'en' });
  }
}
