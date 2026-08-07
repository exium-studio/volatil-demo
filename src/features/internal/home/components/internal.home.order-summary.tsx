// src/features/internal/home/components/internal.home.order-summary.tsx

import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
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
import { PADDING_MD, SPACING_MD } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import type {
  InternalHomeOrderStatConfig,
  InternalHomeOrderStatItemProps,
  InternalHomeOrderSummaryHeaderProps,
  InternalHomeOrderSummaryProps,
} from "@/features/internal/home/types/internal.home.order-summary.type";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";
import { dummyInternalOrderSummary } from "@/shared/constants/dummy-data/dummy-internal-home-data";
import {
  CheckCircle2Icon,
  ClipboardListIcon,
  CoinsIcon,
  InboxIcon,
} from "lucide-react";
import { useState } from "react";

const PERIOD_OPTIONS = [
  { value: "1d", label: "1H" },
  { value: "1w", label: "1M" },
  { value: "1m", label: "1B" },
  { value: "1y", label: "1T" },
  { value: "all", label: "Semua", flex: 1 },
];

export const InternalHomeOrderSummary = (
  props: InternalHomeOrderSummaryProps,
) => {
  // States
  const [period, setPeriod] = useState<HomePeriod>("all");

  return (
    <Container.Root flex={"1 1 100%"} withContext={true} {...props}>
      <Container.Body gap={4} pt={PADDING_MD}>
        <InternalHomeOrderSummaryHeader
          period={period}
          onPeriodChange={setPeriod}
        />

        <VStack flex={1}>
          <Separator borderColor={"bg.canvas"} />

          <InternalHomeOrderStats />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const InternalHomeOrderSummaryHeader = (
  props: InternalHomeOrderSummaryHeaderProps,
) => {
  // Props
  const { period, onPeriodChange } = props;

  return (
    <HStack
      wrap={"wrap"}
      align={"center"}
      justify={"space-between"}
      gap={SPACING_MD}
      px={PADDING_MD}
    >
      <VStack gap={1} align={"start"}>
        <P fontSize={"lg"} fontWeight={"semibold"}>
          {"Ringkasan Pesanan"}
        </P>
        <P fontSize={"sm"} color={"fg.subtle"}>
          {"Ringkasan pesanan dari pengguna pada sistem"}
        </P>
      </VStack>

      <SegmentGroupInput
        value={period}
        onValueChange={(e) => onPeriodChange(e.value as HomePeriod)}
        options={PERIOD_OPTIONS}
      />
    </HStack>
  );
};

const InternalHomeOrderSummaryStatItem = (
  props: InternalHomeOrderStatItemProps,
) => {
  // Props
  const { stat, ...restProps } = props;

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
        <P color={"fg.muted"}>{stat.label}</P>

        <AppIcon icon={stat.icon} color={"fg.subtle"} />
      </HStack>

      <P fontSize={"2xl"} fontWeight={"medium"} color={stat.color} mt={"auto"}>
        {stat.isCurrency ? (
          <FormatNumber
            value={stat.value}
            style={"currency"}
            currency={"IDR"}
            maximumFractionDigits={0}
          />
        ) : (
          <FormatNumber value={stat.value} />
        )}

        {stat.suffix && (
          <Span fontSize={"xs"} color={"fg.subtle"} fontWeight={"normal"} ml={1.5}>
            {stat.suffix}
          </Span>
        )}
      </P>
    </VStack>
  );
};

const InternalHomeOrderStats = () => {
  // Stores
  const { theme } = useThemeStore();

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Data
  const { activeOrders, completedOrders, igtRequests, totalRevenue } =
    dummyInternalOrderSummary;

  const cols = isSmContainer ? 2 : 4;

  const STATS: InternalHomeOrderStatConfig[] = [
    {
      icon: ClipboardListIcon,
      label: "Total Pesanan Aktif",
      value: activeOrders,
      suffix: "Pesanan",
    },
    {
      icon: CheckCircle2Icon,
      label: "Total Pesanan Selesai",
      value: completedOrders,
      suffix: "Pesanan",
    },
    {
      icon: InboxIcon,
      label: "Total Permohonan IGT",
      value: igtRequests,
      suffix: "Permohonan",
    },
    {
      icon: CoinsIcon,
      label: "Total Pendapatan",
      value: totalRevenue,
      isCurrency: true,
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
          <InternalHomeOrderSummaryStatItem
            key={stat.label}
            stat={stat}
            borderRight={isLastInRow ? undefined : "2px solid"}
            borderTop={isNotFirstRow ? "2px solid" : undefined}
            borderColor={"bg.canvas"}
          />
        );
      })}
    </SimpleGrid>
  );
};
