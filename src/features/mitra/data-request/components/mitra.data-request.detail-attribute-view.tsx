// src/features/mitra/data-request/components/mitra.data-request.detail-attribute-view.tsx

import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { MitraDataRequestDetailAttributeHeader } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-header";
import { SpatialFeaturesDataView } from "@/features/shared/components/spatial-features.data-view";
import type { MitraDataRequestDetailAttributeViewProps } from "@/features/mitra/data-request/types/mitra.data-request.igt-layer-view.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import { memo } from "react";

export const MitraDataRequestDetailAttributeView = memo(
  (props: MitraDataRequestDetailAttributeViewProps) => {
    // Props
    const {
      layer,
      cqlFilter,
      features,
      totalFeatures,
      isLoading,
      isFetching,
      page,
      pageSize,
      setPage,
      setPageSize,
      selectedItems,
      setSelectedItems,
      showActions = true,
      onBack,
    } = props;

    // Hooks — Delay mounting to guarantee initial render is always a skeleton and avoid flashing no-result state
    const isMounted = useMountTimeout({
      isOpen: true,
      mountDelay: 250,
    });

    // Derived Values
    const hasData = !isEmptyArray(features);
    const showSkeleton =
      !isMounted || isLoading || (isFetching && !hasData);

    return (
      <VStack
        flex={1}
        gap={0}
        align={"stretch"}
        bg={"bg.canvas"}
        position={"relative"}
        overflow={"hidden"}
      >
        <MitraDataRequestDetailAttributeHeader
          layer={layer}
          cqlFilter={cqlFilter}
          showActions={showActions}
          onBack={onBack}
        />

        {showSkeleton && (
          <VStack flex={1} p={"md"} bg={"bg.body"} minH={0}>
            <Skeleton flex={1} w={"full"} h={"full"} rounded={0} />
          </VStack>
        )}

        {!showSkeleton && !hasData && (
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
          <VStack flex={1} gap={0} bg={"bg.body"} minH={0}>
            <SpatialFeaturesDataView
              wfsFeatures={features}
              totalFeatures={totalFeatures}
              isLoading={isLoading}
              isFetching={isFetching}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              selectedItems={selectedItems}
              onSelectedItemChange={({ selectedItems: items }) =>
                setSelectedItems(items)
              }
            />
          </VStack>
        )}
      </VStack>
    );
  },
);
