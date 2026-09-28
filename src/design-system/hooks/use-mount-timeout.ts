// src/design-system/hooks/use-mount-timeout.ts

import type { UseMountTimeoutOptions } from "@/design-system/hooks/types/use-mount-timeout.type";
import { useEffect, useState } from "react";

export const useMountTimeout = (
  options?: number | UseMountTimeoutOptions,
): boolean => {
  // Resolved Options
  const hasExplicitIsOpen =
    typeof options === "object" && options.isOpen !== undefined;

  const isOpen =
    typeof options === "object" ? (options.isOpen ?? true) : true;

  const mountDelay =
    typeof options === "number" ? options : (options?.mountDelay ?? 50);

  const unmountDelay =
    typeof options === "object" ? (options?.unmountDelay ?? 0) : 0;

  // States
  const [isMounted, setIsMounted] = useState<boolean>(() => {
    if (hasExplicitIsOpen) {
      return Boolean(isOpen);
    }
    return false;
  });

  // Effects
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      timer = setTimeout(
        () => {
          setIsMounted(true);
        },
        Math.max(0, mountDelay),
      );
    } else {
      timer = setTimeout(
        () => {
          setIsMounted(false);
        },
        Math.max(0, unmountDelay),
      );
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, mountDelay, unmountDelay]);

  return isMounted;
};
