// src/design-system/components/map/ui/map-attribution.tsx
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { BASE_LAYER_OPTIONS } from "@/design-system/components/map/constants/base-layer-style.constant";
import { useMapBaseLayerStore } from "@/design-system/components/map/stores/map-base-layer.store";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { InfoIcon } from "lucide-react";

export const MapAttribution = () => {
  // Stores
  const { theme } = useThemeStore();
  const { activeStyleId } = useMapBaseLayerStore();

  const activeBaseLayer = BASE_LAYER_OPTIONS.find(
    (option) => option.id === activeStyleId,
  );
  const attributions = activeBaseLayer?.attributions ?? [];

  return (
    <VStack
      pos={"absolute"}
      right={2}
      top={2}
      zIndex={10}
      p={1}
      bg={"bg.body"}
      rounded={theme.radii.container}
    >
      <Popover.Root>
        <Popover.Trigger>
          <IconButton aria-label={"Map attribution"} size={"sm"}>
            <AppIcon icon={InfoIcon} />
          </IconButton>
        </Popover.Trigger>

        <Popover.Content w={"200px"}>
          <Popover.Body>
            <VStack alignItems={"flex-start"} gap={1}>
              {attributions.map((attribution) => (
                <span
                  key={attribution}
                  dangerouslySetInnerHTML={{ __html: attribution }}
                />
              ))}
            </VStack>
          </Popover.Body>
        </Popover.Content>
      </Popover.Root>
    </VStack>
  );
};
