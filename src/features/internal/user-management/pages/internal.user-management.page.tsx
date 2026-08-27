import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalUserManagementDataView } from "@/features/internal/user-management/components/internal.user-management.data-view";
import { InternalUserManagementStats } from "@/features/internal/user-management/components/internal.user-management.stats";
import { useUserManagementQuery } from "@/features/internal/user-management/hooks/use-user-management.query";

export const InternalUserManagementPage = () => {
  // Queries
  const { isLoading, isFetching } = useUserManagementQuery();

  if (isLoading) {
    return (
      <PanelContentContainer h={"auto"}>
        <Skeleton h={"220px"} w={"full"} />
        <Skeleton h={"400px"} w={"full"} />
      </PanelContentContainer>
    );
  }

  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <TopBarLoader isFetching={isFetching} />

      <InternalUserManagementStats />

      <InternalUserManagementDataView />
    </PanelContentContainer>
  );
};
