// src/design-system/components/layout/types/splitter.type.ts

import type { HTMLChakraProps } from "@chakra-ui/react";
import type {
  GroupImperativeHandle,
  GroupProps,
  Layout,
  LayoutChangedMeta,
  Orientation,
  PanelImperativeHandle,
  PanelProps,
  SeparatorProps,
} from "react-resizable-panels";

export type SplitterOrientation = Orientation;

export type SplitterLayout = Layout;
export type SplitterLayoutChangedMeta = LayoutChangedMeta;

export type SplitterRootProps = Omit<HTMLChakraProps<"div">, "onResize" | "direction" | "defaultValue" | "id" | "defaultLayout"> &
  Omit<GroupProps, "orientation" | "id" | "defaultLayout"> & {
    id?: string;
    orientation?: SplitterOrientation;
    direction?: SplitterOrientation;
    defaultLayout?: Layout | number[];
    onResize?: (details: { size: number[] }) => void;
    onLayout?: (layout: number[]) => void;
  };

export type SplitterPanelProps = Omit<HTMLChakraProps<"div">, "id" | "defaultValue" | "onResize"> &
  Omit<PanelProps, "id"> & {
    id?: string;
  };

export type SplitterResizeTriggerProps = Omit<HTMLChakraProps<"div">, "id"> &
  Omit<SeparatorProps, "id"> & {
    id?: string;
    transparentTrigger?: boolean;
    onDoubleClick?: () => void;
  };

export type SplitterResizeTriggerIndicatorProps = HTMLChakraProps<"div">;

export type SplitterResizeTriggerSeparatorProps = HTMLChakraProps<"div">;

export type SplitterGroupHandle = GroupImperativeHandle & {
  resetSizes: (targetSizes?: number[] | Record<string, number>) => void;
};
export type SplitterPanelHandle = PanelImperativeHandle;

export type SplitterContextValue = {
  orientation: SplitterOrientation;
  groupRef: React.RefObject<SplitterGroupHandle | null>;
  resetLayout: (targetSizes?: number[] | Record<string, number>) => void;
};
