// src/shared/libs/i18n/locale-provider.tsx

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  setLocale as paraglideSetLocale,
  getLocale,
  type Locale,
} from "@/paraglide/runtime";
import type { LocaleContextValue } from "@/shared/types/locale.type";
<<<<<<< HEAD

export type { LocaleContextValue };
=======
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getLocale());

  const setLocale = useCallback((newLocale: Locale) => {
    paraglideSetLocale(newLocale, { reload: false });
    setLocaleState(newLocale);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <div id={"locale-provider"} key={locale}>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
