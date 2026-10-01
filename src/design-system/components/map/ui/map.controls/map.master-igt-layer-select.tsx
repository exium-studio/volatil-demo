import { IconButton } from "@/design-system/components/button/ui/button";
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
import type { MapMasterIgtLayerItemProps } from "@/design-system/components/map/types/map.master-igt-layer-select.type";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { IgtBasisType } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isEmptyArray } from "@/shared/utils/data/array";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { useQuery } from "@tanstack/react-query";
import { BlendIcon, FlagIcon, FocusIcon, LayersIcon } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

export const MapMasterIgtLayerSelect = memo(() => {
  // Stores
  const {
    enabledLayerIds,
    enabledSymbologyLayerIds,
    layerOpacities,
    globalOpacity,
    setGlobalOpacity,
    toggleLayerId,
    toggleSymbologyLayerId,
    setLayerOpacity,
    setAllLayersEnabled,
  } = useMapLayerStore();

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

  // Derived Values
  const activeLayers = useMemo(() => layersData?.items ?? [], [layersData]);

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

      <Popover.Content w={"full"} maxW={"380px"}>
        <Popover.Header
          p={3}
          borderBottom={"1px solid"}
          borderColor={"border"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <HStack justify={"space-between"} gap={"md"} w={"full"}>
            <P fontWeight={"medium"}>{"Manajemen Layer & Simbologi"}</P>

            <Badge colorPalette={"blue"}>{`${enabledCount} aktif`}</Badge>
          </HStack>
        </Popover.Header>

        <Popover.Body p={2} maxH={"500px"} overflowY={"auto"}>
          {isLoading ? (
            <HStack align={"center"} justify={"center"} gap={"md"} p={"md"}>
              <Loader />

              <P color={"fg.muted"}>{"Memuat master layer..."}</P>
            </HStack>
          ) : isError ? (
            <Center p={"md"}>
              <RetryState
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
            <VStack gap={"xs"} align={"stretch"}>
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
                          {"Opasitas Semua Layer IGT"}
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

              {isEmptyArray(activeLayers) && (
                <HStack align={"center"} justify={"center"} p={"md"}>
                  <P color={"fg.muted"} fontSize={"sm"}>
                    {"Tidak ada data layer IGT yang tersedia"}
                  </P>
                </HStack>
              )}

              <VStack gap={"2xs"} align={"stretch"}>
                {activeLayers.map((layer) => {
                  const isEnabled = Boolean(enabledLayerIds[layer.id]);
                  const isSymbologyEnabled = Boolean(
                    enabledSymbologyLayerIds[layer.id],
                  );
                  const opacity = layerOpacities[layer.id] ?? 1.0;

                  return (
                    <MapMasterIgtLayerItem
                      key={layer.id}
                      layer={layer}
                      isEnabled={isEnabled}
                      isSymbologyEnabled={isSymbologyEnabled}
                      opacity={opacity}
                      onToggle={toggleLayerId}
                      onToggleSymbology={toggleSymbologyLayerId}
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

const MapMasterIgtLayerItem = memo((props: MapMasterIgtLayerItemProps) => {
  // Props
  const {
    layer,
    isEnabled,
    isSymbologyEnabled,
    opacity,
    onToggle,
    onToggleSymbology,
    onOpacityChange,
  } = props;

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

  // Derived Values
  const displayName =
    layer.title || layer.id.split(":")[1] || layer.wfs.wfsTypeName;
  const normalizedBasis = (
    layer.spatialBasis ? layer.spatialBasis.toLowerCase() : ""
  ) as IgtBasisType;
  const basisConfig =
    IGT_BASIS_MAP[normalizedBasis] ?? IGT_BASIS_MAP[layer.spatialBasis];
  const colorPalette = basisConfig?.colorPalette ?? "gray";
  const LayerIcon = basisConfig?.icon ?? LayersIcon;
  const basisLabel = basisConfig?.label ?? layer.spatialBasis ?? "Layer IGT";

  return (
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
      w={"full"}
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
          <ClampedP color={isEnabled ? `fg` : "fg.subtle"}>
            {displayName.replace(/_/g, " ")}
          </ClampedP>

          <ClampedP fontSize={"sm"} color={"fg.subtle"}>
            {basisLabel}
          </ClampedP>
        </VStack>
      </HStack>

      <HStack gap={"xs"} align={"center"} flexShrink={0}>
        <Switch
          size={"sm"}
          checked={isEnabled}
          pointerEvents={"none"}
          mr={"xs"}
        />

        <Tooltip
          content={
            isSymbologyEnabled ? "Sembunyikan Simbologi" : "Tampilkan Simbologi"
          }
        >
          <IconButton
            size={"xs"}
            variant={"ghost"}
            colorPalette={isSymbologyEnabled ? "blue" : undefined}
            aria-label={"Simbologi"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSymbology?.(layer.id);
            }}
          >
            <AppIcon
              icon={FlagIcon}
              fill={isSymbologyEnabled ? "blue.fg" : ""}
            />
          </IconButton>
        </Tooltip>

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
                <AppIcon icon={BlendIcon} />
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
                  onOpacityChange(layer.id, details.value[0] / 100)
                }
              />
            </VStack>
          </Popover.Content>
        </Popover.Root>
      </HStack>
    </HStack>
  );
});
