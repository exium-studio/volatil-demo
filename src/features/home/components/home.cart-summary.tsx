// src/features/home/components/home.cart-summary.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { PADDING_MD } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type {
  CartStatConfig,
  HomeCartSummaryStatItemProps,
} from "@/features/home/types/home.cart-summary.type";
import { dummyHomeData } from "@/shared/constants/dummy-data/dummy-home-data";
import {
  DatabaseIcon,
  LandPlotIcon,
  LayersIcon,
  ReceiptTextIcon,
} from "lucide-react";

export const HomeCartSummary = () => {
  return (
    <Container.Root flex={"1 1 300px"} withContext={true}>
      <Container.Body gap={4} pt={PADDING_MD}>
        <Header />

        <VStack flex={1}>
          <Separator borderColor={"bg.canvas"} />

          <CartStats />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const Header = () => {
  return (
    <HStack align={"center"} justify={"space-between"} px={PADDING_MD}>
      <VStack gap={1}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          Ringkasan Keranjang Pembelian
        </P>
        <P fontSize={"sm"} color={"fg.subtle"}>
          Ringkasan informasi keranjang pembelian data Anda.
        </P>
      </VStack>
    </HStack>
  );
};

const StatItem = (props: HomeCartSummaryStatItemProps) => {
  // Props
  const { label, value, suffix, icon, color, ...restProps } = props;

  // Derived Values
  const isCurrency = label.toLowerCase().includes("harga");

  return (
    <VStack
      align={"start"}
      overflow={"clip"}
      position={"relative"}
      gap={2}
      h={"full"}
      p={PADDING_MD}
      {...restProps}
    >
      <HStack
        fontSize={"lg"}
        fontWeight={"semibold"}
        align={"center"}
        justify={"space-between"}
        gap={4}
        w={"full"}
      >
        <P color={"fg.muted"}>{label}</P>

        {icon && <AppIcon icon={icon} color={"fg.subtle"} />}
      </HStack>

      <P fontSize={"2xl"} fontWeight={"medium"} color={color} mt={"auto"}>
        {isCurrency ? (
          <FormatNumber
            value={value}
            style={"currency"}
            currency={"IDR"}
            maximumFractionDigits={0}
          />
        ) : (
          <FormatNumber value={value} />
        )}

        {suffix && (
          <Span fontSize={"sm"} color={color} ml={1}>
            {suffix}
          </Span>
        )}
      </P>
    </VStack>
  );
};

const CartStats = () => {
  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { totalField, totalArea, totalIgtData, subtotalPrice } =
    dummyHomeData.cartSummary;

  // Constants
  const cols = isSmContainer ? 2 : 4;
  const STATS: CartStatConfig[] = [
    {
      icon: LayersIcon,
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
    <SimpleGrid
      flex={1}
      columns={cols}
      overflow={"clip"}
      roundedBottom={theme.radii.container}
    >
      {STATS.map((stat, index) => {
        const isLastInRow = (index + 1) % cols === 0;
        const isNotFirstRow = index >= cols;

        return (
          <StatItem
            key={stat.label}
            {...stat}
            borderRight={isLastInRow ? undefined : "2px solid"}
            borderTop={isNotFirstRow ? "2px solid" : undefined}
            borderColor={"bg.canvas"}
          />
        );
      })}
    </SimpleGrid>
  );
};
