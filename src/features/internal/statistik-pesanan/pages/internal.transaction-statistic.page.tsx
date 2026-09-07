// src/features/internal/statistik-pesanan/pages/internal.transaction-statistic.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { InternalTransactionStatisticSummary } from "@/features/internal/statistik-pesanan/components/internal.transaction-statistic.summary";
import { InternalTransactionStatisticDataView } from "@/features/internal/statistik-pesanan/components/internal.transaction-statistic.data-view";

export const InternalTransactionStatisticPage = () => {
  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <AppContentContainer overflowY={"auto"}>
        <VStack flex={1} minH={0} gap={"md"} w={"full"}>
          {/* Section Atas: Ringkasan Metrik Kartu Statistik */}
          <InternalTransactionStatisticSummary />

          {/* Section Bawah: Tabel Transaksi Global */}
          <InternalTransactionStatisticDataView />
        </VStack>
      </AppContentContainer>
    </Container.Root>
  );
};
