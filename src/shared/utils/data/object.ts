// src/shared/utils/data/object.ts

export const isEmptyObject = (object: Record<string, unknown>): boolean =>
  Object.keys(object).length === 0;
