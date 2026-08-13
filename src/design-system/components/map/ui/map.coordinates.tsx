// src/design-system/components/map/ui/map.coordinates.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { Box } from "@chakra-ui/react";
import type maplibregl from "maplibre-gl";
import { useEffect, useState } from "react";

export const MapCoordinates = () => {
  // Stores
  const map = useMapInstanceStore((state) => state.map);

  // States
  const [coords, setCoords] = useState<{ lat: string; lon: string }>(() => ({
    lat: "0.00000",
    lon: "0.00000",
  }));

  // Hooks
  useEffect(() => {
    if (!map) return;
    const mapInstance = map;

    function handleMouseMove(e: maplibregl.MapMouseEvent) {
      if (e.lngLat) {
        setCoords({
          lat: e.lngLat.lat.toFixed(5),
          lon: e.lngLat.lng.toFixed(5),
        });
      }
    }

    function handleMove() {
      const center = mapInstance.getCenter();
      setCoords({
        lat: center.lat.toFixed(5),
        lon: center.lng.toFixed(5),
      });
    }

    // Set initial coordinates
    handleMove();

    mapInstance.on("mousemove", handleMouseMove);
    mapInstance.on("move", handleMove);

    return () => {
      mapInstance.off("mousemove", handleMouseMove);
      mapInstance.off("move", handleMove);
    };
  }, [map]);

  return (
    <Box
      position={"absolute"}
      right={2}
      top={"56%"}
      transform={"translateY(-50%) rotate(90deg)"}
      transformOrigin={"right center"}
      pointerEvents={"none"}
      zIndex={1000}
    >
      <HStack gap={2}>
        <P
          fontSize={"2xs"}
          fontWeight={"bold"}
          color={"fg.muted"}
          letterSpacing={"wider"}
        >
          <TNum>{coords.lat}°</TNum>
        </P>

        <Box w={"1px"} h={"10px"} bg={"border.emphasized"} />

        <P
          fontSize={"2xs"}
          fontWeight={"bold"}
          color={"fg.muted"}
          letterSpacing={"wider"}
        >
          <TNum>{coords.lon}°</TNum>
        </P>
      </HStack>
    </Box>
  );
};
