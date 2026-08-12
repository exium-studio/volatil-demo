// src/features/mitra/data-request/components/mitra.data-request.wfs-data-list.tsx

import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  WFS_BIDANG_ATTRIBUTE_MAP,
  WFS_BIDANG_ATTRIBUTES,
} from "@/features/mitra/data-request/constants/mitra.data-request.constant";
import type { WfsIgtDataListProps } from "@/features/mitra/data-request/types/mitra.data-request.wfs-data-list.type";
import { MapPinIcon } from "lucide-react";
import { memo, useMemo } from "react";
import type GeoJSON from "geojson";

/** Derives [lng, lat] centroid from a GeoJSON geometry, or null if unsupported. */
const getGeometryCentroid = (
  geom: GeoJSON.Geometry,
): [number, number] | null => {
  if (geom.type === "Point") {
    const [lng, lat] = geom.coordinates as [number, number];
    return [lng, lat];
  }

  if (geom.type === "Polygon" && geom.coordinates[0]?.length > 0) {
    const ring = geom.coordinates[0];
    const lng =
      ring.reduce((acc: number, c: number[]) => acc + c[0], 0) / ring.length;
    const lat =
      ring.reduce((acc: number, c: number[]) => acc + c[1], 0) / ring.length;
    return [lng, lat];
  }

  if (geom.type === "MultiPolygon" && geom.coordinates[0]?.[0]?.length > 0) {
    const ring = geom.coordinates[0][0];
    const lng =
      ring.reduce((acc: number, c: number[]) => acc + c[0], 0) / ring.length;
    const lat =
      ring.reduce((acc: number, c: number[]) => acc + c[1], 0) / ring.length;
    return [lng, lat];
  }

  return null;
};

/** Formats a property key string into a readable column title if not present in map. */
const formatColumnHeader = (key: string): string => {
  if (key in WFS_BIDANG_ATTRIBUTE_MAP) {
    return WFS_BIDANG_ATTRIBUTE_MAP[
      key as keyof typeof WFS_BIDANG_ATTRIBUTE_MAP
    ];
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
};

/**
 * Shared WFS data list component used across Tab Catalog, Tab Draw AOI, and Tab Upload AOI.
 * Renders a dynamic table of WFS features based on feature properties, with "Lihat di Peta" item action and optional pagination footer.
 */
export const WfsIgtDataList = memo((props: WfsIgtDataListProps) => {
  // Props
  const {
    wfsFeatures,
    page,
    pageSize,
    totalFeatures,
    setPage,
    setPageSize,
    onSelectedItemChange,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();
  const map = useMapInstanceStore((state) => state.map);

  // Derived Values — Dynamic Attribute Keys
  const attributeKeys = useMemo(() => {
    if (wfsFeatures.length > 0 && wfsFeatures[0].properties) {
      const keys = Object.keys(wfsFeatures[0].properties);
      if (keys.length > 0) return keys;
    }
    return WFS_BIDANG_ATTRIBUTES;
  }, [wfsFeatures]);

  // Derived Values — DataList Configuration
  const dataList = useMemo(
    () => ({
      headers: attributeKeys.map((key) => ({
        th: formatColumnHeader(key),
        sortable: key === "id" || key === "kodewilaya" || key === "gid",
      })),

      items: wfsFeatures.map((feature) => {
        const featureId = String(
          feature.properties?.id ?? feature.properties?.gid ?? feature.id ?? "",
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

      itemActions: [
        (item: FormattedListItem) => {
          const feat = item.data as unknown as GeoJSON.Feature | undefined;
          return (
            <Menu.Item
              key={"fly-to"}
              value={"fly-to"}
              onClick={() => {
                if (!feat?.geometry || !map) return;
                const centroid = getGeometryCentroid(feat.geometry);
                if (centroid) {
                  map.flyTo({ center: centroid, zoom: 16 });
                }
              }}
            >
              <AppIcon icon={MapPinIcon} />
              {"Lihat di Peta"}
            </Menu.Item>
          );
        },
      ] as DataListItemActionsGenerator[],
    }),
    [wfsFeatures, attributeKeys, map],
  );

  const hasPagination =
    page != null && pageSize != null && totalFeatures != null;

  return (
    <VStack
      flex={1}
      overflowY={"auto"}
      bg={"bg.canvas"}
      w={"full"}
      {...restProps}
    >
      <DataListTable.Root
        headers={dataList.headers}
        items={dataList.items}
        itemActions={dataList.itemActions}
        canBatchSelect
        page={page}
        pageSize={pageSize}
        onSelectedItemChange={({ selectedItems }) => {
          onSelectedItemChange?.({
            selectedItems: selectedItems as FormattedListItem[],
          });
        }}
        roundedTop={0}
        roundedBottom={hasPagination ? 0 : theme.radii.container}
        shadow={"none"}
      >
        <DataListTable.Header />
        <DataListTable.Body />
      </DataListTable.Root>

      {hasPagination && (
        <DataListFooter
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          currentDataLength={wfsFeatures.length}
          totalData={totalFeatures}
          totalPage={totalFeatures / pageSize}
          roundedBottom={theme.radii.container}
        />
      )}
    </VStack>
  );
});
