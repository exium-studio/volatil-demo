// src/design-system/components/map/ui/map.controls/map.compass.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { ToggleTip } from "@/design-system/components/input/ui/toggle-tip";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { Navigation2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export const MapCompass = (props: StackProps) => {
  const map = useMapInstanceStore((state) => state.map);

  // States
  const [bearing, setBearing] = useState(0);

  useEffect(() => {
    if (!map) return;

    const onRotate = () => setBearing(map.getBearing());

    map.on("rotate", onRotate);
    return () => {
      map.off("rotate", onRotate);
    };
  }, [map]);

  function resetNorth() {
    map?.resetNorth();
    map?.resetNorthPitch();
  }

  return (
    <MapOverlayContainer {...props}>
      <ToggleTip
        content={`Rotasi: ${bearing.toFixed(1)}°`}
        positioning={{ placement: "top" }}
      >
        <P
          w={"4ch"}
          mx={2}
          textAlign={"center"}
          cursor={"pointer"}
          whiteSpace={"nowrap"}
        >
          <TNum>{bearing.toFixed(0)}</TNum>°
        </P>
      </ToggleTip>

      <Tooltip content={"Reset Arah Utara"} positioning={{ placement: "top" }}>
        <IconButton
          aria-label={"Reset north"}
          size={"sm"}
          roundedLeft={0}
          onClick={resetNorth}
        >
          <AppIcon
            icon={Navigation2Icon}
            fill={"red.400"}
            stroke={"red.400"}
            transform={`rotate(${-bearing}deg)`}
          />
        </IconButton>
      </Tooltip>
    </MapOverlayContainer>
  );
};
