// src/features/mitra/home/components/mitra.home.cart-summary.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING_MD } from "@/design-system/constants/styles";
import type {
  MitraHomeCartStatConfig,
  MitraHomeCartSummaryProps,
} from "@/features/mitra/home/types/mitra.home.cart-summary.type";
import { useMitraHomeData } from "@/features/mitra/home/hooks/use-mitra-home.query";
import {
  DatabaseIcon,
  LandPlotIcon,
  Layers2Icon,
  ReceiptTextIcon,
} from "lucide-react";

export const MitraHomeCartSummary = (props: MitraHomeCartSummaryProps) => {
  return (
    <Container.Root flex={"1 1 300px"} withContext={true} {...props}>
      <Container.Body gap={4} pt={PADDING_MD}>
        <MitraHomeCartSummaryHeader />

        <VStack flex={1}>
          <Separator borderColor={"bg.canvas"} />

          <MitraHomeCartStats />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const MitraHomeCartSummaryHeader = () => {
  return (
    <HStack align={"center"} justify={"space-between"} px={PADDING_MD}>
      <VStack gap={1} align={"start"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          {"Ringkasan Keranjang Pembelian"}
        </P>
        <P fontSize={"sm"} color={"fg.subtle"}>
          {"Ringkasan informasi keranjang pembelian data Anda."}
        </P>
      </VStack>
    </HStack>
  );
};

const MitraHomeCartStats = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries / Data
  const { cartSummary } = useMitraHomeData();
  const { totalField, totalArea, totalIgtData, subtotalPrice } = cartSummary;

  // Constants
  const cols = isSmContainer ? 2 : 4;
  const STATS: MitraHomeCartStatConfig[] = [
    {
      icon: Layers2Icon,
      label: "Total Bidang",
      value: totalField,
      suffix: "bidang",
      color: "blue.fg",
    },
    {
      icon: LandPlotIcon,
      label: "Total Kawasan",
      value: totalArea,
      suffix: "ha",
      color: "orange.fg",
    },
    {
      icon: DatabaseIcon,
      label: "Total Data IGT",
      value: totalIgtData,
      suffix: "data",
    },
    {
      icon: ReceiptTextIcon,
      label: "Subtotal Harga",
      value: subtotalPrice,
    },
  ];

  return (
    <StatGrid.Root columns={cols}>
      {STATS.map((stat, index) => {
        const isCurrency = stat.label.toLowerCase().includes("harga");

        return (
          <StatGrid.Item key={stat.label} index={index} columns={cols}>
            <StatGrid.Header>
              <StatGrid.Label>{stat.label}</StatGrid.Label>
              <StatGrid.Icon icon={stat.icon} color={stat.color} />
            </StatGrid.Header>

            <StatGrid.Value
              value={stat.value}
              suffix={stat.suffix}
              isCurrency={isCurrency}
              color={stat.color}
            />
          </StatGrid.Item>
        );
      })}
    </StatGrid.Root>
  );
};
