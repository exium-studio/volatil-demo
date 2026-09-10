// src/features/internal/statistik-pesanan/components/internal.transaction-statistic.summary.tsx

import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { useInternalTransactionStatisticsQuery } from "@/features/internal/statistik-pesanan/hooks/use-internal-transaction-statistic.query";
import { CheckCircleIcon, CircleDollarSignIcon, ListIcon } from "lucide-react";

export const InternalTransactionStatisticSummary = () => {
  // Queries
  const { isLoading, isFetching } = useInternalTransactionStatisticsQuery();

  if (isLoading) {
    return <Skeleton h={"160px"} w={"full"} p={"md"} />;
  }

  return (
    <Container.Root withContext={true} w={"full"} position={"relative"}>
      <TopBarLoader isFetching={isFetching} />

      <Container.Body gap={4} pt={"md"}>
        <HStack align={"center"} justify={"space-between"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Ringkasan Statistik Pesanan"}</Heading>

            <InfoTip
              variant={"icon"}
              appIconProps={{
                size: "xs",
                color: "fg.subtle",
              }}
            >
              {
                "Akumulasi data pesanan aktif, transaksi selesai (settled), dan total pendapatan PNBP mitra."
              }
            </InfoTip>
          </HStack>
        </HStack>

        <VStack flex={1}>
          <Separator borderColor={"bg.canvas"} />

          <InternalTransactionStatsGrid />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const InternalTransactionStatsGrid = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { statistics, isLoading } = useInternalTransactionStatisticsQuery();

  const cols = isSmContainer ? 1 : 3;

  const STATS = [
    {
      icon: ListIcon,
      label: "Total Pesanan Aktif",
      value: statistics.activeOrders,
      suffix: "layanan",
      tooltip: "Layanan data IGT yang dibeli mitra berstatus aktif/beroperasi",
    },
    {
      icon: CheckCircleIcon,
      label: "Total Pesanan Selesai",
      value: statistics.settledTransactions,
      suffix: "transaksi",
      tooltip: "Total transaksi yang telah settled dan lunas terbayar",
    },
    {
      icon: CircleDollarSignIcon,
      label: "Total Pendapatan (Networth)",
      value: statistics.netWorth,
      isCurrency: true,
      color: "blue.fg",
      tooltip: "Total akumulasi penerimaan PNBP dari seluruh transaksi",
    },
  ];

  return (
    <StatGrid.Root columns={cols}>
      {STATS.map((stat, index) => {
        return (
          <StatGrid.Item key={stat.label} index={index} columns={cols}>
            <StatGrid.Header>
              <StatGrid.Label>{stat.label}</StatGrid.Label>
              <StatGrid.Icon icon={stat.icon} color={stat.color} />
            </StatGrid.Header>

            <StatGrid.Value
              value={isLoading ? 0 : stat.value}
              suffix={stat.suffix}
              isCurrency={stat.isCurrency}
              color={stat.color}
            />
          </StatGrid.Item>
        );
      })}
    </StatGrid.Root>
  );
};
