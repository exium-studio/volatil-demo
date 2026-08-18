// src/design-system/hooks/use-mount-timeout.ts

import { useEffect, useState } from "react";

export const useMountTimeout = (delayMs: number = 50): boolean => {
  // States
  const [isReady, setIsReady] = useState<boolean>(false);

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [delayMs]);

  return isReady;
};
