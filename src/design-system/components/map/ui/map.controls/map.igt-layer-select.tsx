// src/design-system/components/map/ui/map.controls/map.igt-layer-select.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";

import { ClickDelegateContainer } from "@/design-system/components/utilities/ui/click-delegate-container";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { useQuery } from "@tanstack/react-query";
import { Layers2Icon, LayersIcon, TreesIcon } from "lucide-react";
import { memo, useMemo } from "react";

export const MapIgtLayerSelect = memo(() => {
  // Stores
  const { theme } = useThemeStore();
  const { enabledLayerIds, toggleLayerId } = useIgtLayerStore();

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
              <CountBadge count={enabledCount} floating />
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
                  layer.title ||
                  layer.id.split(":")[1] ||
                  layer.wfs.wfsTypeName;

                const isBidang = layer.spatialBasis === "bidang";
                const colorPalette = isBidang ? "blue" : "orange";
                const LayerIcon = isBidang ? Layers2Icon : TreesIcon;

                return (
                  <ClickDelegateContainer
                    key={layer.id}
                    align={"center"}
                    justify={"space-between"}
                    gap={SPACING.lg}
                    p={2}
                    colorPalette={colorPalette}
                    rounded={"md"}
                    onDelegateClick={() => toggleLayerId(layer.id)}
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
