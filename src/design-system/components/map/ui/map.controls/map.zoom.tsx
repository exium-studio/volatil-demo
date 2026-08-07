// src/design-system/components/map/ui/map.controls/map.zoom.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { ButtonGroup } from "@/design-system/components/button/ui/button-group";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { MinusIcon, PlusIcon } from "lucide-react";

export const MapZoom = (props: StackProps) => {
  const map = useMapInstanceStore((state) => state.map);

  // Utils
  function zoomIn() {
    map?.zoomIn();
  }
  function zoomOut() {
    map?.zoomOut();
  }

  return (
    <MapOverlayContainer {...props}>
      <ButtonGroup attached color={"white"}>
        <IconButton aria-label={"Zoom out"} size={"sm"} onClick={zoomOut}>
          <AppIcon icon={MinusIcon} />
        </IconButton>

        <IconButton aria-label={"Zoom in"} size={"sm"} onClick={zoomIn}>
          <AppIcon icon={PlusIcon} />
        </IconButton>
      </ButtonGroup>
    </MapOverlayContainer>
  );
};
