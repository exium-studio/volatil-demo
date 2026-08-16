// src/features/mitra/cart/components/mitra.cart.data-list.tsx

import {
  Button,
  IconButton,
} from "@/design-system/components/button/ui/button";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { SearchInput } from "@/design-system/components/input/ui/search-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { getIgtLayers } from "@/design-system/components/map/services/map-layers.api";
import { PADDING, SPACING } from "@/design-system/constants/styles";
import { useDebouncedValue } from "@/design-system/hooks/use-debounced-value";
import {
  useCartItemsQuery,
  useRemoveFromCart,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import { getLocalCartIds } from "@/features/mitra/cart/services/mitra.cart.service";
import type { MitraCartTableProps } from "@/features/mitra/cart/types/cart.type";
import { IgtFilterTrigger } from "@/features/mitra/data-request/components/igt-filter";
import { useIgtLayerStore } from "@/features/mitra/data-request/stores/igt-layer.store";
import type { IgtFilterValues } from "@/features/mitra/data-request/types/filter-igt-trigger.type";
import { buildIgtCqlFilter } from "@/features/mitra/data-request/utils/build-igt-cql-filter";
import { WfsDataList } from "@/features/mitra/shared/components/wfs-data-list";
import { IconShoppingCartOff } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontalIcon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const MitraCartDataList = (props: MitraCartTableProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { selectedIgtLayer, setSelectedIgtLayer } = useIgtLayerStore();

  // Queries (Get layers dynamically)
  const { data: layersData } = useQuery({
    queryKey: ["igt-layers-list"],
    queryFn: () => getIgtLayers(),
    staleTime: Infinity,
  });

  // Set default selected layer if not set
  useEffect(() => {
    if (layersData?.wfs && layersData.wfs.length > 0 && !selectedIgtLayer) {
      setSelectedIgtLayer(layersData.wfs[0]);
    }
  }, [layersData, selectedIgtLayer, setSelectedIgtLayer]);

  // States
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
  });
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);
  const [searchRaw, setSearchRaw] = useState<string>("");
  const [appliedFilters, setAppliedFilters] = useState<IgtFilterValues>({});

  // Derived Values
  const debouncedSearch = useDebouncedValue(searchRaw);
  const cqlFilter = useMemo(
    () => buildIgtCqlFilter(appliedFilters),
    [appliedFilters],
  );

  // Check if cart has local IDs
  const localCartIds = getLocalCartIds();
  const hasLocalIds = localCartIds.length > 0;

  // Queries
  const { features, total, isLoading, isFetching } = useCartItemsQuery({
    page: pageState.page,
    pageSize: pageState.pageSize,
    cqlFilter,
    search: debouncedSearch,
    typeName: selectedIgtLayer?.wfsTypeName ?? "",
    wfsUrl: selectedIgtLayer?.wfsUrl ?? "",
  });

  // Mutations
  const removeItemsMutation = useRemoveFromCart(() => {
    setSelectedItems([]);
  });

  // Batch actions for deleting selected items
  const batchActions = useMemo(
    () => [
      ({
        selectedItemIds,
        clearSelectedItems,
      }: {
        selectedItemIds: string[];
        clearSelectedItems: () => void;
      }) => (
        <Button
          key={"remove-selected"}
          colorPalette={"red"}
          onClick={() => {
            removeItemsMutation.mutate(selectedItemIds);
            clearSelectedItems();
          }}
        >
          <AppIcon icon={Trash2Icon} />
          {"Hapus"}
        </Button>
      ),
    ],
    [removeItemsMutation],
  );

  return (
    <VStack
      flex={1}
      overflowY={"auto"}
      gap={0}
      align={"stretch"}
      {...restProps}
    >
      {/* If cart is completely empty, show NoDataState immediately */}
      {!hasLocalIds ? (
        <Box
          flex={1}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          w={"full"}
          py={PADDING.md}
          bg={"bg.body"}
        >
          <NoDataState
            icon={IconShoppingCartOff}
            title={"Keranjang kosong"}
            description={"Tambahkan data IGT dari halaman Permohonan Data"}
          />
        </Box>
      ) : (
        <>
          {/* Action Header — Search, Filter (rendered inside datalist) */}
          <VStack
            wrap={"wrap"}
            justify={"space-between"}
            gap={SPACING.md}
            p={PADDING.md}
            bg={"bg.body"}
          >
            <HStack justify={"space-between"} align={"center"} w={"full"}>
              <HStack gap={SPACING.sm}>
                <SearchInput
                  placeholder={"Cari..."}
                  value={searchRaw}
                  onValueChange={(val) => {
                    setSearchRaw(val);
                    setPageState((prev) => ({ ...prev, page: 1 }));
                  }}
                />

                <IgtFilterTrigger
                  modalKey="mitra-cart-filter-modal"
                  onApply={(filters: IgtFilterValues) => {
                    setAppliedFilters(filters);
                    setPageState((prev) => ({ ...prev, page: 1 }));
                  }}
                >
                  <IconButton variant={"outline"}>
                    <AppIcon icon={SlidersHorizontalIcon} />
                  </IconButton>
                </IgtFilterTrigger>
              </HStack>
            </HStack>
          </VStack>

          <Separator borderColor={"bg.canvas"} />

          {isLoading ? (
            <Skeleton p={PADDING.md} />
          ) : features.length === 0 ? (
            <Box
              flex={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              w={"full"}
              py={PADDING.md}
              bg={"bg.body"}
            >
              <NoResultState />
            </Box>
          ) : (
            <WfsDataList
              wfsFeatures={features}
              page={pageState.page}
              pageSize={pageState.pageSize}
              totalFeatures={total}
              setPage={(page) => setPageState((prev) => ({ ...prev, page }))}
              setPageSize={(pageSize) =>
                setPageState((prev) => ({ ...prev, pageSize, page: 1 }))
              }
              selectedItems={selectedItems}
              onSelectedItemChange={({ selectedItems: next }) => {
                setSelectedItems(next);
              }}
              batchActions={batchActions}
              isFetching={isFetching}
            />
          )}
        </>
      )}
    </VStack>
  );
};
