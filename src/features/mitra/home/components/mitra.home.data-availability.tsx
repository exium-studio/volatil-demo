// src\features\mitra\home\components\mitra.home.data-availability.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { useMitraDataAvailabilityQuery } from "@/features/mitra/home/hooks/use-mitra-home.query";
import type {
  MitraHomeDataAvailabilityProps,
  MitraHomeDataAvailabilityResponse,
} from "@/features/mitra/home/types/mitra.home.data-availability.type";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { DatabaseIcon } from "lucide-react";

export const MitraHomeDataAvailability = (
  props: MitraHomeDataAvailabilityProps,
) => {
  return (
    <Container.Root withContext={true} {...props}>
      <MitraHomeDataAvailabilityContent />
    </Container.Root>
  );
};

const MitraHomeDataAvailabilityContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { dataAvailability, isLoading } = useMitraDataAvailabilityQuery();

  if (isLoading) {
    return <Skeleton minH={isSmContainer ? "468px" : "188px"} w={"full"} />;
  }

  return (
    <Container.Body gap={4} pt={"md"}>
      <MitraHomeDataAvailabilityHeader />

      <VStack flex={1}>
        <Separator borderColor={"bg.canvas"} />

        <MitraHomeDataAvailabilityStats
          dataAvailability={dataAvailability}
          isSmContainer={isSmContainer}
        />
      </VStack>
    </Container.Body>
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

const MitraHomeDataAvailabilityStats = (props: {
  dataAvailability: MitraHomeDataAvailabilityResponse;
  isSmContainer: boolean;
}) => {
  // Props
  const { dataAvailability, isSmContainer } = props;

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
          <StatGrid.Item
            key={stat.label}
            index={index}
            columns={cols}
            pos={"relative"}
          >
            <StatGrid.Header>
              <StatGrid.Label
                fontWeight={"semibold"}
                color={`${stat.colorPalette}.fg`}
              >
                {stat.label}
              </StatGrid.Label>

              <AppIcon icon={stat.icon} color={`${stat.colorPalette}.fg`} />
            </StatGrid.Header>

            <StatGrid.Value
              value={stat.value}
              suffix={stat.suffix}
              color={`${stat.colorPalette}.fg`}
            />

            <StatGrid.Description mt={1} zIndex={2}>
              {stat.description}
            </StatGrid.Description>
          </StatGrid.Item>
        );
      })}
    </StatGrid.Root>
  );
};
