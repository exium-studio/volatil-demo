// src/design-system/components/map/ui/map.controls/map.locate.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { useGeolocation } from "@/design-system/components/map/hooks/use-map-geolocation";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { useThemeStore } from "@/design-system/stores/theme-store";
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
      <Tooltip
        content={isActive ? "Matikan Lokasi Saya" : "Lokasi Saya Saat Ini"}
        positioning={{ placement: "top" }}
      >
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
      </Tooltip>
    </MapOverlayContainer>
  );
};
