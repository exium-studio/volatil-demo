// src/features/mitra/cart/pages/mitra.cart.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { ClampedP } from "@/design-system/components/typography/ui/p";
import { PADDING } from "@/design-system/constants/styles";
import { MitraCartDataList } from "@/features/mitra/cart/components/mitra.cart.data-list";
import { MitraCartOrderSummary } from "@/features/mitra/cart/components/mitra.cart.order-summary";
import {
  useCartSummaryQuery,
  useClearCart,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import { Trash2Icon } from "lucide-react";

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
  const clearCartMutation = useClearCart();

  const totalBidang = cartSummaryData.summary.totalBidang ?? 0;
  const hasCartItems = totalBidang > 0;

  return (
    <PanelContentContainer
      gap={PADDING.sm}
      p={PADDING.sm}
      overflowY={isSmContainer ? "auto" : undefined}
    >
      <HStack
        flex={1}
        flexDir={isSmContainer ? "column-reverse" : "row"}
        gap={PADDING.sm}
        minH={isSmContainer ? undefined : 0}
        w={"full"}
      >
        {/* DataList Container */}
        <Container.Body
          flex={isSmContainer ? 1 : 2}
          minH={isSmContainer ? undefined : 0}
          overflowY={isSmContainer ? undefined : "auto"}
        >
          <HeaderContainer pr={3}>
            <ClampedP fontSize={"lg"} fontWeight={"semibold"}>
              {"Keranjang"}
            </ClampedP>

            {hasCartItems && (
              <ConfirmationTrigger
                modalKey={"clear-mitra-cart-confirmation"}
                title={"Kosongkan keranjang?"}
                description={
                  "Semua item akan dihapus dari keranjang belanja Anda."
                }
                confirmLabel={"Kosongkan"}
                colorPalette={"red"}
                onConfirm={() => clearCartMutation.mutate()}
              >
                <Button colorPalette={"red"} size={"xs"}>
                  <AppIcon icon={Trash2Icon} />
                  {"Kosongkan"}
                </Button>
              </ConfirmationTrigger>
            )}
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
          />
        </Container.Body>
      </HStack>
    </PanelContentContainer>
  );
};
