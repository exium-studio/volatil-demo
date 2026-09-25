// src\features\mitra\data-request\utils\build-igt-cql-filter.ts

// src\features\mitra\data-request\utils\build-igt-cql-filter.ts

import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt.config";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";

/**
 * Escapes single quotes and trims whitespace for GeoServer CQL string literals.
 */
export const escapeCqlString = (raw: string): string => {
  if (!raw) return "";
  return raw.trim().replace(/'/g, "''");
};

/**
 * Strips common administrative prefixes and escapes single quotes.
 * Kept for backward compatibility.
 */
export const cleanAdministrativeValue = (raw: string): string => {
  return escapeCqlString(raw);
};

/**
 * Converts administrative filter values into a strict GeoServer CQL_FILTER string.
 * Cascades parent levels (provinsi -> kabupaten -> kecamatan -> kelurahan) using strict
 * case-insensitive matching (`column ILIKE 'value'`).
 * If no administrative filters are applied, returns undefined.
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
      const cleanVal = escapeCqlString(detail.value);
      if (cleanVal) {
        // Use lowercase attribute name to match PostGIS table schema (e.g. wadmpr, wadmkk)
        const col = columnKey.toLowerCase();
        clauses.push(`${col} ILIKE '${cleanVal}'`);
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
