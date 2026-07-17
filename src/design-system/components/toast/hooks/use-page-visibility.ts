// src/design-system/components/toast/hooks/use-page-visibility.ts

import { useEffect } from "react";
import {
  pauseAllTimers,
  resumeAllTimers,
} from "@/design-system/components/toast/core/toast.manager";

/**
 * Subscribes to `visibilitychange` once per mount and delegates directly to
 * the manager's timers. No React state involved — this only drives an
 * external side-effect (timers), so it's a legitimate `useEffect`
 * subscription rather than a state-sync anti-pattern.
 */
export function usePageVisibility(): void {
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        pauseAllTimers();
      } else {
        resumeAllTimers();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
}
