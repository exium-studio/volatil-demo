// src/features/mitra/billing/components/manual-payment-proof-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Input } from "@/design-system/components/input/ui/input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useSubmitManualPaymentProof } from "@/features/mitra/cart/hooks/use-mitra-cart";
import {
  manualPaymentProofSchema,
  type ManualPaymentProofFormValues,
  type ManualPaymentProofModalContentProps,
  type ManualPaymentProofTriggerProps,
} from "@/features/mitra/billing/types/manual-payment.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, UploadCloudIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

export const ManualPaymentProofTrigger = (
  props: ManualPaymentProofTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey,
    orderId,
    billingCode,
    children,
    onSuccess,
  } = props;
  const key = customModalKey || `upload-proof-${orderId}`;

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

      <ManualPaymentProofModalContent
        orderId={orderId}
        billingCode={billingCode}
        close={close}
        onSuccess={onSuccess}
      />
    </Modal.Root>
  );
};

export const ManualPaymentProofModalContent = (
  props: ManualPaymentProofModalContentProps,
) => {
  // Props
  const { orderId, billingCode, close, onSuccess } = props;

  // Mutations
  const submitProofMutation = useSubmitManualPaymentProof();

  // Forms
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ManualPaymentProofFormValues>({
    resolver: zodResolver(manualPaymentProofSchema),
    defaultValues: {
      ntpn: "",
      paidAt: new Date().toISOString().split("T")[0],
    },
    mode: "onChange",
  });

  // Handlers
  const onSubmit = (values: ManualPaymentProofFormValues) => {
    submitProofMutation.mutate(
      {
        orderId,
        ntpn: values.ntpn.toUpperCase().trim(),
        paidAt: values.paidAt,
        paymentProofFile: values.paymentProof,
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
          <Modal.Title>{"Konfirmasi & Unggah Bukti Pembayaran"}</Modal.Title>
          <P fontSize={"xs"} textAlign={"center"} color={"fg.muted"}>
            {`Kode Billing: ${billingCode}`}
          </P>
        </VStack>
      </Modal.Header>

      <VStack as={"form"} onSubmit={handleSubmit(onSubmit)} align={"stretch"}>
        <Modal.Body>
          <VStack align={"stretch"} gap={"md"}>
            <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
              <AppIcon icon={InfoIcon} />
              <Alert.Description>
                {
                  "Unggah struk atau bukti transfer pembayaran PNBP dan cantumkan 16 digit NTPN resmi dari bank/pos persepsi untuk diverifikasi petugas ATR/BPN."
                }
              </Alert.Description>
            </Alert.Root>

            {/* Field NTPN */}
            <Field
              label={"Nomor Transaksi Penerimaan Negara (NTPN)"}
              invalid={Boolean(errors.ntpn)}
              errorText={errors.ntpn?.message}
              helperText={"16 karakter alfanumerik huruf kapital dan angka"}
            >
              <Input
                {...register("ntpn", {
                  onChange: (e) => {
                    const uppercaseVal = (e.target.value as string)
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 16);
                    setValue("ntpn", uppercaseVal, { shouldValidate: true });
                  },
                })}
                placeholder={"Contoh: 8B4F19E3A7029CD1".replace("Contoh: ", "")}
                maxLength={16}
                autoCapitalize={"characters"}
                fontFamily={"mono"}
                w={"full"}
              />
            </Field>

            {/* Field Paid At Date */}
            <Field
              label={"Tanggal Penyetoran / Bayar"}
              invalid={Boolean(errors.paidAt)}
              errorText={errors.paidAt?.message}
            >
              <Input
                type={"date"}
                {...register("paidAt")}
                w={"full"}
              />
            </Field>

            {/* Field Payment Proof File */}
            <Controller
              control={control}
              name={"paymentProof"}
              render={({ field }) => (
                <Field
                  label={"File Bukti Pembayaran / Struk Setor"}
                  invalid={Boolean(errors.paymentProof)}
                  errorText={errors.paymentProof?.message}
                  helperText={"Format .pdf, .jpg, .png (Maksimal 5MB)"}
                >
                  <FileInput
                    accept={[
                      ".pdf",
                      "application/pdf",
                      ".jpg",
                      ".jpeg",
                      "image/jpeg",
                      ".png",
                      "image/png",
                    ]}
                    maxFileSize={5 * 1024 * 1024}
                    maxFiles={1}
                    onFileAccept={(details) => {
                      const file = details.files[0];
                      if (file) {
                        field.onChange(file);
                      }
                    }}
                    w={"full"}
                  />
                </Field>
              )}
            />
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <HStack justify={"end"} gap={"sm"} w={"full"}>
            <Button variant={"outline"} onClick={close}>
              {"Batal"}
            </Button>
            <Button
              primary={true}
              type={"submit"}
              loading={submitProofMutation.isPending}
            >
              <AppIcon icon={UploadCloudIcon} />
              {"Kirim Konfirmasi Pembayaran"}
            </Button>
          </HStack>
        </Modal.Footer>
      </VStack>
    </Modal.Content>
  );
};
