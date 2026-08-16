// src/design-system/components/map/ui/map.controls/map.igt-layer-select.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Loader } from "@/design-system/components/feedback/ui/loader";
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
import { ClampedP, P } from "@/design-system/components/typography/ui/p";

import { ClickDelegateContainer } from "@/design-system/components/utilities/ui/click-delegate-container";
import { PADDING, SPACING } from "@/design-system/constants/styles";
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
            <VStack gap={1} align={"stretch"}>
              {activeLayers.map((layer) => {
                const isEnabled = enabledLayerIds[layer.id] ?? true;
                const displayName =
                  layer.id.split(":")[1] ||
                  layer.wfsTypeName.split(":")[1] ||
                  layer.wfsTypeName;

                const isBidang = layer.spatialBasis === "bidang";
                const LayerIcon = isBidang ? TreesIcon : Layers2Icon;

                return (
                  <ClickDelegateContainer
                    key={layer.id}
                    align={"center"}
                    justify={"space-between"}
                    gap={SPACING.lg}
                    p={2}
                    rounded={"md"}
                    onDelegateClick={() => toggleLayerId(layer.id)}
                    _hover={{ bg: "bg.subtle" }}
                  >
                    <HStack gap={SPACING.md} align={"center"} flex={1}>
                      <AppIcon
                        icon={LayerIcon}
                        color={isEnabled ? "fg.emphasized" : "fg.muted"}
                      />

                      <VStack flex={1} align={"start"}>
                        <ClampedP
                          fontSize={"sm"}
                          color={isEnabled ? "fg.emphasized" : "fg.muted"}
                        >
                          {displayName.replace(/_/g, " ")}
                        </ClampedP>

                        <ClampedP fontSize={"xs"} color={"fg.muted"}>
                          {layer.wfsTypeName}
                        </ClampedP>
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
