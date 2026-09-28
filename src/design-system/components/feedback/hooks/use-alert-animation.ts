// src/design-system/components/feedback/hooks/use-alert-animation.ts

import type { UseAlertAnimationOptions } from "@/design-system/components/feedback/types/alert-animation.type";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { useEffect, useState } from "react";

export function useAlertAnimation(
  isOpen: boolean,
  options?: UseAlertAnimationOptions,
) {
  const { delay = 200 } = options ?? {};
  const [transition, setTransition] = useState(false);

  useFirstMountEffect(
    {
      onUpdate: () => {
        if (isOpen) setTransition(false);
      },
    },
    [isOpen],
  );

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setTransition(true), delay);
      return () => clearTimeout(t);
    }
  }, [isOpen, delay]);

  return transition;
}
