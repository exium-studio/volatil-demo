// src/design-system/components/layout/ui/container.tsx

import type {
  ContainerBodyProps,
  ContainerHeaderProps,
  ContainerRootProps,
} from "@/design-system/components/layout/types/container.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import {
  HEADER_H,
  SM_SCREEN_BREAKPOINT,
  SPACING_MD,
} from "@/design-system/constants/styles";
import { useRefDimension } from "@/design-system/hooks/use-ref-dimenssion";
import { useMergedRefs } from "@/design-system/hooks/use-merge-refs";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { createContext, forwardRef, useContext, useMemo, useRef } from "react";

export type ContainerContextValue = {
  dimension: {
    width: number;
    height: number;
  };
  isValidDimension: boolean;
  isSmContainer: boolean;
};

const ContainerContext = createContext<ContainerContextValue | null>(null);

export function useContainerContext() {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error("useContainerContext must be used inside Container.Root");
  }
  return context;
}

// ---------------------------------------------------------------------------

const ContainerRoot = forwardRef<HTMLDivElement, ContainerRootProps>(
  (props, ref) => {
    // Props
    const {
      children,
      withContext = false,
      className = "",
      ...restProps
    } = props;

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const mergeRef = useMergedRefs({ refs: [containerRef, ref] });

    // Hooks
    const dimension = useRefDimension(containerRef);

    // Derived Values
    const isValidDimension = dimension.width > 0 && dimension.height > 0;
    const isSmContainer = dimension.width < parseInt(SM_SCREEN_BREAKPOINT);

    const contextValue = useMemo(
      () => ({ dimension, isValidDimension, isSmContainer }),
      [dimension, isValidDimension, isSmContainer],
    );

    const content = (
      <VStack
        ref={mergeRef}
        className={`${scrollY ? "scrollY" : ""} ${className}`}
        w={"full"}
        borderColor={"border.subtle"}
        {...restProps}
      >
        {children}
      </VStack>
    );

    if (!withContext) return content;

    return (
      <ContainerContext.Provider value={contextValue}>
        {content}
      </ContainerContext.Provider>
    );
  },
);

const ContainerHeader = (props: ContainerHeaderProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <HStack w={"full"} minH={HEADER_H} px={SPACING_MD} {...restProps}>
      {children}
    </HStack>
  );
};

const ContainerBody = (props: ContainerBodyProps) => {
  // Props
  const { children, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <VStack
      w={"full"}
      bg={"bg.body"}
      rounded={theme.radii.container}
      shadow={"sm"}
      {...restProps}
    >
      {children}
    </VStack>
  );
};

ContainerRoot.displayName = "ContainerRoot";
ContainerHeader.displayName = "ContainerHeader";
ContainerBody.displayName = "ContainerBody";

export const Container = {
  Root: ContainerRoot,
  Header: ContainerHeader,
  Body: ContainerBody,
};
