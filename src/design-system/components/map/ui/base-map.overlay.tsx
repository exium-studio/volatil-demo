import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { MapAttribution } from "@/design-system/components/map/ui/map-attribution";
import { MapControls } from "@/design-system/components/map/ui/map-controls";
import { MapDrawControls } from "@/design-system/components/map/ui/map-draw-controls";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

export type BaseMapOverlayProps = {};

export const BaseMapOverlay = (_: BaseMapOverlayProps) => {
  return (
    <>
      <MapAttribution />

      <MapDrawControls />

      <MapControls />
    </>
  );
};

export const MapOverlayContainer = (props: StackProps) => {
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
