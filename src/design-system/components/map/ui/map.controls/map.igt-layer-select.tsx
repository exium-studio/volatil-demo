// src/design-system/components/map/ui/map.controls/map.igt-layer-select.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { getIgtLayers } from "@/design-system/components/map/services/map-layers.api";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { P } from "@/design-system/components/typography/ui/p";

import { ClickDelegateContainer } from "@/design-system/components/utilities/ui/click-delegate-container";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { useQuery } from "@tanstack/react-query";
import { Layers2Icon, LayersIcon, TreesIcon } from "lucide-react";
import { memo, useMemo } from "react";

export const MapIgtLayerSelect = memo(() => {
  // Stores
  const { enabledLayerIds, toggleLayerId } = useIgtLayerStore();

  // Queries — list of all active IGT layers
  const { data: layersData, isLoading } = useQuery({
    queryKey: ["igt-layers-list"],
    queryFn: () => getIgtLayers(),
    staleTime: Infinity,
  });

  // Derived Values
  const activeLayers = useMemo(() => layersData?.wfs ?? [], [layersData]);

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
              <CountBadge count={enabledCount} isFloating />
            </Box>
          </Tooltip>
        </MapOverlayContainer>
      </Popover.Trigger>

      <Popover.Content width={"300px"}>
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
            <P fontSize={"xs"} color={"fg.muted"} p={2}>
              {"Memuat layer..."}
            </P>
          ) : (
            <VStack gap={1} align={"stretch"}>
              {activeLayers.map((layer) => {
                const isEnabled = enabledLayerIds[layer.id] ?? true;
                const displayName =
                  layer.id.split(":")[1] ||
                  layer.wfsTypeName.split(":")[1] ||
                  layer.wfsTypeName;

                const isKawasan = layer.spatialBasis === "kawasan";
                const LayerIcon = isKawasan ? TreesIcon : Layers2Icon;

                return (
                  <ClickDelegateContainer
                    key={layer.id}
                    p={2}
                    rounded={"md"}
                    justify={"space-between"}
                    align={"center"}
                    _hover={{ bg: "bg.subtle" }}
                    onDelegateClick={() => toggleLayerId(layer.id)}
                  >
                    <HStack gap={2} align={"center"} flex={1}>
                      <AppIcon
                        icon={LayerIcon}
                        boxSize={4}
                        color={isEnabled ? "fg.emphasized" : "fg.muted"}
                      />

                      <VStack gap={0} align={"start"} flex={1}>
                        <P
                          fontSize={"xs"}
                          color={isEnabled ? "fg.emphasized" : "fg.muted"}
                        >
                          {displayName.replace(/_/g, " ")}
                        </P>
                        <P fontSize={"2xs"} color={"fg.muted"}>
                          {layer.wfsTypeName}
                        </P>
                      </VStack>
                    </HStack>

                    <Switch checked={isEnabled} pointerEvents={"none"} />
                  </ClickDelegateContainer>
                );
              })}
            </VStack>
          )}
        </Popover.Body>
      </Popover.Content>
    </Popover.Root>
  );
});
