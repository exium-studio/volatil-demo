// src/features/mitra/transaction-history/pages/mitra.transaction-history.page.tsx

// src\features\mitra\transaction-history\pages\mitra.transaction-history.page.tsx

// src\features\mitra\transaction-history\pages\mitra.transaction-history.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { TransactionHistoryDataView } from "@/features/mitra/transaction-history/components/mitra.transaction-history.data-view";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";

export const MitraTransactionHistoryPage = () => {
  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <AppContentContainer overflowY={"auto"}>
        <Container.Body flex={1} minH={0} overflowY={"auto"}>
          <HeaderContainer>
            <AppNavTitle navsMap={APP_NAVS_MAP} />
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <TransactionHistoryDataView />
        </Container.Body>
      </AppContentContainer>
    </Container.Root>
  );
};
