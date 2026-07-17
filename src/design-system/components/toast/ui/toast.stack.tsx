// src/design-system/components/toast/ui/toast.stack.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { DEFAULT_TOAST_GROUP } from "@/design-system/components/toast/core/toast.config";
import type { ToastStackProps } from "@/design-system/components/toast/types/toast.types";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useFirstMountEffect } from "@/shared/hooks/use-first-mount-effect";
import { t } from "@/shared/libs/i18n";
import { Box } from "@chakra-ui/react";
import { Minimize2Icon } from "lucide-react";
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
    >
      {/* Header (expanded) */}
      <HStack
        justifyContent={"space-between"}
        align={"center"}
        h={"26px"}
        px={3}
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

        <Box display={"flex"} gap={2}>
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

          <Tooltip content={t["action.show_less"]()}>
            <IconButton
              size={"2xs"}
              variant={"subtle"}
              rounded={"full"}
              onClick={(event) => {
                event.stopPropagation();
                setExpanded(false);
              }}
            >
              <AppIcon icon={Minimize2Icon} size={"xs"} />
            </IconButton>
          </Tooltip>
        </Box>
      </HStack>

      {/* Items */}
      <VStack
        pos={"relative"}
        onClick={!expanded ? () => setExpanded(true) : undefined}
        cursor={!expanded ? "pointer" : undefined}
        rounded={theme.radii.container}
      >
        {(() => {
          let nonLeavingCount = 0;
          const visualIndexes = items.map((item) => {
            if (isItemLeaving?.(item)) return -1;
            return nonLeavingCount++;
          });

          const hasVisibleItems = nonLeavingCount > 0;

          return items.map((item, index) => {
            const visualIndex = visualIndexes[index];
            const isLeaving = visualIndex === -1;
            const isStackedVisible =
              visualIndex > -1 && visualIndex < maxVisible;
            const isRelative =
              (!hasVisibleItems && index === 0) || visualIndex === 0;
            const isFirstVisual = visualIndex === 0;
            const isCollapsed = !expanded;

            return (
              <Box
                key={getId(item)}
                display={"grid"}
                gridTemplateRows={isLeaving ? "0fr" : "1fr"}
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
                    ? `scale(${1 - visualIndex * 0.05}) translateY(${visualIndex * 8}px)`
                    : "scale(1)"
                }
                transition={
                  "transform 300ms ease, margin-top 300ms ease, opacity 300ms ease, grid-template-rows 300ms ease"
                }
                pointerEvents={expanded || isFirstVisual ? "auto" : "none"}
              >
                <Box minH={"0px"} overflow={"visible"}>
                  {renderItem({
                    item,
                    index,
                    stackExpanded: expanded,
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
