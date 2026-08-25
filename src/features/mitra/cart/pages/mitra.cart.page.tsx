// src/features/mitra/cart/pages/mitra.cart.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { SPACING } from "@/design-system/constants/styles";
import { MitraCartBatchDataList } from "@/features/mitra/cart/components/mitra.cart.batch-data-list";
import { MitraCartBatchOrderSummary } from "@/features/mitra/cart/components/mitra.cart.batch-order-summary";
import {
  useActiveCartBatchQuery,
  useCancelActiveCartBatch,
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

  // Queries & Mutations
  const { activeBatch, isLoading, isFetching } = useActiveCartBatchQuery();
  const cancelBatchMutation = useCancelActiveCartBatch();

  const hasBatch = Boolean(activeBatch && activeBatch.items.length > 0);

  return (
    <PanelContentContainer
      overflowY={isSmContainer ? "auto" : undefined}
      position={"relative"}
    >
      <TopBarLoader isFetching={isFetching} />

      <HStack
        flex={1}
        flexDir={isSmContainer ? "column-reverse" : "row"}
        gap={SPACING.sm}
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
            <Heading>
              {"Keranjang Transaksi"}
            </Heading>

            {hasBatch && (
              <ConfirmationTrigger
                modalKey={"cancel-cart-batch-confirmation"}
                title={"Batalkan Batch Keranjang?"}
                description={
                  "Batch pesanan ini beserta layer spasial yang telah diproses akan dibatalkan."
                }
                confirmLabel={"Batalkan Batch"}
                colorPalette={"red"}
                onConfirm={() => {
                  if (activeBatch?.batchId) {
                    cancelBatchMutation.mutate(activeBatch.batchId);
                  }
                }}
              >
                <Button colorPalette={"red"} variant={"outline"}>
                  <AppIcon icon={Trash2Icon} />
                  {"Batalkan Batch"}
                </Button>
              </ConfirmationTrigger>
            )}
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <MitraCartBatchDataList
            activeBatch={activeBatch}
            isLoading={isLoading}
          />
        </Container.Body>

        {/* Summary Container */}
        <Container.Body
          flex={isSmContainer ? undefined : 1}
          alignSelf={isSmContainer ? undefined : "start"}
          minW={"320px"}
          maxH={"full"}
          minH={isSmContainer ? undefined : 0}
          overflowY={isSmContainer ? undefined : "auto"}
        >
          <HeaderContainer>
            <Heading>
              {"Ringkasan Order"}
            </Heading>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <MitraCartBatchOrderSummary activeBatch={activeBatch} />
        </Container.Body>
      </HStack>
    </PanelContentContainer>
  );
};
