// src/features/mitra/data-request/components/mitra.data-request.detail-attribute-view.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { PADDING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { MitraDataRequestDetailAttributeHeader } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-header";
import { WfsIgtDataList } from "@/features/mitra/data-request/components/mitra.data-request.wfs-data-list";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { isEmptyArray } from "@/shared/utils/data/array";
import type GeoJSON from "geojson";
import { memo, useEffect, useState } from "react";

export type MitraDataRequestDetailAttributeViewProps = {
  layer: IgtLayerItem | null;
  cqlFilter?: string;
  features: GeoJSON.Feature[];
  totalFeatures: number;
  bidangCount?: number;
  kawasanCount?: number;
  isLoading: boolean;
  isFetching: boolean;
  page?: number;
  pageSize?: number;
  setPage?: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
  selectedItems: FormattedListItem[];
  setSelectedItems: (items: FormattedListItem[]) => void;
  showActions?: boolean;
};

export const MitraDataRequestDetailAttributeView = memo(
  (props: MitraDataRequestDetailAttributeViewProps) => {
    // Props
    const {
      layer,
      cqlFilter,
      features,
      totalFeatures,
      bidangCount,
      kawasanCount,
      isLoading,
      isFetching,
      page,
      pageSize,
      setPage,
      setPageSize,
      selectedItems,
      setSelectedItems,
      showActions = true,
    } = props;

    // Stores
    const { theme } = useThemeStore();

    // Deferred Table Mounting State
    const [isTableReady, setIsTableReady] = useState(false);

    useEffect(() => {
      const raf = requestAnimationFrame(() => {
        setIsTableReady(true);
      });
      return () => cancelAnimationFrame(raf);
    }, []);

    // Hooks (Mutations)
    const addToCartSelectedMutation = useAddToCartSelected();
    const addToCartAllMutation = useAddToCartAll();

    return (
      <VStack
        flex={1}
        gap={0}
        overflowY={"auto"}
        bg={"bg.canvas"}
        w={"full"}
        position={"relative"}
      >
        <MitraDataRequestDetailAttributeHeader
          layer={layer}
          cqlFilter={cqlFilter}
          showActions={showActions}
        />

        {!isTableReady ||
        isLoading ||
        (isFetching && isEmptyArray(features)) ? (
          <Skeleton h={"full"} w={"full"} flex={1} rounded={0} p={PADDING.md} />
        ) : isEmptyArray(features) ? (
          <VStack
            flex={1}
            align={"center"}
            justify={"center"}
            p={PADDING.md}
            bg={"bg.body"}
          >
            <NoResultState query={layer?.wfs?.wfsTypeName || ""} />
          </VStack>
        ) : (
          <VStack
            flex={1}
            gap={PADDING.sm}
            overflow={"hidden"}
            h={"full"}
            w={"full"}
            roundedBottom={theme.radii.container}
          >
            <TopBarLoader isFetching={isFetching} />

            <WfsIgtDataList
              wfsFeatures={features}
              totalFeatures={totalFeatures}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              selectedItems={selectedItems}
              onSelectedItemChange={({ selectedItems: items }) =>
                setSelectedItems(items)
              }
            />

            <MitraDataRequestAddToCartButtons
              selectedItems={selectedItems}
              allItems={features}
              totalBidangCount={bidangCount}
              totalKawasanCount={kawasanCount}
              totalCount={totalFeatures}
              onAddSelectedClick={() => {
                if (!layer) return;
                addToCartSelectedMutation.mutate(
                  selectedItems.map((item) => String(item.id)),
                );
              }}
              onAddAllBothClick={() => {
                if (!layer) return;
                addToCartAllMutation.mutate({
                  cqlFilter,
                  typeName: layer.wfs.wfsTypeName,
                  wfsUrl: layer.wfs.wfsUrl ?? "",
                });
              }}
            />
          </VStack>
        )}
      </VStack>
    );
  },
);
