import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { HelpCenterDataView } from "@/features/mitra/help-center/components/help-center.data-view";
import { HelpCenterSummary } from "@/features/mitra/help-center/components/help-center.summary";

export const HelpCenterPage = () => {
  return (
    <AppContentContainer overflowY={"auto"}>
      <HelpCenterSummary />

      <HelpCenterDataView />
    </AppContentContainer>
  );
};
