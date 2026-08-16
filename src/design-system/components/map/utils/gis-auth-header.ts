// src/design-system/components/map/utils/gis-auth-header.ts

/**
 * Returns Basic Auth header string for GeoServer / GIS requests if credentials exist.
 * Defaults to testing_user:testing123 fallback for development testing.
 */
export const getGisAuthHeader = (): string => {
  const username =
    import.meta.env.VITE_GIS_CREDENTIAL_USERNAME || "testing_user";
  const password =
    import.meta.env.VITE_GIS_CREDENTIAL_PASSWORD || "testing123";

  return `Basic ${btoa(`${username}:${password}`)}`;
};
