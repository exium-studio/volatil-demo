// src/design-system/components/layout/ui/scroll-container.tsx

"use client";

import type { VScrollContainerProps } from "@/design-system/components/layout/types/scroll-container.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useEffect, useRef, useState } from "react";

export const VScrollContainer = (props: VScrollContainerProps) => {
  // Props
  const { children, borderColor = "an1", ...restProps } = props;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [scrollTop, setScrollTop] = useState<number>(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <VStack
      ref={containerRef}
      tabIndex={-1}
      overflowY={"auto"}
      borderTop={"1px solid"}
      borderColor={scrollTop !== 0 ? borderColor : "transparent"}
      transition={"200ms"}
      {...restProps}
    >
      {children}
    </VStack>
  );
};
