// src/features/internal/master-geoserver/pages/internal.master-geoserver.page.tsx

import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { InternalMasterGeoserverDataView } from "@/features/internal/master-geoserver/components/internal.master-geoserver.data-view";

export const InternalMasterGeoserverPage = () => {
  return (
    <PanelContentContainer h={"auto"} position={"relative"}>
      <InternalMasterGeoserverDataView />
    </PanelContentContainer>
  );
};
