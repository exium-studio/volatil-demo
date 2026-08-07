// src/design-system/components/map/ui/map.controls/map.locate.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { useGeolocation } from "@/design-system/components/map/hooks/use-map-geolocation";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import {
  IconCurrentLocation,
  IconCurrentLocationFilled,
} from "@tabler/icons-react";

export const MapLocate = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();

  // Map Instance
  const map = useMapInstanceStore((state) => state.map);

  // Hooks
  const { isActive, isLocating, toggle } = useGeolocation(map);

  return (
    <MapOverlayContainer {...props}>
      <IconButton
        aria-label={isActive ? "Turn off my location" : "Show my location"}
        size={"sm"}
        loading={isLocating}
        onClick={toggle}
        color={isActive ? `${theme.colorPalette}.300` : undefined}
      >
        <AppIcon
          icon={isActive ? IconCurrentLocationFilled : IconCurrentLocation}
        />
      </IconButton>
    </MapOverlayContainer>
  );
};
