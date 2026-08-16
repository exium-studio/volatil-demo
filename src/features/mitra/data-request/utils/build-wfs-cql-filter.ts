// src/features/mitra/data-request/utils/build-wfs-cql-filter.ts

import { WFS_IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/wfs-igt-filter.config";
import type { WfsIgtFilterValues } from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";

/**
 * Converts WfsIgtFilterValues into a GeoServer CQL_FILTER string.
 * Filters out properties that don't exist on the target layer (e.g. basis).
 */
export const buildWfsCqlFilter = (
  filters: WfsIgtFilterValues,
): string | undefined => {
  const clauses: string[] = [];

  const addEqClause = (fieldName: string) => {
    // Skip 'basis' as it's not a GeoServer layer property
    if (fieldName === WFS_IGT_FILTER_KEYS_MAP.BASIS) return;

    const detail = filters[fieldName];
    if (detail?.value) {
      const safeValue = detail.value.replace(/'/g, "''");
      // Use ILIKE for case-insensitive attribute & value matching in GeoServer ECQL
      clauses.push(`${fieldName} ILIKE '${safeValue}'`);
    }
  };

  addEqClause(WFS_IGT_FILTER_KEYS_MAP.BASIS);
  addEqClause(WFS_IGT_FILTER_KEYS_MAP.TEMA);
  addEqClause(WFS_IGT_FILTER_KEYS_MAP.PROVINSI);
  addEqClause(WFS_IGT_FILTER_KEYS_MAP.KABUPATEN);
  addEqClause(WFS_IGT_FILTER_KEYS_MAP.KECAMATAN);
  addEqClause(WFS_IGT_FILTER_KEYS_MAP.KELURAHAN);

  return clauses.length > 0 ? clauses.join(" AND ") : undefined;
};
