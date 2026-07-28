// src/design-system/components/map/ui/map.search.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import FeedbackState from "@/design-system/components/feedback/ui/feedback-state";
import { Loader } from "@/design-system/components/feedback/ui/loader";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { useBaseMapContext } from "@/design-system/components/map/contexts/map.basemap.context";
import type { MapSearchResultItem } from "@/design-system/components/map/types/map.search.type";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { useSearchParam } from "@/design-system/hooks/use-search-param";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { t } from "@/shared/libs/i18n";
import { isEmptyArray } from "@/shared/utils/data/array";
import { Box } from "@chakra-ui/react";
import { Clock, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SEARCH_QUERY_KEY = "map-search";

export const MapSearch = () => {
  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { map } = useBaseMapContext();

  // hooks
  const { queryValue, setQueryValue } = useSearchParam(SEARCH_QUERY_KEY);
  const activeQuery = queryValue || "";

  // States
  const [inputValue, setInputValue] = useState<string>(activeQuery);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(activeQuery);
  const [prevActiveQuery, setPrevActiveQuery] = useState<string>(activeQuery);

  // Sync state if activeQuery changes externally (e.g. navigation)
  if (activeQuery !== prevActiveQuery) {
    setInputValue(activeQuery);
    setDebouncedQuery(activeQuery);
    setPrevActiveQuery(activeQuery);
  }
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
      setDebouncedQuery(inputValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Sync debounced query value to URL
  useEffect(() => {
    setQueryValue(debouncedQuery || undefined);
  }, [debouncedQuery, setQueryValue]);

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
  const hasInput = !!inputValue.trim();
  const isOpened = isFocused || hasInput;
  const showRecent = isFocused && !hasInput;
  const showResults = isFocused && hasInput;

  return (
    <VStack gap={2} w={"300px"} pointerEvents={"auto"} position={"relative"}>
      {/* Search Input Container */}
      <MapOverlayContainer
        overflow={"clip"}
        w={isOpened ? "full" : "36px"}
        bg={isOpened ? "bg.body" : "darkAlpha.700"}
        transition={"200ms"}
      >
        <SearchInput
          value={inputValue}
          onValueChange={setInputValue}
          size={"sm"}
          placeholder={t["common.search_location"]()}
          w={"full"}
          border={"none"}
          color={isOpened ? "fg" : "white"}
          bg={"transparent"}
          onFocus={handleFocus}
          onBlur={handleBlur}
          appIconProps={{
            color: isOpened ? "fg" : "white",
          }}
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
          bg={"bg.body"}
          rounded={theme.radii.container}
          shadow={"lg"}
          border={"1px solid"}
          borderColor={"border.emphasized"}
          maxH={"360px"}
          overflowY={"auto"}
          zIndex={2000}
        >
          {/* Recent Searches List */}
          {showRecent && (
            <VStack align={"stretch"}>
              {isEmptyArray(recentSearches) ? (
                <Box p={2}>
                  <FeedbackState
                    title={t["common.type_to_find"]()}
                    description={t[
                      "common.search_results_and_recent_appear_here"
                    ]()}
                  />
                </Box>
              ) : (
                <>
                  <Box px={3} py={2}>
                    <P fontSize={"sm"} fontWeight={"medium"} color={"fg.muted"}>
                      {t["common.recent"]()}
                    </P>
                  </Box>

                  <Box px={1} pb={1}>
                    {recentSearches.map((item) => (
                      <Button
                        key={item.place_id}
                        variant={"ghost"}
                        w={"full"}
                        p={2}
                        pr={"2px"}
                        onClick={() => handleSelectLocation(item)}
                        justifyContent={"space-between"}
                      >
                        <HStack
                          align={"center"}
                          gap={2}
                          flex={1}
                          overflow={"hidden"}
                        >
                          <AppIcon icon={Clock} color={"fg.muted"} />

                          <ClampedP textAlign={"start"}>
                            {item.display_name}
                          </ClampedP>
                        </HStack>

                        <IconButton
                          as={"span"}
                          size={"sm"}
                          onClick={(e) => handleRemoveRecent(item.place_id, e)}
                        >
                          <AppIcon icon={X} />
                        </IconButton>
                      </Button>
                    ))}
                  </Box>
                </>
              )}
            </VStack>
          )}

          {/* Search Results List */}
          {showResults && (
            <VStack align={"stretch"} gap={0} py={1}>
              {isLoading && (
                <HStack align={"center"} justify={"center"} py={4} gap={4}>
                  <Loader />

                  <P color={"fg.muted"}>{t["common.searching"]()}</P>
                </HStack>
              )}

              {isError && (
                <Box px={3} py={3}>
                  <P color={"fg.error"}>{t["common.error"]()}</P>
                </Box>
              )}

              {!isLoading && !isError && results.length === 0 && (
                <Box px={3} py={3}>
                  <NoResultState query={debouncedQuery} />
                </Box>
              )}

              {!isLoading && !isError && (
                <Box px={1}>
                  {results.map((item) => (
                    <Button
                      key={item.place_id}
                      variant={"ghost"}
                      w={"full"}
                      p={2}
                      onClick={() => handleSelectLocation(item)}
                      _hover={{ bg: "bg.muted" }}
                      justifyContent={"flex-start"}
                    >
                      <HStack gap={2} overflow={"hidden"} w={"full"}>
                        <AppIcon icon={MapPin} color={"fg.muted"} />

                        <ClampedP textAlign={"start"}>
                          {item.display_name}
                        </ClampedP>
                      </HStack>
                    </Button>
                  ))}
                </Box>
              )}
            </VStack>
          )}
        </Box>
      )}
    </VStack>
  );
};
