// src/design-system/components/map/ui/map.controls.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { Map3DToggle } from "@/design-system/components/map/ui/map.controls/map.3d-toggle";
import { MapBasemapSelect } from "@/design-system/components/map/ui/map.controls/map.basemap-select";
import { MapScale } from "@/design-system/components/map/ui/map.controls/map.scale";
import { MapCompass } from "@/design-system/components/map/ui/map.controls/map.compass";
import { MapLocate } from "@/design-system/components/map/ui/map.controls/map.locate";
import { MapZoom } from "@/design-system/components/map/ui/map.controls/map.zoom";

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
      <HStack align={"end"} gap={3}>
        <MapBasemapSelect />
        <MapScale mb={1} />
      </HStack>

      <HStack gap={2}>
        <Map3DToggle />
        <MapZoom />
        <MapLocate />
        <MapCompass />
      </HStack>
    </HStack>
  );
};
