import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, Language, LANGUAGES } from './translations';

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
  isUserSelected: boolean;
  setLanguage: (lang: Language, explicit?: boolean) => void;
  setCountryCode: (code: string) => void;
  initGeoDetection: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      countryCode: 'MX',
      isUserSelected: false,
      setLanguage: (lang: Language, explicit: boolean = true) => {
        set({ language: lang, isUserSelected: explicit });
      },
      setCountryCode: (code: string) => {
        set({ countryCode: code });
      },
      initGeoDetection: async () => {
        // 1. Instant check from browser / device OS locale if language not user-selected
        if (!get().isUserSelected) {
          const deviceLang = detectDeviceLanguage();
          if (deviceLang !== 'en' && get().language === 'en') {
            set({ language: deviceLang });
          }
        }

        // 2. Query edge Country IP resolver in background to refine country and language
        try {
          const res = await fetch('/api/geo/locale');
          if (res.ok) {
            const data = await res.json();
            if (data?.country && typeof data.country === 'string') {
              set({ countryCode: data.country.toUpperCase() });
            }
            if (data?.language && !get().isUserSelected) {
              set({ language: data.language });
            }
          }
        } catch {
          // Graceful fallback to default
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
    setLanguage,
    setCountryCode,
    isUserSelected,
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
    getLocalizedCountry,
    setLanguage: (lang: Language) => setLanguage(lang, true),
    setCountryCode,
    availableLanguages: LANGUAGES,
  };
}
