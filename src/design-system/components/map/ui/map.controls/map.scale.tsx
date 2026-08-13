// src/design-system/components/map/ui/map.controls/map.scale.tsx

import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { P } from "@/design-system/components/typography/ui/p";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const MapScale = (props: StackProps) => {
  // Stores
  const map = useMapInstanceStore((state) => state.map);

  // States
  const [scaleData, setScaleData] = useState<{ width: number; label: string }>(
    () => ({
      width: 0,
      label: "",
    }),
  );

  // Hooks
  useEffect(() => {
    if (!map) return;
    const mapInstance = map;

    function updateScale() {
      const center = mapInstance.getCenter();
      const zoom = mapInstance.getZoom();

      const latitude = center.lat;
      const metersPerPixel =
        (Math.cos((latitude * Math.PI) / 180) * 2 * Math.PI * 6378137) /
        (256 * Math.pow(2, zoom));

      const targetWidth = 80;
      const targetMeters = targetWidth * metersPerPixel;

      const log = Math.log10(targetMeters);
      const powerOf10 = Math.pow(10, Math.floor(log));
      const ratio = targetMeters / powerOf10;

      let roundMeters = powerOf10;
      if (ratio >= 5) {
        roundMeters = 5 * powerOf10;
      } else if (ratio >= 2) {
        roundMeters = 2 * powerOf10;
      }

      const width = roundMeters / metersPerPixel;
      const label =
        roundMeters >= 1000
          ? `${(roundMeters / 1000).toFixed(0)} km`
          : `${roundMeters.toFixed(0)} m`;

      setScaleData({ width, label });
    }

    updateScale();
    map.on("move", updateScale);
    map.on("zoom", updateScale);

    return () => {
      map.off("move", updateScale);
      map.off("zoom", updateScale);
    };
  }, [map]);

  if (scaleData.width === 0) return null;

  return (
    <VStack gap={1} align={"center"} justify={"center"} w={"full"} {...props}>
      <P fontSize={"2xs"} fontWeight={"bold"} color={"fg.muted"} lineHeight={1}>
        {scaleData.label}
      </P>

      <Box
        w={`${scaleData.width}px`}
        h={"5px"}
        borderLeft={"2px solid"}
        borderRight={"2px solid"}
        borderBottom={"2px solid"}
        borderColor={"fg.muted"}
        transition={"width 200ms ease"}
      />
    </VStack>
  );
};
