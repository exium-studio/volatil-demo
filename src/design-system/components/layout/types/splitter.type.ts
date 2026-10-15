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

export type SplitterTriggerVariant = "default" | "plain";
export type SplitterMode = "free" | "snappy";

export type SplitterRootProps = Omit<HTMLChakraProps<"div">, "onResize" | "direction" | "defaultValue" | "id" | "defaultLayout"> &
  Omit<GroupProps, "orientation" | "id" | "defaultLayout"> & {
    id?: string;
    orientation?: SplitterOrientation;
    direction?: SplitterOrientation;
    variant?: SplitterTriggerVariant;
    defaultLayout?: Layout | number[];
    mode?: SplitterMode;
    triggerAlwaysVisible?: boolean;
    minSizeA?: number | string;
    minSizeB?: number | string;
    onResize?: (details: { size: number[] }) => void;
    onLayout?: (layout: number[]) => void;
  };

export type SplitterPanelProps = Omit<HTMLChakraProps<"div">, "id" | "defaultValue" | "onResize"> &
  Omit<PanelProps, "id"> & {
    id?: string;
    panelRole?: "a" | "b";
    elementRef?: React.Ref<HTMLElement | null>;
  };

export type SplitterResizeTriggerProps = Omit<HTMLChakraProps<"div">, "id"> &
  Omit<SeparatorProps, "id"> & {
    id?: string;
    variant?: SplitterTriggerVariant;
    transparentTrigger?: boolean;
    alwaysVisible?: boolean;
    onDoubleClick?: () => void;
  };

export type SplitterResizeTriggerIndicatorProps = HTMLChakraProps<"div">;

export type SplitterResizeTriggerSeparatorProps = HTMLChakraProps<"div">;

export type SplitterGroupHandle = GroupImperativeHandle & {
  resetSizes: (targetSizes?: number[] | Record<string, number>) => void;
  snapNext: () => void;
  snapPrev: () => void;
  snapToStep: (step: 0 | 1 | 2) => void;
};
export type SplitterPanelHandle = PanelImperativeHandle;

export type SplitterContextValue = {
  orientation: SplitterOrientation;
  variant: SplitterTriggerVariant;
  mode: SplitterMode;
  triggerAlwaysVisible: boolean;
  minSizeA?: number | string;
  minSizeB?: number | string;
  groupRef: React.RefObject<SplitterGroupHandle | null>;
  resetLayout: (targetSizes?: number[] | Record<string, number>) => void;
  snapNext: () => void;
  snapPrev: () => void;
  snapToStep: (step: 0 | 1 | 2) => void;
  activeSnapIndex: 0 | 1 | 2;
  registerPanelAContentRef: (el: HTMLElement | null) => void;
  handleTriggerPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleTriggerPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleTriggerPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleTriggerPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};
