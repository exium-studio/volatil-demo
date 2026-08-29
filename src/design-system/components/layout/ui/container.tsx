// src/design-system/components/layout/ui/container.tsx

import type {
  ContainerBodyProps,
  ContainerHeaderProps,
  ContainerRootProps,
} from "@/design-system/components/layout/types/container.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { useRefDimension } from "@/design-system/hooks/use-ref-dimenssion";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { createContext, useContext, useMemo, useRef } from "react";

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

const ContainerRoot = (props: ContainerRootProps) => {
  // Props
  const { children, withContext = false, ...restProps } = props;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const dimension = useRefDimension(containerRef);

  // Derived Values
  const isValidDimension = dimension.width > 0 && dimension.height > 0;
  const isSmContainer = dimension.width < parseInt("720px");

  const contextValue = useMemo(
    () => ({ dimension, isValidDimension, isSmContainer }),
    [dimension, isValidDimension, isSmContainer],
  );

  const content = (
    <VStack ref={containerRef} w={"full"} align={"stretch"} {...restProps}>
      {children}
    </VStack>
  );

  if (!withContext) return content;

  return (
    <ContainerContext.Provider value={contextValue}>
      {content}
    </ContainerContext.Provider>
  );
};

const ContainerHeader = (props: ContainerHeaderProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <HStack w={"full"} minH={"headerH"} px={"md"} {...restProps}>
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
      flex={1}
      w={"full"}
      bg={"bg.body"}
      rounded={theme.radii.container}
      // shadow={"sm"}
      {...restProps}
    >
      {children}
    </VStack>
  );
};

export const Container = {
  Root: ContainerRoot,
  Header: ContainerHeader,
  Body: ContainerBody,
};
