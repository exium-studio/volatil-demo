// src/features/mitra/home/components/mitra.home.data-availability.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Circle } from "@/design-system/components/layout/ui/box";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { useMitraDataAvailabilityQuery } from "@/features/mitra/home/hooks/use-mitra-home.query";
import type { MitraHomeDataAvailabilityProps } from "@/features/mitra/home/types/mitra.home.data-availability.type";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { DatabaseIcon } from "lucide-react";

export const MitraHomeDataAvailability = (
  props: MitraHomeDataAvailabilityProps,
) => {
  return (
    <Container.Root withContext={true} {...props}>
      <Container.Body gap={4} pt={"md"}>
        <MitraHomeDataAvailabilityHeader />

        <VStack flex={1}>
          <Separator borderColor={"bg.canvas"} />

          <MitraHomeDataAvailabilityStats />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const MitraHomeDataAvailabilityHeader = () => {
  return (
    <HStack align={"center"} justify={"space-between"} px={"md"}>
      <HStack gap={"xs"} align={"center"}>
        <Heading>{"Ketersediaan Data Spasial IGT"}</Heading>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {
            "Jumlah informasi peta IGT terintegrasi yang tersedia di sistem saat ini."
          }
        </InfoTip>
      </HStack>
    </HStack>
  );
};

const MitraHomeDataAvailabilityStats = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries / Data
  const { dataAvailability } = useMitraDataAvailabilityQuery();

  // Constants
  const cols = isSmContainer ? 1 : 3;
  const STATS = [
    {
      icon: DatabaseIcon,
      label: "IGT Terintegrasi",
      value: dataAvailability.totalIgt,
      suffix: "layer",
      description: "Total seluruh dataset IGT terintegrasi",
      colorPalette: "neutral",
    },
    {
      icon: IGT_BASIS_MAP.bidang.icon,
      label: `IGT Berbasis ${IGT_BASIS_MAP.bidang.label}`,
      value: dataAvailability.bidang,
      suffix: "layer",
      description: "Peta spasial berorientasi bidang tanah/persil",
      colorPalette: IGT_BASIS_MAP.bidang.colorPalette,
    },
    {
      icon: IGT_BASIS_MAP.kawasan.icon,
      label: `IGT Berbasis ${IGT_BASIS_MAP.kawasan.label}`,
      value: dataAvailability.kawasan,
      suffix: "layer",
      description: "Peta spasial penataan ruang & zonasi wilayah",
      colorPalette: IGT_BASIS_MAP.kawasan.colorPalette,
    },
  ];

  return (
    <StatGrid.Root columns={cols}>
      {STATS.map((stat, index) => {
        return (
          <StatGrid.Item key={stat.label} index={index} columns={cols}>
            <StatGrid.Header>
              <StatGrid.Label
                fontWeight={"semibold"}
                color={`${stat.colorPalette}.fg`}
              >
                {stat.label}
              </StatGrid.Label>

              <Circle p={2} bg={`${stat.colorPalette}.subtle`}>
                <AppIcon icon={stat.icon} color={`${stat.colorPalette}.fg`} />
              </Circle>
            </StatGrid.Header>

            <StatGrid.Value
              value={stat.value}
              suffix={stat.suffix}
              color={`${stat.colorPalette}.fg`}
            />

            <StatGrid.Description mt={1}>
              {stat.description}
            </StatGrid.Description>
          </StatGrid.Item>
        );
      })}
    </StatGrid.Root>
  );
};
