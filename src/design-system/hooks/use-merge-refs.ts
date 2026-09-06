// src/design-system/hooks/use-merge-refs.ts

import type { UseMergedRefsOptions } from "@/design-system/hooks/types/use-merge-refs.type";
import { useCallback, useRef } from "react";

export const useMergedRefs = <T>(options: UseMergedRefsOptions<T>) => {
  // Options
  const { refs } = options;

  // Refs
  const refsRef = useRef(refs);

  return useCallback((node: T | null) => {
    for (const ref of refsRef.current) {
      if (!ref) continue;

      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  }, []);
};
