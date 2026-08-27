// src/design-system/components/toast/ui/toast.stack.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { DEFAULT_TOAST_GROUP } from "@/design-system/components/toast/core/toast.config";
import { toastTimerControls } from "@/design-system/components/toast/core/toast.manager";
import type { ToastStackProps } from "@/design-system/components/toast/types/toast.types";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { t } from "@/shared/libs/i18n";
import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export function ToastStack<TItem>({
  groupLabel,
  items,
  getId,
  maxVisible,
  renderItem,
  isItemLeaving,
  onCloseAll,
  onClickOutside,
}: ToastStackProps<TItem>) {
  // Stores
  const { theme } = useThemeStore();

  // Hooks
  // const { maxVisiblePerGroup } = getToastConfig();

  // States
  const [expanded, setExpanded] = useState(false);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Collapse stack if no items
  useFirstMountEffect(
    {
      onUpdate: () => {
        if (items.length === 0) {
          setExpanded(false);
        }
      },
    },
    [items],
  );

  // Click outside to collapse
  useEffect(() => {
    if (!expanded) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
        if (onClickOutside) {
          onClickOutside(event);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [expanded, onClickOutside]);

  // Resolved Values
  // const overflowCount = Math.max(items.length - maxVisible, 0);

  return (
    <VStack
      ref={containerRef}
      data-state={expanded ? "expanded" : "collapsed"}
      flexShrink={0}
      gap={expanded ? 2 : 0}
      pointerEvents={"auto"}
      onPointerEnter={() => toastTimerControls.pauseAll()}
      onPointerLeave={() => toastTimerControls.resumeAll()}
      onFocus={() => toastTimerControls.pauseAll()}
      onBlur={() => toastTimerControls.resumeAll()}
    >
      {/* Header (expanded) */}
      <HStack
        justifyContent={"space-between"}
        align={"center"}
        h={"26px"}
        // px={3}
        mt={expanded ? 0 : "-26px"}
        visibility={expanded ? "visible" : "hidden"}
        opacity={expanded ? 1 : 0}
        transition={"200ms"}
      >
        <P fontWeight={"semibold"}>
          {groupLabel === DEFAULT_TOAST_GROUP
            ? t["common.system"]()
            : groupLabel}
        </P>

        <Box display={"flex"} gap={1}>
          <Button
            size={"2xs"}
            fontSize={"sm"}
            variant={"subtle"}
            rounded={"full"}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(false);
            }}
          >
            {t["action.close"]()}
          </Button>

          {onCloseAll && (
            <Button
              size={"2xs"}
              fontSize={"sm"}
              variant={"subtle"}
              rounded={"full"}
              onClick={(event) => {
                event.stopPropagation();
                setExpanded(false);
                onCloseAll();
              }}
            >
              {t["action.clear"]()}
            </Button>
          )}
        </Box>
      </HStack>

      {/* Items */}
      <VStack
        pos={"relative"}
        w={"full"}
        minW={0}
        cursor={!expanded ? "pointer" : undefined}
        rounded={theme.radii.container}
        onClick={!expanded ? () => setExpanded(true) : undefined}
      >
        {(() => {
          let nonLeavingCount = 0;
          const visualIndexes = items.map((item) => {
            if (isItemLeaving?.(item)) return -1;
            return nonLeavingCount++;
          });

          const hasVisibleItems = nonLeavingCount > 0;
          const isCollapsed = !expanded;
          // Buffer threshold: keep up to 6 cards mounted in collapsed state so expand transition is smooth without DOM bloat
          const maxCollapsedRenderCount = Math.max(maxVisible + 3, 6);

          return items.map((item, index) => {
            const visualIndex = visualIndexes[index];
            const isLeaving = visualIndex === -1;
            const isStackedVisible =
              visualIndex > -1 && visualIndex < maxVisible;
            const isRelative =
              (!hasVisibleItems && index === 0) || visualIndex === 0;
            const isFirstVisual = visualIndex === 0;

            // When collapsed, skip rendering items beyond buffer threshold to keep DOM light
            if (isCollapsed && visualIndex >= maxCollapsedRenderCount) {
              return null;
            }

            // Stack transform calculations for cards in collapsed state
            const collapsedTranslateY = isStackedVisible
              ? visualIndex * 8
              : maxVisible * 8;
            const collapsedScale = isStackedVisible
              ? 1 - visualIndex * 0.05
              : 1 - maxVisible * 0.05;

            return (
              <Box
                key={getId(item)}
                display={"grid"}
                gridTemplateRows={isLeaving ? "0fr" : "1fr"}
                w={"full"}
                minW={0}
                data-stack-state={
                  expanded
                    ? "expanded"
                    : isStackedVisible
                      ? "stacked"
                      : "hidden"
                }
                pos={isCollapsed && !isRelative ? "absolute" : "relative"}
                top={isCollapsed && !isRelative ? 0 : undefined}
                right={isCollapsed && !isRelative ? 0 : undefined}
                bottom={isCollapsed && !isRelative ? 0 : undefined}
                left={isCollapsed && !isRelative ? 0 : undefined}
                overflow={
                  isCollapsed && !isRelative && !isLeaving ? "clip" : "visible"
                }
                rounded={theme.radii.container}
                zIndex={items.length - index}
                mt={expanded && index > 0 && !isLeaving ? 2 : 0}
                opacity={!expanded && !isStackedVisible && !isLeaving ? 0 : 1}
                transformOrigin={"bottom"}
                transform={
                  isCollapsed && !isFirstVisual && !isLeaving
                    ? `scale(${collapsedScale}) translateY(${collapsedTranslateY}px)`
                    : "scale(1)"
                }
                transition={
                  "transform 250ms cubic-bezier(0.2, 0, 0, 1), margin-top 250ms cubic-bezier(0.2, 0, 0, 1), opacity 250ms ease"
                }
                pointerEvents={expanded || isFirstVisual ? "auto" : "none"}
                willChange={isCollapsed ? "transform, opacity" : undefined}
              >
                <Box w={"full"} minW={0} minH={"0px"} overflow={"visible"}>
                  {renderItem({
                    item,
                    index,
                    stackExpanded: expanded,
                    setStackExpanded: setExpanded,
                  })}
                </Box>
              </Box>
            );
          });
        })()}
      </VStack>

      {/* Stack additional item count */}
      {/* {!expanded && overflowCount > 0 ? (
        <Text fontSize={"xs"} color={"fg.muted"} mt={3} textAlign={"center"}>
          {`+${overflowCount} more in ${groupLabel}`}
        </Text>
      ) : null} */}
    </VStack>
  );
}
