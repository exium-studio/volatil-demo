// src/features/mitra/shared/components/wfs-data-list/wfs-data-list.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import type { DataViewItemActionsGenerator } from "@/design-system/components/data-display/types/data-view.type";
import { DataViewFooter } from "@/design-system/components/data-display/ui/data-view-footer";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import type {
  SpatialFeaturesDataViewContentProps,
  SpatialFeaturesDataViewProps,
} from "@/features/shared/types/spatial-features-data-view.type";
import { isEmptyArray } from "@/shared/utils/data/array";
import { MapPinIcon } from "lucide-react";
import { memo, useMemo } from "react";

export const SpatialFeaturesDataView = memo(
  (props: SpatialFeaturesDataViewProps) => {
    // Props
    const {
      wfsFeatures,
      page,
      pageSize,
      totalFeatures,
      setPage,
      setPageSize,
      selectedItems,
      onSelectedItemChange,
      canBatchSelect = false,
      batchActions,
      extraItemActions,
      isLoading = false,
      isFetching = false,
      ...restProps
    } = props;

    // Stores
    const { theme } = useThemeStore();

    // Hooks — Delay heavy table mounting to allow initial skeleton render
    const isMounted = useMountTimeout(50);

    // Derived Values — Dynamic Attribute Keys from WFS features
    const attributeKeys = useMemo(() => {
      if (wfsFeatures.length > 0 && wfsFeatures[0]?.properties) {
        const keys = Object.keys(wfsFeatures[0].properties);
        if (keys.length > 0) {
          return keys.filter((key) => key !== "geom" && key !== "geometry");
        }
      }
      return [
        "id",
        "kodewilaya",
        "kabupaten",
        "kecamatan",
        "kelurahan",
        "nib",
        "luastertul",
      ];
    }, [wfsFeatures]);

    const hasPagination =
      page != null && pageSize != null && totalFeatures != null;

    if (!isMounted || isLoading || (isFetching && isEmptyArray(wfsFeatures))) {
      return (
        <Skeleton h={"full"} w={"full"} flex={1} roundedTop={0} p={"md"} />
      );
    }

    return (
      <>
        <TopBarLoader isFetching={isFetching} />

        <VStack
          flex={1}
          overflow={"hidden"}
          bg={"bg.canvas"}
          w={"full"}
          h={"full"}
          position={"relative"}
          {...restProps}
        >
          <SpatialFeaturesDataViewContent
            wfsFeatures={wfsFeatures}
            attributeKeys={attributeKeys}
            canBatchSelect={canBatchSelect}
            batchActions={batchActions}
            extraItemActions={extraItemActions}
            page={page}
            pageSize={pageSize}
            selectedItems={selectedItems}
            onSelectedItemChange={onSelectedItemChange}
          />

          {hasPagination && (
            <DataViewFooter
              page={page}
              pageSize={pageSize}
              currentDataLength={wfsFeatures.length}
              totalData={totalFeatures}
              totalPage={Math.ceil(totalFeatures / pageSize)}
              setPage={setPage}
              setPageSize={setPageSize}
              roundedBottom={theme.radii.container}
            />
          )}
        </VStack>
      </>
    );
  },
);

const SpatialFeaturesDataViewContent = memo(
  (props: SpatialFeaturesDataViewContentProps) => {
    // Props
    const {
      wfsFeatures,
      attributeKeys,
      canBatchSelect,
      batchActions,
      extraItemActions,
      page,
      pageSize,
      selectedItems,
      onSelectedItemChange,
    } = props;

    // Stores
    const map = useMapInstanceStore((state) => state.map);

    // Derived Values
    const dataList = useMemo(
      () => ({
        headers: attributeKeys.map((key) => ({
          th: key,
          sortable: key === "id" || key === "kodewilaya" || key === "gid",
        })),

        items: wfsFeatures.map((feature) => {
          const featureId = String(
            feature.properties?.id ??
              feature.properties?.gid ??
              feature.id ??
              "",
          );
          return {
            id: featureId,
            data: feature as unknown as Record<string, unknown>,
            columns: attributeKeys.map((key) => ({
              value: feature.properties?.[key] ?? "-",
              align: "start" as const,
            })),
          };
        }),

        batchActions,

        itemActions: [
          {
            key: "fly-to-feature",
            label: "Lihat di Peta",
            icon: MapPinIcon,
            onClick: (
              _data: Record<string, unknown>,
              formattedItem: FormattedListItem,
            ) => {
              const feat = formattedItem.data as unknown as
                | GeoJSON.Feature
                | Record<string, unknown>
                | undefined;
              const currentMap = map ?? useMapInstanceStore.getState().map;
              if (!currentMap || !feat) return;
              highlightFeatureOnMap(
                currentMap,
                feat as unknown as GeoJSON.Feature,
              );
            },
          },
          ...(extraItemActions ?? []),
        ] as DataViewItemActionsGenerator[],
      }),
      [wfsFeatures, attributeKeys, map, batchActions, extraItemActions],
    );

    return (
      <DataView.Table.Root
        headers={dataList.headers}
        items={dataList.items}
        batchActions={dataList.batchActions}
        itemActions={dataList.itemActions}
        canBatchSelect={canBatchSelect}
        page={page}
        pageSize={pageSize}
        selectedItems={selectedItems}
        onSelectedItemChange={({ selectedItems: next }) => {
          onSelectedItemChange?.({
            selectedItems: next as FormattedListItem[],
          });
        }}
        flex={"undefined"}
        rounded={0}
      >
        <DataView.Table.Header />
        <DataView.Table.Body />
      </DataView.Table.Root>
    );
  },
);
