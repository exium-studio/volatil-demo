// src/features/mitra/data-request/utils/build-igt-cql-filter.ts

import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt.config";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";

/**
 * Strips common administrative prefixes (e.g. "KABUPATEN BADUNG" -> "BADUNG", "PROVINSI BALI" -> "BALI")
 * and escapes single quotes for GeoServer CQL.
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
 * Converts administrative filter values into a GeoServer CQL_FILTER string.
 * Supports both uppercase (WADMKK) and lowercase (wadmkk) PostGIS column names.
 * Uses ILIKE '%value%' for case-insensitive partial matching.
 * If no administrative filters are applied or all fields are empty, returns undefined (no CQL filter).
 */
export const buildIgtCqlFilter = (
  filters?: FilterAdministrativeAreaValues,
): string | undefined => {
  if (
    !filters ||
    typeof filters !== "object" ||
    Object.keys(filters).length === 0
  ) {
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
        // Use lowercase attribute name to match PostGIS table schema (e.g. wadmpr, wadmkk)
        const col = columnKey.toLowerCase();
        clauses.push(`${col} ILIKE '%${cleanVal}%'`);
      }
    }
  };

  addClause(IGT_FILTER_KEYS_MAP.PROVINSI); // wadmpr
  addClause(IGT_FILTER_KEYS_MAP.KABUPATEN); // wadmkk
  addClause(IGT_FILTER_KEYS_MAP.KECAMATAN); // wadmkc
  addClause(IGT_FILTER_KEYS_MAP.KELURAHAN); // wadmkd

  return clauses.length > 0 ? clauses.join(" AND ") : undefined;
};

// Aliases for compatibility
export const buildWfsCqlFilter = buildIgtCqlFilter;
export const adaptCqlFilterToLayerAttributes = (cqlFilter?: string) =>
  cqlFilter;
