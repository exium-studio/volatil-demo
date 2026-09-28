// src/design-system/stores/types/splitter-store.type.ts

export type SplitterState = {
  sizesByKey: Record<string, number[]>;
};

export type SplitterActions = {
  setSize: (key: string, size: number[]) => void;
};
