// src/features/mitra/data-request/components/mitra.data-request.catalog.tabs-content.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DataListFooter } from "@/design-system/components/data-display/ui/data-list-footer";
import { DEFAULT_PER_PAGE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-per-page";
import type { TabsContentProps } from "@/design-system/components/disclosure/type/tabs.type";
import { Tabs } from "@/design-system/components/disclosure/ui/tabs";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import {
  PADDING_MD,
  PADDING_SM,
  SPACING_MD,
  SPACING_SM,
} from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/use-theme-store";
import { FilterWfsIgtTrigger } from "@/features/mitra/data-request/components/filter-wfs-igt-trigger";
import { MitraDataRequestAddToCartButtons } from "@/features/mitra/data-request/components/mitra.data-request.add-to-cart-buttons";
import { MitraIgtDataListTable } from "@/features/mitra/data-request/components/mitra.data-request.igt-data-list-table";
import {
  useAddToCartAll,
  useAddToCartSelected,
  useIgtCatalog,
} from "@/features/mitra/data-request/hooks/use-mitra-data-request";
import { t } from "@/shared/libs/i18n";
import { SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";

export const MitraDataRequestCatalogTabsContent = (props: TabsContentProps) => {
  // States
  const [activeFilters, setActiveFilters] = useState<
    Record<string, string | undefined>
  >({});

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
        gap={SPACING_MD}
        p={PADDING_MD}
      >
        {/* Header - Actions */}
        <HStack
          wrap={"wrap"}
          align={"center"}
          justify={"space-between"}
          gap={SPACING_SM}
        >
          <HStack gap={SPACING_SM}>
            <SearchInput placeholder={t["action.search"]()} />

            <FilterWfsIgtTrigger
              defaultValues={activeFilters}
              onApply={(filters) => setActiveFilters(filters)}
            >
              <IconButton variant={"outline"}>
                <AppIcon icon={SlidersHorizontalIcon} />
              </IconButton>
            </FilterWfsIgtTrigger>
          </HStack>
        </HStack>
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      <MitraDataRequestCatalogDataList activeFilters={activeFilters} />
    </Tabs.Content>
  );
};

type CatalogDataListProps = {
  activeFilters?: Record<string, string | undefined>;
};

const MitraDataRequestCatalogDataList = (props: CatalogDataListProps) => {
  // Props
  const { activeFilters } = props;

  // Stores
  const { theme } = useThemeStore();

  // Hooks (Mutations)
  const addToCartSelectedMutation = useAddToCartSelected();
  const addToCartAllMutation = useAddToCartAll();

  // States
  const [dataListState, setDataListState] = useState({
    perPage: DEFAULT_PER_PAGE_OPTIONS[0],
    page: 1,
    selectedItems: [] as FormattedListItem[],
  });

  // Queries
  const {
    items: rawItems,
    meta,
    isLoading,
    isFetching,
  } = useIgtCatalog({
    page: dataListState.page,
    perPage: dataListState.perPage,
    search: activeFilters?.search,
  });

  return (
    <VStack
      flex={1}
      gap={PADDING_SM}
      overflowY={"auto"}
      bg={"bg.canvas"}
      w={"full"}
      position={"relative"}
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <VStack overflowY={"auto"} w={"full"} position={"relative"}>
            <MitraIgtDataListTable
              igtItems={rawItems}
              withNumbering={false}
              canBatchSelect={true}
              roundedTop={0}
              onSelectedItemChange={({ selectedItems }) => {
                console.log("selectedItems", selectedItems);
                setDataListState((prev) => ({ ...prev, selectedItems }));
              }}
              rounded={0}
              shadow={"none"}
            />

            <DataListFooter
              perPage={dataListState.perPage}
              setPerPage={(perPage) =>
                setDataListState((prev) => ({ ...prev, perPage }))
              }
              page={dataListState.page}
              setPage={(page) =>
                setDataListState((prev) => ({ ...prev, page }))
              }
              roundedBottom={theme.radii.container}
            />

            <TopBarLoader isFetching={isFetching} />
          </VStack>

          <MitraDataRequestAddToCartButtons
            selectedItems={dataListState.selectedItems}
            allItems={rawItems}
            totalBidangCount={meta?.totalBidang}
            totalKawasanCount={meta?.totalKawasan}
            totalCount={meta?.total}
            onAddSelectedClick={() => {
              const selectedIds = dataListState.selectedItems.map((item) =>
                String(item.id),
              );
              addToCartSelectedMutation.mutate({ itemIds: selectedIds });
            }}
            onAddAllBidangClick={() => {
              addToCartAllMutation.mutate({
                source: "catalog",
                targetBasis: "bidang",
              });
            }}
            onAddAllKawasanClick={() => {
              addToCartAllMutation.mutate({
                source: "catalog",
                targetBasis: "kawasan",
              });
            }}
            onAddAllBothClick={() => {
              addToCartAllMutation.mutate({
                source: "catalog",
                targetBasis: "all",
              });
            }}
            mt={"auto"}
          />
        </>
      )}
    </VStack>
  );
};
