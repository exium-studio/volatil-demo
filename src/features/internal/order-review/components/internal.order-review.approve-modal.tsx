// src\features\internal\order-review\components\internal.order-review.approve-modal.tsx

// src\features\internal\order-review\components\internal.order-review.approve-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useApproveOrder } from "@/features/internal/order-review/hooks/use-order-review";
import type {
  InternalOrderReviewApproveModalContentProps,
  InternalOrderReviewApproveTriggerProps,
} from "@/features/internal/order-review/types/order-review.type";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircleIcon, InfoIcon } from "lucide-react";

export const InternalOrderReviewApproveTrigger = (
  props: InternalOrderReviewApproveTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey,
    order,
    children,
    onSuccessRedirect,
  } = props;
  const key = customModalKey || `approve-modal-${order.orderId}`;

  // Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: key,
  });

  const isMounted = useMountTimeout({
    isOpen,
    mountDelay: 0,
    unmountDelay: 250,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"sm"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      {isMounted && (
        <InternalOrderReviewApproveModalContent
          order={order}
          isOpen={isOpen}
          onSuccessRedirect={onSuccessRedirect}
          close={close}
        />
      )}
    </Modal.Root>
  );
};

const InternalOrderReviewApproveModalContent = (
  props: InternalOrderReviewApproveModalContentProps,
) => {
  // Props
  const { order, onSuccessRedirect, close } = props;

  // Hooks
  const navigate = useNavigate();

  // Mutations
  const approveMutation = useApproveOrder();

  // Handlers
  const handleApprove = () => {
    approveMutation.mutate(
      {
        orderId: order.orderId,
      },
      {
        onSuccess: () => {
          close();
          if (onSuccessRedirect) {
            onSuccessRedirect();
          } else {
            void navigate({ to: "/internal/order-review" });
          }
        },
      },
    );
  };

  const totalItemsCount = order.items?.length ?? 0;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />
        <Modal.Title>{"Verifikasi & Setujui Pesanan"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"xs"}>
          <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
            <AppIcon icon={InfoIcon} />
            <Alert.Description>
              {
                "Apakah Anda yakin ingin memverifikasi dan menyetujui pesanan data spasial ini? Layer IGT akan otomatis disinkronkan ke workspace mitra."
              }
            </Alert.Description>
          </Alert.Root>

          {/* Order Summary Box */}
          <VStack align={"stretch"} gap={"sm"} pt={"xs"}>
            <VStack align={"start"} gap={0}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"No. Pesanan"}
              </P>
              <P fontWeight={"semibold"}>{order.orderId}</P>
            </VStack>

            <VStack align={"start"} gap={0}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Nama Mitra"}
              </P>
              <P fontWeight={"medium"}>{order.mitraName}</P>
            </VStack>

            <VStack align={"start"} gap={0}>
              <P fontSize={"sm"} color={"fg.subtle"}>
                {"Jumlah Layer"}
              </P>
              <P fontWeight={"medium"}>{`${totalItemsCount} Layer`}</P>
            </VStack>

            {order.totalPrice > 0 && (
              <VStack align={"start"} gap={0}>
                <P fontSize={"sm"} color={"fg.subtle"}>
                  {"Total Biaya"}
                </P>
                <P fontWeight={"bold"} color={"colorPalette.fg"}>
                  {formatCurrency(order.totalPrice)}
                </P>
              </VStack>
            )}
          </VStack>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            colorPalette={"green"}
            loading={approveMutation.isPending}
            onClick={handleApprove}
            w={"full"}
          >
            <AppIcon icon={CheckCircleIcon} />
            {"Ya, Setujui Pesanan"}
          </Button>

          <Button onClick={close} w={"full"}>
            {"Batal"}
          </Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
