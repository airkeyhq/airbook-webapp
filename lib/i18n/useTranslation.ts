import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, Language, LANGUAGES } from './translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'airbook-language-storage',
    }
  )
);

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore();

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
    setLanguage,
    availableLanguages: LANGUAGES,
  };
}
