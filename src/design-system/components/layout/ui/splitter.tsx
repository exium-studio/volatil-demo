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
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Group,
  Panel,
  Separator,
  type GroupImperativeHandle,
  type Layout,
} from "react-resizable-panels";

// Context to pass orientation, variant, and imperative layout controls down to triggers & panels
const SplitterContext = createContext<SplitterContextValue>({
  orientation: "horizontal",
  variant: "default",
  mode: "free",
  triggerAlwaysVisible: false,
  groupRef: { current: null },
  resetLayout: () => {},
  snapNext: () => {},
  snapPrev: () => {},
  snapToStep: () => {},
  activeSnapIndex: 1,
  registerPanelMinSize: () => {},
  handleTriggerPointerDown: () => {},
  handleTriggerPointerMove: () => {},
  handleTriggerPointerUp: () => {},
  handleTriggerPointerCancel: () => {},
});

const ChakraGroup = chakra(Group);
const ChakraPanel = chakra(Panel);
const ChakraSeparator = chakra(Separator);

// -------------------------------------------------------------------------------------
// Helpers

const parseMinSizeToPixels = (
  value: number | string | undefined,
  containerSize: number,
  defaultValue = 0,
): number => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "number") {
    // If <= 1 and > 0, treat as percentage fraction; if <= 100 and no px, check if it's px or percent.
    // By convention in minSize (e.g. minSizeA = 100), if >= 10 it's usually px or percent.
    // However, the prompt says "Contoh nilai: A = 100px, B = 0", so number 100 is px, string "100px" is px.
    // If containerSize is available, we return absolute pixels:
    return value;
  }
  const str = String(value).trim();
  if (str.endsWith("%")) {
    const pct = parseFloat(str);
    return isNaN(pct) ? defaultValue : (pct / 100) * containerSize;
  }
  if (str.endsWith("px")) {
    const px = parseFloat(str);
    return isNaN(px) ? defaultValue : px;
  }
  const num = parseFloat(str);
  return isNaN(num) ? defaultValue : num;
};

// -------------------------------------------------------------------------------------

const SplitterRoot = forwardRef<SplitterGroupHandle, SplitterRootProps>(
  (props, ref) => {
    // Props
    const {
      orientation,
      direction = orientation ?? "horizontal",
      variant = "default",
      mode = "free",
      triggerAlwaysVisible = false,
      defaultLayout,
      onLayout,
      onResize,
      onLayoutChanged,
      children,
      ...restProps
    } = props;

    // States
    const [activeSnapIndex, setActiveSnapIndex] = useState<0 | 1 | 2>(1);

    // Refs
    const internalGroupRef = useRef<GroupImperativeHandle | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const snapIndexRef = useRef<0 | 1 | 2>(1);
    const panelMinSizesRef = useRef<Map<string, number | string>>(new Map());

    const isVertical = direction === "vertical";

    // Register minSize per panel id
    const registerPanelMinSize = useCallback(
      (panelId: string, minSize: number | string | undefined) => {
        if (minSize === undefined) {
          panelMinSizesRef.current.delete(panelId);
        } else {
          panelMinSizesRef.current.set(panelId, minSize);
        }
      },
      [],
    );

    // Effects
    useEffect(() => {
      snapIndexRef.current = activeSnapIndex;
    }, [activeSnapIndex]);

    // Derived Snap Points Calculation in Percentages
    const getContainerDimension = useCallback(() => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      return isVertical ? rect.height : rect.width;
    }, [isVertical]);

    const calculateSnapPoints = useCallback(() => {
      const totalPx = getContainerDimension() || 800; // fallback if not yet measured
      const group = internalGroupRef.current;
      const layout = group?.getLayout() ?? {};
      const panelIds = Object.keys(layout);

      // In 2-panel or multi-panel snap logic:
      // Primary panel (A) is panelIds[0] (or panelIds[1] in vertical mobile)
      // Secondary panel (B) is opposite
      const idA = isVertical ? panelIds[1] : panelIds[0];
      const idB = isVertical ? panelIds[0] : panelIds[1];

      const minAVal = idA ? panelMinSizesRef.current.get(idA) : undefined;
      const minBVal = idB ? panelMinSizesRef.current.get(idB) : undefined;

      const minAPx = parseMinSizeToPixels(minAVal, totalPx, 0);
      const minBPx = parseMinSizeToPixels(minBVal, totalPx, 0);

      // Percentage bounds:
      // minPctA: min size of A in percentage
      const minPctA = Math.max(0, Math.min(100, (minAPx / totalPx) * 100));
      // maxPctA: max size of A in percentage = 100 - minBPx
      const maxPctA = Math.max(
        minPctA,
        Math.min(100, ((totalPx - minBPx) / totalPx) * 100),
      );

      // S0: A minimal
      const s0 = minPctA;
      // S1: 50% clamped between minPctA and maxPctA
      const s1 = Math.max(minPctA, Math.min(maxPctA, 50));
      // S2: A full (total - min B)
      const s2 = maxPctA;

      return { s0, s1, s2, minPctA, maxPctA };
    }, [getContainerDimension, isVertical]);

    // Apply layout with smooth 200ms animation
    const animateToLayout = useCallback(
      (targetSizeA: number) => {
        if (!internalGroupRef.current) return;
        const group = internalGroupRef.current;
        const currentLayout = group.getLayout();
        const panelIds = Object.keys(currentLayout);
        if (panelIds.length < 2) return;

        // In vertical mobile: panelIds[0] is B (spacer), panelIds[1] is A (content)
        // In horizontal desktop: panelIds[0] is A (content), panelIds[1] is B (spacer)
        const id0 = panelIds[0];
        const id1 = panelIds[1];
        if (!id0 || !id1) return;

        const currentA = isVertical
          ? (currentLayout[id1] ?? 50)
          : (currentLayout[id0] ?? 50);
        const startA = currentA;
        const deltaA = targetSizeA - startA;

        if (Math.abs(deltaA) < 0.1) {
          // Already there
          const finalLayout: Record<string, number> = isVertical
            ? { [id0]: 100 - targetSizeA, [id1]: targetSizeA }
            : { [id0]: targetSizeA, [id1]: 100 - targetSizeA };
          group.setLayout(finalLayout);
          const layoutArr = Object.values(finalLayout);
          onLayout?.(layoutArr);
          onResize?.({ size: layoutArr });
          return;
        }

        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        const startTime = performance.now();
        const duration = 200; // 200ms per requirement

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          // Ease-out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const nextA = startA + deltaA * easeProgress;

          const nextLayout: Record<string, number> = isVertical
            ? { [id0]: 100 - nextA, [id1]: nextA }
            : { [id0]: nextA, [id1]: 100 - nextA };

          group.setLayout(nextLayout);
          const layoutArr = Object.values(nextLayout);
          onLayout?.(layoutArr);
          onResize?.({ size: layoutArr });

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(step);
          } else {
            animationFrameRef.current = null;
          }
        };

        animationFrameRef.current = requestAnimationFrame(step);
      },
      [isVertical, onLayout, onResize],
    );

    const snapToStep = useCallback(
      (step: 0 | 1 | 2) => {
        const { s0, s1, s2 } = calculateSnapPoints();
        setActiveSnapIndex(step);
        const targetA = step === 0 ? s0 : step === 1 ? s1 : s2;
        animateToLayout(targetA);
      },
      [animateToLayout, calculateSnapPoints],
    );

    const snapNext = useCallback(() => {
      // Swipe that expands A steps up: S0 -> S1, S1 -> S2. At S2, do nothing.
      const current = snapIndexRef.current;
      if (current === 0) snapToStep(1);
      else if (current === 1) snapToStep(2);
    }, [snapToStep]);

    const snapPrev = useCallback(() => {
      // Swipe that shrinks A steps down: S2 -> S1, S1 -> S0. At S0, do nothing.
      const current = snapIndexRef.current;
      if (current === 2) snapToStep(1);
      else if (current === 1) snapToStep(0);
    }, [snapToStep]);

    // Cleanup animation frame on unmount
    useEffect(() => {
      return () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    // Pointer gesture handling for Snappy Trigger (interactive tracking like Google Maps drawer)
    const dragStartRef = useRef<{
      x: number;
      y: number;
      startSizeA: number;
      time: number;
      pointerId: number;
    } | null>(null);

    const handleTriggerPointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (mode !== "snappy") return;
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        const group = internalGroupRef.current;
        const currentLayout = group?.getLayout() ?? {};
        const panelIds = Object.keys(currentLayout);
        const id0 = panelIds[0];
        const id1 = panelIds[1];
        const currentA =
          id0 && id1
            ? isVertical
              ? (currentLayout[id1] ?? 50)
              : (currentLayout[id0] ?? 50)
            : 50;

        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          startSizeA: currentA,
          time: performance.now(),
          pointerId: e.pointerId,
        };
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      },
      [isVertical, mode],
    );

    const handleTriggerPointerMove = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (mode !== "snappy" || !dragStartRef.current) return;
        const start = dragStartRef.current;
        const totalDimension = getContainerDimension() || 800;
        const deltaPx = isVertical
          ? -(e.clientY - start.y)
          : e.clientX - start.x;
        const deltaPct = (deltaPx / totalDimension) * 100;

        const { minPctA, maxPctA } = calculateSnapPoints();
        const nextSizeA = Math.max(
          minPctA,
          Math.min(maxPctA, start.startSizeA + deltaPct),
        );

        const group = internalGroupRef.current;
        if (!group) return;
        const currentLayout = group.getLayout();
        const panelIds = Object.keys(currentLayout);
        const id0 = panelIds[0];
        const id1 = panelIds[1];
        if (!id0 || !id1) return;

        const nextLayout: Record<string, number> = isVertical
          ? { [id0]: 100 - nextSizeA, [id1]: nextSizeA }
          : { [id0]: nextSizeA, [id1]: 100 - nextSizeA };

        group.setLayout(nextLayout);
      },
      [calculateSnapPoints, getContainerDimension, isVertical, mode],
    );

    const handleTriggerPointerUp = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (mode !== "snappy" || !dragStartRef.current) return;
        const start = dragStartRef.current;
        dragStartRef.current = null;
        try {
          if (e.currentTarget.hasPointerCapture(start.pointerId)) {
            e.currentTarget.releasePointerCapture(start.pointerId);
          }
        } catch {
          // ignore
        }

        const deltaX = e.clientX - start.x;
        const deltaY = e.clientY - start.y;
        const deltaTime = performance.now() - start.time;

        const deltaPx = isVertical ? -deltaY : deltaX; // positive = expanding A
        const absDelta = Math.abs(deltaPx);
        const velocity = absDelta / Math.max(1, deltaTime); // px/ms

        const { s0, s1, s2 } = calculateSnapPoints();

        // 1. If fast flick (velocity >= 0.3 px/ms)
        if (velocity >= 0.3 && absDelta >= 20) {
          if (deltaPx > 0) {
            snapNext();
          } else {
            snapPrev();
          }
          return;
        }

        // 2. If short tap/click on trigger without substantial drag (< 10px), cycle snap step:
        // S1 (50%) -> S2 (full) -> S0 (min) -> S1 (50%)
        if (absDelta < 10) {
          const currentSnap = snapIndexRef.current;
          const nextStep: 0 | 1 | 2 =
            currentSnap === 1 ? 2 : currentSnap === 2 ? 0 : 1;
          snapToStep(nextStep);
          return;
        }

        // 3. Otherwise snap to nearest snap point based on current dragged position
        const group = internalGroupRef.current;
        const currentLayout = group?.getLayout() ?? {};
        const panelIds = Object.keys(currentLayout);
        const id0 = panelIds[0];
        const id1 = panelIds[1];
        const currentA =
          id0 && id1
            ? isVertical
              ? (currentLayout[id1] ?? 50)
              : (currentLayout[id0] ?? 50)
            : 50;

        const dist0 = Math.abs(currentA - s0);
        const dist1 = Math.abs(currentA - s1);
        const dist2 = Math.abs(currentA - s2);

        let nearestStep: 0 | 1 | 2 = 1;
        let minDist = dist1;

        if (dist0 < minDist) {
          minDist = dist0;
          nearestStep = 0;
        }
        if (dist2 < minDist) {
          nearestStep = 2;
        }

        snapToStep(nearestStep);
      },
      [calculateSnapPoints, isVertical, mode, snapNext, snapPrev, snapToStep],
    );

    const handleTriggerPointerCancel = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (mode !== "snappy" || !dragStartRef.current) return;
        try {
          if (
            e.currentTarget.hasPointerCapture(dragStartRef.current.pointerId)
          ) {
            e.currentTarget.releasePointerCapture(
              dragStartRef.current.pointerId,
            );
          }
        } catch {
          // ignore
        }
        dragStartRef.current = null;
        snapToStep(snapIndexRef.current);
      },
      [mode, snapToStep],
    );

    // Handle Window Resize: recalculate snap points and maintain current snap step
    useEffect(() => {
      if (mode !== "snappy") return;
      const handleResize = () => {
        snapToStep(snapIndexRef.current);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [mode, snapToStep]);

    // Reset Layout Handlers
    const resetLayout = useCallback(
      (targetSizes?: number[] | Record<string, number>) => {
        if (mode === "snappy") {
          snapToStep(1);
          return;
        }

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
      [defaultLayout, mode, onLayout, onResize, snapToStep],
    );

    useImperativeHandle(
      ref,
      () => ({
        getLayout: () => internalGroupRef.current?.getLayout() ?? {},
        setLayout: (layout: Layout) =>
          internalGroupRef.current?.setLayout(layout) ?? {},
        resetSizes: resetLayout,
        snapNext,
        snapPrev,
        snapToStep,
      }),
      [resetLayout, snapNext, snapPrev, snapToStep],
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

    const contextValue = useMemo<SplitterContextValue>(
      () => ({
        orientation: direction,
        variant,
        mode,
        triggerAlwaysVisible,
        groupRef:
          internalGroupRef as React.RefObject<SplitterGroupHandle | null>,
        resetLayout,
        snapNext,
        snapPrev,
        snapToStep,
        activeSnapIndex,
        registerPanelMinSize,
        handleTriggerPointerDown,
        handleTriggerPointerMove,
        handleTriggerPointerUp,
        handleTriggerPointerCancel,
      }),
      [
        direction,
        variant,
        mode,
        triggerAlwaysVisible,
        resetLayout,
        snapNext,
        snapPrev,
        snapToStep,
        activeSnapIndex,
        registerPanelMinSize,
        handleTriggerPointerDown,
        handleTriggerPointerMove,
        handleTriggerPointerUp,
        handleTriggerPointerCancel,
      ],
    );

    return (
      <SplitterContext.Provider value={contextValue}>
        <ChakraGroup
          ref={containerRef}
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
    // Context
    const { registerPanelMinSize } = useContext(SplitterContext);

    // Props
    const {
      id,
      panelRef,
      elementRef,
      panelRole,
      domId,
      snapOnContentScroll: _snapOnContentScroll,
      minSize: propMinSize,
      children,
      ...restProps
    } = props;

    // Register minSize dynamically to SplitterRoot snap calculator
    useEffect(() => {
      const panelIdentifier = id || domId || panelRole;
      if (panelIdentifier) {
        registerPanelMinSize(panelIdentifier, propMinSize);
      }
      return () => {
        if (panelIdentifier) {
          registerPanelMinSize(panelIdentifier, undefined);
        }
      };
    }, [id, domId, panelRole, propMinSize, registerPanelMinSize]);

    return (
      <ChakraPanel
        id={domId}
        panelRef={ref ?? panelRef}
        elementRef={elementRef}
        minSize={propMinSize}
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
  // Context
  const {
    orientation,
    variant: contextVariant,
    triggerAlwaysVisible,
    resetLayout,
    handleTriggerPointerDown,
    handleTriggerPointerMove,
    handleTriggerPointerUp,
    handleTriggerPointerCancel,
  } = useContext(SplitterContext);

  // Props
  const {
    variant = contextVariant,
    transparentTrigger = false,
    alwaysVisible = triggerAlwaysVisible,
    onDoubleClick,
    children,
    elementRef,
    ...restProps
  } = props;

  const isVertical = orientation === "vertical";
  const isPlain = variant === "plain";

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
        minW={isVertical ? "full" : "1px"}
        w={isVertical ? "full" : "1px"}
        minH={isVertical ? "1px" : "full"}
        h={isVertical ? "1px" : "full"}
        flexShrink={0}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        pos={"relative"}
        zIndex={10}
        cursor={isVertical ? "row-resize" : "col-resize"}
        outline={"none"}
        border={"none"}
        bg={isPlain ? "transparent" : "border.subtle"}
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
        onPointerDown={handleTriggerPointerDown}
        onPointerMove={handleTriggerPointerMove}
        onPointerUp={handleTriggerPointerUp}
        onPointerCancel={handleTriggerPointerCancel}
        onDoubleClick={handleDoubleClick}
        _hover={{
          bg: "transparent",
        }}
        {...restProps}
      >
        {/* Expanded touch hit area - minimum 44px on perpendicular axis */}
        <Box
          pos={"absolute"}
          top={isVertical ? "-22px" : 0}
          bottom={isVertical ? "-22px" : 0}
          left={isVertical ? 0 : "-22px"}
          right={isVertical ? 0 : "-22px"}
          zIndex={0}
          cursor={isVertical ? "row-resize" : "col-resize"}
          style={{
            touchAction: "none",
            userSelect: "none",
          }}
        />

        {/* Hover highlight bar - 8px width/height */}
        <Box
          pos={"absolute"}
          top={isVertical ? "-3.5px" : 0}
          bottom={isVertical ? "-3.5px" : 0}
          left={isVertical ? 0 : "-3.5px"}
          right={isVertical ? 0 : "-3.5px"}
          zIndex={0}
          pointerEvents={"none"}
          transition={"background 150ms ease"}
          _groupHover={{
            bg: isPlain || transparentTrigger ? "transparent" : "border.subtle",
          }}
        />

        {children ?? (
          <SplitterResizeTriggerIndicator
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            bg={"bg.body"}
            border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={"full"}
            shadow={"xs"}
            w={isVertical ? "80px" : "16px"}
            minW={isVertical ? "80px" : "16px"}
            maxW={isVertical ? "80px" : "16px"}
            h={isVertical ? "16px" : "80px"}
            minH={isVertical ? "16px" : "80px"}
            maxH={isVertical ? "16px" : "80px"}
            flexShrink={0}
            opacity={alwaysVisible ? 1 : 0}
            pointerEvents={"none"}
            transition={"opacity 150ms ease, transform 150ms ease"}
            zIndex={2}
            pos={"relative"}
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
