// src\features\mitra\home\components\mitra.home.cart-summary.tsx

// src\features\mitra\home\components\mitra.home.cart-summary.tsx

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
import { useMitraCartSummaryQuery } from "@/features/mitra/home/hooks/use-mitra-home.query";
import type {
  MitraHomeCartStatConfig,
  MitraHomeCartSummaryProps,
} from "@/features/mitra/home/types/mitra.home.cart-summary.type";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { DatabaseIcon, ReceiptTextIcon } from "lucide-react";

export const MitraHomeCartSummary = (props: MitraHomeCartSummaryProps) => {
  return (
    <Container.Root withContext={true} {...props}>
      <MitraHomeCartSummaryContent />
    </Container.Root>
  );
};

const MitraHomeCartSummaryContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries / Data
  const { cartSummary, isLoading } = useMitraCartSummaryQuery();

  if (isLoading) {
    return <Skeleton minH={"353px"} w={"full"} />;
  }

  return (
    <Container.Body gap={4} pt={"md"}>
      <MitraHomeCartSummaryHeader />

      <VStack flex={1}>
        <Separator borderColor={"bg.canvas"} />

        <MitraHomeCartStats
          cartSummary={cartSummary}
          isSmContainer={isSmContainer}
        />
      </VStack>
    </Container.Body>
  );
};

const MitraHomeCartSummaryHeader = () => {
  return (
    <HStack align={"center"} justify={"space-between"} px={"md"}>
      <HStack gap={"xs"} align={"center"}>
        <Heading>{"Ringkasan Keranjang Pembelian"}</Heading>

        <InfoTip
          variant={"icon"}
          appIconProps={{
            size: "xs",
            color: "fg.subtle",
          }}
        >
          {"Ringkasan informasi keranjang pembelian data Anda."}
        </InfoTip>
      </HStack>
    </HStack>
  );
};

const MitraHomeCartStats = (props: {
  cartSummary: {
    totalField: number;
    totalArea: number;
    totalIgtData: number;
    subtotalPrice: number;
  };
  isSmContainer: boolean;
}) => {
  // Props
  const { cartSummary, isSmContainer } = props;
  const { totalField, totalArea, totalIgtData, subtotalPrice } = cartSummary;

  // Constants
  const cols = isSmContainer ? 2 : 4;
  const STATS: MitraHomeCartStatConfig[] = [
    {
      icon: IGT_BASIS_MAP.bidang.icon,
      label: `Total ${IGT_BASIS_MAP.bidang.label}`,
      value: totalField,
      suffix: "bidang",
      colorPalette: IGT_BASIS_MAP.bidang.colorPalette,
    },
    {
      icon: IGT_BASIS_MAP.kawasan.icon,
      label: `Total ${IGT_BASIS_MAP.kawasan.label}`,
      value: totalArea,
      suffix: "ha",
      colorPalette: IGT_BASIS_MAP.kawasan.colorPalette,
    },
    {
      icon: DatabaseIcon,
      label: "Total Data IGT",
      value: totalIgtData,
      suffix: "data",
      colorPalette: "neutral",
    },
    {
      icon: ReceiptTextIcon,
      label: "Subtotal Harga",
      value: subtotalPrice,
      isCompact: true,
      colorPalette: "neutral",
    },
  ];

  return (
    <StatGrid.Root columns={cols}>
      {STATS.map((stat, index) => {
        const isCurrency = stat.label.toLowerCase().includes("harga");

        return (
          <StatGrid.Item
            key={stat.label}
            index={index}
            columns={cols}
            pos={"relative"}
          >
            <StatGrid.Header>
              <StatGrid.Label>{stat.label}</StatGrid.Label>

              <AppIcon icon={stat.icon} color={`${stat.colorPalette}.fg`} />
            </StatGrid.Header>

            <StatGrid.Value
              value={stat.value}
              suffix={stat.suffix}
              isCurrency={isCurrency}
              isCompact={stat.isCompact}
              color={`${stat.colorPalette}.fg`}
            />
          </StatGrid.Item>
        );
      })}
    </StatGrid.Root>
  );
};
