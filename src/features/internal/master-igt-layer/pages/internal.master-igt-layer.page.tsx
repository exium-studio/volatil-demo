// src/features/internal/master-igt-layer/pages/internal.master-igt-layer.page.tsx

import { Container } from "@/design-system/components/layout/ui/container";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalMasterIgtLayerDataView } from "@/features/internal/master-igt-layer/components/internal.master-igt-layer.data-view";

export const InternalMasterIgtLayerPage = () => {
  return (
    <AppContentContainer h={"auto"} position={"relative"}>
      <Container.Root withContext={true} flex={1}>
        <Container.Body overflowY={"auto"}>
          <InternalMasterIgtLayerDataView />
        </Container.Body>
      </Container.Root>
    </AppContentContainer>
  );
};

export const InternalDataManagementPage = InternalMasterIgtLayerPage;
