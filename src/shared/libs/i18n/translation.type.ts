// src/shared/libs/i18n/type.ts

import type { t } from "@/shared/libs/i18n";

export type TranslationKey = keyof typeof t;

export type Translations = typeof t;

export type ParameterlessTranslationKey = {
  [K in keyof Translations]: Translations[K] extends () => string ? K : never;
}[keyof Translations];
