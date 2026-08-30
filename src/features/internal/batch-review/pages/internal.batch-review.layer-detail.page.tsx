// src/features/internal/batch-review/pages/internal.batch-review.layer-detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { IconButton } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { P } from "@/design-system/components/typography/ui/p";
import { SpatialFeaturesDataView } from "@/features/shared/components/spatial-features.data-view";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { flyToIgtLayer } from "@/features/mitra/data-request/utils/fly-to-igt-layer";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { isEmptyArray } from "@/shared/utils/data/array";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPinIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";

export const InternalBatchReviewLayerDetailPage = () => {
  // Hooks
  const { batchId, layerId: encodedLayerId } = useParams({ strict: false }) as {
    batchId: string;
    layerId: string;
  };
  const layerId = decodeURIComponent(encodedLayerId ?? "");
  const navigate = useNavigate();
  const { map } = useMapInstanceStore();

  // States
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
  });
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Queries — resolve layer metadata from master IGT catalog
  const { data: layersData } = useQuery({
    queryKey: queryKeys.map.layers(),
    queryFn: ({ signal }) => getIgtLayers(signal),
    staleTime: 1000 * 60 * 5,
  });

  const selectedIgtLayer = useMemo(() => {
    const list = layersData?.items ?? layersData?.layers ?? [];
    return list.find((l) => l.id === layerId) ?? null;
  }, [layersData, layerId]);

  // Queries — WFS paginated feature attributes
  const { features, totalFeatures, isLoading, isFetching } = useIgtWfsCatalog({
    page: pageState.page,
    pageSize: pageState.pageSize,
    typeName: selectedIgtLayer?.wfs?.wfsTypeName ?? layerId,
    wfsUrl: selectedIgtLayer?.wfs?.wfsUrl ?? "",
  });

  // Derived Values
  const layerTitle =
    selectedIgtLayer?.title ??
    layerId.split(":")[1]?.replace(/_/g, " ") ??
    layerId;

  const hasData = !isEmptyArray(features);

  const handleFlyTo = () => {
    if (!map || !selectedIgtLayer) return;
    void flyToIgtLayer(map, selectedIgtLayer, {});
  };

  return (
    <PanelContentContainer h={"auto"} overflowY={"auto"}>
      <VStack flex={1} gap={0} align={"stretch"} bg={"bg.canvas"} position={"relative"} overflow={"hidden"}>
        {/* Header */}
        <VStack gap={0} w={"full"}>
          <VStack gap={"sm"} w={"full"} p={"md"} bg={"bg.body"}>
            <HStack justify={"space-between"} align={"center"} w={"full"}>
              <HStack gap={"sm"} align={"center"}>
                <BackButton
                  onClick={() =>
                    void navigate({
                      to: "/internal/batch-review/$batchId",
                      params: { batchId },
                    })
                  }
                />

                <P fontWeight={"medium"} fontSize={"md"}>
                  {`Detail Atribut: ${layerTitle}`}
                </P>
              </HStack>

              {selectedIgtLayer && (
                <Tooltip content={"Lihat layer IGT di peta"}>
                  <IconButton
                    variant={"outline"}
                    aria-label={"Lihat layer IGT di peta"}
                    onClick={handleFlyTo}
                  >
                    <AppIcon icon={MapPinIcon} />
                  </IconButton>
                </Tooltip>
              )}
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />
        </VStack>

        {/* Feature Attribute Table */}
        {isLoading && (
          <VStack flex={1} p={"md"} bg={"bg.body"} minH={0}>
            <Skeleton flex={1} w={"full"} h={"full"} rounded={0} />
          </VStack>
        )}

        {!isLoading && !hasData && (
          <VStack flex={1} align={"center"} justify={"center"} p={"md"} bg={"bg.body"} minH={0}>
            <NoResultState />
          </VStack>
        )}

        {!isLoading && hasData && (
          <VStack flex={1} gap={0} bg={"bg.body"} minH={0}>
            <SpatialFeaturesDataView
              wfsFeatures={features}
              totalFeatures={totalFeatures}
              isLoading={isLoading}
              isFetching={isFetching}
              page={pageState.page}
              pageSize={pageState.pageSize}
              setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
              setPageSize={(pageSize) =>
                setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
              }
              selectedItems={selectedItems}
              onSelectedItemChange={({ selectedItems: items }) =>
                setSelectedItems(items)
              }
              canBatchSelect={false}
            />
          </VStack>
        )}
      </VStack>
    </PanelContentContainer>
  );
};
