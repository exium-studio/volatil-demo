// src/features/cart/pages/mitra.cart.page.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import { Container, useContainerContext } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { AppNavTitle } from "@/design-system/components/shell/ui/app-nav-title";
import { PADDING_SM, SPACING_MD } from "@/design-system/constants/styles";
import { MitraCartOrderSummary } from "@/features/cart/components/mitra.cart.order-summary";
import { MitraCartTable } from "@/features/cart/components/mitra.cart.table";
import { checkout, clearCart, getCartData, removeFromCart } from "@/features/cart/services/cart.api";
import type { CartItem, CartResponse } from "@/features/cart/types/cart.type";
import { DUMMY_CART_RESPONSE } from "@/shared/constants/dummy-data/dummy-cart-data";
import { APP_NAVS_MAP } from "@/shared/constants/app.navs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // States
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<FormattedListItem[]>([]);

  // Queries
  const { data: cartData = DUMMY_CART_RESPONSE, isLoading } = useQuery<CartResponse>({
    queryKey: ["cart", searchValue],
    queryFn: () => getCartData({ search: searchValue }),
  });

  // Mutations
  const checkoutMutation = useMutation({
    mutationFn: (itemIds: string[]) => checkout(itemIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: () => {
      setSelectedItems([]);
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemsMutation = useMutation({
    mutationFn: (itemIds: string[]) => removeFromCart(itemIds),
    onSuccess: () => {
      setSelectedItems([]);
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

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
    <Container.Body flex={1} overflowY={"auto"} gap={PADDING_SM}>
      <AppNavTitle navsMap={APP_NAVS_MAP} title={"Pembayaran Data"} />

      <Separator borderColor={"bg.canvas"} />

      <FlexContainer isSmContainer={isSmContainer}>
        {/* If small container, Order Summary is on top */}
        {isSmContainer && (
          <MitraCartOrderSummary
            summary={cartData.summary}
            selectedItems={selectedCartItems}
            onCheckout={handleCheckout}
            isCheckoutPending={checkoutMutation.isPending}
          />
        )}

        {/* Cart Data Table */}
        <MitraCartTable
          cartItems={cartData.items}
          selectedItems={selectedItems as FormattedListItem<CartItem>[]}
          onSelectedItemChange={({ selectedItems: sel }) => setSelectedItems(sel)}
          onClearCart={() => clearCartMutation.mutate()}
          onRemoveItems={(ids) => removeItemsMutation.mutate(ids)}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />

        {/* If desktop/large container, Order Summary is on right */}
        {!isSmContainer && (
          <MitraCartOrderSummary
            summary={cartData.summary}
            selectedItems={selectedCartItems}
            onCheckout={handleCheckout}
            isCheckoutPending={checkoutMutation.isPending}
          />
        )}
      </FlexContainer>
    </Container.Body>
  );
};

const FlexContainer = (props: { isSmContainer: boolean; children: React.ReactNode }) => {
  // Props
  const { isSmContainer, children } = props;

  if (isSmContainer) {
    return (
      <VStack flex={1} w={"full"} overflowY={"auto"} gap={SPACING_MD} align={"stretch"}>
        {children}
      </VStack>
    );
  }

  return (
    <HStack flex={1} w={"full"} overflowY={"auto"} gap={SPACING_MD} align={"stretch"}>
      {children}
    </HStack>
  );
};
