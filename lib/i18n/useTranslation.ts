import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, Language, LANGUAGES } from './translations';
import {
  CurrencyCode,
  CURRENCIES_LIST,
  getCurrencyForCountry,
  formatPlanPrice,
  getPlanPricing,
  PlanTier,
} from '@/lib/plans';

export function detectDeviceLanguage(): Language {
  if (typeof window === 'undefined' || !window.navigator) {
    return 'en';
  }

  const navLang =
    (navigator.languages && navigator.languages.length > 0 ? navigator.languages[0] : null) ||
    navigator.language ||
    '';

  const code = navLang.toLowerCase();
  if (code.startsWith('es')) return 'es';
  if (code.startsWith('de')) return 'de';
  if (code.startsWith('fr')) return 'fr';
  return 'en';
}

interface LanguageState {
  language: Language;
  countryCode: string;
  currency: CurrencyCode;
  isUserSelected: boolean;
  isCurrencyUserSelected: boolean;
  setLanguage: (lang: Language, explicit?: boolean) => void;
  setCountryCode: (code: string) => void;
  setCurrency: (currency: CurrencyCode, explicit?: boolean) => void;
  initGeoDetection: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      countryCode: 'MX',
      currency: 'USD',
      isUserSelected: false,
      isCurrencyUserSelected: false,
      setLanguage: (lang: Language, explicit: boolean = true) => {
        set({ language: lang, isUserSelected: explicit });
      },
      setCountryCode: (code: string) => {
        set({ countryCode: code });
      },
      setCurrency: (currency: CurrencyCode, explicit: boolean = true) => {
        set({ currency, isCurrencyUserSelected: explicit });
      },
      initGeoDetection: async () => {
        // 1. Instant check from browser / device OS locale if language not user-selected
        if (!get().isUserSelected) {
          const deviceLang = detectDeviceLanguage();
          if (deviceLang !== 'en' && get().language === 'en') {
            set({ language: deviceLang });
          }
        }

        // 2. Query edge Country IP resolver in background to refine country, language, and currency
        try {
          const res = await fetch('/api/geo/locale');
          if (res.ok) {
            const data = await res.json();
            const rawCountry = data?.country && typeof data.country === 'string' ? data.country.toUpperCase() : 'US';
            set({ countryCode: rawCountry });

            if (data?.language && !get().isUserSelected) {
              set({ language: data.language });
            }

            if (!get().isCurrencyUserSelected) {
              const matchedCurrency = getCurrencyForCountry(rawCountry);
              set({ currency: matchedCurrency });
            }
          }
        } catch {
          // Graceful fallback
        }
      },
    }),
    {
      name: 'airbook-language-storage',
    }
  )
);

export function useTranslation() {
  const {
    language,
    countryCode,
    currency,
    setLanguage,
    setCountryCode,
    setCurrency,
    isUserSelected,
    isCurrencyUserSelected,
    initGeoDetection,
  } = useLanguageStore();

  useEffect(() => {
    // Run geo/device detection on client mount
    initGeoDetection();
  }, [initGeoDetection]);

  const getLocalizedCountry = (customCode?: string): string => {
    const code = (customCode || countryCode || 'MX').toUpperCase();
    try {
      if (code && code !== 'GLOBAL' && typeof Intl !== 'undefined' && Intl.DisplayNames) {
        const displayNames = new Intl.DisplayNames([language], { type: 'region' });
        const name = displayNames.of(code);
        if (name) return name;
      }
    } catch {
      // Fallback
    }

    if (code === 'MX') return language === 'es' ? 'México' : language === 'de' ? 'Mexiko' : language === 'fr' ? 'Mexique' : 'Mexico';
    if (code === 'ES') return language === 'es' ? 'España' : language === 'de' ? 'Spanien' : language === 'fr' ? 'Espagne' : 'Spain';
    if (code === 'US') return language === 'es' ? 'Estados Unidos' : language === 'de' ? 'Vereinigte Staaten' : language === 'fr' ? 'États-Unis' : 'United States';
    if (code === 'CO') return language === 'es' ? 'Colombia' : 'Colombia';
    if (code === 'AR') return language === 'es' ? 'Argentina' : 'Argentina';
    if (code === 'CL') return language === 'es' ? 'Chile' : 'Chile';
    if (code === 'PE') return language === 'es' ? 'Perú' : 'Peru';
    if (code === 'DE') return language === 'es' ? 'Alemania' : language === 'de' ? 'Deutschland' : language === 'fr' ? 'Allemagne' : 'Germany';
    if (code === 'FR') return language === 'es' ? 'Francia' : language === 'de' ? 'Frankreich' : language === 'fr' ? 'France' : 'France';

    return language === 'es' ? 'México' : 'Global';
  };

  const formatPrice = (amount: number, overrideCurrency?: CurrencyCode): string => {
    return formatPlanPrice(amount, overrideCurrency || currency);
  };

  const getTierPricing = (tier: PlanTier) => {
    return getPlanPricing(tier, currency);
  };

  const t = (key: keyof typeof translations.en, params?: Record<string, string | number>): string => {
    const dict = (translations[language] || translations.en) as Record<string, string>;
    let text = dict[key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(`{${paramKey}}`, String(val));
      });
    }
    return text;
  };

  return {
    t,
    language,
    countryCode,
    currency,
    currenciesList: CURRENCIES_LIST,
    formatPrice,
    getTierPricing,
    getLocalizedCountry,
    setLanguage: (lang: Language) => setLanguage(lang, true),
    setCountryCode,
    setCurrency: (curr: CurrencyCode) => setCurrency(curr, true),
    isUserSelected,
    isCurrencyUserSelected,
    availableLanguages: LANGUAGES,
  };
}
