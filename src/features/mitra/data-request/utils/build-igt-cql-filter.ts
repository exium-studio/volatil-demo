// src/features/mitra/data-request/utils/build-igt-cql-filter.ts

import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt.config";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";

/**
 * Strips common administrative prefix prefixes (e.g. "KABUPATEN BADUNG" -> "BADUNG")
 * and escapes single quotes so that ILIKE '%value%' partial matching matches any DB naming format.
 */
export const cleanAdministrativeValue = (raw: string): string => {
  if (!raw) return "";
  let cleaned = raw.trim();

  // Strip common administrative prefix keywords to maximize partial match flexibility
  cleaned = cleaned
    .replace(/^PROVINSI\s+/i, "")
    .replace(/^KABUPATEN\s+/i, "")
    .replace(/^KAB\.\s+/i, "")
    .replace(/^KOTA\s+/i, "")
    .replace(/^KECAMATAN\s+/i, "")
    .replace(/^KEC\.\s+/i, "")
    .replace(/^KELURAHAN\s+/i, "")
    .replace(/^KEL\.\s+/i, "")
    .replace(/^DESA\s+/i, "")
    .trim();

  // Escape single quotes for GeoServer CQL
  return cleaned.replace(/'/g, "''");
};

/**
 * Converts administrative filter values into a GeoServer CQL_FILTER string using hardcoded standard column names (WADMPR, WADMKK, WADMKC, WADMKD).
 * Uses ILIKE '%value%' partial matching on cleaned core keywords.
 * If no administrative filters are applied or all fields are empty, returns undefined (no CQL filter).
 */
export const buildIgtCqlFilter = (
  filters?: FilterAdministrativeAreaValues,
): string | undefined => {
  if (!filters || typeof filters !== "object" || Object.keys(filters).length === 0) {
    return undefined;
  }

  const clauses: string[] = [];

  const addClause = (columnKey: string) => {
    const detail =
      filters[columnKey] ??
      filters[columnKey.toLowerCase()] ??
      filters[columnKey.toUpperCase()];

    if (detail?.value && detail.value.trim() !== "") {
      const cleanVal = cleanAdministrativeValue(detail.value);
      if (cleanVal) {
        clauses.push(`${columnKey} ILIKE '%${cleanVal}%'`);
      }
    }
  };

  addClause(IGT_FILTER_KEYS_MAP.PROVINSI); // WADMPR
  addClause(IGT_FILTER_KEYS_MAP.KABUPATEN); // WADMKK
  addClause(IGT_FILTER_KEYS_MAP.KECAMATAN); // WADMKC
  addClause(IGT_FILTER_KEYS_MAP.KELURAHAN); // WADMKD

  return clauses.length > 0 ? clauses.join(" AND ") : undefined;
};

// Aliases for compatibility
export const buildWfsCqlFilter = buildIgtCqlFilter;
export const adaptCqlFilterToLayerAttributes = (cqlFilter?: string) => cqlFilter;


