// src/design-system/hooks/use-debounced-value.ts

import { useDeferredValue, useEffect, useState } from "react";

/**
 * Returns a deferred copy of `value` that:
 * 1. Waits `delayMs` ms of inactivity before updating (debounce)
 * 2. Then schedules the update at low React priority via `useDeferredValue` (non-blocking UI)
 */
export const useDebouncedValue = <T>(value: T, delayMs = 300): T => {
  // States
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return useDeferredValue(debounced);
};
