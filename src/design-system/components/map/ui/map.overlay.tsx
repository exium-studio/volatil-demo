// src/design-system/components/map/ui/map.overlay.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { MapAttribution } from "@/design-system/components/map/ui/map.basemap-attribution";
import { MapControls } from "@/design-system/components/map/ui/map.controls";
import { MapDrawControls } from "@/design-system/components/map/ui/map.draw-controls";
import { MapSearch } from "@/design-system/components/map/ui/map.search";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

export type MapOverlayProps = {};

export const MapOverlay = (_: MapOverlayProps) => {
  return (
    <VStack
      justify={"space-between"}
      overflow={"auto"}
      position={"absolute"}
      top={0}
      left={0}
      w={"full"}
      h={"full"}
      pointerEvents={"none"}
    >
      <HStack
        align={"start"}
        justify={"space-between"}
        w={"full"}
        gap={4}
        p={4}
      >
        <MapSearch />

        <HStack align={"start"} gap={2}>
          <MapDrawControls />

          <MapAttribution />
        </HStack>
      </HStack>

      <MapControls />
    </VStack>
  );
};

export const MapOverlayContainer = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <HStack
      align={"center"}
      bg={"darkAlpha.700"}
      color={"white"}
      rounded={theme.radii.component}
      outline={"1px solid"}
      outlineColor={"border.emphasized"}
      backdropFilter={"blur(50px)"}
      pointerEvents={"auto"}
      {...props}
    />
  );
};
