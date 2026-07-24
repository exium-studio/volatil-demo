// src/design-system/components/map/ui/map-controls.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { useGeolocation } from "@/design-system/components/map/hooks/use-geolocation";
import { MapBaseLayerSelect } from "@/design-system/components/map/ui/map-controls/map-base-layer-select";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
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
    <HStack
      align={"center"}
      justify={"space-between"}
      position={"absolute"}
      bottom={0}
      left={0}
      gap={2}
      w={"full"}
      p={4}
    >
      <MapConrolContainer>
        <MapBaseLayerSelect />
      </MapConrolContainer>

      <HStack gap={2}>
        <MapConrolContainer>
          <IconButton aria-label={"Zoom out"} size={"sm"} onClick={zoomOut}>
            <ZoomOutIcon />
          </IconButton>

          <ClampedP fontSize={"sm"}>{map?.getZoom().toFixed(1)}</ClampedP>

          <IconButton aria-label={"Zoom in"} size={"sm"} onClick={zoomIn}>
            <ZoomInIcon />
          </IconButton>
        </MapConrolContainer>

        <MapConrolContainer>
          <IconButton
            aria-label={isActive ? "Turn off my location" : "Show my location"}
            variant={isActive ? "solid" : "ghost"}
            colorPalette={isActive ? "blue" : "gray"}
            size={"sm"}
            loading={isLocating}
            onClick={toggle}
          >
            <LocateFixedIcon />
          </IconButton>
        </MapConrolContainer>

        <MapConrolContainer>
          <IconButton
            aria-label={"Reset north"}
            size={"sm"}
            onClick={resetNorth}
          >
            <CompassIcon />
          </IconButton>
        </MapConrolContainer>
      </HStack>
    </HStack>
  );
};

const MapConrolContainer = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <HStack
      align={"center"}
      bg={"bg.body"}
      rounded={theme.radii.container}
      p={1}
      {...props}
    />
  );
};
