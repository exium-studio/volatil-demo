// src/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { MitraDataRequestDetailAttributeView } from "@/features/mitra/data-request/components/mitra.data-request.detail-attribute-view";
import { MitraDataRequestIgtLayerList } from "@/features/mitra/data-request/components/mitra.data-request.igt-layer-list";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import { useSelectedIgtLayer } from "@/features/mitra/data-request/hooks/use-selected-igt-layer";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { useState } from "react";

export const MitraDataRequestCatalogTabsContent = (props: TabsContentProps) => {
  // Hooks
  const { layerId, selectedIgtLayer, selectLayer } = useSelectedIgtLayer();

  return (
    <Tabs.Content p={0} flex={1} display={"flex"} {...props} value={"catalog"}>
      {!layerId || !selectedIgtLayer ? (
        <MitraDataRequestIgtLayerList
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
  const { features, totalFeatures, isLoading, isFetching } = useIgtWfsCatalog({
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
