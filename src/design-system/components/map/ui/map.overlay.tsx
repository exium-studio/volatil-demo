// src/design-system/components/map/ui/map.overlay.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import type { MapOverlayProps } from "@/design-system/components/map/types/map.type";
import { MapAttribution } from "@/design-system/components/map/ui/map.basemap-attribution";
import { MapControls } from "@/design-system/components/map/ui/map.controls";
import { MapMasterIgtLayerSelect } from "@/design-system/components/map/ui/map.controls/map.master-igt-layer-select";
import { MapCoordinates } from "@/design-system/components/map/ui/map.coordinates";
import { MapFeatureInfoPanel } from "@/design-system/components/map/ui/map.feature-info-panel";
import { MapSearch } from "@/design-system/components/map/ui/map.search";
import { MapSymbologyPanel } from "@/design-system/components/map/ui/map.symbology-panel";
import { useThemeStore } from "@/design-system/stores/theme-store";

export const MapOverlay = (props: MapOverlayProps) => {
  const {
    showMasterIgtLayerSelect = true, //showMyDataLayerSelect = true
  } = props;

  // User session
  // const userSession = getUserSession();
  // const isMitra = userSession?.role === "mitra";

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
        gap={"md"}
        p={4}
        pointerEvents={"none"}
      >
        <MapSearch />

        <VStack align={"end"} gap={2} pointerEvents={"none"}>
          <HStack align={"start"} gap={2} pointerEvents={"none"}>
            {/* {isMitra && showMyDataLayerSelect && <MapMyDataLayerSelect />} */}
            {showMasterIgtLayerSelect && <MapMasterIgtLayerSelect />}
            <MapAttribution />
          </HStack>

          <MapFeatureInfoPanel />
        </VStack>
      </HStack>

      <MapCoordinates />

      <VStack align={"start"} gap={"md"} w={"full"} pointerEvents={"none"}>
        <Box pl={"md"} pointerEvents={"none"}>
          <MapSymbologyPanel />
        </Box>

        <MapControls px={"md"} pb={"md"} />
      </VStack>
    </VStack>
  );
};

export const MapOverlayContainer = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <HStack
      align={"center"}
      bg={"bg.body"}
      rounded={theme.radii.component}
      shadow={"xs"}
      pointerEvents={"auto"}
      {...props}
    />
  );
};
