// src/design-system/components/map/ui/map.controls/map.my-data-layer-select.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Slider } from "@/design-system/components/input/ui/slider";
import { Switch } from "@/design-system/components/input/ui/switch";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type { MapMyDataLayerItemProps } from "@/design-system/components/map/types/map.my-data-layer-select.type";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { useMitraMyDataQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type { MyDataItem } from "@/features/mitra/my-data/types/my-data.type";
import type { IgtBasisType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DatabaseIcon,
  FocusIcon,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";

export const MapMyDataLayerSelect = memo(() => {
  // Stores
  const {
    enabledLayerIds,
    layerOpacities,
    globalOpacity,
    setGlobalOpacity,
    setLayerEnabled,
    setCustomLayerConfig,
    setLayerOpacity,
  } = useMapLayerStore();

  // Queries — Fetch active data saya
  const { myData, isLoading, isError, error, refetch } = useMitraMyDataQuery({
    page: 1,
    pageSize: 100,
    status: "ready",
  });

  // Derived Values — Filter only valid active items
  const activeItems = useMemo(() => myData?.items ?? [], [myData]);

  const enabledCount = useMemo(() => {
    return activeItems.filter((item) => Boolean(enabledLayerIds[item.id]))
      .length;
  }, [activeItems, enabledLayerIds]);

  const isAllEnabled = useMemo(() => {
    return activeItems.length > 0 && enabledCount === activeItems.length;
  }, [activeItems.length, enabledCount]);

  // Handlers
  const handleToggleItem = useCallback(
    (item: MyDataItem) => {
      const isCurrentlyEnabled = Boolean(enabledLayerIds[item.id]);
      if (isCurrentlyEnabled) {
        setLayerEnabled(item.id, false);
        setCustomLayerConfig(item.id, null);
      } else {
        setCustomLayerConfig(item.id, {
          wmsUrl: item.externalWmsUrl || item.wmsUrl,
          layers: item.wmsLayers || item.id,
          spatialBasis: item.spatialBasis,
        });
        setLayerEnabled(item.id, true);
      }
    },
    [enabledLayerIds, setCustomLayerConfig, setLayerEnabled],
  );

  const handleToggleAll = useCallback(
    (checked: boolean) => {
      activeItems.forEach((item) => {
        if (checked) {
          setCustomLayerConfig(item.id, {
            wmsUrl: item.externalWmsUrl || item.wmsUrl,
            layers: item.wmsLayers || item.id,
            spatialBasis: item.spatialBasis,
          });
          setLayerEnabled(item.id, true);
        } else {
          setLayerEnabled(item.id, false);
          setCustomLayerConfig(item.id, null);
        }
      });
    },
    [activeItems, setCustomLayerConfig, setLayerEnabled],
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
            content={"Layer Data Saya"}
            positioning={{ placement: "bottom" }}
          >
            <Box position={"relative"}>
              <IconButton size={"xs"}>
                <AppIcon icon={DatabaseIcon} boxSize={5} />
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
            <P fontWeight={"medium"}>{"Toggle Layer Data Saya"}</P>

            <Badge colorPalette={"blue"}>{`${enabledCount} aktif`}</Badge>
          </HStack>
        </Popover.Header>

        <Popover.Body p={2} maxH={"500px"} overflowY={"auto"}>
          {isLoading ? (
            <HStack align={"center"} justify={"center"} gap={"md"} p={"md"}>
              <Loader />

              <P color={"fg.muted"}>{"Memuat data saya..."}</P>
            </HStack>
          ) : isError ? (
            <Center p={"md"}>
              <RetryState
                title={"Gagal Memuat Data Saya"}
                description={
                  error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat memuat data layer Anda."
                }
                onRetry={() => {
                  void refetch();
                }}
              />
            </Center>
          ) : (
            <VStack gap={"xs"} align={"stretch"}>
              {!isEmptyArray(activeItems) && (
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
                          {"Opasitas Semua Layer Data Saya"}
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

                  <Separator />
                </>
              )}

              {isEmptyArray(activeItems) && (
                <HStack align={"center"} justify={"center"} p={"md"}>
                  <P color={"fg.muted"} fontSize={"sm"}>
                    {"Tidak ada data layer aktif yang tersedia"}
                  </P>
                </HStack>
              )}

              <VStack gap={"2xs"} align={"stretch"}>
                {activeItems.map((item) => {
                  const isEnabled = Boolean(enabledLayerIds[item.id]);
                  const opacity = layerOpacities[item.id] ?? 1.0;

                  return (
                    <MapMyDataLayerItem
                      key={item.id}
                      item={item}
                      isEnabled={isEnabled}
                      opacity={opacity}
                      onToggle={handleToggleItem}
                      onOpacityChange={setLayerOpacity}
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

const MapMyDataLayerItem = memo((props: MapMyDataLayerItemProps) => {
  // Props
  const { item, isEnabled, opacity, onToggle, onOpacityChange } = props;

  // Stores
  const { theme } = useThemeStore();
  const { flyTo } = useFlyToLayer();

  // Handlers
  const handleToggle = () => {
    onToggle(item);
  };

  const handleFlyTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    void flyTo({
      id: item.id,
      title: item.title,
      spatialBasis: item.spatialBasis,
      bbox: item.bbox,
      wfs: {
        wfsTypeName: item.wfsTypeName || item.id,
        wfsUrl: item.externalWfsUrl || item.wfsUrl,
      },
    });
  };

  // States
  const [isOpacityOpen, setIsOpacityOpen] = useState<boolean>(false);

  // Derived Values
  const displayName = item.label || item.title || item.id.replace(/_/g, " ");
  const normalizedBasis = (
    item.spatialBasis ? item.spatialBasis.toLowerCase() : ""
  ) as IgtBasisType;
  const basisConfig =
    IGT_BASIS_MAP[normalizedBasis] ?? IGT_BASIS_MAP[item.spatialBasis];
  const colorPalette = basisConfig?.colorPalette ?? "gray";
  const LayerIcon = basisConfig?.icon ?? DatabaseIcon;
  const basisLabel = basisConfig?.label ?? item.spatialBasis ?? "Layer IGT";

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
        <HStack gap={"md"} align={"center"} flex={1} minW={0}>
          <Center
            p={"xs"}
            bg={isEnabled ? `${colorPalette}.subtle` : "bg.muted"}
            rounded={theme.radii.component}
            flexShrink={0}
          >
            <AppIcon
              icon={LayerIcon}
              color={isEnabled ? `${colorPalette}.fg` : "fg.subtle"}
            />
          </Center>

          <VStack flex={1} align={"start"} minW={0}>
            <ClampedP color={isEnabled ? "fg" : "fg.subtle"}>
              {displayName}
            </ClampedP>

            <HStack gap={1} align={"center"}>
              <ClampedP fontSize={"xs"} color={"fg.subtle"}>
                {basisLabel}
              </ClampedP>
              {item.label && (
                <ClampedP fontSize={"xs"} color={"fg.muted"}>
                  {`• ${item.title}`}
                </ClampedP>
              )}
            </HStack>
          </VStack>
        </HStack>

        <HStack gap={"xs"} align={"center"} flexShrink={0}>
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
                onOpacityChange(item.id, details.value[0] / 100)
              }
            />
          </VStack>
        </Collapsible.Content>
      </Collapsible.Root>
    </VStack>
  );
});
