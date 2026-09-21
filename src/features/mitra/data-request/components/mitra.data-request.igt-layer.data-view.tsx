// src/features/mitra/data-request/components/mitra.data-request.igt-layer.data-view.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { P } from "@/design-system/components/typography/ui/p";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { useAddToCartMultipleLayers } from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import type { MitraDataRequestIgtLayerDataViewProps } from "@/features/mitra/data-request/types/mitra.data-request.igt-layer-view.type";
import { buildIgtCqlFilter } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import { FilterAdministrativeAreaTrigger } from "@/features/shared/components/filter.administrative-area";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useQuery } from "@tanstack/react-query";
import {
  FocusIcon,
  InfoIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  TablePropertiesIcon,
} from "lucide-react";
import { useAdminBoundaryAoi } from "@/features/mitra/data-request/hooks/use-admin-boundary-aoi";
import { memo, useMemo, useState } from "react";

export const MitraDataRequestIgtLayerDataView = memo(
  (props: MitraDataRequestIgtLayerDataViewProps) => {
    // Props
    const {
      cqlFilter: baseCqlFilter,
      selectionType = "catalog",
      aoiPolygon: propAoiPolygon,
      onSelectIgtLayer,
      onApplyFilter,
      showFilter = true,
    } = props;

    // Stores
    const { theme } = useThemeStore();
    const { flyTo } = useFlyToLayer();

    // States
    const [searchRaw, setSearchRaw] = useState<string>("");
    const [appliedAdministrativeFilters, setAppliedAdministrativeFilters] =
      useState<FilterAdministrativeAreaValues>({});
    const [selectedTableItems, setSelectedTableItems] = useState<
      FormattedListItem<IgtLayerItem>[]
    >([]);

    // Mutations
    const addToCartMultipleMutation = useAddToCartMultipleLayers();

    // Derived Values
    const debouncedSearch = useDebouncedValue(searchRaw);
    const localCqlFilter = useMemo(
      () => buildIgtCqlFilter(appliedAdministrativeFilters),
      [appliedAdministrativeFilters],
    );
    const combinedCqlFilter = useMemo(() => {
      // Administrative filter is only applied when showFilter is true (Catalog tab)
      const activeStoreCql = showFilter ? localCqlFilter : undefined;

      if (baseCqlFilter && activeStoreCql) {
        return `${baseCqlFilter} AND ${activeStoreCql}`;
      }
      return baseCqlFilter ?? activeStoreCql ?? undefined;
    }, [baseCqlFilter, localCqlFilter, showFilter]);

    // Queries — list of all active IGT layers
    const {
      data: layersData,
      isLoading: isLoadingLayers,
      isError: isErrorLayers,
      error: errorLayers,
      refetch: refetchLayers,
    } = useQuery({
      queryKey: queryKeys.map.layers(),
      queryFn: ({ signal }) => getIgtLayers(signal),
      staleTime: 1000 * 60 * 5,
    });

    const activeLayers = useMemo(() => layersData?.items ?? [], [layersData]);

    const filteredLayers = useMemo(() => {
      if (!debouncedSearch) return activeLayers;
      const lower = debouncedSearch.toLowerCase();
      return activeLayers.filter(
        (l) =>
          l.id.toLowerCase().includes(lower) ||
          l.wfs?.wfsTypeName?.toLowerCase().includes(lower) ||
          l.title?.toLowerCase().includes(lower),
      );
    }, [activeLayers, debouncedSearch]);

    // Hooks — Resolve administrative boundary AOI when in catalog tab with filter applied
    const adminBoundaryQuery = useAdminBoundaryAoi(
      appliedAdministrativeFilters,
      { enabled: showFilter },
    );

    // Derived Values — Resolve effective AOI polygon
    const effectiveAoiPolygon = useMemo(() => {
      if (propAoiPolygon) return propAoiPolygon;
      if (showFilter && adminBoundaryQuery.aoiPolygon) {
        return adminBoundaryQuery.aoiPolygon;
      }
      return null;
    }, [propAoiPolygon, showFilter, adminBoundaryQuery.aoiPolygon]);

    const bidangLayers = useMemo(
      () => filteredLayers.filter((l) => l.spatialBasis === "bidang"),
      [filteredLayers],
    );

    const kawasanLayers = useMemo(
      () => filteredLayers.filter((l) => l.spatialBasis === "kawasan"),
      [filteredLayers],
    );

    // Handlers — Cart actions (Direct submit to BE without local spatial processing)
    const handleAddToCartSelected = () => {
      const targetLayers =
        selectedTableItems.length > 0
          ? (selectedTableItems.map((item) => item.data).filter(Boolean) as IgtLayerItem[])
          : filteredLayers;

      const validLayers = targetLayers.filter((layer) =>
        Boolean(layer?.wfs?.wfsTypeName || layer?.id),
      );

      if (isEmptyArray(validLayers)) return;

      const resolvedAoi =
        effectiveAoiPolygon && "geometry" in effectiveAoiPolygon
          ? (effectiveAoiPolygon.geometry as GeoJSON.MultiPolygon | GeoJSON.Polygon)
          : (effectiveAoiPolygon as GeoJSON.MultiPolygon | GeoJSON.Polygon | undefined);

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        aoiPolygon: resolvedAoi,
        layers: validLayers.map((layer) => ({
          layerId: layer.id,
          typeName: layer.wfs?.wfsTypeName ?? "",
          title: layer.title,
          spatialBasis: layer.spatialBasis,
          selectionType,
          cqlFilter: combinedCqlFilter,
        })),
      });
    };

    const handleAddToCartBidangOnly = () => {
      const validLayers = bidangLayers.filter((layer) =>
        Boolean(layer?.wfs?.wfsTypeName || layer?.id),
      );

      if (isEmptyArray(validLayers)) return;

      const resolvedAoi =
        effectiveAoiPolygon && "geometry" in effectiveAoiPolygon
          ? (effectiveAoiPolygon.geometry as GeoJSON.MultiPolygon | GeoJSON.Polygon)
          : (effectiveAoiPolygon as GeoJSON.MultiPolygon | GeoJSON.Polygon | undefined);

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        aoiPolygon: resolvedAoi,
        layers: validLayers.map((layer) => ({
          layerId: layer.id,
          typeName: layer.wfs?.wfsTypeName ?? "",
          title: layer.title,
          spatialBasis: layer.spatialBasis,
          selectionType,
          cqlFilter: combinedCqlFilter,
        })),
      });
    };

    const handleAddToCartKawasanOnly = () => {
      const validLayers = kawasanLayers.filter((layer) =>
        Boolean(layer?.wfs?.wfsTypeName || layer?.id),
      );

      if (isEmptyArray(validLayers)) return;

      const resolvedAoi =
        effectiveAoiPolygon && "geometry" in effectiveAoiPolygon
          ? (effectiveAoiPolygon.geometry as GeoJSON.MultiPolygon | GeoJSON.Polygon)
          : (effectiveAoiPolygon as GeoJSON.MultiPolygon | GeoJSON.Polygon | undefined);

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        aoiPolygon: resolvedAoi,
        layers: validLayers.map((layer) => ({
          layerId: layer.id,
          typeName: layer.wfs?.wfsTypeName ?? "",
          title: layer.title,
          spatialBasis: layer.spatialBasis,
          selectionType,
          cqlFilter: combinedCqlFilter,
        })),
      });
    };

    const handleApplyFilters = (filters: FilterAdministrativeAreaValues) => {
      setAppliedAdministrativeFilters(filters);
      onApplyFilter?.(filters);
    };

    // Derived Values - DataList headers, items, itemActions
    const dataList = useMemo(() => {
      const headers: FormattedTableHeader[] = [
        { th: "Layer IGT", sortable: true, align: "start" },
        { th: "Basis IGT", sortable: true, align: "start" },
      ];

      const items: FormattedListItem<IgtLayerItem>[] = filteredLayers.map(
        (layer: IgtLayerItem) => {
          const layerDisplayName =
            layer.title ||
            layer.id.split(":")[1] ||
            layer.wfs?.wfsTypeName?.split(":")[1] ||
            layer.wfs?.wfsTypeName ||
            layer.id;
          const formattedTitle = layerDisplayName.replace(/_/g, " ");

          return {
            id: layer.id,
            data: layer,
            columns: [
              {
                value: formattedTitle,
                td: <P fontWeight={"medium"}>{formattedTitle}</P>,
                align: "start",
              },
              {
                value: layer.spatialBasis,
                td: <IgtBasisBadge>{layer.spatialBasis}</IgtBasisBadge>,
                align: "start",
              },
            ],
          };
        },
      );

      const itemActions = [
        {
          key: "fly-to-map",
          label: "Zoom ke Layer",
          icon: FocusIcon,
          onClick: (layer: IgtLayerItem) => {
            void flyTo(layer, {
              cqlFilter: combinedCqlFilter,
            });
          },
        },
        {
          key: "detail-attribute",
          label: "Detail Atribut",
          icon: TablePropertiesIcon,
          onClick: (layer: IgtLayerItem) => {
            onSelectIgtLayer(layer);
          },
        },
      ];

      return {
        headers,
        items,
        batchActions: [],
        itemActions,
      };
    }, [filteredLayers, combinedCqlFilter, flyTo, onSelectIgtLayer]);

    const hasSelectedLayers = selectedTableItems.length > 0;
    const isCartDisabled =
      isEmptyArray(filteredLayers) || addToCartMultipleMutation.isPending;

    return (
      <VStack
        flex={1}
        position={"relative"}
        overflowY={"auto"}
        w={"full"}
        bg={"bg.body"}
        roundedBottom={theme.radii.container}
      >
        {/* Header Action Bar */}
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={"sm"}
          w={"full"}
          p={"md"}
          bg={"bg.body"}
        >
          <HStack gap={"sm"} flex={1} maxW={"full"}>
            <SearchInput
              placeholder={"Cari nama / layer IGT"}
              value={searchRaw}
              onValueChange={(val) => setSearchRaw(val)}
            />

            {showFilter && (
              <FilterAdministrativeAreaTrigger
                modalKey={"mitra-data-request-igt-card-filter-modal"}
                value={appliedAdministrativeFilters}
                onApply={handleApplyFilters}
              >
                <IconButton variant={"outline"}>
                  <AppIcon icon={SlidersHorizontalIcon} />
                </IconButton>
              </FilterAdministrativeAreaTrigger>
            )}
          </HStack>
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* DataList Table with Multi-Selection Checkbox */}
        <VStack flex={1} bg={"bg.body"} overflow={"clip"}>
          {isLoadingLayers && <Skeleton flex={1} p={"md"} rounded={0} />}

          {!isLoadingLayers && isErrorLayers && (
            <VStack flex={1} justify={"center"} align={"center"} p={"xl"}>
              <RetryState
                title={"Gagal Memuat Katalog Layer IGT"}
                description={
                  errorLayers?.message ||
                  "Terjadi kesalahan saat memuat katalog layer IGT. Silakan coba lagi."
                }
                onRetry={() => {
                  void refetchLayers();
                }}
              />
            </VStack>
          )}

          {!isLoadingLayers && !isErrorLayers && (
            <DataViewTable.Root<IgtLayerItem>
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
              canBatchSelect={true}
              selectedItems={selectedTableItems}
              onSelectedItemChange={({ selectedItems }) =>
                setSelectedTableItems(selectedItems)
              }
              virtualized={true}
              withNumbering={true}
              roundedTop={0}
            >
              <DataViewTable.Header />
              <DataViewTable.Body />
            </DataViewTable.Root>
          )}
        </VStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Action Bar Footer */}
        <VStack gap={"sm"} w={"full"} p={"md"} bg={"bg.body"} mt={"auto"}>
          <HStack
            align={"center"}
            gap={"xs"}
            p={"xs"}
            px={"sm"}
            w={"full"}
            rounded={"md"}
            bg={"blue.subtle"}
            color={"blue.fg"}
          >
            <AppIcon icon={InfoIcon} size={"xs"} flexShrink={0} />
            <P fontSize={"xs"}>
              {
                "Kalkulasi clipping, luas tutupan kawasan, dan estimasi tarif akan diproses otomatis oleh server setelah ditambahkan ke keranjang."
              }
            </P>
          </HStack>

          {/* Action Buttons */}
          <VStack w={"full"} gap={"xs"}>
            <Button
              primary
              w={"full"}
              disabled={isCartDisabled}
              loading={addToCartMultipleMutation.isPending}
              onClick={handleAddToCartSelected}
            >
              <AppIcon icon={ShoppingCartIcon} />
              {hasSelectedLayers
                ? `Tambah ${selectedTableItems.length} layer terpilih ke keranjang`
                : `Tambah semua layer ke keranjang (${formatNumber(filteredLayers.length)})`}
            </Button>

            <HStack w={"full"} gap={"xs"}>
              <Button
                primary
                variant={"outline"}
                flex={1}
                minW={0}
                disabled={isCartDisabled || isEmptyArray(bidangLayers)}
                onClick={handleAddToCartBidangOnly}
              >
                {IGT_BASIS_MAP.bidang.icon && (
                  <AppIcon icon={IGT_BASIS_MAP.bidang.icon} />
                )}
                {"Semua Bidang"} ({formatNumber(bidangLayers.length)})
              </Button>

              <Button
                primary
                variant={"outline"}
                flex={1}
                minW={0}
                disabled={isCartDisabled || isEmptyArray(kawasanLayers)}
                onClick={handleAddToCartKawasanOnly}
              >
                {IGT_BASIS_MAP.kawasan.icon && (
                  <AppIcon icon={IGT_BASIS_MAP.kawasan.icon} />
                )}
                {"Semua Kawasan"} ({formatNumber(kawasanLayers.length)})
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    );
  },
);
