// src/design-system/components/map/ui/map.overlay.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { MapAttribution } from "@/design-system/components/map/ui/map.basemap-attribution";
import { MapControls } from "@/design-system/components/map/ui/map.controls";
import { MapMasterIgtLayerSelect } from "@/design-system/components/map/ui/map.controls/map.master-igt-layer-select";
import { MapMyDataLayerSelect } from "@/design-system/components/map/ui/map.controls/map.my-data-layer-select";
import { MapCoordinates } from "@/design-system/components/map/ui/map.coordinates";
import { MapFeatureInfoPanel } from "@/design-system/components/map/ui/map.feature-info-panel";
import { MapSearch } from "@/design-system/components/map/ui/map.search";
import type { MapOverlayProps } from "@/design-system/components/map/types/map.type";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { getUserSession } from "@/shared/utils/user/user-session.utils";

export const MapOverlay = (props: MapOverlayProps) => {
  const { showMasterIgtLayerSelect = true, showMyDataLayerSelect = true } =
    props;

  // User session
  const userSession = getUserSession();
  const isMitra = userSession?.role === "mitra";

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
            {isMitra && showMyDataLayerSelect && <MapMyDataLayerSelect />}
            {showMasterIgtLayerSelect && <MapMasterIgtLayerSelect />}
            <MapAttribution />
          </HStack>

          <MapFeatureInfoPanel />
        </VStack>
      </HStack>

      <MapCoordinates />

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
      bg={"bg.body"}
      rounded={theme.radii.component}
      shadow={"xs"}
      pointerEvents={"auto"}
      {...props}
    />
  );
};
