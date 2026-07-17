// src/shared/utils/data/array.ts

export const isArray = (item: unknown): boolean => Array.isArray(item);

export const isEmptyArray = <T>(array: T[] | undefined | null): boolean =>
  !array || array.length === 0;
