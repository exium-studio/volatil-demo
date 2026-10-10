// src/features/internal/order-review/components/internal.order-review.approve-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { useApproveOrder } from "@/features/internal/order-review/hooks/use-order-review";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  approveOrderSchema,
  type ApproveOrderFormValues,
  type InternalOrderReviewApproveModalContentProps,
  type InternalOrderReviewApproveTriggerProps,
} from "@/features/internal/order-review/types/order-review.type";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircleIcon, InfoIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

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
      size={"md"}
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

  // Stores
  const { theme } = useThemeStore();

  // Forms
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ApproveOrderFormValues>({
    resolver: zodResolver(approveOrderSchema),
    defaultValues: {
      workspaceInteropUrl: order.workspaceInteropUrl || "",
    },
    mode: "onChange",
  });

  // Hooks
  const navigate = useNavigate();

  // Mutations
  const approveMutation = useApproveOrder();

  // Derived Values — Internal GeoServer workspace URL to be registered in INTEROP Pusdatin
  const internalWorkspaceUrl =
    order.internalWorkspaceUrl ||
    `https://geoserver.internal.volatil.atrbpn.go.id/geoserver/${order.workspaceName || `ws_${order.orderId}`}/ows`;

  // Handlers
  const onSubmit = (values: ApproveOrderFormValues) => {
    approveMutation.mutate(
      {
        orderId: order.orderId,
        workspaceInteropUrl: values.workspaceInteropUrl.trim(),
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

  const isSubmitDisabled =
    !isValid || approveMutation.isPending || isSubmitting;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />
        <VStack gap={"2xs"}>
          <Modal.Title>{"Verifikasi & Setujui Pesanan"}</Modal.Title>
          <P fontSize={"xs"} textAlign={"center"} color={"fg.muted"}>
            {`${order.mitraName} • ${order.orderNumber || order.orderId}`}
          </P>
        </VStack>
      </Modal.Header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <VStack align={"stretch"} gap={"md"}>
            <Alert.Root
              status={"info"}
              colorPalette={"blue"}
              variant={"subtle"}
            >
              <AppIcon icon={InfoIcon} />
              <Alert.Description>
                {
                  "Salin URL Workspace GeoServer internal di bawah, buka aplikasi INTEROP Pusdatin ATR/BPN untuk mendaftarkan workspace pesanan dan mendapatkan link proxy wrapper resmi, lalu masukkan link proxy tersebut ke formulir di bawah ini."
                }
              </Alert.Description>
            </Alert.Root>

            {/* Internal GeoServer Workspace URL */}
            <VStack
              align={"stretch"}
              gap={"md"}
              p={"md"}
              rounded={theme.radii.component}
              border={"1px solid"}
              borderColor={"border.subtle"}
              bg={"bg.subtle"}
            >
              <P fontSize={"xs"} color={"fg.muted"}>
                {"URL Workspace GeoServer Volatil (Internal):"}
              </P>
              <HStack gap={"md"}>
                <P
                  fontFamily={"mono"}
                  fontSize={"xs"}
                  flex={1}
                  color={"fg.default"}
                >
                  {internalWorkspaceUrl}
                </P>

                <ClipboardButton
                  value={internalWorkspaceUrl}
                  variant={"ghost"}
                  size={"xs"}
                  aria-label={"Salin URL Workspace Internal"}
                />
              </HStack>
            </VStack>

            {/* Input INTEROP Workspace Proxy URL */}
            <Controller
              control={control}
              name={"workspaceInteropUrl"}
              render={({ field }) => (
                <Field
                  // variant={"default"}
                  label={"URL Workspace Resmi (INTEROP Pusdatin - Wajib)"}
                  invalid={Boolean(errors.workspaceInteropUrl)}
                  errorText={errors.workspaceInteropUrl?.message}
                >
                  <Textarea
                    placeholder={
                      "https://geoportal.atrbpn.go.id/interop/wms?workspace=..."
                    }
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    minH={"90px"}
                  />
                </Field>
              )}
            />

            {/* Order Summary Box */}
            <HStack
              p={"sm"}
              bg={"bg.subtle"}
              rounded={theme.radii.component}
              justify={"space-between"}
              align={"center"}
            >
              <VStack align={"start"} gap={0}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Jumlah Layer"}
                </P>
                <P fontSize={"sm"} fontWeight={"medium"}>
                  {`${order.items?.length ?? 0} Layer`}
                </P>
              </VStack>

              {order.totalPrice > 0 && (
                <VStack align={"end"} gap={0}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Total Biaya"}
                  </P>
                  <P
                    fontSize={"sm"}
                    fontWeight={"bold"}
                    color={"colorPalette.fg"}
                  >
                    {formatCurrency(order.totalPrice)}
                  </P>
                </VStack>
              )}
            </HStack>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <VStack gap={"xs"} w={"full"}>
            <Button
              type={"submit"}
              primary
              colorPalette={"green"}
              disabled={isSubmitDisabled}
              loading={approveMutation.isPending || isSubmitting}
              w={"full"}
            >
              <AppIcon icon={CheckCircleIcon} />
              {"Ya, Setujui Pesanan"}
            </Button>

            <Button type={"button"} onClick={close} w={"full"}>
              {"Batal"}
            </Button>
          </VStack>
        </Modal.Footer>
      </form>
    </Modal.Content>
  );
};
