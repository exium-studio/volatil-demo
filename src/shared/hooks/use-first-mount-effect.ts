// src/shared/hooks/use-first-mount-effect.ts

import {
  useEffect,
  useRef,
  type DependencyList,
  type EffectCallback,
} from "react";

type UseFirstMountEffectOptions = {
  onFirstMount?: EffectCallback;
  onUpdate?: EffectCallback;
};

/**
 * Runs a different effect callback on first mount versus subsequent updates.
 *
 * @param options - `onFirstMount` runs once, only on the first mount.
 *                   `onUpdate` runs on every dependency change after that.
 *                   Both may return a cleanup function, same as `useEffect`.
 * @param deps - dependency list, same semantics as `useEffect`.
 */
export function useFirstMountEffect(
  options: UseFirstMountEffectOptions,
  deps: DependencyList,
) {
  const { onFirstMount, onUpdate } = options;
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return onFirstMount?.();
    }

    return onUpdate?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
