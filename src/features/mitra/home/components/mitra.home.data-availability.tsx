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
import { P } from "@/design-system/components/typography/ui/p";
import { SPACING } from "@/design-system/constants/styles";
import { DatabaseIcon, Layers2Icon, TreesIcon } from "lucide-react";

export const MitraHomeDataAvailability = () => {
  return (
    <Container.Root withContext={true}>
      <Container.Body gap={4} pt={SPACING.md}>
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
    <HStack align={"center"} justify={"space-between"} px={SPACING.md}>
      <HStack gap={SPACING.xs} align={"center"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          {"Ketersediaan Data Spasial IGT"}
        </P>

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

  // Constants
  const cols = isSmContainer ? 1 : 3;
  const STATS = [
    {
      icon: DatabaseIcon,
      label: "IGT Terintegrasi",
      value: 30,
      suffix: "layer",
      description: "Total seluruh dataset IGT terintegrasi",
      colorPalette: "neutral",
    },
    {
      icon: Layers2Icon,
      label: "IGT Berbasis Bidang",
      value: 10,
      suffix: "layer",
      description: "Peta spasial berorientasi bidang tanah/persil",
      colorPalette: "blue",
    },
    {
      icon: TreesIcon,
      label: "IGT Berbasis Kawasan",
      value: 20,
      suffix: "layer",
      description: "Peta spasial penataan ruang & zonasi wilayah",
      colorPalette: "orange",
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
              fontWeight={"semibold"}
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
