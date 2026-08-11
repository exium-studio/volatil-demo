// src/features/cart/pages/mitra.cart.page.tsx

import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { PADDING_SM } from "@/design-system/constants/styles";
import { MitraCartDataList } from "@/features/cart/components/mitra.cart.data-list";
import { MitraCartOrderSummary } from "@/features/cart/components/mitra.cart.order-summary";
import {
  useCartSummaryQuery,
  useCheckoutCart,
} from "@/features/cart/hooks/use-mitra-cart";

export const MitraCartPage = () => {
  return (
    <Container.Root flex={1} minH={0} withContext={true}>
      <MitraCartContent />
    </Container.Root>
  );
};

const MitraCartContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Hooks (Queries & Mutations)
  const { cartSummaryData } = useCartSummaryQuery();
  const checkoutMutation = useCheckoutCart();

  // Handlers
  const handleCheckout = () => {
    checkoutMutation.mutate();
  };

  return (
    <PanelContentContainer
      gap={PADDING_SM}
      p={PADDING_SM}
      overflowY={isSmContainer ? "auto" : undefined}
    >
      <HStack
        flex={1}
        flexDir={isSmContainer ? "column-reverse" : "row"}
        gap={PADDING_SM}
        minH={isSmContainer ? undefined : 0}
        w={"full"}
      >
        {/* DataList Container */}
        <Container.Body
          flex={isSmContainer ? 1 : 2}
          minH={isSmContainer ? undefined : 0}
          overflowY={isSmContainer ? undefined : "auto"}
        >
          <HeaderContainer>
            <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
              {"Keranjang"}
            </ClampedP>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <MitraCartDataList />
        </Container.Body>

        {/* Summary Container */}
        <Container.Body
          flex={isSmContainer ? undefined : 1}
          alignSelf={isSmContainer ? undefined : "start"}
          minW={"300px"}
          maxH={"full"}
          minH={isSmContainer ? undefined : 0}
          overflowY={isSmContainer ? undefined : "auto"}
        >
          <HeaderContainer>
            <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
              {"Ringkasan"}
            </ClampedP>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <MitraCartOrderSummary
            summary={cartSummaryData.summary}
            config={cartSummaryData.config}
            onCheckout={handleCheckout}
            isCheckoutPending={checkoutMutation.isPending}
          />
        </Container.Body>
      </HStack>
    </PanelContentContainer>
  );
};
