// src/features/internal/mitra-registration/pages/internal.mitra-registration.page.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalMitraRegistrationDataView } from "@/features/internal/mitra-registration/components/internal.mitra-registration.data-view";

export const InternalMitraRegistrationPage = () => {
  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <InternalMitraRegistrationDataView />
    </PanelContentContainer>
  );
};
