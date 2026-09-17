// src/features/mitra/home/pages/mitra.home.page.tsx

import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { MitraHomeCartSummary } from "@/features/mitra/home/components/mitra.home.cart-summary";
import { MitraHomeDataAvailability } from "@/features/mitra/home/components/mitra.home.data-availability";
import { MitraHomeDataSummary } from "@/features/mitra/home/components/mitra.home.data-summary";
import { MitraHomeFinancialFlow } from "@/features/mitra/home/components/mitra.home.financial-flow";
import { MitraHomeLastTransaction } from "@/features/mitra/home/components/mitra.home.last-transaction";

export const MitraHomePage = () => {
  return (
    <AppContentContainer h={"auto"} position={"relative"}>
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
