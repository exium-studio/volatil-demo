// src/design-system/components/map/ui/map.controls/map.master-igt-layer-management.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Slider } from "@/design-system/components/input/ui/slider";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { MapMasterIgtLayerItemProps } from "@/design-system/components/map/types/map.master-igt-layer-select.type";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { LayerSymbologyContent } from "@/design-system/components/map/ui/map.symbology-panel";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { IgtBasisType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isEmptyArray } from "@/shared/utils/data/array";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
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
import { useQuery } from "@tanstack/react-query";
import {
  FocusIcon,
  GripVerticalIcon,
  LayersIcon,
  SquareDashedIcon,
  SwatchBookIcon,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

export const MapMasterIgtLayerManagement = memo(() => {
  // Stores
  const {
    enabledLayerIds,
    enabledSymbologyLayerIds,
    layerOpacities,
    globalOpacity,
    layerOrder,
    setGlobalOpacity,
    toggleLayerId,
    toggleSymbologyLayerId,
    setLayerOpacity,
    setAllLayersEnabled,
    setLayerOrder,
    reorderLayer,
  } = useMapLayerStore();

  // Contexts
  const isSmallViewport = useIsSmallViewport();

  // Derived Values
  const userSession = getUserSession();
  const isAuthenticated = Boolean(userSession?.id);

  // Queries — list of all active master IGT catalog layers
  const {
    data: layersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  });

  // Effects — Initialize layerOrder when layersData loaded if empty
  // Sort descending by zIndex (highest zIndex is at the top of the list, index 0)
  useEffect(() => {
    const items = layersData?.items;
    if (items && items.length > 0 && layerOrder.length === 0) {
      const sortedByZIndex = [...items].sort(
        (a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0),
      );
      setLayerOrder(sortedByZIndex.map((l) => l.id));
    }
  }, [layersData?.items, layerOrder.length, setLayerOrder]);

  // Derived Values — Sorted active layers reflecting zIndex / drag order
  const activeLayers = useMemo(() => {
    const raw = layersData?.items ?? [];
    if (layerOrder.length === 0) return raw;

    const layerMap = new Map(raw.map((l) => [l.id, l]));
    const ordered: (typeof raw)[0][] = [];

    // Follow layerOrder (index 0 is visually on top)
    for (const id of layerOrder) {
      const item = layerMap.get(id);
      if (item) {
        ordered.push(item);
        layerMap.delete(id);
      }
    }

    // Append any layers not yet in layerOrder
    for (const remaining of layerMap.values()) {
      ordered.push(remaining);
    }

    return ordered;
  }, [layersData, layerOrder]);

  const enabledCount = useMemo(() => {
    return activeLayers.filter((l) => Boolean(enabledLayerIds[l.id])).length;
  }, [activeLayers, enabledLayerIds]);

  const isAllEnabled = useMemo(() => {
    return activeLayers.length > 0 && enabledCount === activeLayers.length;
  }, [activeLayers.length, enabledCount]);

  // Handlers
  const handleToggleAll = useCallback(
    (checked: boolean) => {
      const layerIds = activeLayers.map((l) => l.id);
      setAllLayersEnabled(layerIds, checked);
    },
    [activeLayers, setAllLayersEnabled],
  );

  return (
    <Popover.Root
      positioning={{
        placement: "top-start",
        offset: {
          crossAxis: -2,
        },
      }}
    >
      <Popover.Trigger>
        <MapOverlayContainer p={"2px"}>
          <Tooltip
            content={"Manajemen Layer IGT"}
            positioning={{ placement: "bottom" }}
          >
            <Box position={"relative"}>
              <IconButton size={"xs"}>
                <AppIcon icon={LayersIcon} boxSize={5} />
              </IconButton>
              <CountBadge count={enabledCount} floating={true} />
            </Box>
          </Tooltip>
        </MapOverlayContainer>
      </Popover.Trigger>

      <Popover.Content w={isSmallViewport ? "300px" : "380px"}>
        <HeaderContainer>
          <P fontWeight={"medium"}>{"Manajemen Layer & Simbologi IGT"}</P>

          <Badge colorPalette={"blue"}>{`${enabledCount} aktif`}</Badge>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <Popover.Body p={"sm"} maxH={"500px"} overflowY={"auto"}>
          {isLoading ? (
            <HStack align={"center"} justify={"center"} gap={"md"} p={"md"}>
              <Loader />

              <P color={"fg.muted"}>{"Memuat master layer..."}</P>
            </HStack>
          ) : isError ? (
            <Center p={"md"}>
              <StateRetry
                title={"Gagal Memuat Master Layer"}
                description={
                  error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat memuat data master layer IGT."
                }
                onRetry={() => {
                  void refetch();
                }}
              />
            </Center>
          ) : (
            <VStack gap={"xs"}>
              {!isEmptyArray(activeLayers) && (
                <>
                  <VStack gap={"sm"} p={1} align={"stretch"}>
                    <HStack
                      justify={"space-between"}
                      align={"center"}
                      cursor={"pointer"}
                      onClick={() => {
                        handleToggleAll(!isAllEnabled);
                      }}
                    >
                      <P fontSize={"sm"} fontWeight={"medium"}>
                        {"Muat Semua Layer"}
                      </P>

                      <Switch
                        size={"sm"}
                        checked={isAllEnabled}
                        pointerEvents={"none"}
                      />
                    </HStack>

                    <VStack gap={"xs"} align={"stretch"}>
                      <HStack justify={"space-between"} w={"full"}>
                        <P fontSize={"sm"} fontWeight={"medium"}>
                          {"Opasitas Semua Layer"}
                        </P>

                        <P
                          fontSize={"sm"}
                          fontWeight={"semibold"}
                          color={"fg.muted"}
                        >
                          {`${Math.round(globalOpacity * 100)}%`}
                        </P>
                      </HStack>

                      <Slider
                        value={[Math.round(globalOpacity * 100)]}
                        min={0}
                        max={100}
                        step={1}
                        showValue={false}
                        onValueChange={(details) =>
                          setGlobalOpacity(details.value[0] / 100)
                        }
                      />
                    </VStack>
                  </VStack>
                </>
              )}

              {isEmptyArray(activeLayers) && (
                <HStack align={"center"} justify={"center"} p={"md"}>
                  <P color={"fg.muted"} fontSize={"sm"}>
                    {"Tidak ada data layer IGT yang tersedia"}
                  </P>
                </HStack>
              )}

              <VStack>
                {activeLayers.map((layer, index) => {
                  const isEnabled = Boolean(enabledLayerIds[layer.id]);
                  const isSymbologyEnabled = Boolean(
                    enabledSymbologyLayerIds[layer.id],
                  );
                  const opacity = layerOpacities[layer.id] ?? 1.0;
                  const isFirstIndex = index === 0;

                  return (
                    <MapMasterIgtLayerItem
                      key={layer.id}
                      layer={layer}
                      index={index}
                      isEnabled={isEnabled}
                      isSymbologyEnabled={isSymbologyEnabled}
                      opacity={opacity}
                      onToggle={toggleLayerId}
                      onToggleSymbology={toggleSymbologyLayerId}
                      onOpacityChange={setLayerOpacity}
                      onReorder={reorderLayer}
                      borderTop={"1px solid"}
                      borderColor={
                        isFirstIndex ? "transparent" : "border.subtle"
                      }
                    />
                  );
                })}
              </VStack>
            </VStack>
          )}
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
});

const MapMasterIgtLayerItem = memo((props: MapMasterIgtLayerItemProps) => {
  // Props
  const {
    layer,
    index,
    isEnabled,
    isSymbologyEnabled,
    opacity,
    onToggle,
    onToggleSymbology,
    onOpacityChange,
    onReorder,
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
    void flyTo(layer);
  };

  const handleToggleSymbology = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSymbologyOpen((prev) => !prev);
    onToggleSymbology?.(layer.id);
  };

  // Derived Values
  const displayName =
    layer.title || layer.id.split(":")[1] || layer.wfs.wfsTypeName;
  const normalizedBasis = (
    layer.spatialBasis ? layer.spatialBasis.toLowerCase() : ""
  ) as IgtBasisType;
  const basisConfig =
    IGT_BASIS_MAP[normalizedBasis] ?? IGT_BASIS_MAP[layer.spatialBasis];
  const colorPalette = basisConfig?.colorPalette ?? "gray";

  return (
    <VStack
      ref={itemRef}
      align={"stretch"}
      w={"full"}
      py={"xs"}
      opacity={isDragging ? 0.4 : 1}
      position={"relative"}
      transition={"opacity 0.15s ease"}
      {...restProps}
    >
      {closestEdge === "top" && (
        <Box
          position={"absolute"}
          top={"-1px"}
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
          bottom={"-1px"}
          left={0}
          right={0}
          height={"2px"}
          bg={"blue.solid"}
          rounded={"full"}
          zIndex={10}
          pointerEvents={"none"}
        />
      )}

      <VStack gap={"2xs"}>
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
            colorPalette={isEnabled ? basisConfig.colorPalette : "neutral"}
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
          </HStack>
        </HStack>
      </VStack>

      <Collapsible.Root opened={isSymbologyOpen}>
        <Collapsible.Content mt={"xs"}>
          <VStack
            gap={"xs"}
            p={3}
            bg={"bg.subtle"}
            rounded={theme.radii.component}
            onClick={(e) => e.stopPropagation()}
            align={"stretch"}
            w={"full"}
          >
            <HStack justify={"space-between"} align={"center"} w={"full"}>
              <P fontSize={"xs"} fontWeight={"semibold"} color={"fg.muted"}>
                {"Simbologi"}
              </P>
            </HStack>

            <LayerSymbologyContent layer={layer} />
          </VStack>
        </Collapsible.Content>
      </Collapsible.Root>
    </VStack>
  );
});
