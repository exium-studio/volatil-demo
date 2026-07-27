import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { VStack, HStack } from "@/design-system/components/layout/ui/flex-box";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { useBaseMapContext } from "@/design-system/components/map/contexts/base-map.context";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { Box, Text } from "@chakra-ui/react";
import { Clock, MapPin, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import type { MapSearchResultItem } from "@/design-system/components/map/types/map-search-overlay.type";

const SEARCH_QUERY_KEY = "map-search";

export const MapSearchOverlay = () => {
  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { map } = useBaseMapContext();

  // hooks
  const { queryValue } = useSearchParam(SEARCH_QUERY_KEY);
  const activeQuery = queryValue || "";

  // States
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(activeQuery);
  const [recentSearches, setRecentSearches] = useState<MapSearchResultItem[]>(
    () => {
      try {
        const stored = localStorage.getItem("map-recent-searches");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Failed to load recent searches", e);
        return [];
      }
    },
  );
  const [results, setResults] = useState<MapSearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Ref to hold blur timeout
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle location selection (flying to coordinate and saving to recents)
  function handleSelectLocation(item: MapSearchResultItem) {
    if (!map) return;

    // Fly to coordinates
    map.flyTo({
      center: [parseFloat(item.lon), parseFloat(item.lat)],
      zoom: 14,
    });

    // Update recent searches: avoid duplicate, limit to 5 items
    const updated = [
      item,
      ...recentSearches.filter((x) => x.place_id !== item.place_id),
    ].slice(0, 5);

    setRecentSearches(updated);
    try {
      localStorage.setItem("map-recent-searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save recent searches", e);
    }

    // Blur search input and close lists
    setIsFocused(false);
  }

  // Handle removing a recent search item
  function handleRemoveRecent(placeId: number | string, e: React.MouseEvent) {
    e.stopPropagation();
    const updated = recentSearches.filter((x) => x.place_id !== placeId);
    setRecentSearches(updated);
    try {
      localStorage.setItem("map-recent-searches", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to update recent searches", err);
    }
  }

  // Input Focus/Blur Handlers
  function handleFocus() {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    setIsFocused(true);
  }
  function handleBlur() {
    // Small delay to allow click events inside the dropdown list to register first
    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
    }, 200);
  }

  // Sync debounced query value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(activeQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [activeQuery]);

  // Fetch location data from Nominatim API
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      const timer = setTimeout(() => {
        setResults([]);
        setIsLoading(false);
        setIsError(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    let active = true;
    const fetchLocations = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedQuery,
          )}&format=json&limit=5`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch geocoding data");
        }
        const data = await response.json();
        if (active) {
          setResults(data);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setIsError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  // Determine which list to display
  const showRecent = isFocused && !activeQuery.trim();
  const showResults = isFocused && !!activeQuery.trim();

  return (
    <VStack
      w={"320px"}
      align={"stretch"}
      gap={2}
      pointerEvents={"auto"}
      position={"relative"}
    >
      {/* Search Input Container */}
      <MapOverlayContainer overflow={"hidden"} bg={"bg.body"}>
        <SearchInput
          queryKey={SEARCH_QUERY_KEY}
          placeholder={"Cari lokasi..."}
          w={"full"}
          color={"fg"}
          bg={"transparent"}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </MapOverlayContainer>

      {/* Floating Results/Recents Container */}
      {(showRecent || showResults) && (
        <Box
          position={"absolute"}
          top={"100%"}
          left={0}
          right={0}
          mt={2}
          bg={"bg.panel"}
          rounded={theme.radii.component}
          shadow={"lg"}
          border={"1px solid"}
          borderColor={"border.emphasized"}
          backdropFilter={"blur(20px)"}
          maxH={"300px"}
          overflowY={"auto"}
          zIndex={2000}
        >
          {/* Recent Searches List */}
          {showRecent && (
            <VStack align={"stretch"} gap={0} py={2}>
              <Box px={3} py={1}>
                <Text fontSize={"xs"} fontWeight={"bold"} color={"fg.muted"}>
                  Pencarian Terakhir
                </Text>
              </Box>

              {recentSearches.length === 0 ? (
                <Box px={3} py={3}>
                  <Text fontSize={"sm"} color={"fg.muted"}>
                    Belum ada riwayat pencarian
                  </Text>
                </Box>
              ) : (
                recentSearches.map((item) => (
                  <Button
                    key={item.place_id}
                    variant={"ghost"}
                    w={"full"}
                    py={2}
                    px={3}
                    h={"auto"}
                    rounded={"none"}
                    onClick={() => handleSelectLocation(item)}
                    _hover={{ bg: "bg.muted" }}
                    justifyContent={"space-between"}
                  >
                    <HStack gap={2} flex={1} overflow={"hidden"}>
                      <AppIcon icon={Clock} size={"xs"} color={"fg.muted"} />
                      <Text
                        fontSize={"sm"}
                        truncate={true}
                        fontWeight={"normal"}
                      >
                        {item.display_name}
                      </Text>
                    </HStack>

                    <Button
                      as={"span"}
                      size={"xs"}
                      variant={"ghost"}
                      p={1}
                      onClick={(e) => handleRemoveRecent(item.place_id, e)}
                      _hover={{ bg: "bg.emphasized" }}
                    >
                      <AppIcon icon={X} size={"xs"} />
                    </Button>
                  </Button>
                ))
              )}
            </VStack>
          )}

          {/* Search Results List */}
          {showResults && (
            <VStack align={"stretch"} gap={0} py={2}>
              {isLoading && (
                <HStack justify={"center"} py={4} gap={2}>
                  <Loader />

                  <Text fontSize={"sm"} color={"fg.muted"}>
                    Mencari lokasi...
                  </Text>
                </HStack>
              )}

              {isError && (
                <Box px={3} py={3}>
                  <Text fontSize={"sm"} color={"red.fg"}>
                    Gagal mengambil data lokasi.
                  </Text>
                </Box>
              )}

              {!isLoading && !isError && results.length === 0 && (
                <Box px={3} py={3}>
                  <Text fontSize={"sm"} color={"fg.muted"}>
                    Lokasi tidak ditemukan
                  </Text>
                </Box>
              )}

              {!isLoading &&
                !isError &&
                results.map((item) => (
                  <Button
                    key={item.place_id}
                    variant={"ghost"}
                    w={"full"}
                    py={2}
                    px={3}
                    h={"auto"}
                    rounded={"none"}
                    onClick={() => handleSelectLocation(item)}
                    _hover={{ bg: "bg.muted" }}
                    justifyContent={"flex-start"}
                  >
                    <HStack gap={2} overflow={"hidden"} w={"full"}>
                      <AppIcon icon={MapPin} size={"xs"} color={"fg.muted"} />
                      <Text
                        fontSize={"sm"}
                        truncate={true}
                        fontWeight={"normal"}
                      >
                        {item.display_name}
                      </Text>
                    </HStack>
                  </Button>
                ))}
            </VStack>
          )}
        </Box>
      )}
    </VStack>
  );
};
