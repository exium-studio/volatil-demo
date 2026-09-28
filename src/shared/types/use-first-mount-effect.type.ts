import type { EffectCallback } from "react";

export type UseFirstMountEffectOptions = {
  onFirstMount?: EffectCallback;
  onUpdate?: EffectCallback;
};
