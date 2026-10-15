// src/design-system/components/map/ui/map.controls/map.layer-management-panel.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
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
import type {
  GenericMapLayer,
  MapLayerManagementPanelProps,
} from "@/design-system/components/map/types/map.layer-management.type";
import { MapLayerManagementItem } from "@/design-system/components/map/ui/map.controls/map.layer-management-item";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { P } from "@/design-system/components/typography/ui/p";
import { useIsSmallViewport } from "@/design-system/hooks/use-is-small-viewport";
import { isEmptyArray } from "@/shared/utils/data/array";
import { LayersIcon } from "lucide-react";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

export const MapLayerManagementPanel = memo(
  <T extends GenericMapLayer = GenericMapLayer>(
    props: MapLayerManagementPanelProps<T>,
  ) => {
    // Props
    const {
      title,
      tooltipContent = "Manajemen Layer",
      badgeLabel,
      emptyLabel = "Tidak ada data layer yang tersedia",
      loadingLabel = "Memuat layer...",
      errorTitle = "Gagal Memuat Layer",
      errorMessage = "Terjadi kesalahan saat memuat data layer.",
      layers,
      isLoading,
      isError,
      error,
      onRetry,
      showSymbology = true,
      onToggleLayer,
      onFlyToLayer,
      children,
    } = props;

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

    // States
    const [isOpen, setIsOpen] = useState(false);

    // Effects — Initialize layerOrder when layers loaded if empty
    useEffect(() => {
      if (layers && layers.length > 0 && layerOrder.length === 0) {
        const sortedByZIndex = [...layers].sort(
          (a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0),
        );
        setLayerOrder(sortedByZIndex.map((l) => l.id));
      }
    }, [layers, layerOrder.length, setLayerOrder]);

    // Derived Values — Sorted active layers reflecting zIndex / drag order
    const orderedLayers = useMemo(() => {
      const raw = layers ?? [];
      if (layerOrder.length === 0) return raw;

      const layerMap = new Map(raw.map((l) => [l.id, l]));
      const ordered: T[] = [];

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
    }, [layers, layerOrder]);

    const enabledCount = useMemo(() => {
      return orderedLayers.filter((l) => Boolean(enabledLayerIds[l.id])).length;
    }, [orderedLayers, enabledLayerIds]);

    const isAllEnabled = useMemo(() => {
      return orderedLayers.length > 0 && enabledCount === orderedLayers.length;
    }, [orderedLayers.length, enabledCount]);

    // Handlers
    const handleToggleAll = useCallback(
      (checked: boolean) => {
        if (onToggleLayer) {
          orderedLayers.forEach((l) => onToggleLayer(l, checked));
        } else {
          const layerIds = orderedLayers.map((l) => l.id);
          setAllLayersEnabled(layerIds, checked);
        }
      },
      [orderedLayers, onToggleLayer, setAllLayersEnabled],
    );

    const handleToggleItem = useCallback(
      (layerId: string) => {
        if (onToggleLayer) {
          const target = orderedLayers.find((l) => l.id === layerId);
          if (target) {
            const nextChecked = !enabledLayerIds[layerId];
            onToggleLayer(target, nextChecked);
            return;
          }
        }
        toggleLayerId(layerId);
      },
      [orderedLayers, onToggleLayer, enabledLayerIds, toggleLayerId],
    );

    return (
      <Popover.Root
        positioning={{
          placement: "top-start",
          offset: {
            crossAxis: -2,
          },
        }}
        open={isOpen}
        onOpenChange={(e) => setIsOpen(e.open)}
      >
        <Popover.Trigger>
          {typeof children === "function" ? (
            children({ enabledCount, isOpen })
          ) : children ? (
            children
          ) : (
            <MapOverlayContainer p={"2px"}>
              <Tooltip
                content={tooltipContent}
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
          )}
        </Popover.Trigger>

        <Popover.Content w={isSmallViewport ? "300px" : "380px"}>
          <HeaderContainer>
            <P fontWeight={"medium"}>{title}</P>

            <Badge colorPalette={"blue"}>
              {badgeLabel ?? `${enabledCount} aktif`}
            </Badge>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <Popover.Body p={"sm"} maxH={"500px"} overflowY={"auto"}>
            {isLoading ? (
              <HStack align={"center"} justify={"center"} gap={"md"} p={"md"}>
                <Loader />

                <P color={"fg.muted"}>{loadingLabel}</P>
              </HStack>
            ) : isError ? (
              <Center p={"md"}>
                <StateRetry
                  title={errorTitle}
                  description={
                    error instanceof Error ? error.message : errorMessage
                  }
                  onRetry={() => {
                    onRetry?.();
                  }}
                />
              </Center>
            ) : (
              <VStack gap={"xs"}>
                {!isEmptyArray(orderedLayers) && (
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
                )}

                {isEmptyArray(orderedLayers) && (
                  <HStack align={"center"} justify={"center"} p={"md"}>
                    <P color={"fg.muted"} fontSize={"sm"}>
                      {emptyLabel}
                    </P>
                  </HStack>
                )}

                <VStack>
                  {orderedLayers.map((layer, index) => {
                    const isEnabled = Boolean(enabledLayerIds[layer.id]);
                    const isSymbologyEnabled = Boolean(
                      enabledSymbologyLayerIds[layer.id],
                    );
                    const opacity = layerOpacities[layer.id] ?? 1.0;
                    const isFirstIndex = index === 0;

                    return (
                      <MapLayerManagementItem
                        key={layer.id}
                        layer={layer}
                        index={index}
                        isEnabled={isEnabled}
                        isSymbologyEnabled={isSymbologyEnabled}
                        showSymbology={showSymbology}
                        opacity={opacity}
                        onToggle={handleToggleItem}
                        onToggleSymbology={toggleSymbologyLayerId}
                        onOpacityChange={setLayerOpacity}
                        onReorder={reorderLayer}
                        onFlyTo={onFlyToLayer}
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
  },
);
