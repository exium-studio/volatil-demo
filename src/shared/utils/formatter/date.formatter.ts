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

