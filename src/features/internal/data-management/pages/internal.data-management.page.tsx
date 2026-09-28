// src/features/internal/data-management/pages/internal.data-management.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalDataManagementDataView } from "@/features/internal/data-management/components/internal.data-management.data-view";

export const InternalDataManagementPage = () => {
  return (
    <AppContentContainer h={"auto"} position={"relative"}>
      <Container.Root withContext={true} flex={1}>
        <Container.Body overflowY={"auto"}>
          <InternalDataManagementDataView />
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};
