export type Viewport = {
  width: number;
  height: number;
};

export type UseViewportOptions = {
  onChange?: (viewport: Viewport) => void;
};
