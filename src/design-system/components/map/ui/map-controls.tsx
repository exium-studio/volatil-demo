// src/design-system/components/map/ui/map-controls.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { MapBaseLayerSelect } from "@/design-system/components/map/ui/map-controls/base-map.base-layer-select";
import { BaseMapCompass } from "@/design-system/components/map/ui/map-controls/base-map.compass";
import { BaseMapLocate } from "@/design-system/components/map/ui/map-controls/base-map.locate";
import { BaseMapZoomControl } from "@/design-system/components/map/ui/map-controls/base-map.zoom-control";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

export const MapControls = (props: StackProps) => {
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
      {...props}
    >
      <MapConrolContainer>
        <MapBaseLayerSelect />
      </MapConrolContainer>

      <HStack gap={2}>
        <BaseMapZoomControl />

        <BaseMapLocate />

        <BaseMapCompass />
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
