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
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { RetryState } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { fetchWfs } from "@/design-system/components/map/utils/fetch-wfs";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  flyToCartGeometry,
  useCartAoiCoverageMap,
} from "@/features/mitra/cart/hooks/use-cart-aoi-coverage-map";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { MitraDataRequestSpatialSummary } from "@/features/mitra/data-request/components/mitra.data-request.spatial-summary";
import { useAdminBoundaryAoi } from "@/features/mitra/data-request/hooks/use-admin-boundary-aoi";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { useAddToCartMultipleLayers } from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { useMitraDataRequestCalculation } from "@/features/mitra/data-request/hooks/use-mitra-data-request-calculation";
import type { MitraDataRequestIgtLayerDataViewProps } from "@/features/mitra/data-request/types/mitra.data-request.igt-layer-view.type";
import { buildIgtCqlFilter } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import { checkBboxIntersection } from "@/features/mitra/data-request/utils/calculate-feature-area";
import { FilterAdministrativeAreaTrigger } from "@/features/shared/components/filter.administrative-area";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { IconDatabaseOff } from "@tabler/icons-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  FocusIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  TablePropertiesIcon,
} from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

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
    const map = useMapInstanceStore((state) => state.map);

    // States
    const [searchRaw, setSearchRaw] = useState<string>("");
    const [appliedAdministrativeFilters, setAppliedAdministrativeFilters] =
      useState<FilterAdministrativeAreaValues>({});
    const [selectedTableItems, setSelectedTableItems] = useState<
      FormattedListItem<IgtLayerItem>[]
    >([]);
    const [isAoiVisible, setIsAoiVisible] = useState<boolean>(true);
    const [isCoverageVisible, setIsCoverageVisible] = useState<boolean>(true);

    // Mutations
    const addToCartMultipleMutation = useAddToCartMultipleLayers();

    // Hooks
    const {
      isCalculating,
      progressMessage,
      progressPercentage,
      result: calculationResult,
      calculate,
    } = useMitraDataRequestCalculation();

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

    // Spatial Hit Check: Query whether each layer intersects with the active AOI
    const hitQueries = useQueries({
      queries: activeLayers.map((layer) => {
        const isBboxOk = checkBboxIntersection(layer.bbox, effectiveAoiPolygon);
        return {
          queryKey: [
            "igt-layer-hits",
            layer.id,
            layer.wfs?.wfsTypeName,
            combinedCqlFilter,
          ],
          queryFn: async ({ signal }: { signal: AbortSignal }) => {
            if (!combinedCqlFilter) {
              return { layerId: layer.id, hasData: true };
            }
            if (!isBboxOk) {
              return { layerId: layer.id, hasData: false };
            }
            if (!layer.wfs?.wfsTypeName || !layer.wfs?.wfsUrl) {
              return { layerId: layer.id, hasData: isBboxOk };
            }
            try {
              const res = await fetchWfs({
                typeName: layer.wfs.wfsTypeName,
                wfsUrl: layer.wfs.wfsUrl,
                version: "2.0.0",
                resultType: "hits",
                maxFeatures: 1,
                cqlFilter: combinedCqlFilter,
                signal,
              });
              const total = res.totalFeatures ?? res.features.length;
              return { layerId: layer.id, hasData: total > 0 };
            } catch {
              // Fallback to bbox intersection check
              return { layerId: layer.id, hasData: isBboxOk };
            }
          },
          enabled: Boolean(combinedCqlFilter),
          staleTime: 5 * 60 * 1000,
        };
      }),
    });

    const isCheckingHits =
      Boolean(combinedCqlFilter) && hitQueries.some((q) => q.isLoading);

    // Filter layers that actually intersect with the AOI
    const intersectingLayers = useMemo(() => {
      if (!combinedCqlFilter) return activeLayers;
      return activeLayers.filter((layer, idx) => {
        const isBboxOk = checkBboxIntersection(layer.bbox, effectiveAoiPolygon);
        if (!isBboxOk) return false;
        const hitData = hitQueries[idx]?.data;
        if (hitData) return hitData.hasData;
        return isBboxOk;
      });
    }, [activeLayers, combinedCqlFilter, effectiveAoiPolygon, hitQueries]);

    // Apply text search
    const filteredLayers = useMemo(() => {
      if (!debouncedSearch) return intersectingLayers;
      const lower = debouncedSearch.toLowerCase();
      return intersectingLayers.filter(
        (l) =>
          l.id.toLowerCase().includes(lower) ||
          l.wfs?.wfsTypeName?.toLowerCase().includes(lower) ||
          l.title?.toLowerCase().includes(lower),
      );
    }, [intersectingLayers, debouncedSearch]);

    const bidangLayers = useMemo(
      () => filteredLayers.filter((l) => l.spatialBasis === "bidang"),
      [filteredLayers],
    );

    const kawasanLayers = useMemo(
      () => filteredLayers.filter((l) => l.spatialBasis === "kawasan"),
      [filteredLayers],
    );

    // Manage AOI & Coverage Map Layers
    useCartAoiCoverageMap(map, {
      aoiPolygon: effectiveAoiPolygon,
      coveragePolygon: calculationResult?.coveragePolygon,
      selectionType,
      isAoiVisible,
      isCoverageVisible,
    });

    // Effects — Trigger backend spatial calculation whenever effective AOI or layers change
    useEffect(() => {
      if (!effectiveAoiPolygon || isEmptyArray(filteredLayers)) return;

      const validLayers = filteredLayers.filter((layer) =>
        Boolean(layer?.wfs?.wfsTypeName || layer?.id),
      );

      if (isEmptyArray(validLayers)) return;

      const resolvedAoi =
        effectiveAoiPolygon && "geometry" in effectiveAoiPolygon
          ? (effectiveAoiPolygon.geometry as
              | GeoJSON.MultiPolygon
              | GeoJSON.Polygon)
          : (effectiveAoiPolygon as
              | GeoJSON.MultiPolygon
              | GeoJSON.Polygon);

      void calculate({
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
    }, [
      effectiveAoiPolygon,
      combinedCqlFilter,
      filteredLayers,
      selectionType,
      calculate,
    ]);

    // Handlers — Cart actions (Direct submit to BE without local spatial processing)
    const handleAddToCartSelected = () => {
      const targetLayers =
        selectedTableItems.length > 0
          ? (selectedTableItems
              .map((item) => item.data)
              .filter(Boolean) as IgtLayerItem[])
          : filteredLayers;

      const validLayers = targetLayers.filter((layer) =>
        Boolean(layer?.wfs?.wfsTypeName || layer?.id),
      );

      if (isEmptyArray(validLayers)) return;

      const resolvedAoi =
        effectiveAoiPolygon && "geometry" in effectiveAoiPolygon
          ? (effectiveAoiPolygon.geometry as
              | GeoJSON.MultiPolygon
              | GeoJSON.Polygon)
          : (effectiveAoiPolygon as
              | GeoJSON.MultiPolygon
              | GeoJSON.Polygon
              | undefined);

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        aoiPolygon: resolvedAoi,
        coveragePolygon: calculationResult?.coveragePolygon ?? undefined,
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
          ? (effectiveAoiPolygon.geometry as
              | GeoJSON.MultiPolygon
              | GeoJSON.Polygon)
          : (effectiveAoiPolygon as
              | GeoJSON.MultiPolygon
              | GeoJSON.Polygon
              | undefined);

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        aoiPolygon: resolvedAoi,
        coveragePolygon: calculationResult?.coveragePolygon ?? undefined,
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
          ? (effectiveAoiPolygon.geometry as
              | GeoJSON.MultiPolygon
              | GeoJSON.Polygon)
          : (effectiveAoiPolygon as
              | GeoJSON.MultiPolygon
              | GeoJSON.Polygon
              | undefined);

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        aoiPolygon: resolvedAoi,
        coveragePolygon: calculationResult?.coveragePolygon ?? undefined,
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
    const isShowLoading = isLoadingLayers || isCheckingHits;
    const hasIntersectingData = !isEmptyArray(filteredLayers);
    const isPurchaseLimitValid = calculationResult?.isPurchaseLimitValid ?? true;
    const purchaseLimitMessage = calculationResult?.purchaseLimitMessage;

    const isCartDisabled =
      !hasIntersectingData ||
      addToCartMultipleMutation.isPending ||
      isShowLoading ||
      isCalculating ||
      !isPurchaseLimitValid;

    const isBidangDisabled =
      isCartDisabled || isEmptyArray(bidangLayers);

    const isKawasanDisabled =
      isCartDisabled || isEmptyArray(kawasanLayers);

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
          {isShowLoading && <Skeleton flex={1} p={"md"} rounded={0} />}

          {!isShowLoading && isErrorLayers && (
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

          {!isShowLoading && !isErrorLayers && !hasIntersectingData && (
            <VStack flex={1} justify={"center"} align={"center"} p={"xl"}>
              {debouncedSearch ? (
                <NoResultState />
              ) : (
                <NoDataState
                  icon={IconDatabaseOff}
                  title={"Tidak Ada Layer IGT pada Area Ini"}
                  description={
                    "Area AOI yang Anda pilih tidak beririsan dengan data spasial layer IGT manapun. Silakan gambar atau upload area lain yang memiliki data."
                  }
                />
              )}
            </VStack>
          )}

          {!isShowLoading && !isErrorLayers && hasIntersectingData && (
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

        {/* Spatial Calculation Summary Box */}
        {effectiveAoiPolygon && (
          <Box px={"md"} pt={"sm"} bg={"bg.body"} w={"full"}>
            <MitraDataRequestSpatialSummary
              totalBidangCount={calculationResult?.totalBidangCount ?? 0}
              totalKawasanCount={calculationResult?.totalKawasanCount ?? 0}
              totalKawasanAreaHa={calculationResult?.totalKawasanAreaHa ?? 0}
              subtotalBidangPrice={calculationResult?.subtotalBidangPrice ?? 0}
              subtotalKawasanPrice={
                calculationResult?.subtotalKawasanPrice ?? 0
              }
              estimatedTotalPrice={
                calculationResult?.estimatedTotalPrice ?? 0
              }
              isPurchaseLimitValid={isPurchaseLimitValid}
              purchaseLimitMessage={purchaseLimitMessage}
              isCalculating={isCalculating}
              progressMessage={progressMessage}
              progressPercentage={progressPercentage}
              hasAoiPolygon={Boolean(effectiveAoiPolygon)}
              hasCoveragePolygon={Boolean(calculationResult?.coveragePolygon)}
              isAoiVisible={isAoiVisible}
              isCoverageVisible={isCoverageVisible}
              onToggleAoiVisible={() => setIsAoiVisible((prev) => !prev)}
              onToggleCoverageVisible={() =>
                setIsCoverageVisible((prev) => !prev)
              }
              onFlyToAoi={() => flyToCartGeometry(map, effectiveAoiPolygon)}
              onFlyToCoverage={() =>
                flyToCartGeometry(map, calculationResult?.coveragePolygon)
              }
            />
          </Box>
        )}

        <Separator borderColor={"bg.canvas"} mt={"xs"} />

        {/* Action Bar Footer */}
        <VStack gap={"sm"} w={"full"} p={"md"} bg={"bg.body"} mt={"auto"}>
          {/* Action Buttons */}
          <VStack w={"full"} gap={"xs"}>
            {!isPurchaseLimitValid && purchaseLimitMessage ? (
              <Tooltip content={purchaseLimitMessage}>
                <VStack w={"full"} align={"stretch"}>
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
                </VStack>
              </Tooltip>
            ) : (
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
            )}

            <HStack w={"full"} gap={"xs"}>
              {!isPurchaseLimitValid && purchaseLimitMessage ? (
                <Tooltip content={purchaseLimitMessage}>
                  <VStack flex={1} minW={0} align={"stretch"}>
                    <Button
                      primary
                      variant={"outline"}
                      w={"full"}
                      disabled={isBidangDisabled}
                      onClick={handleAddToCartBidangOnly}
                    >
                      {IGT_BASIS_MAP.bidang.icon && (
                        <AppIcon icon={IGT_BASIS_MAP.bidang.icon} />
                      )}
                      {"Semua Bidang"} ({formatNumber(bidangLayers.length)})
                    </Button>
                  </VStack>
                </Tooltip>
              ) : (
                <Button
                  primary
                  variant={"outline"}
                  flex={1}
                  minW={0}
                  disabled={isBidangDisabled}
                  onClick={handleAddToCartBidangOnly}
                >
                  {IGT_BASIS_MAP.bidang.icon && (
                    <AppIcon icon={IGT_BASIS_MAP.bidang.icon} />
                  )}
                  {"Semua Bidang"} ({formatNumber(bidangLayers.length)})
                </Button>
              )}

              {!isPurchaseLimitValid && purchaseLimitMessage ? (
                <Tooltip content={purchaseLimitMessage}>
                  <VStack flex={1} minW={0} align={"stretch"}>
                    <Button
                      primary
                      variant={"outline"}
                      w={"full"}
                      disabled={isKawasanDisabled}
                      onClick={handleAddToCartKawasanOnly}
                    >
                      {IGT_BASIS_MAP.kawasan.icon && (
                        <AppIcon icon={IGT_BASIS_MAP.kawasan.icon} />
                      )}
                      {"Semua Kawasan"} ({formatNumber(kawasanLayers.length)})
                    </Button>
                  </VStack>
                </Tooltip>
              ) : (
                <Button
                  primary
                  variant={"outline"}
                  flex={1}
                  minW={0}
                  disabled={isKawasanDisabled}
                  onClick={handleAddToCartKawasanOnly}
                >
                  {IGT_BASIS_MAP.kawasan.icon && (
                    <AppIcon icon={IGT_BASIS_MAP.kawasan.icon} />
                  )}
                  {"Semua Kawasan"} ({formatNumber(kawasanLayers.length)})
                </Button>
              )}
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    );
  },
);

