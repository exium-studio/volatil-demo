// src/features/internal/statistik-pesanan/pages/internal.transaction-statistic.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import {
  InternalTransactionStatisticSummary,
  InternalTransactionWmsSummary,
} from "@/features/internal/statistik-pesanan/components/internal.transaction-statistic.summary";
import { InternalTransactionStatisticDataView } from "@/features/internal/statistik-pesanan/components/internal.transaction-statistic.data-view";

export const InternalTransactionStatisticPage = () => {
  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <AppContentContainer overflowY={"auto"}>
        <VStack flex={1} minH={0} gap={"md"} w={"full"}>
          {/* Section 1: Ringkasan Metrik Kartu Statistik Pesanan */}
          <InternalTransactionStatisticSummary />

          {/* Section 2: Ringkasan Layanan WMS Spasial */}
          <InternalTransactionWmsSummary />

          {/* Section 3: Tabel Transaksi Global */}
          <InternalTransactionStatisticDataView />
        </VStack>
      </AppContentContainer>
    </Container.Root>
  );
};
