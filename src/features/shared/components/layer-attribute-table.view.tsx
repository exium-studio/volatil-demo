// src/features/shared/components/layer-attribute-table.view.tsx

import { BackButton } from "@/design-system/components/button/ui/back-button";
import { IconButton } from "@/design-system/components/button/ui/button";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useSelectedIgtLayer } from "@/features/mitra/data-request/hooks/use-selected-igt-layer";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { SpatialFeaturesDataView } from "@/features/shared/components/spatial-features.data-view";
import type { LayerAttributeTableViewProps } from "@/features/shared/types/layer-attribute-table.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import { FocusIcon } from "lucide-react";
import { memo, useMemo, useState } from "react";

export const LayerAttributeTableView = memo(
  (props: LayerAttributeTableViewProps) => {
    // Props
    const {
      layer,
      cqlFilter,
      showActions = true,
      canBatchSelect = false,
      batchActions,
      selectedItems = [],
      onSelectedItemChange,
      onBack,
    } = props;

    // Hooks
    const { layerId, selectLayer, selectedIgtLayer } = useSelectedIgtLayer();
    const { flyTo } = useFlyToLayer();

    // States
    const [pageState, setPageState] = useState({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    });

    // Derived Values — Resolve target layer, layer titles and WFS target params
    const targetLayer = layer ?? selectedIgtLayer;

    const effectiveTypeName = useMemo(() => {
      if (!targetLayer) return "";
      if ("typeName" in targetLayer && targetLayer.typeName)
        return targetLayer.typeName;
      if ("wfs" in targetLayer && targetLayer.wfs?.wfsTypeName)
        return targetLayer.wfs.wfsTypeName;
      if ("wfsTypeName" in targetLayer && targetLayer.wfsTypeName)
        return targetLayer.wfsTypeName;
      if ("wmsLayers" in targetLayer && targetLayer.wmsLayers)
        return targetLayer.wmsLayers;
      return "";
    }, [targetLayer]);

    const effectiveWfsUrl = useMemo(() => {
      if (!targetLayer) return "";
      if ("wfs" in targetLayer && targetLayer.wfs?.wfsUrl)
        return targetLayer.wfs.wfsUrl;
      if ("externalWfsUrl" in targetLayer && targetLayer.externalWfsUrl)
        return targetLayer.externalWfsUrl;
      if ("wfsUrl" in targetLayer && targetLayer.wfsUrl)
        return targetLayer.wfsUrl;
      return "/api/proxy/wfs";
    }, [targetLayer]);

    const layerTitle = useMemo(() => {
      if (!targetLayer) return "Layer IGT";
      if (targetLayer.title) return targetLayer.title;
      if ("label" in targetLayer && targetLayer.label) return targetLayer.label;
      return (
        effectiveTypeName.split(":")[1]?.replace(/_/g, " ") || targetLayer.id
      );
    }, [targetLayer, effectiveTypeName]);

    const spatialBasis = targetLayer?.spatialBasis;

    // Queries — server-side WFS pagination
    const {
      features,
      totalFeatures,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useIgtWfsCatalog({
      page: pageState.page,
      pageSize: pageState.pageSize,
      cqlFilter,
      typeName: effectiveTypeName,
      wfsUrl: effectiveWfsUrl,
      enabled: Boolean(targetLayer && effectiveTypeName && effectiveWfsUrl),
    });

    // Handlers
    const handleBackClick = () => {
      if (layerId) {
        selectLayer(undefined);
      }
      onBack?.();
    };

    const handleFlyToLayer = () => {
      if (!targetLayer) return;
      void flyTo(
        {
          id: targetLayer.id,
          title: targetLayer.title,
          bbox: targetLayer.bbox ?? null,
          spatialBasis: targetLayer.spatialBasis,
          wfs: {
            wfsTypeName: effectiveTypeName,
            wfsUrl: effectiveWfsUrl,
          },
        },
        { cqlFilter },
      );
    };

    const hasData = !isEmptyArray(features);
    const showSkeleton = isLoading || (isFetching && !hasData && !isError);

    return (
      <VStack
        flex={1}
        align={"stretch"}
        gap={0}
        position={"relative"}
        overflow={"auto"}
        w={"full"}
        h={"full"}
        minH={0}
        bg={"bg.body"}
      >
        {/* Header */}
        <HStack
          justify={"space-between"}
          align={"center"}
          w={"full"}
          p={"md"}
          bg={"bg.body"}
        >
          <HStack gap={"sm"} align={"center"} minW={0}>
            <BackButton onClick={handleBackClick} />

            <VStack align={"start"} gap={"xs"} minW={0}>
              <HStack gap={"xs"} align={"center"}>
                <P fontWeight={"semibold"}>{`Detail Atribut: ${layerTitle}`}</P>
                {spatialBasis && <IgtBasisBadge>{spatialBasis}</IgtBasisBadge>}
              </HStack>

              {effectiveTypeName && (
                <P fontSize={"sm"} color={"fg.subtle"}>
                  {effectiveTypeName}
                </P>
              )}
            </VStack>
          </HStack>

          {showActions && (
            <HStack gap={"sm"} align={"center"} flexShrink={0}>
              <Tooltip content={"Lihat layer IGT di peta"}>
                <IconButton
                  variant={"outline"}
                  aria-label={"Lihat layer IGT di peta"}
                  onClick={handleFlyToLayer}
                >
                  <AppIcon icon={FocusIcon} />
                </IconButton>
              </Tooltip>
            </HStack>
          )}
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Content Body */}
        {showSkeleton && (
          <VStack flex={1} p={"md"} bg={"bg.body"} minH={0}>
            <Skeleton flex={1} w={"full"} h={"full"} rounded={0} />
          </VStack>
        )}

        {!showSkeleton && isError && (
          <VStack
            flex={1}
            align={"center"}
            justify={"center"}
            minH={0}
            p={"md"}
            bg={"bg.body"}
          >
            <RetryState
              title={"Gagal Memuat Data Spasial"}
              description={
                error?.message ||
                "Terjadi kesalahan saat memuat data fitur spasial. Silakan coba lagi."
              }
              onRetry={() => {
                void refetch();
              }}
            />
          </VStack>
        )}

        {!showSkeleton && !isError && !hasData && (
          <VStack
            flex={1}
            align={"center"}
            justify={"center"}
            p={"md"}
            bg={"bg.body"}
            minH={0}
          >
            <NoResultState />
          </VStack>
        )}

        {!showSkeleton && hasData && (
          <VStack flex={1} gap={0} bg={"bg.body"} minH={0} overflow={"auto"}>
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
              canBatchSelect={canBatchSelect}
              batchActions={batchActions}
              selectedItems={selectedItems}
              onSelectedItemChange={({ selectedItems: items }) =>
                onSelectedItemChange?.(items)
              }
            />
          </VStack>
        )}
      </VStack>
    );
  },
);
