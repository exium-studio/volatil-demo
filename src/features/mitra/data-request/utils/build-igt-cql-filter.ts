// src/features/mitra/data-request/utils/build-igt-cql-filter.ts

import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt.config";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";

/**
 * Known administrative column synonyms across various GeoServer layer schemas.
 */
const ADMIN_COLUMN_SYNONYMS: Record<string, string[]> = {
  wadmpr: ["wadmpr", "provinsi", "propinsi", "wadm_provinsi"],
  wadmkk: ["wadmkk", "kabupaten", "kotakab", "kab_kota", "wadm_kotakab"],
  wadmkc: ["wadmkc", "kecamatan", "wadm_kecamatan"],
  wadmkd: ["wadmkd", "kelurahan", "desa", "wadmpd", "wadm_desa", "namboj"],
};

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
 * Finds matching column name in available attributes based on administrative level.
 */
const findMatchingAttribute = (
  standardKey: string,
  availableAttributes?: string[],
): string | undefined => {
  if (!availableAttributes || availableAttributes.length === 0) {
    return standardKey.toLowerCase();
  }

  const synonyms =
    ADMIN_COLUMN_SYNONYMS[standardKey.toLowerCase()] ?? [standardKey.toLowerCase()];

  for (const syn of synonyms) {
    const matched = availableAttributes.find(
      (attr) => attr.toLowerCase() === syn.toLowerCase(),
    );
    if (matched) return matched;
  }

  return undefined;
};

/**
 * Converts administrative filter values into a strict GeoServer CQL_FILTER string.
 * Cascades parent levels (provinsi -> kabupaten -> kecamatan -> kelurahan) using strict
 * case-insensitive matching (`column ILIKE '%value%'`).
 * If no administrative filters are applied, returns undefined.
 */
export const buildIgtCqlFilter = (
  filters?: FilterAdministrativeAreaValues,
  availableAttributes?: string[],
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
        const targetCol = findMatchingAttribute(columnKey, availableAttributes);
        if (targetCol) {
          clauses.push(`${targetCol} ILIKE '%${cleanVal}%'`);
        }
      }
    }
  };

  addClause(IGT_FILTER_KEYS_MAP.PROVINSI); // wadmpr
  addClause(IGT_FILTER_KEYS_MAP.KABUPATEN); // wadmkk
  addClause(IGT_FILTER_KEYS_MAP.KECAMATAN); // wadmkc
  addClause(IGT_FILTER_KEYS_MAP.KELURAHAN); // wadmkd

  return clauses.length > 0 ? clauses.join(" AND ") : undefined;
};

/**
 * Adapts an existing CQL filter string to match target layer's available attributes.
 * Replaces unmatching administrative property names with synonyms present in the layer,
 * and strips clauses referencing properties that do not exist on the layer.
 */
export const adaptCqlFilterToLayerAttributes = (
  cqlFilter?: string,
  availableAttributes?: string[],
): string | undefined => {
  if (!cqlFilter || !availableAttributes || availableAttributes.length === 0) {
    return cqlFilter;
  }

  // Regex to match "prop ILIKE 'val'" or "prop='val'"
  const clauseRegex = /^\s*"?([a-zA-Z0-9_]+)"?\s*(ILIKE|=)\s*(.+)$/i;

  const clauses = cqlFilter.split(/\s+AND\s+/i);
  const adaptedClauses: string[] = [];

  for (const clause of clauses) {
    const match = clauseRegex.exec(clause.trim());
    if (!match) {
      // Non-property clause or spatial predicate like INTERSECTS / BBOX — preserve as-is
      adaptedClauses.push(clause.trim());
      continue;
    }

    const [, rawProp, op, val] = match;
    const propLower = rawProp.toLowerCase();

    // If property exists directly in layer attributes, keep clause
    const directMatch = availableAttributes.find(
      (attr) => attr.toLowerCase() === propLower,
    );
    if (directMatch) {
      adaptedClauses.push(`"${directMatch}" ${op.toUpperCase()} ${val}`);
      continue;
    }

    // Check if property is a known administrative column and find synonym in layer
    let synonymFound = false;
    for (const [standardKey, synonyms] of Object.entries(ADMIN_COLUMN_SYNONYMS)) {
      if (synonyms.includes(propLower) || standardKey === propLower) {
        for (const syn of synonyms) {
          const matchedSyn = availableAttributes.find(
            (attr) => attr.toLowerCase() === syn.toLowerCase(),
          );
          if (matchedSyn) {
            adaptedClauses.push(`"${matchedSyn}" ${op.toUpperCase()} ${val}`);
            synonymFound = true;
            break;
          }
        }
        break;
      }
    }

    // If property doesn't exist and has no synonym on this layer, omit clause to prevent GeoServer 400 error
    if (!synonymFound) {
      console.warn(
        `Property "${rawProp}" not found in layer attributes [${availableAttributes.join(
          ", ",
        )}]. Dropping clause from CQL_FILTER.`,
      );
    }
  }

  return adaptedClauses.length > 0 ? adaptedClauses.join(" AND ") : undefined;
};

// Aliases for compatibility
export const buildWfsCqlFilter = buildIgtCqlFilter;

