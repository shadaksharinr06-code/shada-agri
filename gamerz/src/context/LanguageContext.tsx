import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import translations from '../data/translations';

export type LanguageCode = 'en' | 'kn' | 'hi' | 'ta';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
  languageLabel: (lang: LanguageCode) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = useMemo(
    () => (key: string) =>
      (translations as any)[language]?.[key] ?? (translations as any)['en']?.[key] ?? key,
    [language]
  );

  const languageLabel = useMemo(
    () => (lang: LanguageCode) => (translations as any)[lang]?.languageName ?? lang,
    []
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
