// src/features/mitra/data-request/utils/build-igt-cql-filter.ts

import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt.config";
import type { IgtFilterValues } from "@/features/mitra/data-request/types/filter-igt-trigger.type";

/**
 * Resolves a target attribute field key against sample properties in a case-insensitive manner.
 * E.g., if sample properties contain 'wadmpr', it resolves 'WADMPR' to 'wadmpr'.
 */
export const resolveAttributeKey = (
  targetKey: string,
  sampleProperties?: Record<string, unknown> | string[],
): string => {
  if (!sampleProperties) return targetKey;
  const keys = Array.isArray(sampleProperties)
    ? sampleProperties
    : Object.keys(sampleProperties);

  const matchedKey = keys.find(
    (k) => k.toUpperCase() === targetKey.toUpperCase(),
  );
  return matchedKey ?? targetKey;
};

/**
 * Adapts property field names in a CQL filter string to match actual layer attributes available on GeoServer.
 * E.g., transforms "WADMPR ILIKE '%BALI%'" -> "wadmpr ILIKE '%BALI%'" if layer has lowercase 'wadmpr'.
 */
export const adaptCqlFilterToLayerAttributes = (
  cqlFilter?: string,
  availableAttributes?: string[],
): string | undefined => {
  if (!cqlFilter || !availableAttributes || availableAttributes.length === 0) {
    return cqlFilter;
  }

  let adapted = cqlFilter;
  for (const attr of availableAttributes) {
    if (adapted.includes(attr)) continue;

    const upperAttr = attr.toUpperCase();
    const regex = new RegExp(`\\b${upperAttr}\\b`, "gi");
    adapted = adapted.replace(regex, attr);
  }

  return adapted;
};

/**
 * Converts IgtFilterValues into a GeoServer CQL_FILTER string.
 * Filters out properties that don't exist on the target layer (e.g. basis).
 * Adapts field names dynamically based on sampleProperties (lowercase vs uppercase).
 * Uses ILIKE '%value%' partial matching so API values like "BALI" match DB values like "Provinsi Bali".
 */
export const buildIgtCqlFilter = (
  filters: IgtFilterValues,
  sampleProperties?: Record<string, unknown> | string[],
): string | undefined => {
  const clauses: string[] = [];

  const addEqClause = (standardKey: string) => {
    // Skip 'basis' as it's not a GeoServer layer property
    if (standardKey === IGT_FILTER_KEYS_MAP.BASIS) return;

    // Resolve key from filters object (user filter input)
    const detail =
      filters[standardKey] ??
      filters[standardKey.toLowerCase()] ??
      filters[standardKey.toUpperCase()];

    if (detail?.value) {
      const safeValue = detail.value.replace(/'/g, "''");
      const actualFieldName = resolveAttributeKey(
        standardKey,
        sampleProperties,
      );
      // Use ILIKE '%value%' for case-insensitive & partial matching (e.g. "BALI" matches "Provinsi Bali")
      clauses.push(`${actualFieldName} ILIKE '%${safeValue}%'`);
    }
  };

  // addEqClause(IGT_FILTER_KEYS_MAP.BASIS);
  // addEqClause(IGT_FILTER_KEYS_MAP.TEMA);
  addEqClause(IGT_FILTER_KEYS_MAP.PROVINSI);
  addEqClause(IGT_FILTER_KEYS_MAP.KABUPATEN);
  addEqClause(IGT_FILTER_KEYS_MAP.KECAMATAN);
  addEqClause(IGT_FILTER_KEYS_MAP.KELURAHAN);

  return clauses.length > 0 ? clauses.join(" AND ") : undefined;
};

// Aliases for compatibility
export const buildWfsCqlFilter = buildIgtCqlFilter;
