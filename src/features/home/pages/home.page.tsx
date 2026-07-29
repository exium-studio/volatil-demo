// src/features/home/pages/home.page.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { DataSummary } from "@/features/home/components/home.data-summary";

export const HomePage = () => {
  return (
    <PanelContentContainer>
      <DataSummary />
    </PanelContentContainer>
  );
};
