// src/features/mitra/data-request/utils/build-igt-cql-filter.ts

import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt-filter.config";
import type { IgtFilterValues } from "@/features/mitra/data-request/types/filter-igt-trigger.type";

/**
 * Converts IgtFilterValues into a GeoServer CQL_FILTER string.
 * Filters out properties that don't exist on the target layer (e.g. basis).
 */
export const buildIgtCqlFilter = (
  filters: IgtFilterValues,
): string | undefined => {
  const clauses: string[] = [];

  const addEqClause = (fieldName: string) => {
    // Skip 'basis' as it's not a GeoServer layer property
    if (fieldName === IGT_FILTER_KEYS_MAP.BASIS) return;

    const detail = filters[fieldName];
    if (detail?.value) {
      const safeValue = detail.value.replace(/'/g, "''");
      // Use ILIKE for case-insensitive attribute & value matching in GeoServer ECQL
      clauses.push(`${fieldName} ILIKE '${safeValue}'`);
    }
  };

  addEqClause(IGT_FILTER_KEYS_MAP.BASIS);
  addEqClause(IGT_FILTER_KEYS_MAP.TEMA);
  addEqClause(IGT_FILTER_KEYS_MAP.PROVINSI);
  addEqClause(IGT_FILTER_KEYS_MAP.KABUPATEN);
  addEqClause(IGT_FILTER_KEYS_MAP.KECAMATAN);
  addEqClause(IGT_FILTER_KEYS_MAP.KELURAHAN);

  return clauses.length > 0 ? clauses.join(" AND ") : undefined;
};

// Aliases for compatibility
export const buildWfsCqlFilter = buildIgtCqlFilter;
