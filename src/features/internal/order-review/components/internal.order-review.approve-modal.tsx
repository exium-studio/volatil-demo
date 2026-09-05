import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { Fieldset } from "@/design-system/components/input/ui/fieldset";
import { Textarea } from "@/design-system/components/input/ui/textarea";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useApproveOrder } from "@/features/internal/order-review/hooks/use-order-review";
import {
  approveOrderFormSchema,
  type ApproveOrderFormValues,
  type InternalOrderItem,
} from "@/features/internal/order-review/types/order-review.type";
import { buildWmsProxyUrl } from "@/shared/utils/url/wms-proxy.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

type InternalOrderReviewApproveTriggerProps = {
  modalKey?: string;
  order: InternalOrderItem;
  children?: ReactNode;
  onSuccessRedirect?: () => void;
};

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

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalOrderReviewApproveModalContent
        order={order}
        isOpen={isOpen}
        onSuccessRedirect={onSuccessRedirect}
        close={close}
      />
    </Modal.Root>
  );
};

type InternalOrderReviewApproveModalContentProps = {
  order: InternalOrderItem;
  isOpen: boolean;
  onSuccessRedirect?: () => void;
  close: () => void;
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

  // Forms
  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<ApproveOrderFormValues>({
    resolver: zodResolver(approveOrderFormSchema),
    defaultValues: {
      items: (order.items ?? []).map((item) => ({
        id: item.id,
        externalWmsUrl: item.externalWmsUrl ?? "",
        externalWfsUrl: item.externalWfsUrl ?? "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  // Handlers
  const onSubmit = (values: ApproveOrderFormValues) => {
    const payloadItems = values.items.map((item) => ({
      id: item.id,
      externalWmsUrl: item.externalWmsUrl.trim(),
      externalWfsUrl: item.externalWfsUrl?.trim() || undefined,
    }));

    approveMutation.mutate(
      {
        orderId: order.orderId,
        items: payloadItems,
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

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />
        <Modal.Title>{"Verifikasi & Setujui Permohonan"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Fieldset
          as={"form"}
          id={"approve-order-form"}
          onSubmit={handleSubmit(onSubmit)}
        >
          <VStack align={"stretch"} gap={"md"}>
            <Alert.Root
              status={"info"}
              colorPalette={"blue"}
              variant={"subtle"}
            >
              <AppIcon icon={InfoIcon} />

              <Alert.Description>
                {
                  "Salin URL WMS internal Volatil di bawah, buka aplikasi INTEROP Pusdatin ATR/BPN untuk mendaftarkan layer dan mendapatkan link wrapper resmi, lalu masukkan link tersebut ke formulir di bawah ini."
                }
              </Alert.Description>
            </Alert.Root>

            <Fieldset>
              {fields.map((field, index) => {
                const item = order.items?.[index];
                if (!item) return null;

                const previewUrl =
                  item.previewWmsUrl ||
                  item.wmsUrl ||
                  buildWmsProxyUrl(
                    `/api/proxy/wms?layerId=${item.sourceLayerId}`,
                  );

                return (
                  <VStack key={field.id} align={"stretch"} gap={"xs"}>
                    {/* Volatil GeoServer WMS URL */}
                    <VStack align={"stretch"} gap={1} mt={1}>
                      <P fontSize={"xs"} color={"fg.muted"}>
                        {"URL WMS GeoServer Volatil (Internal):"}
                      </P>

                      <HStack
                        gap={"md"}
                        bg={"bg.panel"}
                        p={"md"}
                        rounded={"sm"}
                        border={"1px solid"}
                        borderColor={"border.subtle"}
                      >
                        <P fontFamily={"mono"} flex={1} color={"fg.default"}>
                          {previewUrl}
                        </P>

                        <ClipboardButton
                          value={previewUrl}
                          variant={"ghost"}
                          size={"xs"}
                          aria-label={"Salin URL WMS"}
                          mt={-2}
                          mr={-2}
                        />
                      </HStack>
                    </VStack>

                    {/* Input INTEROP WMS */}
                    <Controller
                      control={control}
                      name={`items.${index}.externalWmsUrl`}
                      render={({ field: inputField, fieldState }) => (
                        <Field
                          label={"URL WMS Resmi (INTEROP Pusdatin)"}
                          errorText={fieldState.error?.message}
                          invalid={Boolean(fieldState.error)}
                          mt={2}
                        >
                          <Textarea
                            placeholder={
                              "https://geoportal.atrbpn.go.id/wms?layers=..."
                            }
                            value={inputField.value ?? ""}
                            onChange={inputField.onChange}
                            onBlur={inputField.onBlur}
                          />
                        </Field>
                      )}
                    />

                    {/* Input INTEROP WFS (Optional) */}
                    <Controller
                      control={control}
                      name={`items.${index}.externalWfsUrl`}
                      render={({ field: inputField }) => (
                        <Field
                          label={"URL WFS Resmi (INTEROP Pusdatin - Opsional)"}
                        >
                          <Textarea
                            placeholder={
                              "https://geoportal.atrbpn.go.id/wfs?typename=..."
                            }
                            value={inputField.value ?? ""}
                            onChange={inputField.onChange}
                            onBlur={inputField.onBlur}
                          />
                        </Field>
                      )}
                    />
                  </VStack>
                );
              })}
            </Fieldset>
          </VStack>
        </Fieldset>
      </Modal.Body>

      <Modal.Footer>
        <VStack gap={"xs"} w={"full"}>
          <Button
            primary
            form={"approve-order-form"}
            type={"submit"}
            colorPalette={"green"}
            loading={approveMutation.isPending}
          >
            <AppIcon icon={CheckCircle2Icon} />
            {"Simpan & Setujui"}
          </Button>

          <Button onClick={close}>{"Batal"}</Button>
        </VStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
