// src/features/mitra/data-request/components/mitra.data-request.detail-attribute-header.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useSelectedIgtLayer } from "@/features/mitra/data-request/hooks/use-selected-igt-layer";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { flyToIgtLayer } from "@/features/mitra/data-request/utils/fly-to-igt-layer";
import { IconCurrentLocation } from "@tabler/icons-react";
import { memo } from "react";

type MitraDataRequestDetailAttributeHeaderProps = {
  layer: IgtLayerItem | null;
  cqlFilter?: string;
  onBack?: () => void;
  showActions?: boolean;
};

export const MitraDataRequestDetailAttributeHeader = memo(
  (props: MitraDataRequestDetailAttributeHeaderProps) => {
    // Props
    const { layer, cqlFilter, onBack, showActions = true } = props;

    // Hooks
    const { selectLayer } = useSelectedIgtLayer();

    // Derived Values
    const layerTitle =
      layer?.title ||
      layer?.wfs?.wfsTypeName?.split(":")[1]?.replace(/_/g, " ") ||
      layer?.id ||
      "Layer IGT";

    // Handlers
    const handleBackClick = () => {
      selectLayer(undefined);
      onBack?.();
    };

    const { map } = useMapInstanceStore();

    const handleFlyToLayer = () => {
      if (!layer) return;
      void flyToIgtLayer(map, layer, { cqlFilter });
    };

    return (
      <VStack gap={0} w={"full"}>
        <VStack gap={SPACING.sm} w={"full"} p={PADDING.md} bg={"bg.body"}>
          <HStack justify={"space-between"} align={"center"} w={"full"}>
            <HStack gap={SPACING.sm} align={"center"}>
              <BackButton onClick={handleBackClick} />

              <P fontWeight={"medium"} fontSize={"md"}>
                {`Detail Attribute: ${layerTitle}`}
              </P>
            </HStack>

            {showActions && (
              <HStack gap={SPACING.sm} align={"center"}>
                <Tooltip content={"Lihat layer IGT di peta"}>
                  <IconButton
                    variant={"outline"}
                    aria-label={"Lihat layer IGT di peta"}
                    onClick={handleFlyToLayer}
                  >
                    <AppIcon icon={IconCurrentLocation} />
                  </IconButton>
                </Tooltip>
              </HStack>
            )}
          </HStack>
        </VStack>

        <Separator borderColor={"bg.canvas"} />
      </VStack>
    );
  },
);
