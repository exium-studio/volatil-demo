// src\features\help-center\pages\help-center.page.tsx

import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { HelpCenterDataView } from "@/features/help-center/components/help-center.data-view";
import { HelpCenterSummary } from "@/features/help-center/components/help-center.summary";

export const HelpCenterPage = () => {
  return (
    <AppContentContainer overflowY={"auto"}>
      <HelpCenterSummary />

      <HelpCenterDataView />
    </AppContentContainer>
  );
};
