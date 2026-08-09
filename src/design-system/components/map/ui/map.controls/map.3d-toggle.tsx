// src/design-system/components/map/ui/map.controls/map.3d-toggle.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { MAP_EVENTS_MAP } from "@/design-system/components/map/constants/map.config";
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

  const syncBuildingLayer = useCallback(() => {
    if (!map) return;

    // Remove layer and source first
    if (map.getLayer("3d-buildings")) {
      map.removeLayer("3d-buildings");
    }

    if (is3D) {
      const layers = map.getStyle()?.layers;
      let labelLayerId: string | undefined;

      if (layers) {
        for (let i = 0; i < layers.length; i++) {
          if (
            layers[i].type === "symbol" &&
            (layers[i].layout as Record<string, unknown> | undefined)?.[
              "text-field"
            ]
          ) {
            labelLayerId = layers[i].id;
            break;
          }
        }
      }

      map.addLayer(
        {
          id: "3d-buildings",
          source: "openmaptiles",
          "source-layer": "building",
          type: "fill-extrusion",
          minzoom: 13,
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["get", "render_height"],
              0,
              "#e0e0e0",
              20,
              "#c0c0c0",
              50,
              "#a0a0a0",
              100,
              "#808080",
            ],
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              13,
              0,
              14.5,
              ["get", "render_height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              13,
              0,
              14.5,
              ["get", "render_min_height"],
            ],
            "fill-extrusion-opacity": 0.8,
          },
        },
        labelLayerId,
      );
    }
  }, [map, is3D]);

  useEffect(() => {
    if (!map) return;

    syncBuildingLayer();

    map.on("style.load", syncBuildingLayer);
    map.on(MAP_EVENTS_MAP.styleReady, syncBuildingLayer);

    return () => {
      map.off("style.load", syncBuildingLayer);
      map.off(MAP_EVENTS_MAP.styleReady, syncBuildingLayer);
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
