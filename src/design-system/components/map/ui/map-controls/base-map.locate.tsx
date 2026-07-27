import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { useGeolocation } from "@/design-system/components/map/hooks/use-geolocation";
import { useBaseMapContext } from "@/design-system/components/map/contexts/base-map.context";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import {
  IconCurrentLocation,
  IconCurrentLocationFilled,
} from "@tabler/icons-react";

export const BaseMapLocate = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { map } = useBaseMapContext();

  // Hooks
  const { isActive, isLocating, toggle } = useGeolocation(map);

  return (
    <MapOverlayContainer {...props}>
      <IconButton
        aria-label={isActive ? "Turn off my location" : "Show my location"}
        variant={"whiteAlphaGhost"}
        size={"sm"}
        loading={isLocating}
        onClick={toggle}
        color={isActive ? `${theme.colorPalette}.solid` : undefined}
      >
        <AppIcon
          icon={isActive ? IconCurrentLocationFilled : IconCurrentLocation}
        />
      </IconButton>
    </MapOverlayContainer>
  );
};
