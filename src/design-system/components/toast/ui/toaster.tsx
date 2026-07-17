// src/design-system/components/toast/ui/toaster.tsx

import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { getToastConfig } from "@/design-system/components/toast/core/toast.config";
import { toast } from "@/design-system/components/toast/core/toast.manager";
import { usePageVisibility } from "@/design-system/components/toast/hooks/use-page-visibility";
import { useToastVisibleStore } from "@/design-system/components/toast/stores/toast-visible.store";
import type { ToastPlacement } from "@/design-system/components/toast/types/toast.types";
import { ToastItem } from "@/design-system/components/toast/ui/toast.item";
import { ToastStack } from "@/design-system/components/toast/ui/toast.stack";
import { Portal } from "@chakra-ui/react";

const EDGE_OFFSET = 0;

function getPlacementStyles(placement: ToastPlacement) {
  const isTop = placement.startsWith("top");
  const isCentered = placement === "top" || placement === "bottom";
  const isEnd = placement.endsWith("end");

  return {
    top: isTop ? EDGE_OFFSET : undefined,
    bottom: isTop ? undefined : EDGE_OFFSET,
    left: isCentered ? "50%" : isEnd ? undefined : EDGE_OFFSET,
    right: isCentered ? undefined : isEnd ? EDGE_OFFSET : undefined,
    transform: isCentered ? "translateX(-50%)" : undefined,
    flexDirection: (isTop ? "column" : "column-reverse") as
      | "column"
      | "column-reverse",
  };
}

export function Toaster() {
  usePageVisibility();

  const entries = useToastVisibleStore((s) => s.entries);
  const { maxVisiblePerGroup, placement, newestOnTop } = getToastConfig();
  const placementStyles = getPlacementStyles(placement);

  // Flatten all groups into a single ordered array.
  const allRecords = Object.values(entries).flat();
  const visibleToasts = [...allRecords].sort((a, b) =>
    newestOnTop ? b.createdAt - a.createdAt : a.createdAt - b.createdAt,
  );

  return (
    <Portal>
      <VStack
        flexDir={placementStyles.flexDirection}
        align={"center"}
        gap={2}
        pos={"fixed"}
        top={placementStyles.top}
        bottom={placementStyles.bottom}
        left={placementStyles.left}
        right={placementStyles.right}
        zIndex={"toast"}
        overflow={"clip"}
        w={"100vw"}
        h={"100dvh"}
        p={4}
        transform={placementStyles.transform}
        transition={"200ms"}
        pointerEvents={"none"}
        userSelect={"none"}
        css={{
          "&:has([data-state='expanded'])": {
            bg: "bg.backdrop",
            // backdropFilter: "blur(5px)",
            pointerEvents: "auto",
          },
        }}
      >
        <VStack w={"360px"}>
          {/* {groups.map(({ group, items }) => (
          <ToastStack
            key={group}
            groupLabel={group}
            items={items}
            getId={(record) => record.id}
            maxVisible={maxVisiblePerGroup}
            renderItem={({ item, index, expanded }) => (
              <ToastItem record={item} index={index} expanded={expanded} />
            )}
            onCloseAll={() => items.forEach((record) => toast.close(record.id))}
          />
        ))} */}

          <ToastStack
            groupLabel={""}
            items={visibleToasts}
            getId={(record) => record.id}
            maxVisible={maxVisiblePerGroup}
            renderItem={({ item, index, stackExpanded }) => (
              <ToastItem
                record={item}
                index={index}
                stackExpanded={stackExpanded}
              />
            )}
            isItemLeaving={(record) => record.status === "leaving"}
            onCloseAll={() =>
              visibleToasts.forEach((record) => toast.close(record.id))
            }
          />
        </VStack>
      </VStack>
    </Portal>
  );
}
