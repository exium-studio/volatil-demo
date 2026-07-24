import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { useBaseMapContext } from "@/design-system/components/map/ui/base-map";
import { MapOverlayContainer } from "@/design-system/components/map/ui/base-map.overlay";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";

export const BaseMapZoomControl = (props: StackProps) => {
  // Contexts
  const { map } = useBaseMapContext();

  // Utils
  function zoomIn() {
    map?.zoomIn();
  }
  function zoomOut() {
    map?.zoomOut();
  }

  return (
    <MapOverlayContainer {...props}>
      <IconButton aria-label={"Zoom out"} size={"sm"} onClick={zoomOut}>
        <AppIcon icon={ZoomOutIcon} />
      </IconButton>

      <ClampedP fontSize={"sm"}>{map?.getZoom().toFixed(1)}</ClampedP>

      <IconButton aria-label={"Zoom in"} size={"sm"} onClick={zoomIn}>
        <AppIcon icon={ZoomInIcon} />
      </IconButton>
    </MapOverlayContainer>
  );
};
