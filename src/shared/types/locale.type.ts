import type { Locale } from "@/paraglide/runtime";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};
