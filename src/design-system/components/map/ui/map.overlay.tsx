// src/design-system/components/map/ui/map.overlay.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import type { MapOverlayProps } from "@/design-system/components/map/types/map.type";
import { MapAttribution } from "@/design-system/components/map/ui/map.basemap-attribution";
import { MapControls } from "@/design-system/components/map/ui/map.controls";
import { MapMasterIgtLayerManagement } from "@/design-system/components/map/ui/map.controls/map.master-igt-layer-management";
import { MapCoordinates } from "@/design-system/components/map/ui/map.coordinates";
import { MapFeatureInfoPanel } from "@/design-system/components/map/ui/map.feature-info-panel";
import { MapSearch } from "@/design-system/components/map/ui/map.search";
import { useThemeStore } from "@/design-system/stores/theme-store";

export const MapOverlay = (props: MapOverlayProps) => {
  // Props
  const { showMasterIgtLayerSelect = true } = props;

  return (
    <Box
      position={"absolute"}
      top={0}
      left={0}
      w={"full"}
      h={"full"}
      minW={"fit-content"}
      overflow={"hidden"}
      pointerEvents={"none"}
    >
      {/* Top Header Bar (Search on Left, Layer Select on Right) */}
      <HStack
        position={"absolute"}
        top={4}
        left={0}
        right={0}
        px={4}
        justify={"space-between"}
        align={"start"}
        gap={4}
        minW={"480px"}
        pointerEvents={"none"}
      >
        <Box pointerEvents={"none"} flexShrink={0}>
          <MapSearch />
        </Box>

        <HStack align={"center"} gap={2} pointerEvents={"none"} flexShrink={0}>
          {showMasterIgtLayerSelect && <MapMasterIgtLayerManagement />}
          <MapAttribution />
        </HStack>
      </HStack>

      {/* Floating: Feature Info Panel (Top-Right under actions) */}
      <Box
        position={"absolute"}
        top={"60px"}
        right={4}
        pointerEvents={"none"}
        zIndex={10}
      >
        <MapFeatureInfoPanel />
      </Box>

      {/* Center Coordinates Indicator */}
      <MapCoordinates />

      {/* Bottom Controls Bar */}
      <Box
        position={"absolute"}
        bottom={0}
        left={0}
        right={0}
        minW={"480px"}
        pointerEvents={"none"}
      >
        <MapControls px={"md"} pb={"md"} />
      </Box>
    </Box>
  );
};

export const MapOverlayContainer = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();

  return (
    <HStack
      align={"center"}
      // bg={"bg.body"}
      layerStyle={"glassTopRight"}
      rounded={theme.radii.component}
      shadow={"xs"}
      pointerEvents={"auto"}
      {...props}
    />
  );
};
