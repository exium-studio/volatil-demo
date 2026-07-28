// src/design-system/components/map/ui/map.basemap-attribution.tsx
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { getBaseLayerOption } from "@/design-system/components/map/constants/map.basemap-options";
import { useMapBaseMapStore } from "@/design-system/components/map/stores/map.base-map.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Popover } from "@/design-system/components/overlay/ui/popover";
import { InfoIcon } from "lucide-react";

export const MapAttribution = () => {
  // Stores
  const { activeStyleKey } = useMapBaseMapStore();

  const activeBaseLayer = getBaseLayerOption(activeStyleKey);
  const attributions = activeBaseLayer?.attributions ?? [];

  return (
    <MapOverlayContainer>
      <Popover.Root>
        <Popover.Trigger>
          <IconButton
            aria-label={"Map attribution"}
            variant={"whiteAlphaGhost"}
            size={"sm"}
          >
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
    </MapOverlayContainer>
  );
};
