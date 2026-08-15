// src/features/mitra/home/components/mitra.home.data-availability.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING } from "@/design-system/constants/styles";
import { DatabaseIcon, LandPlotIcon, Layers2Icon } from "lucide-react";

export const MitraHomeDataAvailability = () => {
  return (
    <Container.Root withContext={true}>
      <Container.Body gap={4} pt={PADDING.md}>
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
    <HStack align={"center"} justify={"space-between"} px={PADDING.md}>
      <VStack gap={1} align={"start"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          {"Ketersediaan Data Spasial IGT"}
        </P>

        <P fontSize={"sm"} color={"fg.subtle"}>
          {
            "Jumlah informasi peta IGT terintegrasi yang tersedia di sistem saat ini."
          }
        </P>
      </VStack>
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
      color: `fg`,
    },
    {
      icon: Layers2Icon,
      label: "IGT Berbasis Bidang",
      value: 10,
      suffix: "layer",
      description: "Peta spasial berorientasi bidang tanah/persil",
      color: "blue.fg",
    },
    {
      icon: LandPlotIcon,
      label: "IGT Berbasis Kawasan",
      value: 20,
      suffix: "layer",
      description: "Peta spasial penataan ruang & zonasi wilayah",
      color: "orange.fg",
    },
  ];

  return (
    <StatGrid.Root columns={cols}>
      {STATS.map((stat, index) => {
        return (
          <StatGrid.Item key={stat.label} index={index} columns={cols}>
            <StatGrid.Header>
              <StatGrid.Label color={stat.color}>{stat.label}</StatGrid.Label>

              <StatGrid.Icon icon={stat.icon} color={stat.color} />
            </StatGrid.Header>

            <StatGrid.Value
              value={stat.value}
              suffix={stat.suffix}
              color={stat.color}
              fontWeight={"bold"}
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
