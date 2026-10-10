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
import {
  CheckCircleIcon,
  CircleDollarSignIcon,
  LoaderIcon,
  ShoppingCartIcon,
  TimerOffIcon,
} from "lucide-react";

export const InternalTransactionStatisticSummary = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { isLoading, isFetching } = useInternalTransactionStatisticsQuery();

  if (isLoading) {
    return (
      <Skeleton h={isSmContainer ? "328px" : "160px"} w={"full"} p={"md"} />
    );
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
      icon: CircleDollarSignIcon,
      label: "Pendapatan WMS Bidang",
      value: statistics.revenueWmsBidang,
      isCurrency: true,
      color: "blue.fg",
      tooltip:
        "Akumulasi total pendapatan PNBP dari transaksi penjualan layanan WMS berbasis Bidang",
    },
    {
      icon: CircleDollarSignIcon,
      label: "Pendapatan WMS Kawasan",
      value: statistics.revenueWmsKawasan,
      isCurrency: true,
      color: "orange.fg",
      tooltip:
        "Akumulasi total pendapatan PNBP dari transaksi penjualan layanan WMS berbasis Kawasan",
    },
    {
      icon: CircleDollarSignIcon,
      label: "Total Pendapatan (Nilai Bersih)",
      value: statistics.netWorth,
      isCurrency: true,
      color: "fg",
      tooltip:
        "Akumulasi total seluruh pendapatan PNBP dari transaksi lunas/settled",
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
              isCurrency={stat.isCurrency}
              color={stat.color}
            />
          </StatGrid.Item>
        );
      })}
    </StatGrid.Root>
  );
};

export const InternalTransactionWmsSummary = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { isLoading, isFetching } = useInternalTransactionStatisticsQuery();

  if (isLoading) {
    return (
      <Skeleton h={isSmContainer ? "420px" : "160px"} w={"full"} p={"md"} />
    );
  }

  return (
    <Container.Root withContext={true} w={"full"} position={"relative"}>
      <TopBarLoader isFetching={isFetching} />

      <Container.Body gap={4} pt={"md"}>
        <HStack align={"center"} justify={"space-between"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading>{"Statistik Layanan WMS"}</Heading>

            <InfoTip
              variant={"icon"}
              appIconProps={{
                size: "xs",
                color: "fg.subtle",
              }}
            >
              {
                "Distribusi status provisioning layanan WMS spasial dari potensi keranjang belanja hingga kedaluwarsa."
              }
            </InfoTip>
          </HStack>
        </HStack>

        <VStack flex={1}>
          <Separator borderColor={"bg.canvas"} />

          <InternalTransactionWmsStatsGrid />
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};

const InternalTransactionWmsStatsGrid = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries
  const { statistics, isLoading } = useInternalTransactionStatisticsQuery();

  const cols = isSmContainer ? 1 : 4;

  const STATS = [
    {
      icon: ShoppingCartIcon,
      label: "Potensi WMS",
      value: statistics.wmsPotential ?? 0,
      suffix: "pesanan",
      color: "blue.fg",
      tooltip: "Diambil dari total item keranjang (cart) seluruh user mitra",
    },
    {
      icon: LoaderIcon,
      label: "WMS Diproses",
      value: statistics.wmsProcessing ?? 0,
      suffix: "layanan",
      color: "purple.fg",
      tooltip:
        "Pesanan dengan status processing (sedang menyiapkan layanan WMS)",
    },
    {
      icon: CheckCircleIcon,
      label: "WMS Aktif",
      value: statistics.wmsActive ?? 0,
      suffix: "layanan",
      color: "green.fg",
      tooltip: "Layanan data spasial berstatus ready / aktif",
    },
    {
      icon: TimerOffIcon,
      label: "WMS Expired",
      value: statistics.wmsExpired ?? 0,
      suffix: "layanan",
      color: "red.fg",
      tooltip: "Layanan data spasial dengan status expired (kedaluwarsa)",
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
              color={stat.color}
            />
          </StatGrid.Item>
        );
      })}
    </StatGrid.Root>
  );
};
