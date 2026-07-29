// src/features/home/components/home.cart-summary.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { ClampedP, P } from "@/design-system/components/typography/ui/p";
import { Span } from "@/design-system/components/typography/ui/span";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { PADDING_MD, PADDING_SM } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type { HomeCartSummaryStatItemProps } from "@/features/home/types/home.cart-summary.type";
import { homeData } from "@/shared/constants/dummy-data";
import {
  DatabaseIcon,
  HandCoinsIcon,
  LandPlotIcon,
  LayersIcon,
} from "lucide-react";
import type { ComponentType } from "react";

const Header = () => {
  return (
    <HStack align={"center"} justify={"space-between"} px={PADDING_MD}>
      <VStack gap={1}>
        <P>Ringkasan Keranjang Pembelian</P>
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
      p={PADDING_MD}
      {...restProps}
    >
      <HStack align={"center"} justify={"space-between"} gap={4} w={"full"}>
        <P color={"fg.muted"}>{label}</P>

        {icon && <AppIcon icon={icon} color={"fg.subtle"} />}
      </HStack>

      <ClampedP fontSize={"2xl"} fontWeight={"medium"} color={color}>
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
      </ClampedP>

      {/* {icon && (
        <AppIcon
          icon={icon}
          boxSize={"48px"}
          strokeWidth={"1.25px"}
          color={color}
          mt={3}
          mb={-6}
          transform={"rotate(20deg)"}
        />
      )} */}
    </VStack>
  );
};

interface CartStatConfig {
  icon: ComponentType;
  label: string;
  value: number;
  suffix?: string;
  color?: string;
}

const CartStats = () => {
  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { totalField, totalArea, totalIgtData, subtotalPrice } =
    homeData.cartSummary;

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
      icon: HandCoinsIcon,
      label: "Subtotal Harga",
      value: subtotalPrice,
    },
  ];

  return (
    <SimpleGrid
      columns={cols}
      overflow={"clip"}
      roundedBottom={theme.radii.container}
      borderTop={"2px solid"}
      borderColor={"bg.canvas"}
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

export const CartSummary = () => {
  return (
    <Container.Root px={PADDING_SM} withContext={true}>
      <Container.Body gap={4} pt={PADDING_MD}>
        <Header />

        <CartStats />
      </Container.Body>
    </Container.Root>
  );
};
