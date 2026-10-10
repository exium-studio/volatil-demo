// src/features/mitra/home/pages/mitra.home.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { toast } from "@/design-system/components/toast";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { MitraHomeCartSummary } from "@/features/mitra/home/components/mitra.home.cart-summary";
import { MitraHomeDataAvailability } from "@/features/mitra/home/components/mitra.home.data-availability";
import { MitraHomeDataSummary } from "@/features/mitra/home/components/mitra.home.data-summary";
import { MitraHomeFinancialFlow } from "@/features/mitra/home/components/mitra.home.financial-flow";
import { MitraHomeLastTransaction } from "@/features/mitra/home/components/mitra.home.last-transaction";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useQueryClient } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import { useState } from "react";

export const MitraHomePage = () => {
  // Hooks
  const queryClient = useQueryClient();

  // States
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.mitra.home.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.mitra.cart.all }),
        queryClient.invalidateQueries({ queryKey: ["mitra", "transactions"] }),
      ]);
      toast.success("Data dashboard berhasil diperbarui", {
        group: "Dashboard",
      });
    } catch {
      toast.error("Gagal memperbarui data dashboard", {
        group: "Dashboard",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AppContentContainer h={"auto"} position={"relative"}>
      {/* Dashboard Top Header */}
      <HStack gap={"xs"} align={"center"} justify={"space-between"} w={"full"}>
        <HStack gap={"xs"} align={"center"}>
          <Heading>{"Dashboard Mitra"}</Heading>

          <InfoTip
            variant={"icon"}
            appIconProps={{
              size: "xs",
              color: "fg.subtle",
            }}
          >
            {
              "Ringkasan statistik ketersediaan data spasial IGT, status pemanfaatan data, alur transaksi, dan keranjang pembelian."
            }
          </InfoTip>
        </HStack>

        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={handleRefresh}
          loading={isRefreshing}
          disabled={isRefreshing}
        >
          <AppIcon icon={RefreshCwIcon} />
          {"Segarkan Data"}
        </Button>
      </HStack>

      {/* 1. Ketersediaan Data Spasial IGT */}
      <MitraHomeDataAvailability />

      {/* 2. Ringkasan Status Data IGT Mitra */}
      <MitraHomeDataSummary />

      {/* 3. Ringkasan Keranjang, Alur Keuangan, dan Transaksi Terakhir */}
      <HStack wrap={"wrap"} gap={"sm"}>
        <MitraHomeCartSummary flex={"1 1 300px"} />
        <MitraHomeFinancialFlow flex={"1 1 500px"} />
        <MitraHomeLastTransaction flex={"1 1 100%"} />
      </HStack>
    </AppContentContainer>
  );
};

export const HomePage = MitraHomePage;
