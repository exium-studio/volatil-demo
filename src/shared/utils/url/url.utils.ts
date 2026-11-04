// src/shared/utils/url/url.utils.ts

/**
 * Resolves the API Base URL from VITE_API_BASE_URL (SSOT).
 */
export const getApiBaseUrl = (): string => {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
};

/**
 * Resolves the WMS/WFS Proxy Base URL directly from the API Base URL SSOT.
 */
export const getApiBaseWmsProxyUrl = (): string => {
  return getApiBaseUrl();
};

/**
 * Normalizes proxy / backend URLs (e.g. /api/proxy/wms, /api/proxy/wfs) with the backend base URL if relative.
 */
export const normalizeApiUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const cleanBase = getApiBaseUrl();
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
};
