// src/design-system/components/map/ui/map.controls.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { MapBaseLayerSelect } from "@/design-system/components/map/ui/map-controls/map.basemap-select";
import { BaseMapCompass } from "@/design-system/components/map/ui/map-controls/map.compass";
import { BaseMapLocate } from "@/design-system/components/map/ui/map-controls/map.locate";
import { BaseMapZoomControl } from "@/design-system/components/map/ui/map-controls/map.zoom";

export const MapControls = (props: StackProps) => {
  return (
    <HStack
      align={"end"}
      overflowX={"auto"}
      justify={"space-between"}
      gap={2}
      w={"full"}
      p={4}
      {...props}
    >
      <MapBaseLayerSelect />

      <HStack gap={2}>
        <BaseMapZoomControl />

        <BaseMapLocate />

        <BaseMapCompass />
      </HStack>
    </HStack>
  );
};
