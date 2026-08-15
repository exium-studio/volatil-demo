// src/features/mitra/my-data/utils/my-data-date.ts

const DEFAULT_TIMEZONE = "UTC";
const DEFAULT_LOCALE = "id-ID";

const createFormatter = (timeZone: string) =>
  new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
    timeZoneName: "short",
    hour12: false,
  });

export const formatUtcDateTime = (
  utcIso: string | null | undefined,
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

export const getPreferredUserTimezone = (): string => {
  if (typeof window === "undefined") return DEFAULT_TIMEZONE;

  const storedTimezone = window.localStorage.getItem("preferred-timezone");
  if (storedTimezone) return storedTimezone;

  return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
};
