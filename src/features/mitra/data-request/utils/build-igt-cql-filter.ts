import { IGT_FILTER_KEYS_MAP } from "@/features/mitra/data-request/constants/igt.config";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";
import { isEmptyArray } from "@/shared/utils/data/array";

const ATTRIBUTE_SYNONYMS: Record<string, string[]> = {
  WADMPR: [
    "WADMPR",
    "wadmpr",
    "provinsi",
    "prov",
    "propinsi",
    "nm_prov",
    "nama_provinsi",
    "nama_prov",
  ],
  WADMKK: [
    "WADMKK",
    "wadmkk",
    "kabupaten",
    "kab_kota",
    "kab",
    "kota",
    "nm_kab",
    "nama_kabupaten",
    "nama_kab",
  ],
  WADMKC: [
    "WADMKC",
    "wadmkc",
    "kecamatan",
    "kec",
    "nm_kec",
    "nama_kecamatan",
    "nama_kec",
  ],
  WADMKD: [
    "WADMKD",
    "wadmkd",
    "kelurahan",
    "desa",
    "des_kel",
    "nm_desa",
    "nama_kelurahan",
    "nama_desa",
  ],
};

/**
 * Resolves a target attribute field key against sample properties in a case-insensitive manner.
 * Also checks known synonyms (e.g. WADMKK -> kabupaten).
 */
export const resolveAttributeKey = (
  targetKey: string,
  sampleProperties?: Record<string, unknown> | string[],
): string => {
  if (!sampleProperties) return targetKey;
  const keys = Array.isArray(sampleProperties)
    ? sampleProperties
    : Object.keys(sampleProperties);

  // 1. Direct case-insensitive match
  const directMatch = keys.find(
    (k) => k.toUpperCase() === targetKey.toUpperCase(),
  );
  if (directMatch) return directMatch;

  // 2. Check synonyms
  const upperTarget = targetKey.toUpperCase();
  const synonyms = ATTRIBUTE_SYNONYMS[upperTarget] ?? [];
  for (const syn of synonyms) {
    const synMatch = keys.find((k) => k.toUpperCase() === syn.toUpperCase());
    if (synMatch) return synMatch;
  }

  return targetKey;
};

/**
 * Adapts property field names in a CQL filter string to match actual layer attributes available on GeoServer.
 * - Maps standard keys (e.g. WADMKK) to available layer column names (e.g. kabupaten).
 * - Strips clauses for properties that do NOT exist on the layer (e.g. WADMPR on layers without a province column)
 *   to avoid GeoServer 400 "Illegal property name" errors.
 */
export const adaptCqlFilterToLayerAttributes = (
  cqlFilter?: string,
  availableAttributes?: string[],
): string | undefined => {
  if (!cqlFilter || !availableAttributes || isEmptyArray(availableAttributes)) {
    return cqlFilter;
  }

  // If filter is pure spatial predicate (INTERSECTS, BBOX, DWITHIN), preserve as is
  if (
    cqlFilter.startsWith("INTERSECTS(") ||
    cqlFilter.startsWith("BBOX(") ||
    cqlFilter.startsWith("DWITHIN(")
  ) {
    return cqlFilter;
  }

  const clauses = cqlFilter.split(/\s+AND\s+/i);
  const adaptedClauses: string[] = [];

  for (const clause of clauses) {
    const trimmed = clause.trim();
    if (!trimmed) continue;

    // Preserve complex/spatial or nested clauses
    if (
      trimmed.startsWith("INTERSECTS(") ||
      trimmed.startsWith("BBOX(") ||
      trimmed.startsWith("DWITHIN(") ||
      trimmed.startsWith("(")
    ) {
      adaptedClauses.push(trimmed);
      continue;
    }

    // Match attribute comparison e.g. "WADMPR ILIKE '%BALI%'" or "WADMKK = 'BADUNG'"
    const match = trimmed.match(/^("?[a-zA-Z0-9_]+"?)(\s+.*)$/);
    if (!match || !match[1] || !match[2]) {
      adaptedClauses.push(trimmed);
      continue;
    }

    const rawProp = match[1].replace(/"/g, "");
    const restOfClause = match[2];

    // Check if property or synonym exists on the layer
    const actualProp = resolveAttributeKey(rawProp, availableAttributes);
    const propExists = availableAttributes.some(
      (attr) => attr.toUpperCase() === actualProp.toUpperCase(),
    );

    if (propExists) {
      adaptedClauses.push(`${actualProp}${restOfClause}`);
    }
    // If property does not exist on this layer, omit clause to prevent GeoServer 400 error
  }

  return adaptedClauses.length > 0 ? adaptedClauses.join(" AND ") : undefined;
};

/**
 * Converts IgtFilterValues into a GeoServer CQL_FILTER string.
 * Filters out properties that don't exist on the target layer (e.g. basis).
 * Adapts field names dynamically based on sampleProperties (lowercase vs uppercase).
 * Uses ILIKE '%value%' partial matching so API values like "BALI" match DB values like "Provinsi Bali".
 */
export const buildIgtCqlFilter = (
  filters: FilterAdministrativeAreaValues,
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
