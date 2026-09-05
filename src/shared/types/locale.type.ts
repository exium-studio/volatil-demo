<<<<<<< HEAD
// src/shared/types/locale.type.ts

=======
>>>>>>> fd4996e3 (refactor: overhaul design system toast architecture, introduce shared utility types, and refine component interfaces across features)
import type { Locale } from "@/paraglide/runtime";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};
