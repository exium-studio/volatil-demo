// src/features/mitra/cart/components/mitra.cart.data-list.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "@/design-system/components/data-display/ui/data-list-page-size";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { NoResultState } from "@/design-system/components/feedback/ui/state.no-result";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { PADDING } from "@/design-system/constants/styles";
import {
  useCartItemsQuery,
  useRemoveFromCart,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import { getLocalCartIds } from "@/features/mitra/cart/services/mitra.cart.service";
import type { MitraCartTableProps } from "@/features/mitra/cart/types/cart.type";
import { getIgtLayers } from "@/features/mitra/data-request/api/mitra.data-request-igt-layers.api";
import { WfsFeaturesDataList } from "@/features/mitra/shared/components/wfs-features-data-list";
import { IconShoppingCartOff } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";

export const MitraCartDataList = (props: MitraCartTableProps) => {
  // Props
  const { ...restProps } = props;

  // Queries (Get layers dynamically)
  const { data: layersData } = useQuery({
    queryKey: ["igt-layers-list"],
    queryFn: () => getIgtLayers(),
    staleTime: Infinity,
  });

  // Derived Values
  const selectedIgtLayer = useMemo(
    () => layersData?.layers[0] ?? null,
    [layersData],
  );

  // States
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0],
  });
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Check if cart has local IDs
  const localCartIds = getLocalCartIds();
  const hasLocalIds = localCartIds.length > 0;

  // Queries
  const { features, total, isLoading, isFetching } = useCartItemsQuery({
    page: pageState.page,
    pageSize: pageState.pageSize,
    typeName: selectedIgtLayer?.wfs.wfsTypeName ?? "",
    wfsUrl: selectedIgtLayer?.wfs.wfsUrl ?? "",
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
      {!hasLocalIds && (
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
      )}

      {hasLocalIds && (
        <>
          {isLoading && (
            <Skeleton
              flex={1}
              w={"full"}
              h={"full"}
              rounded={0}
              p={PADDING.md}
            />
          )}

          {!isLoading && features.length === 0 && (
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
          )}

          {!isLoading && features.length > 0 && (
            <WfsFeaturesDataList
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
