// src/design-system/components/map/ui/map.controls/map.master-igt-layer-select.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Slider } from "@/design-system/components/input/ui/slider";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { MapMasterIgtLayerItemProps } from "@/design-system/components/map/types/map.master-igt-layer-select.type";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FocusIcon,
  LayersIcon,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

export const MapMasterIgtLayerSelect = memo(() => {
  // Stores
  const {
    enabledLayerIds,
    layerOpacities,
    toggleLayerId,
    setLayerOpacity,
    setAllLayersEnabled,
  } = useMapLayerStore();

  // Queries — list of all active master IGT catalog layers
  const { data: layersData, isLoading } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
  });

  // Derived Values
  const activeLayers = useMemo(
    () => layersData?.items ?? layersData?.layers ?? [],
    [layersData],
  );

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
            content={"Master Layer Spasial IGT"}
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

      <Popover.Content width={"380px"}>
        <Popover.Header
          p={3}
          borderBottom={"1px solid"}
          borderColor={"border"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <HStack justify={"space-between"} gap={"md"} w={"full"}>
            <HStack flex={1} gap={"xs"} align={"center"}>
              <P fontWeight={"medium"}>{"Toggle Master Layer IGT"}</P>

              <Badge colorPalette={"blue"}>{enabledCount} aktif</Badge>
            </HStack>

            {activeLayers.length > 0 && (
              <HStack
                align={"center"}
                gap={"sm"}
                cursor={"pointer"}
                onClick={() => {
                  handleToggleAll(!isAllEnabled);
                }}
              >
                <P fontSize={"sm"} color={"fg.muted"} userSelect={"none"}>
                  {"Semua"}
                </P>

                <Switch
                  size={"sm"}
                  checked={isAllEnabled}
                  pointerEvents={"none"}
                />
              </HStack>
            )}
          </HStack>
        </Popover.Header>

        <Popover.Body p={2} maxH={"500px"} overflowY={"auto"}>
          {isLoading ? (
            <HStack align={"center"} justify={"center"} gap={"md"} p={"md"}>
              <Loader />

              <P color={"fg.muted"}>{"Memuat master layer..."}</P>
            </HStack>
          ) : (
            <VStack gap={"2xs"} align={"stretch"}>
              {activeLayers.map((layer) => {
                const isEnabled = Boolean(enabledLayerIds[layer.id]);
                const opacity = layerOpacities[layer.id] ?? 1.0;

                return (
                  <MapMasterIgtLayerItem
                    key={layer.id}
                    layer={layer}
                    isEnabled={isEnabled}
                    opacity={opacity}
                    onToggle={toggleLayerId}
                    onOpacityChange={setLayerOpacity}
                  />
                );
              })}
            </VStack>
          )}
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
});

const MapMasterIgtLayerItem = memo((props: MapMasterIgtLayerItemProps) => {
  // Props
  const { layer, isEnabled, opacity, onToggle, onOpacityChange } = props;

  // Stores
  const { theme } = useThemeStore();
  const { flyTo } = useFlyToLayer();

  // Handlers
  const handleToggle = () => {
    onToggle(layer.id);
  };

  const handleFlyTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    void flyTo(layer);
  };

  // States
  const [isOpacityOpen, setIsOpacityOpen] = useState<boolean>(false);
  const [localOpacity, setLocalOpacity] = useState<number>(opacity);

  // Sync local opacity state with prop opacity if updated externally
  useEffect(() => {
    setLocalOpacity(opacity);
  }, [opacity]);

  // Debounce opacity state updates to MapLibre store for performance
  const debouncedOpacity = useDebouncedValue(localOpacity, 80);

  useEffect(() => {
    if (debouncedOpacity !== opacity) {
      onOpacityChange(layer.id, debouncedOpacity);
    }
  }, [debouncedOpacity, opacity, onOpacityChange, layer.id]);

  // Derived Values
  const displayName =
    layer.title || layer.id.split(":")[1] || layer.wfs.wfsTypeName;
  const basisConfig = IGT_BASIS_MAP[layer.spatialBasis];
  const colorPalette = basisConfig?.colorPalette ?? "gray";
  const LayerIcon = basisConfig?.icon;

  return (
    <VStack gap={isOpacityOpen ? "2xs" : 0} align={"stretch"} w={"full"}>
      <HStack
        align={"center"}
        justify={"space-between"}
        gap={"md"}
        p={"2xs"}
        colorPalette={colorPalette}
        rounded={theme.radii.component}
        cursor={"pointer"}
        onClick={handleToggle}
        _hover={{ bg: "bg.subtle" }}
      >
        <HStack gap={"md"} align={"center"} flex={1}>
          <Center
            p={"xs"}
            bg={isEnabled ? `${colorPalette}.subtle` : "bg.muted"}
            rounded={theme.radii.component}
          >
            <AppIcon
              icon={LayerIcon}
              color={isEnabled ? `${colorPalette}.fg` : "fg.subtle"}
            />
          </Center>

          <VStack flex={1} align={"start"}>
            <ClampedP color={isEnabled ? `fg` : "fg.subtle"}>
              {displayName.replace(/_/g, " ")}
            </ClampedP>

            <ClampedP fontSize={"sm"} color={"fg.subtle"}>
              {IGT_BASIS_MAP[layer.spatialBasis].label}
            </ClampedP>
          </VStack>
        </HStack>

        <HStack gap={"xs"} align={"center"}>
          <Switch
            size={"sm"}
            checked={isEnabled}
            pointerEvents={"none"}
            mr={"xs"}
          />

          <Tooltip content={"Zoom ke Layer"}>
            <IconButton size={"xs"} variant={"ghost"} onClick={handleFlyTo}>
              <AppIcon icon={FocusIcon} />
            </IconButton>
          </Tooltip>

          <Tooltip content={"Atur Opasitas"}>
            <IconButton
              size={"xs"}
              variant={"ghost"}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpacityOpen((prev) => !prev);
              }}
            >
              <AppIcon icon={isOpacityOpen ? ChevronUpIcon : ChevronDownIcon} />
            </IconButton>
          </Tooltip>
        </HStack>
      </HStack>

      <Collapsible.Root opened={isOpacityOpen}>
        <Collapsible.Content>
          <VStack
            gap={2}
            p={3}
            bg={"bg.subtle"}
            rounded={theme.radii.component}
            onClick={(e) => e.stopPropagation()}
          >
            <HStack justify={"space-between"} w={"full"}>
              <P fontSize={"sm"} color={"fg.muted"}>
                {"Opasitas Layer"}
              </P>

              <P fontSize={"sm"} fontWeight={"semibold"} color={"fg.muted"}>
                {`${Math.round(localOpacity * 100)}%`}
              </P>
            </HStack>

            <Slider
              value={[Math.round(localOpacity * 100)]}
              min={0}
              max={100}
              step={1}
              showValue={false}
              onValueChange={(details) =>
                setLocalOpacity(details.value[0] / 100)
              }
            />
          </VStack>
        </Collapsible.Content>
      </Collapsible.Root>
    </VStack>
  );
});
