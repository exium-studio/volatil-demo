// src/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { WfsIgtDataList } from "@/features/mitra/data-request/components/mitra.data-request.wfs-data-list";
import { WfsIgtFilterTrigger } from "@/features/mitra/data-request/components/wfs-igt-filter";
import { useIgtWfsCatalog } from "@/features/mitra/data-request/hooks/use-igt-wfs-catalog";
import {
  useAddToCartAll,
  useAddToCartSelected,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import type { WfsIgtFilterValues } from "@/features/mitra/data-request/types/filter-wfs-igt-trigger.type";
import type { CatalogDataListProps } from "@/features/mitra/data-request/types/mitra.data-request.catalog.type";
import { buildWfsCqlFilter } from "@/features/mitra/data-request/utils/build-wfs-cql-filter";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { isEmptyArray } from "@/shared/utils/data/array";
import { SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";

export const MitraDataRequestCatalogTabsContent = (props: TabsContentProps) => {
  // States
  const [appliedFilters, setAppliedFilters] = useState<WfsIgtFilterValues>({});
  const [searchRaw, setSearchRaw] = useState<string>("");
  const [dataListState, setDataListState] = useState({
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    page: 1,
    selectedItems: [] as FormattedListItem[],
  });

  // Derived Values
  const debouncedSearch = useDebouncedValue(searchRaw);

  const cqlFilter = buildWfsCqlFilter(appliedFilters);

  return (
    <Tabs.Content
      display={"flex"}
      flex={1}
      flexDir={"column"}
      overflowY={"auto"}
      p={0}
      {...props}
    >
      <VStack
        wrap={"wrap"}
        justify={"space-between"}
        gap={SPACING.md}
        p={PADDING.md}
      >
        {/* Header - Actions */}
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING.sm}
        >
          <HStack gap={SPACING.sm}>
            <SearchInput
              placeholder={"Cari..."}
              value={searchRaw}
              onValueChange={(val) => {
                setSearchRaw(val);
                setDataListState((prev) => ({ ...prev, page: 1 }));
              }}
            />

            <WfsIgtFilterTrigger
              onApply={(filters) => {
                setAppliedFilters(filters);
                setDataListState((prev) => ({ ...prev, page: 1 }));
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

      <CatalogDataList
        page={dataListState.page}
        pageSize={dataListState.pageSize}
        cqlFilter={cqlFilter}
        search={debouncedSearch}
        selectedItems={dataListState.selectedItems}
        onPageChange={(page) => setDataListState((prev) => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) =>
          setDataListState((prev) => ({ ...prev, pageSize, page: 1 }))
        }
        onSelectedItemChange={(selectedItems) =>
          setDataListState((prev) => ({ ...prev, selectedItems }))
        }
      />
    </Tabs.Content>
  );
};

// -------------------------------------------------------------------------------------

const CatalogDataList = (props: CatalogDataListProps) => {
  // Props
  const {
    page,
    pageSize,
    cqlFilter,
    search,
    selectedItems,
    onPageChange,
    onPageSizeChange,
    onSelectedItemChange,
  } = props;

  // Stores
  const { theme } = useThemeStore();
  const { selectedLayer } = useIgtLayerStore();

  // Hooks (Mutations)
  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  // Queries
  const {
    features,
    totalFeatures,
    bidangCount,
    kawasanCount,
    isLoading,
    isFetching,
  } = useIgtWfsCatalog({
    page,
    pageSize,
    cqlFilter,
    search,
    typeName: selectedLayer?.wfsTypeName ?? "",
    wfsUrl: selectedLayer?.wfsUrl ?? "",
  });

  return (
    <VStack
      flex={1}
      gap={PADDING.sm}
      overflowY={"auto"}
      bg={"bg.canvas"}
      w={"full"}
      position={"relative"}
    >
      {isLoading ? (
        <Skeleton p={PADDING.md} />
      ) : isEmptyArray(features) ? (
        <VStack
          flex={1}
          align={"center"}
          justify={"center"}
          gap={3}
          py={12}
          bg={"bg.body"}
        >
          <NoResultState />
        </VStack>
      ) : (
        <>
          <TopBarLoader isFetching={isFetching} />

          <WfsIgtDataList
            wfsFeatures={features}
            page={page}
            pageSize={pageSize}
            totalFeatures={totalFeatures}
            setPage={onPageChange}
            setPageSize={onPageSizeChange}
            onSelectedItemChange={({ selectedItems: sel }) =>
              onSelectedItemChange(sel)
            }
            roundedBottom={theme.radii.container}
          />

          <MitraDataRequestAddToCartButtons
            selectedItems={selectedItems}
            allItems={features}
            totalBidangCount={bidangCount}
            totalKawasanCount={kawasanCount}
            totalCount={totalFeatures}
            onAddSelectedClick={() => {
              const selectedIds = selectedItems.map((item) => String(item.id));
              addToCartSelectedMutation.mutate(selectedIds);
            }}
            onAddAllBidangClick={() => {
              if (!selectedLayer) return;
              addToCartAllMutation.mutate({
                cqlFilter,
                typeName: selectedLayer.wfsTypeName,
                wfsUrl: selectedLayer.wfsUrl ?? "",
              });
            }}
            onAddAllKawasanClick={() => {
              if (!selectedLayer) return;
              addToCartAllMutation.mutate({
                cqlFilter,
                typeName: selectedLayer.wfsTypeName,
                wfsUrl: selectedLayer.wfsUrl ?? "",
              });
            }}
            onAddAllBothClick={() => {
              if (!selectedLayer) return;
              addToCartAllMutation.mutate({
                cqlFilter,
                typeName: selectedLayer.wfsTypeName,
                wfsUrl: selectedLayer.wfsUrl ?? "",
              });
            }}
            mt={"auto"}
          />
        </>
      )}
    </VStack>
  );
};
