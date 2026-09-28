// src/design-system/hooks/types/use-viewport.type.ts

export type Viewport = {
  width: number;
  height: number;
};

export type UseViewportOptions = {
  onChange?: (viewport: Viewport) => void;
};
