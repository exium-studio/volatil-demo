// src/features/mitra/shared/components/wfs-data-list/wfs-data-list.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { PADDING } from "@/design-system/constants/styles";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import type {
  WfsFeaturesDataListContentProps,
  WfsFeaturesDataListProps,
} from "@/features/mitra/shared/types/wfs-data-list.type";
import { IconCurrentLocation } from "@tabler/icons-react";
import { memo, useMemo } from "react";

export const WfsFeaturesDataList = memo((props: WfsFeaturesDataListProps) => {
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
    canBatchSelect = true,
    batchActions,
    extraItemActions,
    isLoading = false,
    isFetching = false,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks — Delay heavy table mounting to allow initial skeleton render
  const isReady = useMountTimeout(50);

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

  if (!isReady || isLoading || (isFetching && wfsFeatures.length === 0)) {
    return (
      <Skeleton h={"full"} w={"full"} flex={1} rounded={0} p={PADDING.md} />
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
        <Box
          w={"full"}
          h={"full"}
          position={"relative"}
          overflow={"hidden"}
          flex={1}
        >
          <WfsFeaturesDataListContent
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
        </Box>

        {hasPagination && (
          <DataListFooter
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
});

const WfsFeaturesDataListContent = memo(
  (props: WfsFeaturesDataListContentProps) => {
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
          (item: FormattedListItem) => {
            const feat = item.data as unknown as GeoJSON.Feature | undefined;
            return (
              <Menu.Item
                key={"fly-to"}
                value={"fly-to"}
                onClick={() => {
                  if (!feat?.geometry || !map) return;
                  highlightFeatureOnMap(map, feat);
                }}
              >
                <AppIcon icon={IconCurrentLocation} />
                {"Lihat di Peta"}
              </Menu.Item>
            );
          },
          ...(extraItemActions ?? []),
        ] as DataListItemActionsGenerator[],
      }),
      [wfsFeatures, attributeKeys, map, batchActions, extraItemActions],
    );

    return (
      <DataListTable.Root
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
        rounded={0}
        pb={0}
        shadow={"none"}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>
    );
  },
);
