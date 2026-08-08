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
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { PADDING_SM, SPACING_MD } from "@/design-system/constants/styles";
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
        <MitraCartContent />
      </Container.Root>
    </PanelContentContainer>
  );
};

const MitraCartContent = () => {
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
    <HStack
      flex={1}
      flexDir={isSmContainer ? "column" : "row-reverse"}
      align={"start"}
      gap={SPACING_MD}
      overflowY={"auto"}
      w={"full"}
    >
      {/* Summary Container */}
      <Container.Body flex={1} overflowY={"auto"}>
        <HeaderContainer>
          <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
            {"Ringkasan"}
          </ClampedP>
        </HeaderContainer>

        <Separator borderColor={"bg.canvas"} />

        <MitraCartOrderSummary
          summary={cartData.summary}
          config={cartData.config}
          selectedItems={selectedCartItems}
          onCheckout={handleCheckout}
          isCheckoutPending={checkoutMutation.isPending}
        />
      </Container.Body>

      {/* DataList Container */}
      <Container.Body flex={2} overflowY={"auto"}>
        <AppNavTitle navsMap={APP_NAVS_MAP} />

        <Separator borderColor={"bg.canvas"} />

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
        />
      </Container.Body>
    </HStack>
  );
};
