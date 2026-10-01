// src/design-system/components/map/ui/map.feature-info-panel.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { Presence } from "@/design-system/components/disclosure/ui/presence";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapFeatureInfoStore } from "@/design-system/components/map/stores/map.feature-info.store";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { toast } from "@/design-system/components/toast";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import * as turf from "@turf/turf";
import { FocusIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

export const MapFeatureInfoPanel = () => {
  // Stores
  const { theme } = useThemeStore();
  const map = useMapInstanceStore((s) => s.map);
  const selectedFeature = useMapFeatureInfoStore((s) => s.selectedFeature);
  const isLoading = useMapFeatureInfoStore((s) => s.isLoading);
  const clearFeatureInfo = useMapFeatureInfoStore((s) => s.clearFeatureInfo);

  // States
  const [searchQuery, setSearchQuery] = useState("");

  // Derived Values
  const isOpen = Boolean(selectedFeature || isLoading);
  const properties = useMemo(
    () => selectedFeature?.properties ?? {},
    [selectedFeature],
  );

  const filteredEntries = useMemo(() => {
    const entries = Object.entries(properties);
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter(
      ([k, v]) =>
        k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q),
    );
  }, [properties, searchQuery]);

  // Handlers
  const handleZoomToFeature = () => {
    if (!map || !selectedFeature?.geometry) return;
    try {
      const bbox = turf.bbox({
        type: "Feature",
        properties: {},
        geometry: selectedFeature.geometry,
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
        <HStack
          flexShrink={0}
          w={"full"}
          h={"48px"}
          px={"md"}
          pr={"xs"}
          justify={"space-between"}
          align={"center"}
          borderBottom={"1px solid"}
          borderColor={"border.subtle"}
        >
          <HStack gap={"xs"} minW={0} flex={1}>
            <ClampedP
              fontWeight={"semibold"}
              fontSize={"sm"}
              lineHeight={"tight"}
            >
              {selectedFeature?.layerTitle ?? "Informasi Fitur"}
            </ClampedP>
          </HStack>

          <HStack align={"center"} gap={"2xs"} flexShrink={0}>
            {selectedFeature?.geometry && (
              <Tooltip content={"Zoom ke Fitur"}>
                <IconButton
                  size={"sm"}
                  variant={"ghost"}
                  aria-label={"Zoom ke Fitur"}
                  onClick={handleZoomToFeature}
                >
                  <AppIcon icon={FocusIcon} />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip content={"Tutup"}>
              <IconButton
                size={"xs"}
                variant={"ghost"}
                aria-label={"Tutup"}
                onClick={clearFeatureInfo}
              >
                <AppIcon icon={XIcon} />
              </IconButton>
            </Tooltip>
          </HStack>
        </HStack>

        {/* Content */}
        {isLoading ? (
          <VStack w={"full"} p={"md"} gap={"sm"}>
            <Skeleton h={"28px"} w={"full"} />
            <Skeleton h={"18px"} w={"75%"} />
            <Skeleton h={"18px"} w={"60%"} />
            <Skeleton h={"18px"} w={"90%"} />
          </VStack>
        ) : filteredEntries.length === 0 ? (
          <VStack w={"full"} p={"lg"} align={"center"} justify={"center"}>
            <P fontSize={"sm"} color={"fg.muted"}>
              {"Tidak ada atribut fitur"}
            </P>
          </VStack>
        ) : (
          <VStack w={"full"} flex={1} gap={0} overflowY={"auto"}>
            {Object.keys(properties).length > 5 && (
              <Box
                p={"xs"}
                w={"full"}
                // borderBottom={"1px solid"}
                borderColor={"border.subtle"}
              >
                <SearchInput
                  placeholder={"Cari atribut..."}
                  value={searchQuery}
                  onValueChange={(val) => setSearchQuery(val)}
                  w={"full"}
                />
              </Box>
            )}

            <VStack w={"full"} flex={1} p={"sm"} gap={"xs"}>
              {filteredEntries.map(([key, value], idx) => {
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
