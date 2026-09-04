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
import { MitraCartOrderItem } from "@/features/mitra/cart/components/mitra.cart.order-item";
import { MitraCartOrderSummary } from "@/features/mitra/cart/components/mitra.cart.order-summary";
import { MitraCartExpiredOrdersTrigger } from "@/features/mitra/cart/components/mitra.cart.expired-orders.modal";
import {
  useCancelActiveCartOrder,
  useClearAllCartOrders,
  useCartOrderDetailQuery,
  useCartOrdersQuery,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import type {
  MitraCartOrderDetailProps,
  MitraCartOrderListProps,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import { HistoryIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react";
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

  // Queries (for derived index between orders and selected order)
  const { orders } = useCartOrdersQuery();

  // States — initial load has NO selected order
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Derived Values
  const selectedOrderIndex = orders.findIndex(
    (b) => b.orderId === selectedOrderId,
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
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
        />

        <MitraCartOrderDetail
          selectedOrderId={selectedOrderId}
          selectedOrderIndex={selectedOrderIndex}
        />
      </HStack>
    </PanelContentContainer>
  );
};

export const MitraCartOrderList = (props: MitraCartOrderListProps) => {
  // Props
  const { selectedOrderId, onSelectOrder } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries & Mutations
  const { orders, isLoading: isOrdersLoading } = useCartOrdersQuery();
  const clearAllOrdersMutation = useClearAllCartOrders();
  const deleteOrderMutation = useCancelActiveCartOrder();

  // Handlers
  const handleDeleteOrder = (orderId: string) => {
    deleteOrderMutation.mutate(orderId, {
      onSuccess: () => {
        if (selectedOrderId === orderId) {
          onSelectOrder("");
        }
      },
    });
  };

  // Derived Values
  const hasOrders = orders.length > 0;

  return (
    <Container.Body
      flex={isSmContainer ? 1 : 2}
      minH={isSmContainer ? undefined : 0}
      overflowY={isSmContainer ? undefined : "auto"}
      w={"full"}
    >
      <HeaderContainer pr={"xs"}>
        <Heading>{"Keranjang Pesanan"}</Heading>

        {hasOrders && (
          <ConfirmationTrigger
            modalKey={"clear-cart-confirmation"}
            title={"Kosongkan Keranjang?"}
            description={
              "Semua daftar pesanan layer spasial di keranjang akan dihapus."
            }
            confirmLabel={"Kosongkan keranjang"}
            colorPalette={"red"}
            onConfirm={() => {
              const allOrderIds = orders.map((b) => b.orderId);
              clearAllOrdersMutation.mutate(allOrderIds, {
                onSuccess: () => {
                  onSelectOrder("");
                },
              });
            }}
          >
            <Button
              colorPalette={"red"}
              size={"xs"}
              loading={clearAllOrdersMutation.isPending}
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
        {isOrdersLoading && (
          <Skeleton flex={1} w={"full"} minH={"250px"} rounded={0} />
        )}

        {!isOrdersLoading && (
          <>
            {!hasOrders && (
              <NoDataState
                icon={ShoppingCartIcon}
                title={"Keranjang Kosong"}
                description={
                  "Silakan pilih layer IGT dan masukkan ke keranjang di menu Permohonan Data."
                }
              />
            )}

            {hasOrders && (
              <VStack gap={"sm"} align={"stretch"} w={"full"}>
                {orders.map((order, index) => (
                  <MitraCartOrderItem
                    key={order.orderId}
                    order={order}
                    index={index}
                    isSelected={order.orderId === selectedOrderId}
                    onSelect={onSelectOrder}
                    onDelete={handleDeleteOrder}
                    isDeleting={
                      deleteOrderMutation.isPending &&
                      deleteOrderMutation.variables === order.orderId
                    }
                  />
                ))}
              </VStack>
            )}
          </>
        )}
      </VStack>

      <Separator borderColor={"bg.canvas"} />

      {/* Bottom Actions: Expired Orders Shortcut */}
      <HStack p={"md"} align={"center"} justify={"center"} w={"full"}>
        <MitraCartExpiredOrdersTrigger>
          <Button flex={1}>
            <AppIcon icon={HistoryIcon} />
            {"Pesanan Kedaluwarsa"}
          </Button>
        </MitraCartExpiredOrdersTrigger>
      </HStack>
    </Container.Body>
  );
};

export const MitraCartOrderDetail = (props: MitraCartOrderDetailProps) => {
  // Props
  const { selectedOrderId, selectedOrderIndex } = props;

  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries — detail of selected order
  const { orderDetail: selectedOrder, isLoading: isDetailLoading } =
    useCartOrderDetailQuery(selectedOrderId || undefined);

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

          {selectedOrderIndex !== -1 && (
            <Badge>{`Pesanan #${selectedOrderIndex + 1}`}</Badge>
          )}
        </HStack>
      </HeaderContainer>

      <Separator borderColor={"bg.canvas"} />

      <MitraCartOrderSummary
        activeOrder={selectedOrder}
        isLoading={isDetailLoading}
      />
    </Container.Body>
  );
};
