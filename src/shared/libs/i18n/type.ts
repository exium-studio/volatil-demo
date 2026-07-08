// src/shared/libs/i18n/type.ts

import type { t } from "@/shared/libs/i18n/-typed";

export type TranslationKey = keyof typeof t;
