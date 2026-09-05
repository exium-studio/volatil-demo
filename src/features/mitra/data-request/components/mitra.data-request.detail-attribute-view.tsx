// src/features/mitra/data-request/components/mitra.data-request.detail-attribute-view.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { MitraDataRequestDetailAttributeHeader } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-header";
import { SpatialFeaturesDataView } from "@/features/shared/components/spatial-features.data-view";
import { isEmptyArray } from "@/shared/utils/data/array";
import type GeoJSON from "geojson";
import { memo } from "react";

type MitraDataRequestDetailAttributeViewProps = {
  layer: IgtLayerItem | null;
  cqlFilter?: string;
  features: GeoJSON.Feature[];
  totalFeatures: number;
  isLoading: boolean;
  isFetching: boolean;
  page?: number;
  pageSize?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  selectedItems: FormattedListItem[];
  setSelectedItems: (items: FormattedListItem[]) => void;
  showActions?: boolean;
  onBack?: () => void;
};

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

    // Derived Values
    const hasData = !isEmptyArray(features);

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

        {isLoading && (
          <VStack flex={1} p={"md"} bg={"bg.body"} minH={0}>
            <Skeleton flex={1} w={"full"} h={"full"} rounded={0} />
          </VStack>
        )}

        {!isLoading && !hasData && (
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

        {!isLoading && hasData && (
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
