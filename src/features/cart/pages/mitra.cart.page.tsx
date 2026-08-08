// src/features/cart/pages/mitra.cart.page.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { PADDING_SM } from "@/design-system/constants/styles";
import { MitraCartDataList } from "@/features/cart/components/mitra.cart.data-list";
import { MitraCartOrderSummary } from "@/features/cart/components/mitra.cart.order-summary";
import {
  useCartQuery,
  useCheckoutCart,
  useClearCart,
  useRemoveFromCart,
} from "@/features/cart/hooks/use-mitra-cart";
import type { CartItem } from "@/features/cart/types/cart.type";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { useMemo, useState } from "react";

export const MitraCartPage = () => {
  return (
    <PanelContentContainer overflowY={"auto"} gap={PADDING_SM} p={PADDING_SM}>
      <Container.Root flex={1} overflowY={"auto"} withContext={true}>
        <MitraCartPageContent />
      </Container.Root>
    </PanelContentContainer>
  );
};

const MitraCartPageContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // States
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Hooks (Queries & Mutations)
  const { cartData, isLoading, isFetching } = useCartQuery(searchValue);
  const checkoutMutation = useCheckoutCart();
  const clearCartMutation = useClearCart(() => setSelectedItems([]));
  const removeItemsMutation = useRemoveFromCart(() => setSelectedItems([]));

  // Derived Values
  const selectedCartItems: CartItem[] = useMemo(() => {
    return (selectedItems ?? [])
      .map((si) => si.data as CartItem)
      .filter(Boolean);
  }, [selectedItems]);

  const handleCheckout = () => {
    const ids = selectedCartItems.map((item) => item.id);
    checkoutMutation.mutate(ids);
  };

  return (
    <Container.Body flex={1} overflowY={"auto"}>
      <AppNavTitle navsMap={APP_NAVS_MAP} />

      <Separator borderColor={"bg.canvas"} />

      <HStack
        flex={1}
        flexDir={isSmContainer ? "column" : "row-reverse"}
        w={"full"}
        overflowY={"auto"}
        align={"stretch"}
      >
        <MitraCartOrderSummary
          summary={cartData.summary}
          config={cartData.config}
          selectedItems={selectedCartItems}
          onCheckout={handleCheckout}
          isCheckoutPending={checkoutMutation.isPending}
          flex={1}
        />

        {/* Cart Data List */}
        <MitraCartDataList
          cartItems={cartData.items}
          selectedItems={selectedItems as FormattedListItem<CartItem>[]}
          onSelectedItemChange={({ selectedItems: sel }) =>
            setSelectedItems(sel)
          }
          onClearCart={() => clearCartMutation.mutate()}
          onRemoveItems={(ids) => removeItemsMutation.mutate(ids)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          isLoading={isLoading}
          isFetching={isFetching}
          flex={2}
        />
      </HStack>
    </Container.Body>
  );
};
