// src/design-system/hooks/use-click-outside.ts

import { useEffect, type RefObject } from "react";

type UseClickOutsideOptions = {
  enabled?: boolean;
};

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent | PointerEvent) => void,
  options: UseClickOutsideOptions = {},
) {
  const { enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    function listener(event: MouseEvent | TouchEvent | PointerEvent) {
      const target = event.target as Node | null;
      if (!ref.current || !target || ref.current.contains(target)) {
        return;
      }
      handler(event);
    }

    document.addEventListener("pointerdown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
