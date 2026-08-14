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
import { buildWfsCqlFilter } from "@/features/mitra/data-request/utils/build-wfs-cql-filter";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import { isEmptyArray } from "@/shared/utils/data/array";
import { SlidersHorizontalIcon } from "lucide-react";
import { useState, useMemo } from "react";

export const MitraDataRequestCatalogTabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      display={"flex"}
      flex={1}
      flexDir={"column"}
      overflowY={"auto"}
      p={0}
      {...props}
    >
      <CatalogDataList />
    </Tabs.Content>
  );
};

// -------------------------------------------------------------------------------------

const CatalogDataList = () => {
  // Stores
  const { theme } = useThemeStore();
  const { selectedIgtLayer } = useIgtLayerStore();

  // States
  const [appliedFilters, setAppliedFilters] = useState<WfsIgtFilterValues>({});
  const [searchRaw, setSearchRaw] = useState<string>("");
  const [pageState, setPageState] = useState({
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
    page: 1,
  });
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Derived Values
  const debouncedSearch = useDebouncedValue(searchRaw);
  const cqlFilter = useMemo(
    () => buildWfsCqlFilter(appliedFilters),
    [appliedFilters],
  );

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
    page: pageState.page,
    pageSize: pageState.pageSize,
    cqlFilter,
    search: debouncedSearch,
    typeName: selectedIgtLayer?.wfsTypeName ?? "",
    wfsUrl: selectedIgtLayer?.wfsUrl ?? "",
  });

  return (
    <VStack
      flex={1}
      gap={0}
      overflowY={"auto"}
      bg={"bg.canvas"}
      w={"full"}
      position={"relative"}
    >
      {/* Action Header — Search, Filter (rendered inside datalist) */}
      <HStack
        wrap={"wrap"}
        align={"center"}
        justify={"space-between"}
        gap={SPACING.sm}
        w={"full"}
        p={PADDING.md}
        bg={"bg.body"}
      >
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

      <Separator borderColor={"bg.canvas"} />

      {isLoading ? (
        <Skeleton p={PADDING.md} rounded={0} />
      ) : isEmptyArray(features) ? (
        <VStack
          flex={1}
          align={"center"}
          justify={"center"}
          gap={3}
          py={12}
          bg={"bg.body"}
          w={"full"}
        >
          <NoResultState query={debouncedSearch} />
        </VStack>
      ) : (
        <VStack gap={SPACING.sm} overflowY={"auto"}>
          <TopBarLoader isFetching={isFetching} />

          <WfsIgtDataList
            wfsFeatures={features}
            page={pageState.page}
            pageSize={pageState.pageSize}
            totalFeatures={totalFeatures}
            setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
            setPageSize={(pageSize) =>
              setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
            }
            onSelectedItemChange={({ selectedItems: sel }) =>
              setSelectedItems(sel as FormattedListItem[])
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
              if (!selectedIgtLayer) return;
              addToCartAllMutation.mutate({
                cqlFilter,
                typeName: selectedIgtLayer.wfsTypeName,
                wfsUrl: selectedIgtLayer.wfsUrl ?? "",
              });
            }}
            onAddAllKawasanClick={() => {
              if (!selectedIgtLayer) return;
              addToCartAllMutation.mutate({
                cqlFilter,
                typeName: selectedIgtLayer.wfsTypeName,
                wfsUrl: selectedIgtLayer.wfsUrl ?? "",
              });
            }}
            onAddAllBothClick={() => {
              if (!selectedIgtLayer) return;
              addToCartAllMutation.mutate({
                cqlFilter,
                typeName: selectedIgtLayer.wfsTypeName,
                wfsUrl: selectedIgtLayer.wfsUrl ?? "",
              });
            }}
            mt={"auto"}
          />
        </VStack>
      )}
    </VStack>
  );
};
