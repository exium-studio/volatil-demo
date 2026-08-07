// src/design-system/components/map/ui/map.controls/map.3d-toggle.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { MAP_STYLE_READY_EVENT } from "@/design-system/components/map/constants/map.config";
import { useMapBaseMapStore } from "@/design-system/components/map/stores/map.base-map.store";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { useCallback, useEffect } from "react";

export const Map3DToggle = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();
  const { is3D, setIs3D } = useMapBaseMapStore();

  // Map Instance
  const map = useMapInstanceStore((state) => state.map);

  // Sync building-3d layer visibility on map style load or ready
  const syncBuildingLayer = useCallback(() => {
    if (!map) return;

    if (map.getLayer("building-3d")) {
      map.setLayoutProperty(
        "building-3d",
        "visibility",
        is3D ? "visible" : "none",
      );
    }

    if (map.getLayer("building")) {
      map.setLayoutProperty(
        "building",
        "visibility",
        is3D ? "none" : "visible",
      );
    }
  }, [map, is3D]);

  useEffect(() => {
    if (!map) return;

    syncBuildingLayer();

    map.on("style.load", syncBuildingLayer);
    map.on(MAP_STYLE_READY_EVENT, syncBuildingLayer);

    return () => {
      map.off("style.load", syncBuildingLayer);
      map.off(MAP_STYLE_READY_EVENT, syncBuildingLayer);
    };
  }, [map, syncBuildingLayer]);

  const handleToggle = () => {
    if (!map) return;

    const nextIs3D = !is3D;
    const targetPitch = nextIs3D ? 60 : 0;

    if (map.getLayer("building-3d")) {
      map.setLayoutProperty(
        "building-3d",
        "visibility",
        nextIs3D ? "visible" : "none",
      );
    }

    if (map.getLayer("building")) {
      map.setLayoutProperty(
        "building",
        "visibility",
        nextIs3D ? "none" : "visible",
      );
    }

    map.easeTo({
      pitch: targetPitch,
      duration: 800,
    });

    setIs3D(nextIs3D);
  };

  return (
    <MapOverlayContainer {...props}>
      <Tooltip
        content={
          is3D
            ? "Mode 3D Building Aktif (Klik untuk 2D)"
            : "Mode 2D Aktif (Klik untuk 3D Building)"
        }
        positioning={{ placement: "top" }}
      >
        <IconButton
          aria-label={is3D ? "Switch to 2D view" : "Switch to 3D view"}
          size={"sm"}
          onClick={handleToggle}
          color={is3D ? `${theme.colorPalette}.300` : undefined}
        >
          <P fontSize={"sm"} fontWeight={"bold"}>
            {is3D ? "3D" : "2D"}
          </P>
        </IconButton>
      </Tooltip>
    </MapOverlayContainer>
  );
};
