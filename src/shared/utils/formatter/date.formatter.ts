import { getLocale } from "@/shared/libs/i18n";

const DEFAULT_TIMEZONE = "UTC";
const DEFAULT_LOCALE = "id-ID";

export const getPreferredUserTimezone = (): string => {
  if (typeof window === "undefined") return DEFAULT_TIMEZONE;

  const storedTimezone = window.localStorage.getItem("preferred-timezone");
  if (storedTimezone) return storedTimezone;

  return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
};

const createFormatter = (timeZone: string, locale = DEFAULT_LOCALE) =>
  new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
    hour12: false,
  });

export const formatTime = (
  timestamp: number | Date | string | null | undefined,
  timeZone = getPreferredUserTimezone(),
  locale = DEFAULT_LOCALE,
): string => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    hour12: false,
  }).format(date);
};

export const formatDateTime = (
  timestamp: number | Date | string | null | undefined,
  timeZone = getPreferredUserTimezone(),
  locale = DEFAULT_LOCALE,
): string => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    hour12: false,
  }).format(date);
};

export const formatUtcDateTime = (
  utcIso: string | number | Date | null | undefined,
  preferredTimezone = DEFAULT_TIMEZONE,
): string => {
  if (!utcIso) return "-";

  const date = new Date(utcIso);
  if (Number.isNaN(date.getTime())) return "-";

  try {
    return createFormatter(preferredTimezone).format(date);
  } catch {
    return createFormatter(DEFAULT_TIMEZONE).format(date);
  }
};

export const formatRelativeTime = (
  timestamp: number | Date | string | null | undefined,
  locale?: string,
): string => {
  if (!timestamp) return "-";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "-";

  const now = Date.now();
  const diffInSeconds = Math.round((date.getTime() - now) / 1000);

  const currentLocale = locale ?? getLocale();
  const resolvedLocale =
    currentLocale === "id"
      ? "id-ID"
      : currentLocale === "en"
        ? "en-US"
        : currentLocale;

  const rtf = new Intl.RelativeTimeFormat(resolvedLocale, {
    numeric: "auto",
  });

  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < 60) {
    return rtf.format(diffInSeconds, "second");
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, "hour");
  }

  const diffInDays = Math.round(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, "day");
  }

  const diffInMonths = Math.round(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, "month");
  }

  const diffInYears = Math.round(diffInDays / 365);
  return rtf.format(diffInYears, "year");
};
