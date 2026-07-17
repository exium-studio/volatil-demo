// src/design-system/hooks/use-ref-dimenssion.ts

import { useEffect, useRef, useState, type RefObject } from "react";

type UseContainerDimensionOptions = {
  debounceDelay?: number;
};

export function useRefDimension(
  ref: RefObject<HTMLDivElement | null> | null,
  options?: UseContainerDimensionOptions,
) {
  // Options
  const { debounceDelay = 200 } = options || {};
  // Refs
  const timerRef = useRef<number | null>(null);

  // States
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        const { width, height } = entry.contentRect;
        setDimension({ width, height });
      }, debounceDelay);
    });

    observer.observe(node);

    const rect = node.getBoundingClientRect();
    setDimension({ width: rect.width, height: rect.height });

    return () => {
      observer.disconnect();
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [ref, debounceDelay]);

  return dimension;
}
