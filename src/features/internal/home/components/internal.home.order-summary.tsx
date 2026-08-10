// src/features/internal/home/components/internal.home.order-summary.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { PADDING_MD, SPACING_MD } from "@/design-system/constants/styles";
import type {
  InternalHomeOrderStatConfig,
  InternalHomeOrderSummaryHeaderProps,
  InternalHomeOrderSummaryProps,
} from "@/features/internal/home/types/internal.home.order-summary.type";
import { useInternalHomeData } from "@/features/internal/home/hooks/use-internal-home.query";
import {
  CheckCircle2Icon,
  ClipboardListIcon,
  CoinsIcon,
  InboxIcon,
} from "lucide-react";
import { useState } from "react";
import type { HomePeriod } from "@/features/mitra/home/types/mitra.home.data-summary.type";

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
    <Container.Root flex={1} withContext={true} {...props}>
      <Container.Body gap={4} pt={PADDING_MD}>
        <InternalHomeOrderSummaryHeader
          period={period}
          onPeriodChange={setPeriod}
        />

        <VStack flex={1}>
          <Separator borderColor={"bg.canvas"} />

          <InternalHomeOrderStats period={period} />
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

const InternalHomeOrderStats = (props: { period: HomePeriod }) => {
  // Props
  const { period } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries / Data
  const { orderSummary } = useInternalHomeData(period);

  const { activeOrders, completedOrders, igtRequests, totalRevenue } =
    orderSummary;

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
    <StatGrid.Root columns={cols}>
      {STATS.map((stat, index) => (
        <StatGrid.Item key={stat.label} index={index} columns={cols}>
          <StatGrid.Header>
            <StatGrid.Label>{stat.label}</StatGrid.Label>
            <StatGrid.Icon icon={stat.icon} color={stat.color} />
          </StatGrid.Header>

          <StatGrid.Value
            value={stat.value}
            suffix={stat.suffix}
            isCurrency={stat.isCurrency}
            color={stat.color}
          />
        </StatGrid.Item>
      ))}
    </StatGrid.Root>
  );
};
