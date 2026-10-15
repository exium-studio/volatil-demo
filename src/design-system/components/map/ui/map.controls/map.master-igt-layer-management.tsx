import type { MapMasterIgtLayerManagementProps } from "@/design-system/components/map/types/map.layer-management.type";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { MapLayerManagementPanel } from "@/design-system/components/map/ui/map.controls/map.layer-management-panel";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { getUserSession } from "@/shared/utils/user/user-session.utils";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";

export const MapMasterIgtLayerManagement = memo((props: MapMasterIgtLayerManagementProps) => {
  // Props
  const { children } = props;

  // Derived Values
  const userSession = getUserSession();
  const isAuthenticated = Boolean(userSession?.id);

  // Queries — list of all active master IGT catalog layers
  const {
    data: layersData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
    enabled: isAuthenticated,
  });

  const layers: IgtLayerItem[] = layersData?.items ?? [];

  return (
    <MapLayerManagementPanel<IgtLayerItem>
      title={"Manajemen Layer & Simbologi IGT"}
      tooltipContent={"Manajemen Layer IGT"}
      loadingLabel={"Memuat master layer..."}
      errorTitle={"Gagal Memuat Master Layer"}
      errorMessage={"Terjadi kesalahan saat memuat data master layer IGT."}
      emptyLabel={"Tidak ada data layer IGT yang tersedia"}
      layers={layers}
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => {
        void refetch();
      }}
      showSymbology={true}
    >
      {children}
    </MapLayerManagementPanel>
  );
});
