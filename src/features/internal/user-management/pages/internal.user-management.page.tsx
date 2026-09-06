import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalUserManagementDataView } from "@/features/internal/user-management/components/internal.user-management.data-view";
import { InternalUserManagementStats } from "@/features/internal/user-management/components/internal.user-management.stats";

export const InternalUserManagementPage = () => {
  return (
    <PanelContentContainer h={"auto"}>
      <InternalUserManagementStats />
      <InternalUserManagementDataView />
    </PanelContentContainer>
  );
};
