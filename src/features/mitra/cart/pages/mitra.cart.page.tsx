// src/features/mitra/cart/pages/mitra.cart.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { TopBarLoader } from "@/design-system/components/feedback/ui/top-bar-loader";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { HeaderContainer } from "@/design-system/components/shell/ui/header-container";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { MitraCartBatchItem } from "@/features/mitra/cart/components/mitra.cart.batch-item";
import { MitraCartBatchOrderSummary } from "@/features/mitra/cart/components/mitra.cart.batch-order-summary";
import {
  useCancelActiveCartBatch,
  useCartBatchDetailQuery,
  useCartBatchesQuery,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import { IconShoppingCartOff } from "@tabler/icons-react";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

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
  const {
    batches,
    isLoading: isBatchesLoading,
    isFetching: isBatchesFetching,
  } = useCartBatchesQuery();
  const cancelBatchMutation = useCancelActiveCartBatch();

  // States — initial load has NO selected batch
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  // Queries — detail of selected batch
  const {
    batchDetail: selectedBatch,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useCartBatchDetailQuery(selectedBatchId ?? undefined);

  // Handlers — once selected, user cannot unselect (only switch to another batch)
  const handleSelectBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
  };

  // Derived Values
  const selectedBatchIndex = batches.findIndex(
    (b) => b.batchId === selectedBatchId,
  );
  const hasBatches = batches.length > 0;
  const isGlobalFetching = isBatchesFetching || isDetailFetching;

  return (
    <PanelContentContainer
      overflowY={isSmContainer ? "auto" : undefined}
      position={"relative"}
    >
      <TopBarLoader isFetching={isGlobalFetching} />

      <HStack
        flex={1}
        flexDir={isSmContainer ? "column-reverse" : "row"}
        gap={"sm"}
        minH={isSmContainer ? undefined : 0}
        w={"full"}
      >
        {/* Batches List Container */}
        <Container.Body
          flex={isSmContainer ? 1 : 2}
          minH={isSmContainer ? undefined : 0}
          overflowY={isSmContainer ? undefined : "auto"}
        >
          <HeaderContainer pr={3}>
            <Heading>{"Keranjang Transaksi"}</Heading>

            {hasBatches && (
              <ConfirmationTrigger
                modalKey={"clear-cart-confirmation"}
                title={"Kosongkan Keranjang?"}
                description={
                  "Semua daftar batch pesanan layer spasial di keranjang akan dihapus."
                }
                confirmLabel={"Kosongkan keranjang"}
                colorPalette={"red"}
                onConfirm={() => {
                  if (selectedBatch?.batchId) {
                    cancelBatchMutation.mutate(selectedBatch.batchId, {
                      onSuccess: () => {
                        setSelectedBatchId(null);
                      },
                    });
                  } else if (batches[0]?.batchId) {
                    cancelBatchMutation.mutate(batches[0].batchId, {
                      onSuccess: () => {
                        setSelectedBatchId(null);
                      },
                    });
                  }
                }}
              >
                <Button colorPalette={"red"} size={"sm"} pl={3}>
                  <AppIcon icon={Trash2Icon} />
                  {"Kosongkan keranjang"}
                </Button>
              </ConfirmationTrigger>
            )}
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <VStack flex={1} p={"md"} overflowY={"auto"}>
            {isBatchesLoading ? (
              <VStack gap={"md"} w={"full"}>
                <Skeleton w={"full"} h={"120px"} rounded={"lg"} />
                <Skeleton w={"full"} h={"120px"} rounded={"lg"} />
              </VStack>
            ) : !hasBatches ? (
              <NoDataState
                icon={IconShoppingCartOff}
                title={"Keranjang Kosong"}
                description={
                  "Silakan pilih layer IGT dan masukkan ke keranjang di menu Permohonan Data."
                }
              />
            ) : (
              <VStack gap={"sm"} align={"stretch"} w={"full"}>
                {batches.map((batch, index) => (
                  <MitraCartBatchItem
                    key={batch.batchId}
                    batch={batch}
                    index={index}
                    isSelected={batch.batchId === selectedBatchId}
                    onSelect={handleSelectBatch}
                  />
                ))}
              </VStack>
            )}
          </VStack>
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
            <HStack align={"center"} gap={"sm"}>
              <Heading>{"Ringkasan Pesanan"}</Heading>

              {selectedBatchIndex !== -1 && (
                <Badge>{`Batch #${selectedBatchIndex + 1}`}</Badge>
              )}
            </HStack>
          </HeaderContainer>

          <Separator borderColor={"bg.canvas"} />

          <MitraCartBatchOrderSummary
            activeBatch={selectedBatch}
            isLoading={isDetailLoading}
          />
        </Container.Body>
      </HStack>
    </PanelContentContainer>
  );
};
