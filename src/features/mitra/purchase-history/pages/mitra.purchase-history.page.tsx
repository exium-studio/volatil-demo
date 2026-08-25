// src/features/mitra/purchase-history/pages/mitra.purchase-history.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { PurchaseHistoryDataList } from "@/features/mitra/purchase-history/components/purchase-history.data-list";

export const MitraPurchaseHistoryPage = () => {
  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <PanelContentContainer>
        <Container.Body flex={1} minH={0} overflowY={"auto"}>
          <HeaderContainer>
            <Heading>
              {"Riwayat Transaksi"}
            </Heading>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <PurchaseHistoryDataList />
        </Container.Body>
      </PanelContentContainer>
    </Container.Root>
  );
};
