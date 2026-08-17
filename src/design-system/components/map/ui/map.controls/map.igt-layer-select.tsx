// src/design-system/components/map/ui/map.controls/map.igt-layer-select.tsx

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
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Layers2Icon,
  LayersIcon,
  TreesIcon,
} from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

export const MapIgtLayerSelect = memo(() => {
  // Stores
  const { enabledLayerIds, layerOpacities, toggleLayerId, setLayerOpacity } =
    useMapLayerStore();

  // Queries — list of all active IGT layers
  const { data: layersData, isLoading } = useQuery({
    queryKey: ["igt-layers-list"],
    queryFn: () => getIgtLayers(),
    staleTime: Infinity,
  });

  // Derived Values
  const activeLayers = useMemo(() => layersData?.layers ?? [], [layersData]);

  const enabledCount = useMemo(() => {
    return activeLayers.filter((l) => enabledLayerIds[l.id] !== false).length;
  }, [activeLayers, enabledLayerIds]);

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
            content={"Layer Spasial IGT"}
            positioning={{ placement: "left" }}
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

      <Popover.Content width={"320px"}>
        <Popover.Header
          p={3}
          borderBottom={"1px solid"}
          borderColor={"border"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <P fontWeight={"medium"}>{"Toggle Layer IGT"}</P>

          <Badge colorPalette={"blue"}>{enabledCount} aktif</Badge>
        </Popover.Header>

        <Popover.Body p={2}>
          {isLoading ? (
            <HStack
              align={"center"}
              justify={"center"}
              gap={SPACING.md}
              p={PADDING.md}
            >
              <Loader />

              <P color={"fg.muted"}>{"Memuat layer..."}</P>
            </HStack>
          ) : (
            <VStack gap={2} align={"stretch"}>
              {activeLayers.map((layer) => {
                const isEnabled = enabledLayerIds[layer.id] ?? true;
                const opacity = layerOpacities[layer.id] ?? 0.5;

                return (
                  <MapIgtLayerItem
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

type MapIgtLayerItemProps = {
  layer: IgtLayerItem;
  isEnabled: boolean;
  opacity: number;
  onToggle: (id: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
};

const MapIgtLayerItem = memo((props: MapIgtLayerItemProps) => {
  // Props
  const { layer, isEnabled, opacity, onToggle, onOpacityChange } = props;

  // Stores
  const { theme } = useThemeStore();

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
  const isBidang = layer.spatialBasis === "bidang";
  const colorPalette = isBidang ? "blue" : "orange";
  const LayerIcon = isBidang ? Layers2Icon : TreesIcon;

  return (
    <VStack gap={1} align={"stretch"} w={"full"}>
      <HStack
        align={"center"}
        justify={"space-between"}
        gap={SPACING.md}
        p={2}
        colorPalette={colorPalette}
        rounded={"md"}
        cursor={"pointer"}
        onClick={() => onToggle(layer.id)}
        _hover={{ bg: "bg.subtle" }}
      >
        <HStack gap={SPACING.md} align={"center"} flex={1}>
          <Center
            p={PADDING.sm}
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

            <ClampedP
              fontSize={"sm"}
              color={isEnabled ? `fg.muted` : "fg.subtle"}
            >
              {layer.wfs.wfsTypeName}
            </ClampedP>
          </VStack>
        </HStack>

        <HStack gap={1} align={"center"}>
          <Switch checked={isEnabled} pointerEvents={"none"} />

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

              <P fontSize={"sm"} fontWeight={"bold"} color={"fg.muted"}>
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
