// src/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-view-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-view-page-size";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MitraDataRequestDetailAttributeView } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-view";
import { MitraDataRequestIgtLayerDataView } from "@/features/mitra/data-request/components/mitra.data-request.igt-layer.data-view";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useSelectedIgtLayer } from "@/features/mitra/data-request/hooks/use-selected-igt-layer";
import {
  useAdministrativeFilterStore,
  useIgtLayerStore,
} from "@/features/mitra/data-request/stores/igt-layer.store";
import type { MitraDataRequestCatalogTabsContentProps } from "@/features/mitra/data-request/types/mitra.data-request.catalog.type";
import { FilterAdministrativeAreaForm } from "@/features/shared/components/filter.administrative-area.form";
import {
  hasActiveAdministrativeFilter,
  type FilterAdministrativeAreaValues,
} from "@/features/shared/types/filter.administrative-area.type";
import { useState } from "react";

export const MitraDataRequestCatalogTabsContent = (
  props: MitraDataRequestCatalogTabsContentProps,
) => {
  // Props
  const { isActive: _isActive, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();
  const {
    appliedAdministrativeFilters,
    setAppliedAdministrativeFilters,
  } = useAdministrativeFilterStore();

  // Hooks
  const { layerId, selectedIgtLayer, selectLayer } = useSelectedIgtLayer();

  // States
  const [draftFilters, setDraftFilters] =
    useState<FilterAdministrativeAreaValues>(appliedAdministrativeFilters);

  // Derived Values
  const hasFilter = hasActiveAdministrativeFilter(appliedAdministrativeFilters);

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
      {!hasFilter ? (
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
        <MitraDataRequestIgtLayerDataView
          selectionType={"catalog"}
          onSelectIgtLayer={(layer) => {
            selectLayer(layer.id);
          }}
        />
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

