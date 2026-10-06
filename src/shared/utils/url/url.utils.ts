// src/shared/utils/url/url.utils.ts

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
