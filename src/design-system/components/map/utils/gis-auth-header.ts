// src/design-system/components/map/utils/gis-auth-header.ts

/**
 * Returns Basic Auth header string for GeoServer / GIS requests if credentials exist.
 * Defaults to testing_user:testing123 fallback for development testing.
 */

// TODO: use proxy from BE instead
export const getGisAuthHeader = (): string => {
  const username = import.meta.env.VITE_GIS_CREDENTIAL_USERNAME;
  const password = import.meta.env.VITE_GIS_CREDENTIAL_PASSWORD;

  return `Basic ${btoa(`${username}:${password}`)}`;
};
