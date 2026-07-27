import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { MapAttribution } from "@/design-system/components/map/ui/map-attribution";
import { MapControls } from "@/design-system/components/map/ui/map-controls";
import { MapDrawControls } from "@/design-system/components/map/ui/map-draw-controls";
import { useThemeStore } from "@/design-system/stores/use-theme-store";

export type BaseMapOverlayProps = {};

export const BaseMapOverlay = (_: BaseMapOverlayProps) => {
  return (
    <VStack
      justify={"space-between"}
      position={"absolute"}
      top={0}
      left={0}
      w={"full"}
      h={"full"}
      pointerEvents={"none"}
    >
      <HStack align={"start"} justify={"end"} gap={2} p={4}>
        <MapDrawControls />

        <MapAttribution />
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
