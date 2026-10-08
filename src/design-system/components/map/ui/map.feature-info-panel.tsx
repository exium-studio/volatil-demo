// src/design-system/components/map/ui/map.feature-info-panel.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Presence } from "@/design-system/components/disclosure/ui/presence";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { Center } from "@/design-system/components/layout/ui/center";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapFeatureInfoStore } from "@/design-system/components/map/stores/map.feature-info.store";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type { MapFeatureInfoItem } from "@/design-system/components/map/types/map.feature-info.type";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { toast } from "@/design-system/components/toast";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { isEmptyArray } from "@/shared/utils/data/array";
import * as turf from "@turf/turf";
import { FocusIcon, Grid2X2Icon, Layers2Icon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

export const MapFeatureInfoPanel = () => {
  // Stores
  const { theme } = useThemeStore();
  const map = useMapInstanceStore((s) => s.map);
  const selectedFeature = useMapFeatureInfoStore((s) => s.selectedFeature);
  const isLoading = useMapFeatureInfoStore((s) => s.isLoading);
  const clearFeatureInfo = useMapFeatureInfoStore((s) => s.clearFeatureInfo);

  // States
  const [prevFeature, setPrevFeature] = useState<MapFeatureInfoItem | null>(
    selectedFeature,
  );
  const [cachedFeature, setCachedFeature] = useState<MapFeatureInfoItem | null>(
    selectedFeature,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Adjust state during render when selectedFeature changes (React standard pattern)
  if (selectedFeature !== prevFeature) {
    setPrevFeature(selectedFeature);
    if (selectedFeature !== null) {
      setCachedFeature(selectedFeature);
    }
  }

  // Derived Values
  const isOpen = Boolean(selectedFeature || isLoading);
  const displayFeature = selectedFeature ?? cachedFeature;
  const normalizedBasis = (
    displayFeature?.spatialBasis ??
    displayFeature?.basis ??
    ""
  )
    .toString()
    .toLowerCase();
  const isKawasan = normalizedBasis === "kawasan";
  const isBidang = normalizedBasis === "bidang";
  const colorPalette = isKawasan ? "orange" : isBidang ? "blue" : "gray";
  const LayerIcon = isKawasan ? Grid2X2Icon : Layers2Icon;
  const basisLabel = isKawasan
    ? "Kawasan"
    : isBidang
      ? "Bidang"
      : (displayFeature?.spatialBasis ?? displayFeature?.basis ?? "Layer IGT");

  const properties = useMemo(
    () => displayFeature?.properties ?? {},
    [displayFeature],
  );

  const allEntries = useMemo(() => {
    return Object.entries(properties).filter(
      ([key]) =>
        key !== "geom" &&
        key !== "the_geom" &&
        key !== "geometry" &&
        key !== "bbox",
    );
  }, [properties]);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return allEntries;
    const q = searchQuery.toLowerCase();
    return allEntries.filter(
      ([k, v]) =>
        k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q),
    );
  }, [allEntries, searchQuery]);

  // Handlers
  const handleExitComplete = () => {
    setCachedFeature(null);
    setSearchQuery("");
  };

  const handleZoomToFeature = () => {
    const geom = selectedFeature?.geometry ?? displayFeature?.geometry;
    if (!map || !geom) return;
    try {
      const bbox = turf.bbox({
        type: "Feature",
        properties: {},
        geometry: geom,
      });
      map.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        {
          padding: 80,
          maxZoom: 18,
          duration: 1000,
        },
      );
    } catch {
      toast.error("Gagal melakukan zoom ke fitur.");
    }
  };

  return (
    <Presence
      present={isOpen}
      onExitComplete={handleExitComplete}
      lazyMount={true}
      unmountOnExit={true}
      animationName={{
        _open: "slide-from-top, fade-in",
        _closed: "slide-to-top, fade-out",
      }}
      animationDuration={"200ms"}
    >
      <VStack
        w={"340px"}
        maxW={"calc(100vw - 32px)"}
        maxH={"460px"}
        bg={"bg.body"}
        border={"1px solid"}
        borderColor={"border.subtle"}
        rounded={theme.radii.container}
        shadow={"md"}
        overflow={"hidden"}
        pointerEvents={"auto"}
        gap={0}
      >
        {/* Header */}
        <HeaderContainer pr={"sm"}>
          <P fontWeight={"medium"}>{"Properties"}</P>

          <Tooltip content={"Tutup"}>
            <IconButton
              size={"sm"}
              aria-label={"Tutup"}
              onClick={clearFeatureInfo}
            >
              <AppIcon icon={XIcon} />
            </IconButton>
          </Tooltip>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <HStack
          flexShrink={0}
          align={"center"}
          justify={"space-between"}
          gap={"md"}
          w={"full"}
          h={"auto"}
          minH={"48px"}
          p={"sm"}
          borderBottom={"1px solid"}
          borderColor={"bg.canvas"}
        >
          <HStack gap={"md"} align={"center"} flex={1} minW={0}>
            <Center
              p={"xs"}
              bg={`${colorPalette}.subtle`}
              rounded={theme.radii.component}
              flexShrink={0}
            >
              <AppIcon icon={LayerIcon} color={`${colorPalette}.fg`} />
            </Center>

            <VStack flex={1} align={"start"}>
              <ClampedP fontWeight={"medium"} lineHeight={"tight"}>
                {displayFeature?.title ??
                  displayFeature?.layerTitle ??
                  "Informasi Fitur"}
              </ClampedP>

              <ClampedP fontSize={"sm"} color={"fg.subtle"}>
                {basisLabel}
              </ClampedP>
            </VStack>
          </HStack>

          <HStack align={"center"} gap={"2xs"} flexShrink={0}>
            {(selectedFeature?.geometry || displayFeature?.geometry) && (
              <Tooltip content={"Zoom ke Fitur"}>
                <IconButton
                  size={"sm"}
                  aria-label={"Zoom ke Fitur"}
                  onClick={handleZoomToFeature}
                >
                  <AppIcon icon={FocusIcon} />
                </IconButton>
              </Tooltip>
            )}
          </HStack>
        </HStack>

        {/* Content */}
        {isLoading && !displayFeature && (
          <VStack w={"full"} p={"md"} gap={"sm"}>
            <Skeleton h={"28px"} w={"full"} />
            <Skeleton h={"18px"} w={"75%"} />
            <Skeleton h={"18px"} w={"60%"} />
            <Skeleton h={"18px"} w={"90%"} />
          </VStack>
        )}

        {(!isLoading || Boolean(displayFeature)) &&
          isEmptyArray(allEntries) && (
            <VStack w={"full"} p={"lg"} align={"center"} justify={"center"}>
              <NoDataState description={"Tidak ada atribut fitur"} />
            </VStack>
          )}

        {(!isLoading || Boolean(displayFeature)) &&
          !isEmptyArray(allEntries) && (
            <VStack w={"full"} flex={1} gap={0} overflowY={"auto"}>
              {allEntries.length > 5 && (
                <Box p={"sm"} w={"full"}>
                  <SearchInput
                    placeholder={"Cari atribut..."}
                    value={searchQuery}
                    onValueChange={(val) => setSearchQuery(val)}
                    w={"full"}
                  />
                </Box>
              )}

              <VStack w={"full"} flex={1} p={"sm"} gap={"xs"}>
                {isEmptyArray(filteredEntries) && (
                  <VStack
                    w={"full"}
                    py={"md"}
                    align={"center"}
                    justify={"center"}
                  >
                    <NoResultState query={searchQuery || "..."} />
                  </VStack>
                )}

                {!isEmptyArray(filteredEntries) &&
                  filteredEntries.map(([key, value], idx) => {
                    const stringVal =
                      value === null || value === undefined
                        ? "-"
                        : typeof value === "object"
                          ? JSON.stringify(value)
                          : String(value);

                    return (
                      <VStack key={key} w={"full"} gap={"xs"}>
                        {idx > 0 && <Separator borderColor={"border.subtle"} />}
                        <HStack
                          w={"full"}
                          justify={"space-between"}
                          align={"start"}
                          gap={"sm"}
                          py={"2xs"}
                        >
                          <P
                            fontSize={"sm"}
                            color={"fg.muted"}
                            w={"40%"}
                            wordBreak={"break-word"}
                          >
                            {key}
                          </P>

                          <P
                            fontWeight={"medium"}
                            w={"60%"}
                            textAlign={"right"}
                            wordBreak={"break-word"}
                          >
                            {stringVal}
                          </P>
                        </HStack>
                      </VStack>
                    );
                  })}
              </VStack>
            </VStack>
          )}
      </VStack>
    </Presence>
  );
};
