// src/design-system/components/feedback/ui/top-bar-loader.tsx

import type { TopBarLoaderProps } from "@/design-system/components/feedback/types/top-bar-loader.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useEffect, useRef } from "react";

export const TopBarLoader = (props: TopBarLoaderProps) => {
  // Props
  const { isFetching = false } = props;

  // Stores
  const { theme } = useThemeStore();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    const containerEl = containerRef.current;
    const barEl = barRef.current;

    if (!containerEl || !barEl) return;

    let intervalId: ReturnType<typeof setInterval>;
    let hideTimeoutId: ReturnType<typeof setTimeout>;

    if (isFetching) {
      containerEl.style.opacity = "1";
      barEl.style.transition = "width 250ms ease-in-out";
      barEl.style.width = "20%";

      let currentProgress = 20;
      intervalId = setInterval(() => {
        if (currentProgress < 60) {
          currentProgress += 15;
        } else if (currentProgress < 85) {
          currentProgress += 5;
        } else if (currentProgress < 95) {
          currentProgress += 1;
        }
        barEl.style.width = `${currentProgress}%`;
      }, 200);
    } else {
      barEl.style.transition = "width 150ms ease-out";
      barEl.style.width = "100%";

      hideTimeoutId = setTimeout(() => {
        containerEl.style.opacity = "0";
        setTimeout(() => {
          barEl.style.transition = "none";
          barEl.style.width = "0%";
        }, 200);
      }, 200);
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(hideTimeoutId);
    };
  }, [isFetching]);

  return (
    <Box
      ref={containerRef}
      position={"fixed"}
      top={0}
      left={0}
      right={0}
      h={"4px"}
      zIndex={9999}
      pointerEvents={"none"}
      bg={"transparent"}
      w={"full"}
      opacity={0}
      transition={"opacity 200ms ease-out"}
    >
      <Box
        ref={barRef}
        h={"full"}
        w={"0%"}
        bg={`${theme.colorPalette}.solid`}
        boxShadow={`0 0 8px ${theme.colorPalette}.solid`}
      />
    </Box>
  );
};
