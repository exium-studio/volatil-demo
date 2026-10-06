// src/shared/utils/env/env.utils.ts

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

/**
 * Resolves the WMS/WFS Proxy Base URL from VITE_API_BASE_WMS_PROXY_URL or fallback to VITE_API_BASE_URL.
 */
export const getApiBaseWmsProxyUrl = (): string => {
  return (
    import.meta.env.VITE_API_BASE_WMS_PROXY_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    ""
  ).replace(/\/+$/, "");
};

/**
 * Resolves the API Base URL from VITE_API_BASE_URL.
 */
export const getApiBaseUrl = (): string => {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
};

/**
 * Normalizes proxy / backend URLs (e.g. /api/proxy/wms, /api/proxy/wfs) with the backend base URL if relative.
 */
export const normalizeApiUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const base = getApiBaseWmsProxyUrl();
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
};
