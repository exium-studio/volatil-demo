// src/features/mitra/cart/components/mitra.cart.data-list.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type { DataListItemActionsGenerator } from "@/design-system/components/data-display/types/data-list.type";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { Menu } from "@/design-system/components/overlay/ui/menu";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type { MitraCartTableProps } from "@/features/mitra/cart/types/cart.type";
import {
  useCartItemsQuery,
  useRemoveFromCart,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { getIgtLayers } from "@/design-system/components/map/services/map-layers.api";
import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { WfsIgtFilterTrigger } from "@/features/mitra/data-request/components/wfs-igt-filter";
import { buildWfsCqlFilter } from "@/features/mitra/data-request/utils/build-wfs-cql-filter";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { getLocalCartIds } from "@/features/mitra/cart/services/cart.service";
import type { WfsIgtFilterValues } from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import { MapPinIcon, SlidersHorizontalIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { IconShoppingCartOff } from "@tabler/icons-react";
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

export const MitraCartDataList = (props: MitraCartTableProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const map = useMapInstanceStore((state) => state.map);
  const { theme } = useThemeStore();
  const { selectedIgtLayer, setSelectedIgtLayer } = useIgtLayerStore();

  // Queries (Get layers dynamically)
  const { data: layersData } = useQuery({
    queryKey: ["igt-layers-list"],
    queryFn: () => getIgtLayers(),
    staleTime: Infinity,
  });

  // Set default selected layer if not set
  useEffect(() => {
    if (layersData?.wfs && layersData.wfs.length > 0 && !selectedIgtLayer) {
      setSelectedIgtLayer(layersData.wfs[0]);
    }
  }, [layersData, selectedIgtLayer, setSelectedIgtLayer]);

  // States
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
  });
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);
  const [searchRaw, setSearchRaw] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState<WfsIgtFilterValues>({});

  // Derived Values
  const debouncedSearch = useDebouncedValue(searchRaw);
  const cqlFilter = useMemo(
    () => buildWfsCqlFilter(appliedFilters),
    [appliedFilters],
  );

  // Check if cart has local IDs
  const localCartIds = getLocalCartIds();
  const hasLocalIds = localCartIds.length > 0;

  // Queries
  const { features, total, totalPages, isLoading, isFetching } =
    useCartItemsQuery({
      page: pageState.page,
      pageSize: pageState.pageSize,
      typeName: selectedIgtLayer?.wfsTypeName ?? "",
      wfsUrl: selectedIgtLayer?.wfsUrl ?? "",
      search: debouncedSearch,
      cqlFilter,
    });

  // Mutations
  const removeItemsMutation = useRemoveFromCart(() => {
    setSelectedItems([]);
  });

  // Derived Values — Dynamic Attribute Keys from WFS features
  const attributeKeys = useMemo(() => {
    if (features.length > 0 && features[0]?.properties) {
      const keys = Object.keys(features[0].properties);
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
  }, [features]);

  // Derived Values — DataList Configuration
  const dataList = useMemo(
    () => ({
      headers: attributeKeys.map((key) => ({
        th: key,
        sortable: key === "id" || key === "gid" || key === "kodewilaya",
      })),

      items: features.map((feature) => {
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

      batchActions: [
        ({
          selectedItemIds,
          clearSelectedItems,
        }: {
          selectedItemIds: string[];
          clearSelectedItems: () => void;
        }) => (
          <Button
            key={"remove-selected"}
            colorPalette={"red"}
            onClick={() => {
              removeItemsMutation.mutate(selectedItemIds);
              clearSelectedItems();
            }}
          >
            <AppIcon icon={Trash2Icon} />
            {"Hapus"}
          </Button>
        ),
      ],

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
    [features, attributeKeys, removeItemsMutation, map],
  );

  return (
    <VStack
      flex={1}
      overflowY={"auto"}
      gap={0}
      align={"stretch"}
      {...restProps}
    >
      {/* If cart is completely empty, show NoDataState immediately */}
      {!hasLocalIds ? (
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          w={"full"}
          py={PADDING.md}
          bg={"bg.body"}
        >
          <NoDataState
            icon={IconShoppingCartOff}
            title={"Keranjang kosong"}
            description={"Tambahkan data IGT dari halaman Permohonan Data"}
          />
        </Box>
      ) : (
        <>
          {/* Action Header — Search, Filter (rendered inside datalist) */}
          <VStack
            wrap={"wrap"}
            justify={"space-between"}
            gap={SPACING.md}
            p={PADDING.md}
            bg={"bg.body"}
          >
            <HStack justify={"space-between"} align={"center"} w={"full"}>
              <HStack gap={SPACING.sm}>
                <SearchInput
                  placeholder={"Cari..."}
                  value={searchRaw}
                  onValueChange={(val) => {
                    setSearchRaw(val);
                    setPageState((prev) => ({ ...prev, page: 1 }));
                  }}
                />

                <WfsIgtFilterTrigger
                  modalKey="mitra-cart-filter-modal"
                  onApply={(filters) => {
                    setAppliedFilters(filters);
                    setPageState((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  <IconButton variant={"outline"}>
                    <AppIcon icon={SlidersHorizontalIcon} />
                  </IconButton>
                </WfsIgtFilterTrigger>
              </HStack>
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          {isLoading ? (
            <Skeleton p={PADDING.md} />
          ) : features.length === 0 ? (
            <Box
              flex={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              w={"full"}
              py={PADDING.md}
              bg={"bg.body"}
            >
              <NoResultState />
            </Box>
          ) : (
            <Box w={"full"} position={"relative"} overflowY={"auto"}>
              <DataListTable.Root
                headers={dataList.headers}
                items={dataList.items}
                batchActions={dataList.batchActions}
                itemActions={dataList.itemActions}
                withNumbering={false}
                canBatchSelect={true}
                selectedItems={selectedItems}
                onSelectedItemChange={({ selectedItems: next }) => {
                  setSelectedItems(next as FormattedListItem[]);
                }}
                page={pageState.page}
                pageSize={pageState.pageSize}
                rounded={0}
                pb={0}
                shadow={"none"}
              >
                <DataListTable.Header />
                <DataListTable.Body />
              </DataListTable.Root>

              <TopBarLoader isFetching={isFetching} />

              <DataListFooter
                page={pageState.page}
                pageSize={pageState.pageSize}
                currentDataLength={features.length}
                totalData={total}
                totalPage={totalPages}
                setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
                setPageSize={(pageSize) =>
                  setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
                }
                roundedBottom={theme.radii.container}
              />
            </Box>
          )}
        </>
      )}
    </VStack>
  );
};
