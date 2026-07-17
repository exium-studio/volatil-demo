// src/design-system/components/toast/utils/generate-id.ts

let counter = 0;

/**
 * Generates a stable, collision-resistant id without pulling in a uuid dependency.
 * Format: `<prefix>_<base36 timestamp>_<incrementing counter>`.
 */
export function generateId(prefix = "t"): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}`;
}
