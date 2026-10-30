// src/features/internal/order-review/components/internal.order-review.input-billing-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { DateInput } from "@/design-system/components/input/ui/date-input";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import {
  Modal,
  useModalContext,
} from "@/design-system/components/overlay/ui/modal";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { useInputBillingCode } from "@/features/internal/order-review/hooks/use-order-review";
import {
  inputBillingCodeSchema,
  type InputBillingCodeFormValues,
  type InternalOrderReviewInputBillingModalContentProps,
  type InternalOrderReviewInputBillingTriggerProps,
} from "@/features/internal/order-review/types/order-review.type";
import { formatCurrency } from "@/shared/utils/formatter/number.formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const InternalOrderReviewInputBillingTrigger = (
  props: InternalOrderReviewInputBillingTriggerProps,
) => {
  // Props
  const { modalKey: customModalKey, order, children, onSuccess } = props;
  const key = customModalKey || `input-billing-${order.orderId}`;

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

      <InternalOrderReviewInputBillingModalContent
        order={order}
        close={close}
        onSuccess={onSuccess}
      />
    </Modal.Root>
  );
};

export const InternalOrderReviewInputBillingModalContent = (
  props: InternalOrderReviewInputBillingModalContentProps,
) => {
  // Contexts
  const { modalKey: parentModalKey } = useModalContext();

  // Props
  const { order, close, onSuccess } = props;

  // Mutations
  const inputBillingMutation = useInputBillingCode();

  // States
  const [initialBillingExpiredAt] = useState(() => {
    if (order.billingExpiredAt) {
      return new Date(order.billingExpiredAt).toISOString().split("T")[0];
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    return defaultDate.toISOString().split("T")[0];
  });

  // Forms
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputBillingCodeFormValues>({
    resolver: zodResolver(inputBillingCodeSchema),
    defaultValues: {
      billingCode: order.billingCode || "",
      billingExpiredAt: initialBillingExpiredAt,
    },
    mode: "onChange",
  });

  // Handlers
  const onSubmit = (values: InputBillingCodeFormValues) => {
    inputBillingMutation.mutate(
      {
        orderId: order.orderId,
        billingCode: values.billingCode.trim(),
        billingExpiredAt: new Date(values.billingExpiredAt).toISOString(),
      },
      {
        onSuccess: () => {
          close();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Input Kode Billing SIMPONI"}</Modal.Title>

          <P fontSize={"xs"} color={"fg.muted"} textAlign={"center"}>
            {"Penerbitan manual kode billing PNBP dari portal Kemenkeu"}
          </P>
        </VStack>
      </Modal.Header>

      <VStack
        as={"form"}
        onSubmit={handleSubmit(onSubmit)}
        align={"stretch"}
        gap={0}
      >
        <Modal.Body>
          <VStack align={"stretch"} gap={"md"}>
            {/* Instruction Alert */}
            <Alert.Root
              status={"info"}
              colorPalette={"blue"}
              variant={"subtle"}
            >
              <AppIcon icon={InfoIcon} />
              <Alert.Content>
                <Alert.Title fontWeight={"semibold"}>
                  {"Petunjuk Bendahara / Petugas"}
                </Alert.Title>

                <Alert.Description>
                  {
                    "Salin data transaksi berikut ke portal simponi.kemenkeu.go.id, kemudian tempelkan 15 digit Kode Billing yang dihasilkan ke dalam form di bawah ini."
                  }
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>

            {/* Reference Data Box */}
            <VStack
              align={"stretch"}
              gap={"xs"}
              p={"sm"}
              bg={"bg.subtle"}
              rounded={"md"}
            >
              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.muted"}>{"Nomor Pesanan:"}</P>

                <HStack gap={1} align={"center"}>
                  <P fontWeight={"medium"}>
                    {order.orderNumber || order.orderId}
                  </P>

                  <ClipboardButton
                    value={order.orderNumber || order.orderId}
                    size={"xs"}
                    variant={"ghost"}
                  />
                </HStack>
              </HStack>

              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.muted"}>{"Nama Mitra:"}</P>

                <HStack align={"center"}>
                  <P fontWeight={"medium"}>{order.mitraName}</P>

                  <ClipboardButton
                    value={order.mitraName}
                    size={"xs"}
                    variant={"ghost"}
                    aria-label={"Salin Mitra"}
                  />
                </HStack>
              </HStack>

              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.muted"}>{"Kode K/L & Satker:"}</P>

                <HStack gap={1} align={"center"}>
                  <P fontWeight={"medium"}>{"056 (ATR/BPN) / 654321"}</P>
                  <ClipboardButton
                    value={"654321"}
                    size={"xs"}
                    variant={"ghost"}
                    aria-label={"Salin Kode Satker"}
                  />
                </HStack>
              </HStack>

              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.muted"}>{"Mata Anggaran (Akun):"}</P>

                <HStack gap={1} align={"center"}>
                  <P fontWeight={"medium"}>{"425311 (PNBP Geospasial)"}</P>
                  <ClipboardButton
                    value={"425311"}
                    size={"xs"}
                    variant={"ghost"}
                    aria-label={"Salin Kode Akun"}
                  />
                </HStack>
              </HStack>

              <HStack justify={"space-between"} align={"center"}>
                <P fontSize={"xs"} color={"fg.muted"} fontWeight={"semibold"}>
                  {"Total Tagihan PNBP:"}
                </P>

                <HStack gap={1} align={"center"}>
                  <P fontSize={"lg"} fontWeight={"bold"} color={"blue.fg"}>
                    <TNum>
                      {formatCurrency(
                        order.totalPrice ?? order.totalAmount ?? 0,
                      )}
                    </TNum>
                  </P>

                  <ClipboardButton
                    value={String(order.totalPrice ?? order.totalAmount ?? 0)}
                    size={"xs"}
                    variant={"ghost"}
                    aria-label={"Salin Nominal"}
                  />
                </HStack>
              </HStack>
            </VStack>

            {/* Input Kode Billing */}
            <Field
              label={"Kode Billing"}
              invalid={Boolean(errors.billingCode)}
              errorText={errors.billingCode?.message}
              helperText={
                "Nomor kode billing resmi yang diterbitkan oleh SIMPONI Kemenkeu"
              }
            >
              <Input
                placeholder={"Contoh: 820261029000123"}
                maxLength={15}
                autoFocus={true}
                {...register("billingCode")}
              />
            </Field>

            {/* Input Batas Waktu Bayar */}
            <Controller
              control={control}
              name={"billingExpiredAt"}
              render={({ field }) => (
                <Field
                  label={"Batas Waktu Pembayaran"}
                  invalid={Boolean(errors.billingExpiredAt)}
                  errorText={errors.billingExpiredAt?.message}
                  helperText={
                    "Waktu jatuh tempo kode billing di portal SIMPONI"
                  }
                >
                  <DateInput
                    modalKey={`${parentModalKey}.billingExpiredAt`}
                    datePickerSubtitle={"Pilih batas waktu pembayaran SIMPONI"}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val ?? "");
                    }}
                    w={"full"}
                  />
                </Field>
              )}
            />
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <VStack justify={"end"} gap={"xs"} w={"full"}>
            <Button
              primary={true}
              type={"submit"}
              loading={inputBillingMutation.isPending}
            >
              {"Simpan & Terbitkan"}
            </Button>

            <Button variant={"outline"} onClick={close}>
              {"Batal"}
            </Button>
          </VStack>
        </Modal.Footer>
      </VStack>
    </Modal.Content>
  );
};
