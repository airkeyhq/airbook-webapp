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
  isUserSelected: boolean;
  setLanguage: (lang: Language, explicit?: boolean) => void;
  initGeoDetection: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      isUserSelected: false,
      setLanguage: (lang: Language, explicit: boolean = true) => {
        set({ language: lang, isUserSelected: explicit });
      },
      initGeoDetection: async () => {
        // If user explicitly picked a language, do not override
        if (get().isUserSelected) return;

        // 1. Instant check from browser / device OS locale
        const deviceLang = detectDeviceLanguage();
        if (deviceLang !== 'en' && get().language === 'en') {
          set({ language: deviceLang });
        }

        // 2. Query edge Country IP resolver in background to refine
        try {
          const res = await fetch('/api/geo/locale');
          if (res.ok) {
            const data = await res.json();
            if (data?.language && !get().isUserSelected) {
              set({ language: data.language });
            }
          }
        } catch {
          // Graceful fallback to device language
        }
      },
    }),
    {
      name: 'airbook-language-storage',
    }
  )
);

export function useTranslation() {
  const { language, setLanguage, isUserSelected, initGeoDetection } = useLanguageStore();

  useEffect(() => {
    // Run geo/device detection once on client mount if not manually chosen
    if (!isUserSelected) {
      initGeoDetection();
    }
  }, [isUserSelected, initGeoDetection]);

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
    setLanguage: (lang: Language) => setLanguage(lang, true),
    availableLanguages: LANGUAGES,
  };
}
