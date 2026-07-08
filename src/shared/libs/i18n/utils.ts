// src/shared/libs/i18n/utils.ts

export function getLocaleLabel(locale: string, displayLocale?: string) {
  const names = new Intl.DisplayNames([displayLocale ?? locale], {
    type: "language",
  });
  return names.of(locale); // "Indonesian", "English", "Deutsch", etc
}
