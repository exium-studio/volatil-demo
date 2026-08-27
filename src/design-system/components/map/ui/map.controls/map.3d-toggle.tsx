// src/design-system/components/map/ui/map.controls/map.3d-toggle.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { useMapBaseMapStore } from "@/design-system/components/map/stores/map.base-map.store";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useCallback, useEffect } from "react";

export const Map3DToggle = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();
  const { is3D, setIs3D } = useMapBaseMapStore();

  // Map Instance
  const map = useMapInstanceStore((state) => state.map);

  const syncBuildingLayerVisibility = useCallback(() => {
    if (!map) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(map as any).style || !map.isStyleLoaded()) return;

    if (is3D && map.getSource("terrain-dem")) {
      map.setTerrain({
        source: "terrain-dem",
        exaggeration: 1.5,
      });
    } else {
      map.setTerrain(null);
    }

    if (map.getLayer("building-3d")) {
      map.setLayoutProperty(
        "building-3d",
        "visibility",
        is3D ? "visible" : "none",
      );
    }

    if (map.getLayer("building")) {
      if (is3D) {
        map.setLayoutProperty("building", "visibility", "none");
      } else {
        map.setLayerZoomRange("building", 13, 24);
        map.setLayoutProperty("building", "visibility", "visible");
      }
    }
  }, [map, is3D]);

  useEffect(() => {
    if (!map) return;

    syncBuildingLayerVisibility();
  }, [map, syncBuildingLayerVisibility]);

  const handleToggle = () => {
    if (!map) return;

    const nextIs3D = !is3D;
    const targetPitch = nextIs3D ? 60 : 0;

    if (nextIs3D && map.getSource("terrain-dem")) {
      map.setTerrain({
        source: "terrain-dem",
        exaggeration: 1.5,
      });
    } else {
      map.setTerrain(null);
    }

    if (map.getLayer("building-3d")) {
      map.setLayoutProperty(
        "building-3d",
        "visibility",
        nextIs3D ? "visible" : "none",
      );
    }

    if (map.getLayer("building")) {
      if (nextIs3D) {
        map.setLayoutProperty("building", "visibility", "none");
      } else {
        map.setLayerZoomRange("building", 13, 24);
        map.setLayoutProperty("building", "visibility", "visible");
      }
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
          <P fontSize={"sm"} fontWeight={"medium"}>
            {is3D ? "3D" : "2D"}
          </P>
        </IconButton>
      </Tooltip>
    </MapOverlayContainer>
  );
};
