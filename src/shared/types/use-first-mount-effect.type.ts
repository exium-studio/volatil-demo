// src/shared/types/use-first-mount-effect.type.ts

import type { EffectCallback } from "react";

export type UseFirstMountEffectOptions = {
  onFirstMount?: EffectCallback;
  onUpdate?: EffectCallback;
};
