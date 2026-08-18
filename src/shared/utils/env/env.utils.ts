// src/shared/utils/env/env.utils.ts

/**
 * Checks whether dummy data fallback is enabled via environment variable VITE_USE_DUMMY_DATA or VITE_ENABLE_DUMMY_RESPONSE_FALLBACK.
 * When false, services must strictly return real backend data or throw / return empty results without falling back to mock fixtures.
 */
export const isDummyDataEnabled = (): boolean => {
  const envVal =
    import.meta.env.VITE_USE_DUMMY_DATA ??
    import.meta.env.VITE_ENABLE_DUMMY_RESPONSE_FALLBACK;
  return envVal === "true" || envVal === true;
};
