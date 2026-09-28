// src/shared/utils/url/wms-proxy.utils.ts

/**
 * Gets the base URL for the WMS proxy service.
 * Defaults to VITE_API_BASE_WMS_PROXY_URL or VITE_API_BASE_URL.
 */
export const getWmsProxyBaseUrl = (): string => {
  const envUrl =
    import.meta.env.VITE_API_BASE_WMS_PROXY_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "";

  return envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;
};

/**
 * Constructs a full Volatil proxy WMS URL for a given path or relative proxy string.
 * If the path is already an absolute URL (starts with http:// or https://), it is returned as is.
 * If the path is relative (e.g. /api/proxy/wms?layerId=...), it prefixes with getWmsProxyBaseUrl().
 */
export const buildWmsProxyUrl = (pathOrUrl?: string | null): string => {
  if (!pathOrUrl) return "";

  const trimmed = pathOrUrl.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const base = getWmsProxyBaseUrl();
  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${normalizedPath}`;
};
