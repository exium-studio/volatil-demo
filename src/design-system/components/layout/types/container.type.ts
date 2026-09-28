import type { BoxProps } from "@/design-system/components/layout/types/box.type";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";

export type ContainerRootProps = StackProps & {
  withContext?: boolean;
};

export type ContainerHeaderProps = StackProps;

export type ContainerBodyProps = StackProps;

export type ConstrainedContainerProps = BoxProps & {
  useStoreMaxW?: boolean;
};

export type ContainerContextValue = {
  dimension: {
    width: number;
    height: number;
  };
  isValidDimension: boolean;
  isSmContainer: boolean;
};
