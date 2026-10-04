// src/design-system/components/map/ui/map.symbology-panel.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";
import { Presence } from "@/design-system/components/disclosure/ui/presence";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type {
  DefaultThematicSwatchProps,
  LayerSymbologyContentProps,
  LegendRuleItemProps,
  LineSwatchProps,
  MapSymbologyPanelProps,
  PointSwatchProps,
  PolygonSwatchProps,
} from "@/design-system/components/map/types/map.symbology.type";
import { fetchLegendGraphic } from "@/design-system/components/map/utils/fetch-legend-graphic";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { useQuery } from "@tanstack/react-query";
import { EyeOffIcon, Grid2X2Icon, Layers2Icon, XIcon } from "lucide-react";
import { memo, useMemo, useState } from "react";

export const MapSymbologyPanel = memo((props: MapSymbologyPanelProps) => {
  // Props
  const { layers: propLayers } = props;

  // Stores
  const { theme } = useThemeStore();
  const enabledSymbologyLayerIds = useMapLayerStore(
    (s) => s.enabledSymbologyLayerIds,
  );
  const toggleSymbologyLayerId = useMapLayerStore(
    (s) => s.toggleSymbologyLayerId,
  );
  const setSymbologyLayerEnabled = useMapLayerStore(
    (s) => s.setSymbologyLayerEnabled,
  );

  // Queries — fetch layers if not provided via props
  const userSession = getUserSession();
  const isAuthenticated = Boolean(userSession?.id);
  const { data: layersData } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated && (!propLayers || propLayers.length === 0),
  });

  // Derived Values
  const allLayers = useMemo(() => {
    if (propLayers && propLayers.length > 0) return propLayers;
    return layersData?.items ?? [];
  }, [propLayers, layersData]);

  const activeSymbologyLayers = useMemo(() => {
    return allLayers.filter((l) => Boolean(enabledSymbologyLayerIds[l.id]));
  }, [allLayers, enabledSymbologyLayerIds]);

  const activeLayerIds = useMemo(() => {
    return activeSymbologyLayers.map((l) => l.id);
  }, [activeSymbologyLayers]);

  // States — open accordion item keys
  const [openValues, setOpenValues] = useState<string[]>(activeLayerIds);
  const [prevActiveIds, setPrevActiveIds] = useState<string[]>(activeLayerIds);

  // Synchronize open values when new layer symbology is enabled (default open)
  if (activeLayerIds !== prevActiveIds) {
    setPrevActiveIds(activeLayerIds);
    const newlyAdded = activeLayerIds.filter(
      (id) => !prevActiveIds.includes(id),
    );
    if (newlyAdded.length > 0) {
      setOpenValues((prev) => Array.from(new Set([...prev, ...newlyAdded])));
    }
  }

  // Handlers
  const handleCloseAll = () => {
    for (const layerId of activeLayerIds) {
      setSymbologyLayerEnabled(layerId, false);
    }
  };

  const isVisible = activeSymbologyLayers.length > 0;

  return (
    <Presence
      present={isVisible}
      lazyMount={true}
      unmountOnExit={true}
      animationName={{
        _open: "slide-from-bottom, fade-in",
        _closed: "slide-to-bottom, fade-out",
      }}
      animationDuration={"200ms"}
    >
      <VStack
        w={"340px"}
        maxW={"calc(100vw - 32px)"}
        maxH={"420px"}
        bg={"bg.body"}
        rounded={theme.radii.container}
        shadow={"sm"}
        overflow={"hidden"}
        pointerEvents={"auto"}
        gap={0}
      >
        {/* Header */}
        <HStack
          flexShrink={0}
          gap={"sm"}
          w={"full"}
          h={"48px"}
          px={"md"}
          pr={"xs"}
          justify={"space-between"}
          align={"center"}
          borderBottom={"1px solid"}
          borderColor={"border.subtle"}
        >
          <HStack gap={"xs"} align={"center"} minW={0} flex={1}>
            <ClampedP fontWeight={"medium"}>{"Simbologi & Legenda"}</ClampedP>

            <Badge colorPalette={"blue"} size={"xs"}>
              {`${activeSymbologyLayers.length}`}
            </Badge>
          </HStack>

          <HStack align={"center"} gap={"2xs"} flexShrink={0}>
            <Tooltip content={"Tutup Semua Simbologi"}>
              <IconButton
                size={"xs"}
                variant={"ghost"}
                aria-label={"Tutup Semua Simbologi"}
                onClick={handleCloseAll}
              >
                <AppIcon icon={XIcon} />
              </IconButton>
            </Tooltip>
          </HStack>
        </HStack>

        {/* Content Body — Multi-Open Clean Accordion */}
        <VStack w={"full"} flex={1} overflowY={"auto"} gap={0}>
          <Accordion.Root
            multiple={true}
            value={openValues}
            onValueChange={(details) => setOpenValues(details.value)}
            w={"full"}
          >
            {activeSymbologyLayers.map((layer) => {
              const displayName =
                layer.title ||
                layer.id.split(":")[1] ||
                layer.wfs?.wfsTypeName ||
                layer.id;
              const isKawasan = layer.spatialBasis === "kawasan";
              const colorPalette = isKawasan ? "orange" : "blue";
              const LayerIcon = isKawasan ? Grid2X2Icon : Layers2Icon;
              const basisLabel = isKawasan ? "Kawasan" : "Bidang";

              return (
                <Accordion.Item key={layer.id} value={layer.id}>
                  <Accordion.ItemTrigger
                    px={"md"}
                    w={"full"}
                    _hover={{
                      bg: "bg.subtle",
                    }}
                    transition={"150ms"}
                  >
                    <HStack gap={"sm"} flex={1} align={"center"} minW={0}>
                      <Center
                        p={"xs"}
                        bg={`${colorPalette}.subtle`}
                        rounded={theme.radii.component}
                        flexShrink={0}
                      >
                        <AppIcon
                          icon={LayerIcon}
                          color={`${colorPalette}.fg`}
                        />
                      </Center>

                      <VStack align={"start"} gap={0} flex={1} minW={0}>
                        <ClampedP fontWeight={"medium"} lineHeight={"tight"}>
                          {displayName.replace(/_/g, " ")}
                        </ClampedP>

                        <ClampedP fontSize={"sm"} color={"fg.subtle"}>
                          {basisLabel}
                        </ClampedP>
                      </VStack>
                    </HStack>

                    <HStack gap={"xs"} align={"center"} flexShrink={0}>
                      <Tooltip content={"Sembunyikan Simbologi"}>
                        <IconButton
                          as={"div"}
                          variant={"ghost"}
                          aria-label={"Sembunyikan Simbologi"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSymbologyLayerId(layer.id);
                          }}
                        >
                          <AppIcon icon={EyeOffIcon} />
                        </IconButton>
                      </Tooltip>

                      <Accordion.ItemIndicator />
                    </HStack>
                  </Accordion.ItemTrigger>

                  <Accordion.ItemContent>
                    <Accordion.ItemBody px={"md"}>
                      <LayerSymbologyContent layer={layer} />
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </VStack>
      </VStack>
    </Presence>
  );
});

export const LayerSymbologyContent = memo((props: LayerSymbologyContentProps) => {
  // Props
  const { layer } = props;

  // Queries — Fetch SLD / GetLegendGraphic rules from GeoServer
  const { data: rules, isLoading } = useQuery({
    queryKey: ["map", "legend-graphic", layer.id],
    queryFn: ({ signal }) => fetchLegendGraphic({ layer, signal }),
    staleTime: 1000 * 60 * 15,
  });

  if (isLoading) {
    return (
      <VStack w={"full"} py={"xs"} gap={"xs"}>
        <Skeleton h={"18px"} w={"full"} />
        <Skeleton h={"18px"} w={"75%"} />
      </VStack>
    );
  }

  // If rules exist from SLD JSON response
  if (rules && rules.length > 0) {
    return (
      <VStack w={"full"} gap={"xs"} align={"stretch"} pt={"2xs"}>
        {rules.map((rule, idx) => (
          <LegendRuleItem
            key={rule.name ?? idx}
            rule={rule}
            fallbackBasis={layer.spatialBasis}
          />
        ))}
      </VStack>
    );
  }

  // Fallback: Default Thematic Vector Swatch
  return (
    <VStack w={"full"} gap={"xs"} align={"stretch"} pt={"2xs"}>
      <DefaultThematicSwatch basis={layer.spatialBasis} />
    </VStack>
  );
});

const LegendRuleItem = memo((props: LegendRuleItemProps) => {
  // Props
  const { rule, fallbackBasis } = props;

  // Derived Values
  const ruleTitle = rule.title || rule.name || "Fitur Standar";
  const symbolizers = rule.symbolizers ?? [];

  return (
    <HStack
      w={"full"}
      justify={"space-between"}
      align={"center"}
      gap={"sm"}
      py={"2xs"}
    >
      <HStack gap={"sm"} align={"center"} flex={1} minW={0}>
        {symbolizers.map((symb, idx) => {
          if (symb.Polygon) {
            return <PolygonSwatch key={idx} polygon={symb.Polygon} />;
          }
          if (symb.Line) {
            return <LineSwatch key={idx} line={symb.Line} />;
          }
          if (symb.Point) {
            return <PointSwatch key={idx} point={symb.Point} />;
          }
          return <DefaultThematicSwatch key={idx} basis={fallbackBasis} />;
        })}
        {symbolizers.length === 0 && (
          <DefaultThematicSwatch basis={fallbackBasis} />
        )}

        <ClampedP
          fontSize={"sm"}
          color={"fg"}
          flex={1}
          wordBreak={"break-word"}
        >
          {ruleTitle}
        </ClampedP>
      </HStack>
    </HStack>
  );
});

const PolygonSwatch = memo((props: PolygonSwatchProps) => {
  // Props
  const { polygon } = props;

  // Derived Values
  const fillColor = polygon.fill ?? "#3b82f6";
  const fillOpacity = polygon["fill-opacity"]
    ? Number(polygon["fill-opacity"])
    : 0.4;
  const strokeColor = polygon.stroke ?? "#1d4ed8";
  const strokeWidth = polygon["stroke-width"]
    ? Math.min(3, Number(polygon["stroke-width"]))
    : 1.5;

  return (
    <Box
      w={"20px"}
      h={"16px"}
      rounded={"2px"}
      bg={fillColor}
      opacity={fillOpacity}
      border={`${strokeWidth}px solid ${strokeColor}`}
      flexShrink={0}
    />
  );
});

const LineSwatch = memo((props: LineSwatchProps) => {
  // Props
  const { line } = props;

  // Derived Values
  const strokeColor = line.stroke ?? "#2563eb";
  const strokeWidth = line["stroke-width"]
    ? Math.min(4, Number(line["stroke-width"]))
    : 2.5;

  return (
    <Box
      w={"20px"}
      h={`${strokeWidth}px`}
      bg={strokeColor}
      rounded={"1px"}
      flexShrink={0}
    />
  );
});

const PointSwatch = memo((props: PointSwatchProps) => {
  // Props
  const { point } = props;

  // Derived Values
  const graphicMark = point.graphics?.[0];
  const fillColor = graphicMark?.fill ?? "#2563eb";
  const strokeColor = graphicMark?.stroke ?? "#ffffff";

  return (
    <Box
      w={"14px"}
      h={"14px"}
      rounded={"full"}
      bg={fillColor}
      border={`1.5px solid ${strokeColor}`}
      flexShrink={0}
    />
  );
});

const DefaultThematicSwatch = memo((props: DefaultThematicSwatchProps) => {
  // Props
  const { basis } = props;

  // Derived Values
  const isKawasan = basis === "kawasan";
  const fillColor = isKawasan ? "orange.subtle" : "blue.subtle";
  const strokeColor = isKawasan ? "orange.emphasized" : "blue.emphasized";
  const label = isKawasan ? "Poligon Kawasan" : "Poligon Bidang Tanah";

  return (
    <HStack gap={"sm"} align={"center"}>
      <Box
        w={"20px"}
        h={"16px"}
        rounded={"2px"}
        bg={fillColor}
        border={"1.5px solid"}
        borderColor={strokeColor}
        flexShrink={0}
      />
      <ClampedP fontSize={"sm"} color={"fg"}>
        {label}
      </ClampedP>
    </HStack>
  );
});
