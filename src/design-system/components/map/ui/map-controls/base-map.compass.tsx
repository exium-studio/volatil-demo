import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { ToggleTip } from "@/design-system/components/input/ui/toggle-tip";
import type { StackProps } from "@/design-system/components/layout/types/flex-box.type";
import { useBaseMapContext } from "@/design-system/components/map/contexts/base-map.context";
import { MapOverlayContainer } from "@/design-system/components/map/ui/base-map.overlay";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { Navigation2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export const BaseMapCompass = (props: StackProps) => {
  // Contexts
  const { map } = useBaseMapContext();

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
      <ToggleTip content={`${bearing}°`}>
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

      <IconButton
        aria-label={"Reset north"}
        variant={"whiteAlphaGhost"}
        size={"sm"}
        onClick={resetNorth}
      >
        <AppIcon
          icon={Navigation2Icon}
          fill={"red.500"}
          stroke={"red.500"}
          transform={`rotate(${-bearing}deg)`}
        />
      </IconButton>
    </MapOverlayContainer>
  );
};
