// src/design-system/hooks/use-mount-timeout.ts

import type { UseMountTimeoutOptions } from "@/design-system/hooks/types/use-mount-timeout.type";
import { useEffect, useState } from "react";

export const useMountTimeout = (
  delayOrOptions: number | UseMountTimeoutOptions = 50,
): boolean => {
  // Resolved Options
  const hasExplicitIsOpen =
    typeof delayOrOptions === "object" && delayOrOptions.isOpen !== undefined;

  const isOpen =
    typeof delayOrOptions === "object"
      ? (delayOrOptions?.isOpen ?? true)
      : true;

  const mountDelay =
    typeof delayOrOptions === "number"
      ? delayOrOptions
      : (delayOrOptions?.delayMs ?? 50);

  const unmountDelay =
    typeof delayOrOptions === "object"
      ? (delayOrOptions?.unmountDelay ?? 0)
      : 0;

  // States: If used as simple mount delay (like skeleton loading), start at false.
  // If controlled by isOpen, start with current isOpen boolean.
  const [isReady, setIsReady] = useState<boolean>(() => {
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
          setIsReady(true);
        },
        Math.max(0, mountDelay),
      );
    } else {
      timer = setTimeout(
        () => {
          setIsReady(false);
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

  return isReady;
};
