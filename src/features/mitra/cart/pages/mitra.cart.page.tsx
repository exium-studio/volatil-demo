// src/features/mitra/cart/pages/mitra.cart.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
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
import { MitraCartExpiredBatchesTrigger } from "@/features/mitra/cart/components/mitra.cart.expired-batches.modal";
import {
  useCancelActiveCartBatch,
  useClearAllCartBatches,
  useCartBatchDetailQuery,
  useCartBatchesQuery,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import type {
  MitraCartOrderDetailProps,
  MitraCartOrderListProps,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { IconShoppingCartOff } from "@tabler/icons-react";
import { HistoryIcon, Trash2Icon } from "lucide-react";
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

  // Queries (for derived index between batches and selected batch)
  const { batches } = useCartBatchesQuery();

  // States — initial load has NO selected batch
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  // Derived Values
  const selectedBatchIndex = batches.findIndex(
    (b) => b.batchId === selectedBatchId,
  );

  return (
    <PanelContentContainer
      overflowY={isSmContainer ? "auto" : undefined}
      position={"relative"}
    >
      <HStack
        flex={1}
        flexDir={isSmContainer ? "column" : "row"}
        gap={"sm"}
        minH={isSmContainer ? undefined : 0}
        w={"full"}
      >
        <MitraCartOrderList
          selectedBatchId={selectedBatchId}
          onSelectBatch={setSelectedBatchId}
        />

        <MitraCartOrderDetail
          selectedBatchId={selectedBatchId}
          selectedBatchIndex={selectedBatchIndex}
        />
      </HStack>
    </PanelContentContainer>
  );
};

export const MitraCartOrderList = (props: MitraCartOrderListProps) => {
  // Props
  const { selectedBatchId, onSelectBatch } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries & Mutations
  const { batches, isLoading: isBatchesLoading } = useCartBatchesQuery();
  const clearAllBatchesMutation = useClearAllCartBatches();
  const deleteBatchMutation = useCancelActiveCartBatch();

  // Handlers
  const handleDeleteBatch = (batchId: string) => {
    deleteBatchMutation.mutate(batchId, {
      onSuccess: () => {
        if (selectedBatchId === batchId) {
          onSelectBatch("");
        }
      },
    });
  };

  // Derived Values
  const hasBatches = batches.length > 0;

  return (
    <Container.Body
      flex={isSmContainer ? 1 : 2}
      minH={isSmContainer ? undefined : 0}
      overflowY={isSmContainer ? undefined : "auto"}
      w={"full"}
    >
      <HeaderContainer pr={"xs"}>
        <Heading>{"Keranjang Pesanan"}</Heading>

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
              const allBatchIds = batches.map((b) => b.batchId);
              clearAllBatchesMutation.mutate(allBatchIds, {
                onSuccess: () => {
                  onSelectBatch("");
                },
              });
            }}
          >
            <Button
              colorPalette={"red"}
              size={"xs"}
              loading={clearAllBatchesMutation.isPending}
            >
              <AppIcon icon={Trash2Icon} />
              {"Kosongkan keranjang"}
            </Button>
          </ConfirmationTrigger>
        )}
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <VStack
        flex={1}
        overflowY={isSmContainer ? undefined : "auto"}
        w={"full"}
        p={"md"}
      >
        {isBatchesLoading && <Skeleton flex={1} w={"full"} rounded={0} />}

        {!isBatchesLoading && (
          <>
            {!hasBatches && (
              <NoDataState
                icon={IconShoppingCartOff}
                title={"Keranjang Kosong"}
                description={
                  "Silakan pilih layer IGT dan masukkan ke keranjang di menu Permohonan Data."
                }
              />
            )}

            {hasBatches && (
              <VStack gap={"sm"} align={"stretch"} w={"full"}>
                {batches.map((batch, index) => (
                  <MitraCartBatchItem
                    key={batch.batchId}
                    batch={batch}
                    index={index}
                    isSelected={batch.batchId === selectedBatchId}
                    onSelect={onSelectBatch}
                    onDelete={handleDeleteBatch}
                    isDeleting={
                      deleteBatchMutation.isPending &&
                      deleteBatchMutation.variables === batch.batchId
                    }
                  />
                ))}
              </VStack>
            )}
          </>
        )}
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Bottom Actions: Expired Batches Shortcut */}
      <HStack p={"md"} align={"center"} justify={"center"} w={"full"}>
        <MitraCartExpiredBatchesTrigger>
          <Button flex={1}>
            <AppIcon icon={HistoryIcon} />
            {"Batch Kadaluwarsa"}
          </Button>
        </MitraCartExpiredBatchesTrigger>
      </HStack>
    </Container.Body>
  );
};

export const MitraCartOrderDetail = (props: MitraCartOrderDetailProps) => {
  // Props
  const { selectedBatchId, selectedBatchIndex } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries — detail of selected batch
  const { batchDetail: selectedBatch, isLoading: isDetailLoading } =
    useCartBatchDetailQuery(selectedBatchId || undefined);

  return (
    <Container.Body
      flex={isSmContainer ? undefined : 1}
      alignSelf={isSmContainer ? undefined : "start"}
      minW={isSmContainer ? "full" : "320px"}
      maxH={isSmContainer ? undefined : "full"}
      minH={isSmContainer ? undefined : 0}
      overflowY={isSmContainer ? undefined : "auto"}
      w={"full"}
    >
      <HeaderContainer>
        <HStack align={"center"} gap={"sm"}>
          <Heading>{"Rincian Pesanan"}</Heading>

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
  );
};
