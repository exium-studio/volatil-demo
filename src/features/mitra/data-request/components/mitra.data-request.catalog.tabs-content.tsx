// src/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Switch } from "@/design-system/components/input/ui/switch";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { useMapInstanceStore } from "@/design-system/components/map/stores/map.instance.store";
import { Tooltip } from "@/design-system/components/overlay/ui/tooltip";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { flyToCartGeometry } from "@/features/mitra/cart/hooks/use-cart-aoi-coverage-map";
import { MitraDataRequestDetailAttributeView } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-view";
import { MitraDataRequestIgtLayerDataView } from "@/features/mitra/data-request/components/mitra.data-request.igt-layer.data-view";
import { useAdminBoundaryAoi } from "@/features/mitra/data-request/hooks/use-admin-boundary-aoi";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useSelectedIgtLayer } from "@/features/mitra/data-request/hooks/use-selected-igt-layer";
import {
  useAdministrativeFilterStore,
  useIgtLayerStore,
} from "@/features/mitra/data-request/stores/igt-layer.store";
import type { MitraDataRequestCatalogTabsContentProps } from "@/features/mitra/data-request/types/mitra.data-request.catalog.type";
import { FilterAdministrativeAreaTrigger } from "@/features/shared/components/filter.administrative-area";
import { FilterAdministrativeAreaForm } from "@/features/shared/components/filter.administrative-area.form";
import {
  hasActiveAdministrativeFilter,
  type FilterAdministrativeAreaValues,
} from "@/features/shared/types/filter.administrative-area.type";
import { FocusIcon, SlidersHorizontalIcon, TrashIcon } from "lucide-react";
import { useMemo, useState } from "react";

export const MitraDataRequestCatalogTabsContent = (
  props: MitraDataRequestCatalogTabsContentProps,
) => {
  // Props
  const { isActive = false, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();
  const map = useMapInstanceStore((state) => state.map);
  const { appliedAdministrativeFilters, setAppliedAdministrativeFilters } =
    useAdministrativeFilterStore();

  // Hooks
  const { layerId, selectedIgtLayer, selectLayer } = useSelectedIgtLayer();
  const isMounted = useMountTimeout({
    isOpen: isActive,
    mountDelay: 250,
  });
  const adminBoundaryQuery = useAdminBoundaryAoi(appliedAdministrativeFilters, {
    enabled: isActive,
  });

  // States
  const [draftFilters, setDraftFilters] =
    useState<FilterAdministrativeAreaValues>(appliedAdministrativeFilters);
  const [isAoiVisible, setIsAoiVisible] = useState<boolean>(true);

  // Derived Values
  const hasFilter = hasActiveAdministrativeFilter(appliedAdministrativeFilters);
  const filterLabel = useMemo(() => {
    const parts: string[] = [];
    if (appliedAdministrativeFilters.WADMPR?.label)
      parts.push(appliedAdministrativeFilters.WADMPR.label);
    if (appliedAdministrativeFilters.WADMKK?.label)
      parts.push(appliedAdministrativeFilters.WADMKK.label);
    if (appliedAdministrativeFilters.WADMKC?.label)
      parts.push(appliedAdministrativeFilters.WADMKC.label);
    if (appliedAdministrativeFilters.WADMKD?.label)
      parts.push(appliedAdministrativeFilters.WADMKD.label);
    return parts.join(" • ");
  }, [appliedAdministrativeFilters]);

  // Handlers
  const handleApplyInitialFilter = (
    filters: FilterAdministrativeAreaValues,
  ) => {
    setAppliedAdministrativeFilters(filters);
  };

  const handleResetInitialFilter = () => {
    setDraftFilters({});
    setAppliedAdministrativeFilters({});
  };

  return (
    <Tabs.Content
      p={0}
      flex={1}
      display={"flex"}
      flexDir={"column"}
      overflowY={"auto"}
      {...restProps}
      value={"catalog"}
    >
      {!isActive || !isMounted ? (
        <Skeleton h={"full"} w={"full"} flex={1} p={"md"} rounded={0} />
      ) : !hasFilter ? (
        <VStack
          flex={1}
          w={"full"}
          overflowY={"auto"}
          p={"md"}
          justify={"space-between"}
          align={"stretch"}
          bg={"bg.body"}
          roundedBottom={theme.radii.container}
        >
          <FilterAdministrativeAreaForm
            modalKeyPrefix={"mitra-catalog-initial-filter"}
            value={draftFilters}
            onChange={setDraftFilters}
            onApply={handleApplyInitialFilter}
            onReset={handleResetInitialFilter}
            showActionButtons={true}
            showAlert={true}
          />
        </VStack>
      ) : !layerId || !selectedIgtLayer ? (
        <VStack
          flex={1}
          gap={0}
          overflowY={"auto"}
          bg={"bg.canvas"}
          position={"relative"}
          w={"full"}
        >
          {/* Header Action Bar */}
          <VStack
            wrap={"wrap"}
            justify={"space-between"}
            gap={"sm"}
            p={"md"}
            bg={"bg.body"}
            w={"full"}
          >
            <HStack
              wrap={"wrap"}
              align={"center"}
              justify={"space-between"}
              gap={"sm"}
              w={"full"}
            >
              <VStack align={"start"} gap={0}>
                <P fontWeight={"semibold"} fontSize={"md"}>
                  {"AOI Wilayah Administrasi"}
                </P>
                {filterLabel && (
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {filterLabel}
                  </P>
                )}
              </VStack>

              <HStack align={"center"} gap={"sm"}>
                {adminBoundaryQuery.aoiPolygon && map && (
                  <>
                    <Tooltip
                      content={
                        isAoiVisible
                          ? "Sembunyikan Area (AOI) dari Peta"
                          : "Tampilkan Area (AOI) di Peta"
                      }
                    >
                      <Switch
                        checked={isAoiVisible}
                        onCheckedChange={(e) => setIsAoiVisible(e.checked)}
                        mr={"xs"}
                      />
                    </Tooltip>

                    <Tooltip content={"Zoom ke Area (AOI)"}>
                      <IconButton
                        variant={"outline"}
                        aria-label={"Zoom ke Area (AOI)"}
                        onClick={() => {
                          if (adminBoundaryQuery.aoiPolygon) {
                            flyToCartGeometry(
                              map,
                              adminBoundaryQuery.aoiPolygon,
                            );
                          }
                        }}
                      >
                        <AppIcon icon={FocusIcon} />
                      </IconButton>
                    </Tooltip>
                  </>
                )}

                <FilterAdministrativeAreaTrigger
                  modalKey={"mitra-data-request-igt-card-filter-modal"}
                  value={appliedAdministrativeFilters}
                  onApply={handleApplyInitialFilter}
                >
                  <Tooltip content={"Ubah Filter Wilayah"}>
                    <IconButton
                      variant={"outline"}
                      aria-label={"Ubah Filter Wilayah"}
                    >
                      <AppIcon icon={SlidersHorizontalIcon} />
                    </IconButton>
                  </Tooltip>
                </FilterAdministrativeAreaTrigger>

                <Tooltip content={"Hapus AOI Wilayah Administrasi"}>
                  <IconButton
                    variant={"outline"}
                    colorPalette={"red"}
                    aria-label={"Hapus AOI Wilayah Administrasi"}
                    onClick={handleResetInitialFilter}
                  >
                    <AppIcon icon={TrashIcon} />
                  </IconButton>
                </Tooltip>
              </HStack>
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          <MitraDataRequestIgtLayerDataView
            selectionType={"catalog"}
            aoiPolygon={adminBoundaryQuery.aoiPolygon}
            isAoiVisible={isAoiVisible}
            isActive={isActive}
            onSelectIgtLayer={(layer) => {
              selectLayer(layer.id);
            }}
          />
        </VStack>
      ) : (
        <CatalogAttributeList />
      )}
    </Tabs.Content>
  );
};

const CatalogAttributeList = () => {
  // Hooks & Stores
  const { selectedIgtLayer } = useSelectedIgtLayer();
  const { cqlFilter } = useIgtLayerStore();

  // States
  const [pageState, setPageState] = useState({
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    page: 1,
  });
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Queries — server-side WFS pagination
  const {
    features,
    totalFeatures,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useIgtWfsCatalog({
    page: pageState.page,
    pageSize: pageState.pageSize,
    cqlFilter,
    typeName: selectedIgtLayer?.wfs.wfsTypeName ?? "",
    wfsUrl: selectedIgtLayer?.wfs.wfsUrl ?? "",
  });

  return (
    <MitraDataRequestDetailAttributeView
      layer={selectedIgtLayer}
      cqlFilter={cqlFilter}
      features={features}
      totalFeatures={totalFeatures}
      isLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      error={error}
      onRetry={() => {
        void refetch();
      }}
      page={pageState.page}
      pageSize={pageState.pageSize}
      setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
      setPageSize={(pageSize) =>
        setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
      }
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  );
};
