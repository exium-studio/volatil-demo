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
  const { debounceDelay = 0 } = options || {};

  // Refs
  const timerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // States
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref?.current;
    if (!node) return;

    const updateDimension = (width: number, height: number) => {
      const roundedW = Math.round(width);
      const roundedH = Math.round(height);

      setDimension((prev) => {
        if (prev.width === roundedW && prev.height === roundedH) {
          return prev;
        }
        return { width: roundedW, height: roundedH };
      });
    };

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      if (debounceDelay > 0) {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
          updateDimension(entry.contentRect.width, entry.contentRect.height);
        }, debounceDelay);
      } else {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(() => {
          updateDimension(entry.contentRect.width, entry.contentRect.height);
        });
      }
    });

    observer.observe(node);

    const rect = node.getBoundingClientRect();
    updateDimension(rect.width, rect.height);

    return () => {
      observer.disconnect();
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ref, debounceDelay]);

  return dimension;
}
