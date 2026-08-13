export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isFinished: boolean;
};

const SECOND_IN_MS = 1000;
const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = 60 * MINUTE_IN_SECONDS;
const DAY_IN_SECONDS = 24 * HOUR_IN_SECONDS;

export const getCountdownParts = (
  finishedAt: string | Date,
  now: Date = new Date(),
): CountdownParts => {
  const finishedAtDate =
    finishedAt instanceof Date ? finishedAt : new Date(finishedAt);
  const difference = finishedAtDate.getTime() - now.getTime();

  if (Number.isNaN(difference) || difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isFinished: true,
    };
  }

  const totalSeconds = Math.floor(difference / SECOND_IN_MS);

  return {
    days: Math.floor(totalSeconds / DAY_IN_SECONDS),
    hours: Math.floor((totalSeconds % DAY_IN_SECONDS) / HOUR_IN_SECONDS),
    minutes: Math.floor(
      (totalSeconds % HOUR_IN_SECONDS) / MINUTE_IN_SECONDS,
    ),
    seconds: totalSeconds % MINUTE_IN_SECONDS,
    isFinished: false,
  };
};

const DEFAULT_COUNTDOWN_FORMAT = "{DD}:{HH}:{mm}:{ss}";

export const formatCountdownParts = (
  parts: CountdownParts,
  format = DEFAULT_COUNTDOWN_FORMAT,
): string => {
  if (parts.isFinished) return "Kedaluwarsa";

  const replacements: Record<string, string> = {
    "{days}": String(parts.days),
    "{hours}": String(parts.hours),
    "{minutes}": String(parts.minutes),
    "{seconds}": String(parts.seconds),
    "{DD}": String(parts.days).padStart(2, "0"),
    "{HH}": String(parts.hours).padStart(2, "0"),
    "{mm}": String(parts.minutes).padStart(2, "0"),
    "{ss}": String(parts.seconds).padStart(2, "0"),
  };

  return Object.entries(replacements).reduce(
    (output, [token, value]) => output.replaceAll(token, value),
    format,
  );
};
