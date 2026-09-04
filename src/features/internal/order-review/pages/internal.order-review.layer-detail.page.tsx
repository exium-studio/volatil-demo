// src/features/internal/order-review/pages/internal.order-review.layer-detail.page.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { IconButton } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { P } from "@/design-system/components/typography/ui/p";
import { SpatialFeaturesDataView } from "@/features/shared/components/spatial-features.data-view";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { isEmptyArray } from "@/shared/utils/data/array";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPinIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";

export const InternalOrderReviewLayerDetailPage = () => {
  // Hooks
  const { orderId, layerId: encodedLayerId } = useParams({ strict: false }) as {
    orderId: string;
    layerId: string;
  };
  const layerId = decodeURIComponent(encodedLayerId ?? "");
  const { flyTo } = useFlyToLayer();

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
  });

  // Handlers
  const handlePageChange = (newPage: number) => {
    setPageState((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageState({ page: 1, pageSize: newPageSize });
  };

  const handleFlyTo = () => {
    if (selectedIgtLayer) {
      void flyTo(selectedIgtLayer);
    }
  };

  return (
    <PanelContentContainer h={"auto"}>
      <VStack flex={1} w={"full"} align={"stretch"} gap={0}>
        {/* Header Bar */}
        <HStack
          p={"md"}
          justify={"space-between"}
          align={"center"}
          bg={"bg.body"}
          borderBottom={"1px solid"}
          borderColor={"border.subtle"}
        >
          <HStack gap={"sm"} align={"center"}>
            <BackButton />

            <VStack align={"start"} gap={0}>
              <P fontWeight={"semibold"} fontSize={"md"}>
                {selectedIgtLayer?.title ?? layerId}
              </P>
              <P fontSize={"xs"} color={"fg.subtle"}>
                {`Layer ID: ${layerId} • Pesanan: ${orderId}`}
              </P>
            </VStack>
          </HStack>

          <HStack gap={"xs"}>
            <Tooltip content={"Arahkan kamera peta ke layer ini"}>
              <IconButton
                aria-label={"Zoom to layer"}
                variant={"outline"}
                size={"sm"}
                onClick={handleFlyTo}
              >
                <AppIcon icon={MapPinIcon} />
              </IconButton>
            </Tooltip>
          </HStack>
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Content Body: Features Table */}
        <VStack flex={1} w={"full"} p={"md"} bg={"bg.canvas"}>
          {isLoading ? (
            <Skeleton h={"350px"} rounded={"md"} w={"full"} />
          ) : isEmptyArray(features) ? (
            <NoResultState
              title={"Data Fitur Tidak Tersedia"}
              description={
                "Tidak dapat memuat atribut fitur spasial dari endpoint WFS layer ini."
              }
            />
          ) : (
            <SpatialFeaturesDataView
              wfsFeatures={features}
              totalFeatures={totalFeatures}
              page={pageState.page}
              pageSize={pageState.pageSize}
              isFetching={isFetching}
              selectedItems={selectedItems}
              onSelectedItemChange={({ selectedItems: newItems }) => {
                setSelectedItems(newItems);
              }}
              setPage={handlePageChange}
              setPageSize={handlePageSizeChange}
            />
          )}
        </VStack>
      </VStack>
    </PanelContentContainer>
  );
};
