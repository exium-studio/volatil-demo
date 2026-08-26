// src/features/internal/data-management/pages/internal.data-management.page.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalDataManagementDataList } from "@/features/internal/data-management/components/internal.data-management.data-list";

export const InternalDataManagementPage = () => {
  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <InternalDataManagementDataList />
    </PanelContentContainer>
  );
};
