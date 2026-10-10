// src/features/mitra/data-request/components/mitra.data-request.igt-layer.data-view.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type {
  FormattedListItem,
  FormattedTableHeader,
} from "@/design-system/components/data-display/types/data-view-table.type";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { StateNoData } from "@/design-system/components/feedback/ui/state.no-data";
import { StateNoResult } from "@/design-system/components/feedback/ui/state.no-result";
import { StateRetry } from "@/design-system/components/feedback/ui/state.retry";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { SegmentGroupInput } from "@/design-system/components/input/ui/segment-group-input";
import { ActionHeaderScrollContainer } from "@/design-system/components/layout/ui/action-header-scroll-container";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import type { IgtLayerItem } from "@/design-system/components/map/types/map.type";
import { geojsonPolygonToWkt } from "@/design-system/components/map/utils/geojson-to-wkt";
import { to2DGeometry } from "@/design-system/components/map/utils/geometry";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { flyToCartGeometry } from "@/features/mitra/cart/hooks/use-cart-aoi-coverage-map";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { MitraDataRequestSpatialSummary } from "@/features/mitra/data-request/components/mitra.data-request.spatial-summary";
import { useAdminBoundaryAoi } from "@/features/mitra/data-request/hooks/use-admin-boundary-aoi";
import { useBidangAoiFeatures } from "@/features/mitra/data-request/hooks/use-bidang-aoi-features";
import { useFlyToLayer } from "@/features/mitra/data-request/hooks/use-fly-to-layer";
import { useAddToCartMultipleLayers } from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import { useMitraDataRequestStore } from "@/features/mitra/data-request/stores/mitra.data-request.store";
import type {
  BasisFilterType,
  MitraDataRequestIgtLayerDataViewProps,
} from "@/features/mitra/data-request/types/mitra.data-request.igt-layer-view.type";
import { highlightFeatureOnMap } from "@/features/mitra/data-request/utils/highlight-feature-on-map";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { IGT_BASIS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import { queryKeys } from "@/shared/libs/tanstack-query/query.keys";
import { isEmptyArray } from "@/shared/utils/data/array";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { IconDatabaseOff } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { FocusIcon, ShoppingCartIcon, TablePropertiesIcon } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

const BASIS_FILTER_OPTIONS: Array<{ value: BasisFilterType; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "bidang", label: "Bidang" },
  { value: "kawasan", label: "Kawasan" },
];

export const MitraDataRequestIgtLayerDataView = memo(
  (props: MitraDataRequestIgtLayerDataViewProps) => {
    // Props
    const {
      cqlFilter: baseCqlFilter,
      selectionType = "catalog",
      aoiPolygon: propAoiPolygon,
      onSelectIgtLayer,
      showFilter = true,
    } = props;

    // Stores
    const { theme } = useThemeStore();
    const { flyTo } = useFlyToLayer();
    const map = useMapInstanceStore((state) => state.map);
    const appliedAdministrativeFilters = useMitraDataRequestStore(
      (state) => state.appliedAdministrativeFilters,
    );
    const cachedBoundary = useMitraDataRequestStore(
      (state) => state.adminBoundaryPolygon,
    );
    const calculate = useMitraDataRequestStore((state) => state.calculate);
    const calculationResult = useMitraDataRequestStore(
      (state) => state.calculationResults[selectionType] ?? state.result,
    );
    const isCalculating = useMitraDataRequestStore(
      (state) => state.isCalculating,
    );
    const calculationError = useMitraDataRequestStore((state) => state.error);
    const isCatalogCoverageVisible = useMitraDataRequestStore(
      (state) => state.isCatalogCoverageVisible,
    );
    const setIsCatalogCoverageVisible = useMitraDataRequestStore(
      (state) => state.setIsCatalogCoverageVisible,
    );
    const isCatalogBidangVisible = useMitraDataRequestStore(
      (state) => state.isCatalogBidangVisible,
    );
    const setIsCatalogBidangVisible = useMitraDataRequestStore(
      (state) => state.setIsCatalogBidangVisible,
    );
    const isUploadCoverageVisible = useMitraDataRequestStore(
      (state) => state.isUploadCoverageVisible,
    );
    const setIsUploadCoverageVisible = useMitraDataRequestStore(
      (state) => state.setIsUploadCoverageVisible,
    );
    const isUploadBidangVisible = useMitraDataRequestStore(
      (state) => state.isUploadBidangVisible,
    );
    const setIsUploadBidangVisible = useMitraDataRequestStore(
      (state) => state.setIsUploadBidangVisible,
    );
    const isDrawCoverageVisible = useMitraDataRequestStore(
      (state) => state.isDrawCoverageVisible,
    );
    const setIsDrawCoverageVisible = useMitraDataRequestStore(
      (state) => state.setIsDrawCoverageVisible,
    );
    const isDrawBidangVisible = useMitraDataRequestStore(
      (state) => state.isDrawBidangVisible,
    );
    const setIsDrawBidangVisible = useMitraDataRequestStore(
      (state) => state.setIsDrawBidangVisible,
    );

    // Derived Values — Coverage & Bidang visibility bound to active tab slice
    const isCoverageVisible =
      selectionType === "upload_aoi"
        ? isUploadCoverageVisible
        : selectionType === "draw_aoi"
          ? isDrawCoverageVisible
          : isCatalogCoverageVisible;

    const isBidangVisible =
      selectionType === "upload_aoi"
        ? isUploadBidangVisible
        : selectionType === "draw_aoi"
          ? isDrawBidangVisible
          : isCatalogBidangVisible;

    // States
    const [searchRaw, setSearchRaw] = useState<string>("");
    const [basisFilter, setBasisFilter] = useState<BasisFilterType>("all");

    // Mutations
    const addToCartMultipleMutation = useAddToCartMultipleLayers();

    // Derived Values
    const debouncedSearch = useDebouncedValue(searchRaw);

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
      retry: false,
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
      if (showFilter) {
        if (adminBoundaryQuery.isLoading) return null;
        return adminBoundaryQuery.aoiPolygon || cachedBoundary || null;
      }
      return null;
    }, [
      propAoiPolygon,
      showFilter,
      adminBoundaryQuery.isLoading,
      adminBoundaryQuery.aoiPolygon,
      cachedBoundary,
    ]);

    // Pure AOI spatial CQL filter: INTERSECTS(geom, POLYGON(...)) across all tabs
    const combinedCqlFilter = useMemo(() => {
      if (baseCqlFilter) return baseCqlFilter;
      if (effectiveAoiPolygon) {
        const wkt = geojsonPolygonToWkt(effectiveAoiPolygon);
        if (wkt) {
          return `INTERSECTS(geom, ${wkt})`;
        }
      }
      return undefined;
    }, [baseCqlFilter, effectiveAoiPolygon]);

    // Valid layers eligible for spatial calculation (all active IGT layers in master catalog)
    const validCalculationLayers = useMemo(() => {
      return activeLayers.filter((layer) =>
        Boolean(layer?.wfs?.wfsTypeName || layer?.id),
      );
    }, [activeLayers]);

    // Filter layers that actually intersect with the AOI (based on calculation results or fallback to active layers)
    const intersectingLayers = useMemo(() => {
      if (!combinedCqlFilter) return activeLayers;
      if (calculationResult?.items && calculationResult.items.length > 0) {
        const itemIds = new Set(
          calculationResult.items.map((it) => it.sourceLayerId),
        );
        const matched = activeLayers.filter((layer) => itemIds.has(layer.id));
        return matched.length > 0 ? matched : activeLayers;
      }
      return activeLayers;
    }, [activeLayers, combinedCqlFilter, calculationResult]);

    // Apply text search & basis filter locally for UI display
    const filteredLayers = useMemo(() => {
      let layers = intersectingLayers;
      if (basisFilter === "bidang") {
        layers = layers.filter(
          (l) => (l.igtBasis ?? l.spatialBasis) === "bidang",
        );
      } else if (basisFilter === "kawasan") {
        layers = layers.filter(
          (l) => (l.igtBasis ?? l.spatialBasis) === "kawasan",
        );
      }
      if (!debouncedSearch) return layers;
      const lower = debouncedSearch.toLowerCase();
      return layers.filter(
        (l) =>
          l.id.toLowerCase().includes(lower) ||
          l.wfs?.wfsTypeName?.toLowerCase().includes(lower) ||
          l.title?.toLowerCase().includes(lower),
      );
    }, [intersectingLayers, basisFilter, debouncedSearch]);

    const bidangLayers = useMemo(
      () =>
        filteredLayers.filter(
          (l) => (l.igtBasis ?? l.spatialBasis) === "bidang",
        ),
      [filteredLayers],
    );

    const kawasanLayers = useMemo(
      () =>
        filteredLayers.filter(
          (l) => (l.igtBasis ?? l.spatialBasis) === "kawasan",
        ),
      [filteredLayers],
    );

    const bidangTargetLayers = useMemo(() => {
      return intersectingLayers
        .filter((l) => {
          const isBidang = (l.igtBasis ?? l.spatialBasis) === "bidang";
          const hasUrl = Boolean(l.wfs?.url || l.wfs?.wfsUrl || l.wfs?.baseUrl);
          return isBidang && hasUrl;
        })
        .map((l) => ({
          id: l.id,
          typeName: l.typeName || l.wfs?.wfsTypeName || l.id,
          wfsUrl: l.wfs?.url || l.wfs?.wfsUrl || l.wfs?.baseUrl || "",
          title: l.title,
        }));
    }, [intersectingLayers]);

    // Query WFS features for Bidang layers when toggle is ON
    const bidangQueryResult = useBidangAoiFeatures({
      aoiPolygon: effectiveAoiPolygon,
      bidangLayers: bidangTargetLayers,
      enabled:
        isBidangVisible &&
        Boolean(effectiveAoiPolygon) &&
        bidangTargetLayers.length > 0,
    });

    // Derived stable trigger key: depends strictly on AOI, selectionType, all intersecting layers, and calculation result presence
    const calcTriggerKey = useMemo(() => {
      if (!effectiveAoiPolygon || isEmptyArray(validCalculationLayers))
        return "";
      const layerIds = validCalculationLayers
        .map((l) => l.id)
        .sort()
        .join(",");
      const aoiString = JSON.stringify(effectiveAoiPolygon);
      const hasResult = Boolean(calculationResult);
      return `${selectionType}|${combinedCqlFilter ?? ""}|${layerIds}|${aoiString}|hasResult:${hasResult}`;
    }, [
      effectiveAoiPolygon,
      validCalculationLayers,
      selectionType,
      combinedCqlFilter,
      calculationResult,
    ]);

    // Effects — Trigger backend spatial calculation whenever effective AOI or intersecting layers change
    useEffect(() => {
      if (
        !calcTriggerKey ||
        !effectiveAoiPolygon ||
        isEmptyArray(validCalculationLayers)
      ) {
        return;
      }

      const resolvedAoi = to2DGeometry(effectiveAoiPolygon);
      if (!resolvedAoi) return;

      const itemsList = validCalculationLayers.map((layer) => ({
        sourceLayerId: layer.id,
        typeName: layer.typeName || layer.wfs?.wfsTypeName || "",
        title: layer.title,
        spatialBasis: layer.spatialBasis,
      }));

      void calculate(
        {
          selectionType,
          aoiPolygon: resolvedAoi,
          items: itemsList,
        },
        calcTriggerKey,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calcTriggerKey]);

    // Effects — Auto-fit map camera when administrative boundary AOI polygon is resolved
    useEffect(() => {
      if (!map || !effectiveAoiPolygon || selectionType !== "catalog") return;
      flyToCartGeometry(map, effectiveAoiPolygon);
    }, [map, effectiveAoiPolygon, selectionType]);

    // Handlers — Cart actions (Direct submit to BE with calculationToken)
    const handleAddToCartSelected = () => {
      const targetLayers = filteredLayers;
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
        purchasedIgtBasis: "all",
        aoiPolygon: resolvedAoi,
        kawasanCoveragePolygon:
          calculationResult?.kawasanCoveragePolygon ?? undefined,
        layers: validLayers.map((layer) => ({
          layerId: layer.id,
          typeName: layer.wfs?.wfsTypeName ?? "",
          title: layer.title,
          spatialBasis: layer.spatialBasis,
          selectionType,
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
        purchasedIgtBasis: "bidang",
        aoiPolygon: resolvedAoi,
        layers: validLayers.map((layer) => ({
          layerId: layer.id,
          typeName: layer.wfs?.wfsTypeName ?? "",
          title: layer.title,
          spatialBasis: layer.spatialBasis,
          selectionType,
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
        purchasedIgtBasis: "kawasan",
        aoiPolygon: resolvedAoi,
        kawasanCoveragePolygon:
          calculationResult?.kawasanCoveragePolygon ?? undefined,
        layers: validLayers.map((layer) => ({
          layerId: layer.id,
          typeName: layer.wfs?.wfsTypeName ?? "",
          title: layer.title,
          spatialBasis: layer.spatialBasis,
          selectionType,
        })),
      });
    };

    // Derived Values - DataList headers, items, itemActions
    const dataList = useMemo(() => {
      const headers: FormattedTableHeader[] = [
        { th: "Layer IGT", sortable: true, align: "start" },
        { th: "Basis IGT", sortable: true, align: "start" },
        { th: "Jumlah / Luas", sortable: true, align: "start" },
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

          const calcItem = calculationResult?.items?.find(
            (it) =>
              it.sourceLayerId === layer.id ||
              it.layerId === layer.id ||
              it.sourceLayerId === layer.typeName ||
              it.layerId === layer.typeName ||
              it.sourceLayerId === layer.wfs?.wfsTypeName ||
              it.layerId === layer.wfs?.wfsTypeName,
          );

          const bidangFeatureCount =
            calcItem?.featuresCount && calcItem.featuresCount > 0
              ? calcItem.featuresCount
              : (bidangQueryResult.features?.features?.filter(
                  (f) =>
                    f.properties?.__sourceLayerId === layer.id ||
                    f.properties?.__sourceLayerTitle === layer.title ||
                    f.properties?.__sourceLayerTitle === layer.typeName,
                ).length ?? 0);

          const countOrAreaText =
            layer.spatialBasis === "bidang"
              ? `${formatNumber(bidangFeatureCount)} bidang`
              : `${formatNumber(calcItem?.areaHa ?? 0, { maximumFractionDigits: 2 })} ha`;

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
                td: <IgtBasisBadge>{layer.spatialBasis}</IgtBasisBadge>,
                align: "start",
              },
              {
                value:
                  layer.spatialBasis === "bidang"
                    ? bidangFeatureCount
                    : (calcItem?.areaHa ?? 0),
                td: <P>{countOrAreaText}</P>,
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
            const resolvedAoi =
              effectiveAoiPolygon && "geometry" in effectiveAoiPolygon
                ? (effectiveAoiPolygon.geometry as
                    | GeoJSON.Polygon
                    | GeoJSON.MultiPolygon)
                : (effectiveAoiPolygon as
                    | GeoJSON.Polygon
                    | GeoJSON.MultiPolygon
                    | undefined);

            void flyTo(layer, {
              cqlFilter: combinedCqlFilter,
              aoiPolygon: resolvedAoi,
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
    }, [
      filteredLayers,
      calculationResult,
      combinedCqlFilter,
      effectiveAoiPolygon,
      flyTo,
      onSelectIgtLayer,
      bidangQueryResult.features?.features,
    ]);

    const pricingPolicy = usePricingPolicy();
    const totalBidangCount = calculationResult?.totalBidangCount ?? 0;
    const totalKawasanAreaHa = calculationResult?.totalKawasanAreaHa ?? 0;
    const minBidangCount =
      calculationResult?.policy?.minimumBidangCount ??
      pricingPolicy.minBidangCount;
    const minKawasanHa =
      calculationResult?.policy?.minimumKawasanHa ?? pricingPolicy.minKawasanHa;

    const isShowLoading =
      isLoadingLayers ||
      (showFilter && adminBoundaryQuery.isLoading) ||
      isCalculating;
    const hasIntersectingLayers = !isEmptyArray(intersectingLayers);
    const hasFilteredLayers = !isEmptyArray(filteredLayers);

    // Derived Values
    const isBidangValid = totalBidangCount >= minBidangCount;
    const isKawasanValid = totalKawasanAreaHa >= minKawasanHa;

    return (
      <VStack
        flex={1}
        position={"relative"}
        overflow={"hidden"}
        w={"full"}
        bg={"bg.body"}
        roundedBottom={theme.radii.container}
      >
        <VStack flex={1} w={"full"} overflowY={"auto"}>
          {/* Spatial Calculation Summary Box */}
          {(Boolean(effectiveAoiPolygon) ||
            adminBoundaryQuery.isLoading ||
            isCalculating) && (
            <Box p={"md"} bg={"bg.body"} w={"full"} flexShrink={0}>
              <MitraDataRequestSpatialSummary
                isCalculating={adminBoundaryQuery.isLoading || isCalculating}
                progressMessage={
                  adminBoundaryQuery.isLoading
                    ? "Memuat batas wilayah administrasi..."
                    : undefined
                }
                totalBidangCount={totalBidangCount}
                totalKawasanAreaHa={calculationResult?.totalKawasanAreaHa ?? 0}
                subtotalBidangPrice={
                  calculationResult?.subtotalBidangPrice &&
                  calculationResult.subtotalBidangPrice > 0
                    ? calculationResult.subtotalBidangPrice
                    : totalBidangCount *
                      (calculationResult?.policy?.pricePerBidang ??
                        pricingPolicy.pricePerBidang)
                }
                subtotalKawasanPrice={
                  calculationResult?.subtotalKawasanPrice ?? 0
                }
                pricePerBidang={
                  calculationResult?.policy?.pricePerBidang ??
                  pricingPolicy.pricePerBidang
                }
                pricePerKawasanHa={
                  calculationResult?.policy?.pricePerKawasanHa ??
                  pricingPolicy.pricePerKawasanHa
                }
                minBidangCount={minBidangCount}
                minKawasanHa={minKawasanHa}
                calculatedPolicy={calculationResult?.policy}
                validation={calculationResult?.validation}
                estimatedTotalPrice={
                  calculationResult?.estimatedTotalPrice ?? 0
                }
                hasKawasanCoveragePolygon={Boolean(
                  calculationResult?.kawasanCoveragePolygon,
                )}
                hasBidangLayer={bidangLayers.length > 0 || totalBidangCount > 0}
                hasKawasanLayer={
                  kawasanLayers.length > 0 || totalKawasanAreaHa > 0
                }
                isKawasanCoverageVisible={isCoverageVisible}
                isBidangVisible={isBidangVisible}
                isFetchingBidang={bidangQueryResult.isLoading}
                selectionType={selectionType}
                onToggleKawasanCoverageVisible={() => {
                  if (selectionType === "upload_aoi") {
                    setIsUploadCoverageVisible(!isUploadCoverageVisible);
                  } else if (selectionType === "draw_aoi") {
                    setIsDrawCoverageVisible(!isDrawCoverageVisible);
                  } else {
                    setIsCatalogCoverageVisible(!isCatalogCoverageVisible);
                  }
                }}
                onToggleBidangVisible={() => {
                  if (selectionType === "upload_aoi") {
                    setIsUploadBidangVisible(!isUploadBidangVisible);
                  } else if (selectionType === "draw_aoi") {
                    setIsDrawBidangVisible(!isDrawBidangVisible);
                  } else {
                    setIsCatalogBidangVisible(!isCatalogBidangVisible);
                  }
                }}
                onFlyToKawasanCoverage={() => {
                  if (map && calculationResult?.kawasanCoveragePolygon) {
                    flyToCartGeometry(
                      map,
                      calculationResult.kawasanCoveragePolygon,
                    );
                  }
                }}
                onFlyToBidang={() => {
                  if (
                    map &&
                    bidangQueryResult.features &&
                    bidangQueryResult.features.features.length > 0
                  ) {
                    highlightFeatureOnMap(map, bidangQueryResult.features, {
                      fitCamera: true,
                      zoom: 16,
                    });
                  }
                }}
              />
            </Box>
          )}

          <Separator borderColor={"bg.canvas"} flexShrink={0} />

          {/* Actions Header: Search Bar & Basis IGT Filter */}
          <ActionHeaderScrollContainer
            align={"center"}
            justify={"space-between"}
            gap={"sm"}
            w={"full"}
            p={"md"}
            bg={"bg.body"}
            flexShrink={0}
          >
            {/* Left: Search Bar */}
            <HStack gap={"sm"} flex={1} w={"240px"} maxW={"240px"}>
              <SearchInput
                w={"full"}
                placeholder={"Cari nama / layer IGT"}
                value={searchRaw}
                onValueChange={(val) => setSearchRaw(val)}
              />
            </HStack>

            {/* Right: Basis IGT Filter SegmentGroup */}
            <HStack align={"center"} gap={"sm"} flexShrink={0}>
              <SegmentGroupInput
                value={basisFilter}
                onValueChange={(details) => {
                  if (details.value) {
                    setBasisFilter(details.value as BasisFilterType);
                  }
                }}
                options={BASIS_FILTER_OPTIONS}
              />
            </HStack>
          </ActionHeaderScrollContainer>

          <Separator borderColor={"bg.canvas"} flexShrink={0} />

          {/* DataList Table with Multi-Selection Checkbox */}
          <VStack flex={1} w={"full"} bg={"bg.body"}>
            {isShowLoading && (
              <Skeleton
                flex={1}
                w={"full"}
                minH={"240px"}
                p={"md"}
                rounded={0}
              />
            )}

            {!isShowLoading &&
              (isErrorLayers ||
                (showFilter && adminBoundaryQuery.isError) ||
                Boolean(calculationError && !calculationResult)) && (
                <VStack flex={1} justify={"center"} align={"center"} p={"xl"}>
                  <StateRetry
                    title={
                      calculationError && !calculationResult
                        ? "Gagal Menghitung Cakupan Spasial IGT"
                        : "Gagal Memuat Data Wilayah / Layer IGT"
                    }
                    description={
                      (calculationError && !calculationResult
                        ? calculationError
                        : undefined) ||
                      errorLayers?.message ||
                      adminBoundaryQuery.error?.message ||
                      "Terjadi kesalahan saat memproses kalkulasi spasial di server. Silakan coba lagi atau ubah filter area."
                    }
                    onRetry={() => {
                      if (isErrorLayers) void refetchLayers();
                      if (showFilter && adminBoundaryQuery.isError)
                        void adminBoundaryQuery.refetch();
                      if (calculationError && !calculationResult) {
                        useMitraDataRequestStore
                          .getState()
                          .resetCalculation(selectionType);
                        const resolvedAoi = to2DGeometry(effectiveAoiPolygon);
                        if (!resolvedAoi) return;

                        const itemsList = validCalculationLayers.map(
                          (layer) => ({
                            sourceLayerId: layer.id,
                            typeName: layer.wfs?.wfsTypeName || layer.id,
                            title: layer.title,
                            spatialBasis: layer.spatialBasis,
                          }),
                        );
                        void calculate(
                          {
                            selectionType,
                            aoiPolygon: resolvedAoi,
                            items: itemsList,
                          },
                          `${calcTriggerKey}|retry-${Date.now()}`,
                        );
                      }
                    }}
                  />
                </VStack>
              )}

            {!isShowLoading && !isErrorLayers && !hasIntersectingLayers && (
              <VStack flex={1} justify={"center"} align={"center"} p={"xl"}>
                <StateNoData
                  icon={IconDatabaseOff}
                  title={"Tidak Ada Layer IGT pada Area Ini"}
                  description={
                    "Area AOI yang Anda pilih tidak beririsan dengan data spasial layer IGT manapun. Silakan gambar atau upload area lain yang memiliki data."
                  }
                />
              </VStack>
            )}

            {!isShowLoading &&
              !isErrorLayers &&
              hasIntersectingLayers &&
              !hasFilteredLayers && (
                <VStack flex={1} justify={"center"} align={"center"} p={"xl"}>
                  <StateNoResult
                    query={
                      debouncedSearch ||
                      (basisFilter !== "all" ? `Basis: ${basisFilter}` : "...")
                    }
                  />
                </VStack>
              )}

            {!isShowLoading && !isErrorLayers && hasFilteredLayers && (
              <DataViewTable.Root<IgtLayerItem>
                headers={dataList.headers}
                items={dataList.items}
                itemActions={dataList.itemActions}
                virtualized={false}
                withNumbering={true}
                roundedTop={0}
                overflowY={"visible"}
                overflowX={"auto"}
                maxH={"none"}
                flex={"unset"}
              >
                <DataViewTable.Header />
                <DataViewTable.Body />
              </DataViewTable.Root>
            )}
          </VStack>
        </VStack>

        <Separator borderColor={"bg.canvas"} flexShrink={0} />

        {/* Action Bar Footer */}
        <VStack gap={"sm"} w={"full"} p={"md"} bg={"bg.body"} flexShrink={0}>
          {/* Action Buttons */}
          {!isBidangValid || !isKawasanValid ? (
            <Tooltip
              content={
                "Batas minimum pembelian belum terpenuhi untuk semua basis IGT yang dipilih."
              }
            >
              <VStack w={"full"} align={"stretch"}>
                <Button
                  primary
                  w={"full"}
                  disabled={
                    !hasFilteredLayers ||
                    addToCartMultipleMutation.isPending ||
                    isShowLoading ||
                    !isBidangValid ||
                    !isKawasanValid
                  }
                  loading={addToCartMultipleMutation.isPending}
                  onClick={handleAddToCartSelected}
                >
                  <AppIcon icon={ShoppingCartIcon} />
                  {`Tambah semua layer ke keranjang (${formatNumber(filteredLayers.length)})`}
                </Button>
              </VStack>
            </Tooltip>
          ) : (
            <Button
              primary
              w={"full"}
              disabled={
                !hasFilteredLayers ||
                addToCartMultipleMutation.isPending ||
                isShowLoading
              }
              loading={addToCartMultipleMutation.isPending}
              onClick={handleAddToCartSelected}
            >
              <AppIcon icon={ShoppingCartIcon} />
              {`Tambah semua layer ke keranjang (${formatNumber(filteredLayers.length)})`}
            </Button>
          )}

          <HStack w={"full"} gap={"xs"}>
            {!isBidangValid && totalBidangCount > 0 ? (
              <Tooltip
                content={`Minimum pembelian untuk bidang tanah adalah ${formatNumber(minBidangCount)} bidang (saat ini: ${formatNumber(totalBidangCount)} bidang).`}
              >
                <VStack flex={1} minW={0} align={"stretch"}>
                  <Button
                    primary
                    variant={"outline"}
                    w={"full"}
                    disabled={
                      !hasFilteredLayers ||
                      addToCartMultipleMutation.isPending ||
                      isShowLoading ||
                      !isBidangValid
                    }
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
                disabled={
                  !hasFilteredLayers ||
                  addToCartMultipleMutation.isPending ||
                  isShowLoading ||
                  !isBidangValid
                }
                onClick={handleAddToCartBidangOnly}
              >
                {IGT_BASIS_MAP.bidang.icon && (
                  <AppIcon icon={IGT_BASIS_MAP.bidang.icon} />
                )}
                {"Semua Bidang"} ({formatNumber(bidangLayers.length)})
              </Button>
            )}

            {!isKawasanValid && totalKawasanAreaHa > 0 ? (
              <Tooltip
                content={`Minimum pembelian untuk kawasan adalah ${formatNumber(minKawasanHa)} ha (saat ini: ${formatNumber(totalKawasanAreaHa, { maximumFractionDigits: 2 })} ha).`}
              >
                <VStack flex={1} minW={0} align={"stretch"}>
                  <Button
                    primary
                    variant={"outline"}
                    w={"full"}
                    disabled={
                      !hasFilteredLayers ||
                      addToCartMultipleMutation.isPending ||
                      isShowLoading ||
                      !isKawasanValid
                    }
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
                disabled={
                  !hasFilteredLayers ||
                  addToCartMultipleMutation.isPending ||
                  isShowLoading ||
                  !isKawasanValid
                }
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
    );
  },
);
