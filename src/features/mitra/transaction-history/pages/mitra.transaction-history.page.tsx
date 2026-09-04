// src/features/mitra/transaction-history/pages/mitra.transaction-history.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { TransactionHistoryDataView } from "@/features/mitra/transaction-history/components/transaction-history.data-view";

export const MitraTransactionHistoryPage = () => {
  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <PanelContentContainer overflowY={"auto"}>
        <Container.Body flex={1} minH={0} overflowY={"auto"}>
          <HeaderContainer>
            <Heading>{"Riwayat Transaksi"}</Heading>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <TransactionHistoryDataView />
        </Container.Body>
      </PanelContentContainer>
    </Container.Root>
  );
};
