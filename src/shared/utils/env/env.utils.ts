// src/shared/utils/env/env.utils.ts

// src\shared\utils\env\env.utils.ts

// src\shared\utils\env\env.utils.ts

/**
 * Checks whether dummy data fallback is enabled via environment variable VITE_ENABLE_DUMMY_RESPONSE_FALLBACK.
 * When false, services must strictly return real backend data or throw / return empty results without falling back to mock fixtures.
 */
export const isDummyDataEnabled = (): boolean => {
  const envVal = import.meta.env.VITE_ENABLE_DUMMY_RESPONSE_FALLBACK;
  return envVal === "true" || envVal === true;
};

/**
 * Checks whether dev mode is enabled via environment variable VITE_ENABLE_DEV_MODE or VITE_DEV_MODE.
 * When true, renders development purpose features (e.g. dev login with credentials on Mitra portal).
 */
export const isDevModeEnabled = (): boolean => {
  const envVal =
    import.meta.env.VITE_ENABLE_DEV_MODE ?? import.meta.env.VITE_DEV_MODE;
  return envVal === "true" || envVal === true;
};
