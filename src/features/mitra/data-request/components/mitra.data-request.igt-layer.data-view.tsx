import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { P } from "@/design-system/components/typography/ui/p";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import {
  getLayerCountSummary,
  type LayerCountSummary,
} from "@/features/mitra/data-request/api/mitra.data-request-wfs-summary.api";
import { useAddToCartMultipleLayers } from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
// Uncomment below if persistent filter store is needed again:
// import { useAdministrativeFilterStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import type { MitraDataRequestIgtLayerDataViewProps } from "@/features/mitra/data-request/types/mitra.data-request.igt-layer-view.type";
import { buildIgtCqlFilter } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { BasisIgtBadge } from "@/features/shared/components/basis-igt.badge";
import { FilterAdministrativeAreaTrigger } from "@/features/shared/components/filter.administrative-area";
import type { FilterAdministrativeAreaValues } from "@/features/shared/types/filter.administrative-area.type";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { IGT_BASIS_MAP } from "@/shared/constants/status.config";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  FocusIcon,
  ShoppingCartIcon,
  SlidersHorizontalIcon,
  TablePropertiesIcon,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

export const MitraDataRequestIgtLayerDataView = memo(
  (props: MitraDataRequestIgtLayerDataViewProps) => {
    // Props
    const {
      cqlFilter: baseCqlFilter,
      selectionType = "catalog",
      onSelectIgtLayer,
      onApplyFilter,
      showFilter = true,
    } = props;

    // Stores
    const { theme } = useThemeStore();
    const { flyTo } = useFlyToLayer();
    // [PERSISTENT FILTER STORE - COMMENTED OUT]
    // Uncomment below if client requests administrative filter to persist across page/tabs again
    // const appliedAdministrativeFilters = useAdministrativeFilterStore(
    //   (s) => s.appliedAdministrativeFilters,
    // );
    // const setAppliedAdministrativeFilters = useAdministrativeFilterStore(
    //   (s) => s.setAppliedAdministrativeFilters,
    // );
    // const storeCqlFilter = useAdministrativeFilterStore((s) => s.cqlFilter);

    // States
    const [searchRaw, setSearchRaw] = useState<string>("");
    const [appliedAdministrativeFilters, setAppliedAdministrativeFilters] =
      useState<FilterAdministrativeAreaValues>({});

    // Hooks & Policies
    const pricingPolicy = usePricingPolicy();

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
    const isLoadingLayers = false;
    const {
      data: layersData,
      // isLoading: isLoadingLayers
    } = useQuery({
      queryKey: queryKeys.map.layers(),
      queryFn: ({ signal }) => getIgtLayers(signal),
      staleTime: 1000 * 60 * 5,
    });

    const activeLayers = useMemo(
      () => layersData?.items ?? layersData?.layers ?? [],
      [layersData],
    );

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

    // Queries — fetch summary count/area for all filtered layers
    const summaryQueries = useQueries({
      queries: filteredLayers.map((layer) => ({
        queryKey: [
          "igt-layer-count-summary",
          layer.id,
          layer.wfs?.wfsTypeName,
          layer.spatialBasis,
          combinedCqlFilter,
        ],
        queryFn: ({ signal }: { signal: AbortSignal }) =>
          getLayerCountSummary({
            typeName: layer.wfs?.wfsTypeName ?? "",
            wfsUrl: layer.wfs?.wfsUrl ?? "",
            spatialBasis: layer.spatialBasis,
            cqlFilter: combinedCqlFilter,
            signal,
          }),
        staleTime: 5 * 60 * 1000,
      })),
    });

    const summaryData = useMemo(() => {
      let totalBidangCount = 0;
      let totalKawasanAreaHa = 0;
      let hasBidangLayers = false;
      let hasKawasanLayers = false;
      let isAnySummaryLoading = false;

      summaryQueries.forEach((q, idx) => {
        if (q.isLoading) {
          isAnySummaryLoading = true;
        }
        const layer = filteredLayers[idx];
        const res = q.data as LayerCountSummary | undefined;
        if (layer?.spatialBasis === "bidang") {
          hasBidangLayers = true;
          totalBidangCount += res?.totalCount ?? 0;
        } else if (layer?.spatialBasis === "kawasan") {
          hasKawasanLayers = true;
          totalKawasanAreaHa += res?.totalAreaHa ?? 0;
        }
      });

      return {
        totalBidangCount,
        totalKawasanAreaHa,
        hasBidangLayers,
        hasKawasanLayers,
        isAnySummaryLoading,
      };
    }, [summaryQueries, filteredLayers]);

    // Handlers — Cart actions
    const handleAddToCartAll = () => {
      const validLayers = filteredLayers.filter((layer) =>
        Boolean(layer?.wfs?.wfsTypeName),
      );

      if (isEmptyArray(validLayers)) return;

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        layers: validLayers.map((layer) => {
          const idx = filteredLayers.findIndex((l) => l.id === layer.id);
          const summary = summaryQueries[idx]?.data as
            | LayerCountSummary
            | undefined;
          return {
            layerId: layer.id,
            typeName: layer.wfs?.wfsTypeName ?? "",
            title: layer.title,
            spatialBasis: layer.spatialBasis,
            selectionType,
            featuresCount: summary?.totalCount ?? 0,
            areaHa: summary?.totalAreaHa ?? 0,
            cqlFilter: combinedCqlFilter,
          };
        }),
      });
    };

    const handleAddToCartBidangOnly = () => {
      const validLayers = filteredLayers
        .filter((layer) => layer.spatialBasis === "bidang")
        .filter((layer) => Boolean(layer?.wfs?.wfsTypeName));

      if (isEmptyArray(validLayers)) return;

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        layers: validLayers.map((layer) => {
          const idx = filteredLayers.findIndex((l) => l.id === layer.id);
          const summary = summaryQueries[idx]?.data as
            | LayerCountSummary
            | undefined;
          return {
            layerId: layer.id,
            typeName: layer.wfs?.wfsTypeName ?? "",
            title: layer.title,
            spatialBasis: layer.spatialBasis,
            selectionType,
            featuresCount: summary?.totalCount ?? 0,
            areaHa: summary?.totalAreaHa ?? 0,
            cqlFilter: combinedCqlFilter,
          };
        }),
      });
    };

    const handleAddToCartKawasanOnly = () => {
      const validLayers = filteredLayers
        .filter((layer) => layer.spatialBasis === "kawasan")
        .filter((layer) => Boolean(layer?.wfs?.wfsTypeName));

      if (isEmptyArray(validLayers)) return;

      addToCartMultipleMutation.mutate({
        selectionType,
        cqlFilter: combinedCqlFilter,
        layers: validLayers.map((layer) => {
          const idx = filteredLayers.findIndex((l) => l.id === layer.id);
          const summary = summaryQueries[idx]?.data as
            | LayerCountSummary
            | undefined;
          return {
            layerId: layer.id,
            typeName: layer.wfs?.wfsTypeName ?? "",
            title: layer.title,
            spatialBasis: layer.spatialBasis,
            selectionType,
            featuresCount: summary?.totalCount ?? 0,
            areaHa: summary?.totalAreaHa ?? 0,
            cqlFilter: combinedCqlFilter,
          };
        }),
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
        { th: "Jumlah / Luas", sortable: false, align: "start" },
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
                td: <P>{formattedTitle}</P>,
                align: "start",
              },
              {
                value: layer.spatialBasis,
                td: <BasisIgtBadge>{layer.spatialBasis}</BasisIgtBadge>,
                align: "start",
              },
              {
                value: layer.spatialBasis,
                td: (
                  <IgtLayerCountCell
                    layer={layer}
                    cqlFilter={combinedCqlFilter}
                  />
                ),
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

    // Client Validation — Minimum limits & empty data checks
    const isBidangBelowMin =
      summaryData.hasBidangLayers &&
      (summaryData.totalBidangCount === 0 ||
        summaryData.totalBidangCount < pricingPolicy.minBidangCount);

    const isKawasanBelowMin =
      summaryData.hasKawasanLayers &&
      (summaryData.totalKawasanAreaHa === 0 ||
        summaryData.totalKawasanAreaHa < pricingPolicy.minKawasanHa);

    const hasAnyData =
      summaryData.totalBidangCount > 0 || summaryData.totalKawasanAreaHa > 0;

    const isCartDisabled =
      isEmptyArray(filteredLayers) ||
      addToCartMultipleMutation.isPending ||
      summaryData.isAnySummaryLoading ||
      !hasAnyData;

    const isBidangOnlyDisabled =
      isCartDisabled || !summaryData.hasBidangLayers || isBidangBelowMin;

    const isKawasanOnlyDisabled =
      isCartDisabled || !summaryData.hasKawasanLayers || isKawasanBelowMin;

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
          <HStack gap={"sm"}>
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

          <P fontSize={"sm"} color={"fg.muted"}>
            {`Menampilkan ${debouncedSearch ? filteredLayers.length : activeLayers.length} dari ${activeLayers.length} Layer IGT`}
          </P>
        </HStack>

        <Separator borderColor={"bg.canvas"} />

        {/* DataList Table */}
        <VStack flex={1} bg={"bg.body"} overflow={"clip"}>
          {isLoadingLayers && <Skeleton flex={1} p={"md"} rounded={0} />}

          {!isLoadingLayers && (
            <DataView.Table.Root<IgtLayerItem>
              headers={dataList.headers}
              items={dataList.items}
              itemActions={dataList.itemActions}
              virtualized={true}
              withNumbering={true}
              roundedTop={0}
            >
              <DataView.Table.Header />
              <DataView.Table.Body />
            </DataView.Table.Root>
          )}
        </VStack>

        <Separator borderColor={"bg.canvas"} />

        {/* Add to Cart Bar with Summary & ButtonGroup */}
        <VStack gap={"sm"} w={"full"} p={"md"} bg={"bg.body"} mt={"auto"}>
          {/* Summary Row */}
          <HStack
            align={"center"}
            justify={"space-between"}
            w={"full"}
            gap={"sm"}
          >
            <P fontSize={"xs"} color={"fg.muted"}>
              {"Total ketersediaan data:"}
            </P>
            <HStack align={"center"} gap={"xs"}>
              {summaryData.isAnySummaryLoading ? (
                <Skeleton h={"16px"} w={"120px"} />
              ) : (
                <P fontSize={"xs"} fontWeight={"semibold"} color={"fg.default"}>
                  {`${formatNumber(summaryData.totalBidangCount)} bidang`}
                  {" • "}
                  {`${formatNumber(summaryData.totalKawasanAreaHa, { maximumFractionDigits: 2 })} ha`}
                </P>
              )}
            </HStack>
          </HStack>

          {/* Action Buttons */}
          <VStack w={"full"} gap={"xs"}>
            <Button
              primary
              w={"full"}
              disabled={isCartDisabled}
              onClick={handleAddToCartAll}
            >
              <AppIcon icon={ShoppingCartIcon} />
              {"Tambah semua ke keranjang"}
            </Button>

            <HStack w={"full"} gap={"xs"}>
              <Button
                primary
                variant={"outline"}
                flex={1}
                minW={0}
                disabled={isBidangOnlyDisabled}
                onClick={handleAddToCartBidangOnly}
              >
                {IGT_BASIS_MAP.bidang.icon && (
                  <AppIcon icon={IGT_BASIS_MAP.bidang.icon} />
                )}
                {"Bidang saja"}
                {summaryData.totalBidangCount > 0 &&
                  ` (${formatNumber(summaryData.totalBidangCount)})`}
              </Button>

              <Button
                primary
                variant={"outline"}
                flex={1}
                minW={0}
                disabled={isKawasanOnlyDisabled}
                onClick={handleAddToCartKawasanOnly}
              >
                {IGT_BASIS_MAP.kawasan.icon && (
                  <AppIcon icon={IGT_BASIS_MAP.kawasan.icon} />
                )}
                {"Kawasan saja"}
                {summaryData.totalKawasanAreaHa > 0 &&
                  ` (${formatNumber(summaryData.totalKawasanAreaHa, { maximumFractionDigits: 1 })} ha)`}
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    );
  },
);

const IgtLayerCountCell = memo(
  (props: { layer: IgtLayerItem; cqlFilter?: string }) => {
    const { layer, cqlFilter } = props;

    const { data, isLoading } = useQuery({
      queryKey: [
        "igt-layer-count-summary",
        layer.id,
        layer.wfs?.wfsTypeName,
        layer.spatialBasis,
        cqlFilter,
      ],
      queryFn: ({ signal }) =>
        getLayerCountSummary({
          typeName: layer.wfs?.wfsTypeName ?? "",
          wfsUrl: layer.wfs?.wfsUrl ?? "",
          spatialBasis: layer.spatialBasis,
          cqlFilter,
          signal,
        }),
      staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
      return <Skeleton h={"16px"} w={"64px"} />;
    }

    return (
      <P fontSize={"sm"} fontWeight={"medium"} color={"fg.default"}>
        {data?.label ?? "-"}
      </P>
    );
  },
);
