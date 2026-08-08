// src/features/cart/pages/mitra.cart.page.tsx

import type { FormattedListItem } from "@/design-system/components/data-display/types/data-list-table.type";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { PADDING_SM, SPACING_MD } from "@/design-system/constants/styles";
import { MitraCartDataList } from "@/features/cart/components/mitra.cart.data-list";
import { MitraCartLocationModal } from "@/features/cart/components/mitra.cart.location-modal";
import { MitraCartOrderSummary } from "@/features/cart/components/mitra.cart.order-summary";
import {
  useCartQuery,
  useCheckoutCart,
  useClearCart,
  useRemoveFromCart,
} from "@/features/cart/hooks/use-mitra-cart";
import type { CartItem } from "@/features/cart/types/cart.type";
import { useMemo, useState } from "react";

export const MitraCartPage = () => {
  return (
    <PanelContentContainer gap={PADDING_SM} p={PADDING_SM}>
      <Container.Root flex={1} minH={0} withContext={true}>
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

  // Hooks (Modal)
  const locationModal = usePopModal({
    modalKey: "mitraCartLocationModal",
  });

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
    <>
      <HStack
        flex={1}
        flexDir={isSmContainer ? "column-reverse" : "row"}
        gap={SPACING_MD}
        minH={0}
        overflowY={isSmContainer ? "auto" : undefined}
        w={"full"}
      >
        {/* DataList Container */}
        <Container.Body flex={2} minH={0} overflowY={"auto"}>
          <HeaderContainer>
            <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
              {"Keranjang"}
            </ClampedP>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <MitraCartDataList
            cartItems={cartData.items}
            selectedItems={selectedItems as FormattedListItem<CartItem>[]}
            onSelectedItemChange={({ selectedItems: sel }) =>
              setSelectedItems(sel)
            }
            onClearCart={() => clearCartMutation.mutate()}
            onRemoveItems={(ids) => removeItemsMutation.mutate(ids)}
            onOpenBboxModal={locationModal.open}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        </Container.Body>

        {/* Summary Container */}
        <Container.Body
          flex={1}
          alignSelf={isSmContainer ? undefined : "start"}
          maxH={"full"}
          minH={0}
          overflowY={"auto"}
        >
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
      </HStack>

      <MitraCartLocationModal
        modalKey={locationModal.modalKey}
        isOpen={locationModal.isOpen}
        open={locationModal.open}
        close={locationModal.close}
      />
    </>
  );
};
