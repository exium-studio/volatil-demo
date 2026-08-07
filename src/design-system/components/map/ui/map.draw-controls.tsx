// src/design-system/components/map/ui/map.draw-controls.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { useMapDrawStore } from "@/design-system/components/map/stores/map.draw.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { PencilIcon, XIcon } from "lucide-react";

export const MapDrawControls = () => {
  const { isDrawing, start, cancel } = useMapDrawStore();

  return (
    <MapOverlayContainer>
      <IconButton
        size={"sm"}
        colorPalette={isDrawing ? "red" : "blue"}
        onClick={() => {
          if (isDrawing) {
            // While drawing: just cancel (no finished shape to clear from map source)
            cancel();
          } else {
            start("polygon");
          }
        }}
      >
        {isDrawing ? <XIcon size={16} /> : <PencilIcon size={16} />}
      </IconButton>
    </MapOverlayContainer>
  );
};
