// src/design-system/components/map/ui/map.controls/map.workspace-layer-management.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { useMapLayerStore } from "@/design-system/components/map/stores/map.layer.store";
import type {
  MapLayerManagementTriggerRenderProps,
  MapWorkspaceLayerManagementProps,
} from "@/design-system/components/map/types/map.layer-management.type";
import { MapLayerManagementPanel } from "@/design-system/components/map/ui/map.controls/map.layer-management-panel";
import { MapOverlayContainer } from "@/design-system/components/map/ui/map.overlay";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { CountBadge } from "@/design-system/components/typography/ui/count-badge";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { useMitraWorkspaceDetailQuery } from "@/features/mitra/my-data/hooks/use-mitra-my-data";
import type { MyDataItem } from "@/features/mitra/my-data/types/my-data.type";
import { useParams } from "@tanstack/react-router";
import { DatabaseIcon } from "lucide-react";
import { memo, useCallback } from "react";

export const MapWorkspaceLayerManagement = memo(
  (props: MapWorkspaceLayerManagementProps) => {
    // Props
    const { children } = props;

    // Hooks
    const params = useParams({ strict: false }) as { workspaceId?: string };
    const workspaceId = params.workspaceId;
    const { flyTo } = useFlyToLayer();

    // Stores
    const { setCustomLayerConfig, setLayerEnabled } = useMapLayerStore();

    // Queries
    const {
      data: workspace,
      isLoading,
      isError,
      error,
      refetch,
    } = useMitraWorkspaceDetailQuery(workspaceId);

    const enrichedLayers: MyDataItem[] = (workspace?.layers ?? []).map(
      (item) => ({
        ...item,
        wmsUrl: workspace?.wmsUrl ?? item.wmsUrl,
        apiKey: workspace?.apiKey ?? item.apiKey,
        wms: {
          url: workspace?.wmsUrl ?? item.wms?.url ?? "",
          baseUrl: workspace?.wmsUrl ?? item.wms?.baseUrl ?? "",
        },
      }),
    );

    // Handlers
    const handleToggleLayer = useCallback(
      (item: MyDataItem, checked: boolean) => {
        if (checked) {
          const wmsUrl = workspace?.wmsUrl ?? item.wms?.url;
          if (!wmsUrl) return;

          const layerName =
            item.wmsLayers ??
            item.wfsTypeName ??
            item.id;

          setCustomLayerConfig(item.id, {
            wmsUrl,
            layers: layerName,
            spatialBasis: item.spatialBasis,
          });
          setLayerEnabled(item.id, true);
        } else {
          setLayerEnabled(item.id, false);
          setCustomLayerConfig(item.id, null);
        }
      },
      [workspace?.wmsUrl, setCustomLayerConfig, setLayerEnabled],
    );

    const handleFlyToLayer = useCallback(
      (item: MyDataItem) => {
        void flyTo({
          id: item.id,
          title: item.title || item.label,
          bbox: item.bbox,
          spatialBasis: item.spatialBasis,
        });
      },
      [flyTo],
    );

    return (
      <MapLayerManagementPanel<MyDataItem>
        title={"Manajemen Layer Data Saya"}
        tooltipContent={"Manajemen Layer Data Saya"}
        badgeLabel={`${enrichedLayers.length} layer`}
        loadingLabel={"Memuat layer workspace..."}
        errorTitle={"Gagal Memuat Layer Workspace"}
        errorMessage={"Terjadi kesalahan saat memuat data layer workspace."}
        emptyLabel={"Tidak ada data layer pada workspace ini"}
        layers={enrichedLayers}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => {
          void refetch();
        }}
        showSymbology={true}
        onToggleLayer={handleToggleLayer}
        onFlyToLayer={handleFlyToLayer}
      >
        {children ??
          (({ enabledCount }: MapLayerManagementTriggerRenderProps) => (
            <MapOverlayContainer p={"2px"}>
              <Tooltip
                content={"Manajemen Layer Data Saya"}
                positioning={{ placement: "bottom" }}
              >
                <Box position={"relative"}>
                  <IconButton size={"xs"}>
                    <AppIcon icon={DatabaseIcon} boxSize={5} />
                  </IconButton>
                  <CountBadge count={enabledCount} floating={true} />
                </Box>
              </Tooltip>
            </MapOverlayContainer>
          ))}
      </MapLayerManagementPanel>
    );
  },
);
