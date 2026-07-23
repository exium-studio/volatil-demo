// src/design-system/components/map/ui/map-draw-controls.tsx

import { PencilIcon, XIcon } from "lucide-react";
import { useMapDrawStore } from "@/design-system/components/map/stores/map-draw.store";
import { Button } from "@/design-system/components/button/ui/button";

/**
 * Minimal draw UI: only exposes "polygon" drawing for now.
 * The store/hook already support other geometry types, so adding more
 * buttons later doesn't require touching the store or hook.
 */
export const MapDrawControls = () => {
  const { isDrawing, start, cancel } = useMapDrawStore();

  return (
    <Button
      position={"absolute"}
      top={"12px"}
      left={"12px"}
      variant={"solid"}
      colorPalette={isDrawing ? "red" : "blue"}
      onClick={() => (isDrawing ? cancel() : start("polygon"))}
    >
      {isDrawing ? <XIcon size={16} /> : <PencilIcon size={16} />}
      {isDrawing ? "Batalkan" : "Gambar area"}
    </Button>
  );
};
