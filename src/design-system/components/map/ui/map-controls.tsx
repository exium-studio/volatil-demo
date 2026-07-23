// src/design-system/components/map/ui/map-controls.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useGeolocation } from "@/design-system/components/map/hooks/use-geolocation";
import { MapBaseLayerSelect } from "@/design-system/components/map/ui/map-base-layer-select";
import {
  CompassIcon,
  LocateFixedIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react";
import type maplibregl from "maplibre-gl";

interface MapControlsProps {
  map: maplibregl.Map | null;
}

export const MapControls = ({ map }: MapControlsProps) => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const { isActive, isLocating, toggle } = useGeolocation(map);

  const resetNorth = () => {
    map?.resetNorth();
    map?.resetNorthPitch();
  };

  const zoomIn = () => {
    map?.zoomIn();
  };

  const zoomOut = () => {
    map?.zoomOut();
  };

  return (
    <VStack position={"absolute"} bottom={2.5} right={2.5} gap={"8px"}>
      <VStack bg={"bg.body"} rounded={theme.radii.container} p={1}>
        <MapBaseLayerSelect />
      </VStack>

      <VStack bg={"bg.body"} rounded={theme.radii.container} p={1}>
        <IconButton aria-label={"Zoom in"} size={"sm"} onClick={zoomIn}>
          <ZoomInIcon size={16} />
        </IconButton>

        <IconButton aria-label={"Zoom out"} size={"sm"} onClick={zoomOut}>
          <ZoomOutIcon size={16} />
        </IconButton>
      </VStack>

      <VStack bg={"bg.body"} rounded={theme.radii.container} p={1}>
        <IconButton
          aria-label={"Reset bearing"}
          size={"sm"}
          onClick={resetNorth}
        >
          <CompassIcon size={16} />
        </IconButton>

        <IconButton
          aria-label={isActive ? "Turn off my location" : "Show my location"}
          variant={isActive ? "solid" : "ghost"}
          colorPalette={isActive ? "blue" : "gray"}
          size={"sm"}
          loading={isLocating}
          onClick={toggle}
        >
          <LocateFixedIcon size={16} />
        </IconButton>
      </VStack>
    </VStack>
  );
};
