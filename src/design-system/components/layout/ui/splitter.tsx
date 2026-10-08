// src/design-system/components/layout/ui/splitter.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type {
  SplitterContextValue,
  SplitterGroupHandle,
  SplitterPanelHandle,
  SplitterPanelProps,
  SplitterResizeTriggerIndicatorProps,
  SplitterResizeTriggerProps,
  SplitterResizeTriggerSeparatorProps,
  SplitterRootProps,
} from "@/design-system/components/layout/types/splitter.type";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { t } from "@/shared/libs/i18n";
import { Box, chakra } from "@chakra-ui/react";
import { GripHorizontal, GripVertical } from "lucide-react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Group,
  Panel,
  Separator,
  type GroupImperativeHandle,
  type Layout,
} from "react-resizable-panels";

// Context to pass orientation and imperative layout controls down to triggers
const SplitterContext = createContext<SplitterContextValue>({
  orientation: "horizontal",
  groupRef: { current: null },
  resetLayout: () => {},
});

const ChakraGroup = chakra(Group);
const ChakraPanel = chakra(Panel);
const ChakraSeparator = chakra(Separator);

// -------------------------------------------------------------------------------------

const SplitterRoot = forwardRef<SplitterGroupHandle, SplitterRootProps>(
  (props, ref) => {
    // Props
    const {
      orientation,
      direction = orientation ?? "horizontal",
      defaultLayout,
      onLayout,
      onResize,
      onLayoutChanged,
      children,
      ...restProps
    } = props;

    // Refs
    const internalGroupRef = useRef<GroupImperativeHandle | null>(null);

    // Handlers
    const resetLayout = useCallback(
      (targetSizes?: number[] | Record<string, number>) => {
        if (!internalGroupRef.current) return;
        const group = internalGroupRef.current;
        const currentLayout = group.getLayout();
        const panelIds = Object.keys(currentLayout);
        if (panelIds.length === 0) return;

        let newLayout: Record<string, number> = {};

        if (targetSizes && !Array.isArray(targetSizes)) {
          newLayout = targetSizes;
        } else if (Array.isArray(targetSizes) && targetSizes.length > 0) {
          panelIds.forEach((id, index) => {
            newLayout[id] = targetSizes[index] ?? 100 / panelIds.length;
          });
        } else if (Array.isArray(defaultLayout) && defaultLayout.length > 0) {
          panelIds.forEach((id, index) => {
            newLayout[id] = defaultLayout[index] ?? 100 / panelIds.length;
          });
        } else if (
          defaultLayout &&
          typeof defaultLayout === "object" &&
          !Array.isArray(defaultLayout)
        ) {
          newLayout = defaultLayout as Record<string, number>;
        } else {
          const equalSize = 100 / panelIds.length;
          panelIds.forEach((id) => {
            newLayout[id] = equalSize;
          });
        }

        group.setLayout(newLayout);
        const layoutArray = Object.values(newLayout);
        onLayout?.(layoutArray);
        onResize?.({ size: layoutArray });
      },
      [defaultLayout, onLayout, onResize],
    );

    useImperativeHandle(
      ref,
      () => ({
        getLayout: () => internalGroupRef.current?.getLayout() ?? {},
        setLayout: (layout: Layout) =>
          internalGroupRef.current?.setLayout(layout) ?? {},
        resetSizes: resetLayout,
      }),
      [resetLayout],
    );

    const handleLayoutChanged = (
      layout: Layout,
      meta: Parameters<NonNullable<SplitterRootProps["onLayoutChanged"]>>[1],
    ) => {
      onLayoutChanged?.(layout, meta);
      const layoutArray = Object.values(layout);
      onLayout?.(layoutArray);
      onResize?.({ size: layoutArray });
    };

    return (
      <SplitterContext.Provider
        value={{
          orientation: direction,
          groupRef:
            internalGroupRef as React.RefObject<SplitterGroupHandle | null>,
          resetLayout,
        }}
      >
        <ChakraGroup
          groupRef={internalGroupRef}
          orientation={direction}
          onLayoutChanged={handleLayoutChanged}
          display={"flex"}
          w={"full"}
          h={"full"}
          pos={"relative"}
          {...restProps}
        >
          {children}
        </ChakraGroup>
      </SplitterContext.Provider>
    );
  },
);

// -------------------------------------------------------------------------------------

const SplitterPanel = forwardRef<SplitterPanelHandle, SplitterPanelProps>(
  (props, ref) => {
    // Props
    const { panelRef, elementRef, children, ...restProps } = props;

    return (
      <ChakraPanel
        panelRef={ref ?? panelRef}
        elementRef={elementRef}
        display={"flex"}
        flexDir={"column"}
        overflow={"hidden"}
        pos={"relative"}
        {...restProps}
      >
        {children}
      </ChakraPanel>
    );
  },
);

// -------------------------------------------------------------------------------------

const SplitterResizeTrigger = forwardRef<
  HTMLDivElement,
  SplitterResizeTriggerProps
>((props, ref) => {
  // Props
  const {
    transparentTrigger = false,
    onDoubleClick,
    children,
    elementRef,
    ...restProps
  } = props;

  // Context
  const { orientation, resetLayout } = useContext(SplitterContext);
  const isVertical = orientation === "vertical";

  // Handlers
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    resetLayout();
    onDoubleClick?.();
  };

  return (
    <Tooltip
      content={t["common.splitter_trigger_helper"]()}
      positioning={{
        placement: isVertical ? "top" : "right",
      }}
    >
      <ChakraSeparator
        elementRef={ref ?? elementRef}
        disableDoubleClick={true}
        className={"group"}
        transition={"background 150ms ease"}
        minW={isVertical ? "full" : "8px"}
        w={isVertical ? "full" : "8px"}
        minH={isVertical ? "8px" : "full"}
        h={isVertical ? "8px" : "full"}
        flexShrink={0}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        pos={"relative"}
        zIndex={10}
        cursor={isVertical ? "row-resize" : "col-resize"}
        outline={"none"}
        _hover={{
          bg: transparentTrigger ? "transparent" : "border.subtle",
        }}
        _active={{
          bg: transparentTrigger ? "transparent" : "border",
        }}
        onDoubleClick={handleDoubleClick}
        {...restProps}
      >
        {children ?? (
          <>
            <SplitterResizeTriggerIndicator
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              bg={"bg.body"}
              border={"1px solid"}
              borderColor={"border.subtle"}
              rounded={"sm"}
              shadow={"xs"}
              w={isVertical ? "80px" : "16px"}
              minW={isVertical ? "80px" : "16px"}
              maxW={isVertical ? "80px" : "16px"}
              h={isVertical ? "16px" : "80px"}
              minH={isVertical ? "16px" : "80px"}
              maxH={isVertical ? "16px" : "80px"}
              flexShrink={0}
              opacity={0}
              pointerEvents={"none"}
              transition={"opacity 150ms ease, transform 150ms ease"}
              _groupHover={{
                opacity: 1,
              }}
              _groupActive={{
                opacity: 1,
              }}
            >
              <AppIcon
                icon={isVertical ? GripHorizontal : GripVertical}
                size={"xs"}
                color={"fg.subtle"}
              />
            </SplitterResizeTriggerIndicator>

            <SplitterResizeTriggerSeparator
              pos={"absolute"}
              bg={"border.subtle"}
              w={isVertical ? "full" : "1px"}
              h={isVertical ? "1px" : "full"}
              zIndex={-1}
              pointerEvents={"none"}
            />
          </>
        )}
      </ChakraSeparator>
    </Tooltip>
  );
});

// -------------------------------------------------------------------------------------

const SplitterResizeTriggerIndicator = (
  props: SplitterResizeTriggerIndicatorProps,
) => {
  return <Box {...props} />;
};

const SplitterResizeTriggerSeparator = (
  props: SplitterResizeTriggerSeparatorProps,
) => {
  return <Box {...props} />;
};

// -------------------------------------------------------------------------------------

export const Splitter = {
  Root: SplitterRoot,
  Panel: SplitterPanel,
  ResizeTrigger: SplitterResizeTrigger,
  ResizeTriggerIndicator: SplitterResizeTriggerIndicator,
  ResizeTriggerSeparator: SplitterResizeTriggerSeparator,
};
