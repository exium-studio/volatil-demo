// src/design-system/components/map/ui/map.controls/map.layer-management-item.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Slider } from "@/design-system/components/input/ui/slider";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import type {
  GenericMapLayer,
  MapLayerManagementItemProps,
} from "@/design-system/components/map/types/map.layer-management.type";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { LayerSymbologyContent } from "@/design-system/components/map/ui/map.symbology-panel";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { IgtBasisType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  FocusIcon,
  GripVerticalIcon,
  SquareDashedIcon,
  SwatchBookIcon,
} from "lucide-react";
import React, { memo, useEffect, useRef, useState } from "react";

function MapLayerManagementItemComponent<
  T extends GenericMapLayer = GenericMapLayer,
>(props: MapLayerManagementItemProps<T>) {
  // Props
  const {
    layer,
    index,
    isEnabled,
    isSymbologyEnabled,
    showSymbology = true,
    opacity,
    onToggle,
    onToggleSymbology,
    onOpacityChange,
    onReorder,
    onFlyTo,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();
  const { flyTo } = useFlyToLayer();

  // Refs
  const itemRef = useRef<HTMLDivElement | null>(null);
  const dragHandleRef = useRef<HTMLButtonElement | null>(null);

  // States
  const [isSymbologyOpen, setIsSymbologyOpen] = useState<boolean>(
    Boolean(isSymbologyEnabled),
  );
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

  // Effects — Pragmatic Drag and Drop
  useEffect(() => {
    const element = itemRef.current;
    const dragHandle = dragHandleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({ id: layer.id, index }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          return source.data.id !== layer.id;
        },
        getData: ({ input, element }) => {
          const data = { id: layer.id, index };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          const edge = extractClosestEdge(args.self.data);
          setClosestEdge(edge);
        },
        onDrag: (args) => {
          const edge = extractClosestEdge(args.self.data);
          setClosestEdge(edge);
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: (args) => {
          setClosestEdge(null);
          const sourceIndex = args.source.data.index as number | undefined;
          if (sourceIndex === undefined || sourceIndex === index) return;

          const edge = extractClosestEdge(args.self.data);
          let targetIndex = index;
          if (edge === "bottom" && sourceIndex < index) {
            targetIndex = index;
          } else if (edge === "bottom" && sourceIndex > index) {
            targetIndex = index + 1;
          } else if (edge === "top" && sourceIndex < index) {
            targetIndex = index - 1;
          } else if (edge === "top" && sourceIndex > index) {
            targetIndex = index;
          }

          onReorder(sourceIndex, targetIndex);
        },
      }),
    );
  }, [layer.id, index, onReorder]);

  // Handlers
  const handleToggle = () => {
    onToggle(layer.id);
  };

  const handleFlyTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFlyTo) {
      onFlyTo(layer);
    } else {
      void flyTo({
        id: layer.id,
        title: layer.title || layer.label,
        bbox: layer.bbox,
        spatialBasis: layer.spatialBasis,
      });
    }
  };

  const handleToggleSymbology = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSymbologyOpen((prev) => !prev);
    onToggleSymbology?.(layer.id);
  };

  // Derived Values
  const rawBasis = layer.spatialBasis ?? layer.igtBasis ?? "kawasan";
  const displayName =
    layer.title || layer.id.split(":")[1] || layer.wfs?.wfsTypeName || layer.id;
  const normalizedBasis = (
    rawBasis ? rawBasis.toLowerCase() : ""
  ) as IgtBasisType;
  const basisConfig =
    IGT_BASIS_MAP[normalizedBasis] ??
    IGT_BASIS_MAP[rawBasis as keyof typeof IGT_BASIS_MAP];
  const colorPalette = basisConfig?.colorPalette ?? "gray";

  return (
    <VStack align={"stretch"} w={"full"} position={"relative"} {...restProps}>
      <VStack
        ref={itemRef}
        gap={"2xs"}
        position={"relative"}
        opacity={isDragging ? 0.4 : 1}
        transition={"opacity 0.15s ease"}
      >
        {closestEdge === "top" && (
          <Box
            position={"absolute"}
            top={"-8px"}
            left={0}
            right={0}
            height={"2px"}
            bg={"blue.solid"}
            rounded={"full"}
            zIndex={10}
            pointerEvents={"none"}
          />
        )}
        {closestEdge === "bottom" && (
          <Box
            position={"absolute"}
            bottom={"-8px"}
            left={0}
            right={0}
            height={"2px"}
            bg={"blue.solid"}
            rounded={"full"}
            zIndex={10}
            pointerEvents={"none"}
          />
        )}

        <HStack
          align={"center"}
          gap={"md"}
          colorPalette={colorPalette}
          rounded={theme.radii.component}
          cursor={"pointer"}
          onClick={handleToggle}
          w={"full"}
        >
          <HStack flex={1} align={"center"} gap={"xs"}>
            <Tooltip content={"Tahan & geser untuk mengubah urutan (z-index)"}>
              <IconButton
                ref={dragHandleRef}
                aria-label={"Ubah urutan layer"}
                variant={"plain"}
                size={"2xs"}
                px={0}
                cursor={"grab"}
                onClick={(e) => e.stopPropagation()}
                color={"fg.subtle"}
                _hover={{ color: "fg" }}
                _active={{ cursor: "grabbing" }}
              >
                <AppIcon icon={GripVerticalIcon} size={"sm"} />
              </IconButton>
            </Tooltip>

            <ClampedP
              fontWeight={"medium"}
              color={isEnabled ? `fg` : "fg.subtle"}
            >
              {displayName.replace(/_/g, " ")}
            </ClampedP>
          </HStack>

          <HStack align={"center"} gap={"xs"} mr={"2xs"}>
            <Switch size={"sm"} checked={isEnabled} pointerEvents={"none"} />
          </HStack>
        </HStack>

        <HStack
          align={"center"}
          justify={"space-between"}
          gap={"md"}
          pl={"28px"}
        >
          <IgtBasisBadge
            colorPalette={isEnabled ? basisConfig?.colorPalette : "neutral"}
            opacity={isEnabled ? 1 : 0.5}
          >
            {normalizedBasis}
          </IgtBasisBadge>

          <HStack align={"center"} gap={"2xs"}>
            <Popover.Root
              positioning={{
                placement: "left",
                offset: { mainAxis: 8 },
              }}
              portalled={true}
            >
              <Popover.Trigger>
                <Tooltip content={"Atur Opasitas"}>
                  <IconButton
                    size={"xs"}
                    variant={"ghost"}
                    aria-label={"Atur Opasitas"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AppIcon icon={SquareDashedIcon} />
                  </IconButton>
                </Tooltip>
              </Popover.Trigger>

              <Popover.Content
                w={"220px"}
                p={3}
                onClick={(e) => e.stopPropagation()}
              >
                <VStack gap={"xs"} align={"stretch"} w={"full"}>
                  <HStack justify={"space-between"} w={"full"}>
                    <P fontSize={"sm"} fontWeight={"medium"}>
                      {"Opasitas Layer"}
                    </P>

                    <P
                      fontSize={"sm"}
                      fontWeight={"semibold"}
                      color={"fg.muted"}
                    >
                      {`${Math.round(opacity * 100)}%`}
                    </P>
                  </HStack>

                  <Slider
                    value={[Math.round(opacity * 100)]}
                    min={0}
                    max={100}
                    step={1}
                    showValue={false}
                    onValueChange={(details) =>
                      onOpacityChange(layer.id, details.value[0] / 100)
                    }
                  />
                </VStack>
              </Popover.Content>
            </Popover.Root>

            <Tooltip content={"Zoom ke Layer"}>
              <IconButton
                size={"xs"}
                variant={"ghost"}
                aria-label={"Zoom ke Layer"}
                onClick={handleFlyTo}
              >
                <AppIcon icon={FocusIcon} />
              </IconButton>
            </Tooltip>

            {showSymbology && (
              <Tooltip
                content={
                  isSymbologyOpen
                    ? "Sembunyikan Simbologi"
                    : "Tampilkan Simbologi"
                }
              >
                <IconButton
                  size={"xs"}
                  variant={"ghost"}
                  aria-label={"Simbologi"}
                  onClick={handleToggleSymbology}
                >
                  <AppIcon
                    icon={SwatchBookIcon}
                    color={isSymbologyOpen ? "blue.fg" : undefined}
                  />
                </IconButton>
              </Tooltip>
            )}
          </HStack>
        </HStack>
      </VStack>

      {showSymbology && (
        <Collapsible.Root opened={isSymbologyOpen}>
          <Collapsible.Content mt={"xs"}>
            <VStack
              gap={"xs"}
              p={3}
              bg={"bg.subtle"}
              rounded={theme.radii.component}
              onClick={(e) => e.stopPropagation()}
              onDragStart={(e) => e.stopPropagation()}
              align={"stretch"}
              w={"full"}
            >
              <HStack justify={"space-between"} align={"center"} w={"full"}>
                <P fontSize={"xs"} fontWeight={"semibold"} color={"fg.muted"}>
                  {"Simbologi"}
                </P>
              </HStack>

              <LayerSymbologyContent layer={layer as unknown as IgtLayerItem} />
            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </VStack>
  );
}

export const MapLayerManagementItem = memo(MapLayerManagementItemComponent) as <
  T extends GenericMapLayer = GenericMapLayer,
>(
  props: MapLayerManagementItemProps<T>,
) => React.ReactElement;
