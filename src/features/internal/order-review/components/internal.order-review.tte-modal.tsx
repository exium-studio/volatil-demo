import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Field } from "@/design-system/components/input/ui/field";
import { FileInput } from "@/design-system/components/input/ui/file-input";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useUploadOrderTteInvoice } from "@/features/internal/order-review/hooks/use-order-review";
import type {
  InternalOrderReviewTteModalContentProps,
  InternalOrderReviewTteTriggerProps,
} from "@/features/internal/order-review/types/order-review.type";
import { FileSignatureIcon } from "lucide-react";
import { useState } from "react";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const InternalOrderReviewTteTrigger = (
  props: InternalOrderReviewTteTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey,
    order,
    children,
    onSuccess,
  } = props;
  const key = customModalKey || `tte-modal-${order.orderId}`;

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
        <InternalOrderReviewTteModalContent
          order={order}
          isOpen={isOpen}
          onSuccess={onSuccess}
          close={close}
        />
      )}
    </Modal.Root>
  );
};

export const InternalOrderReviewTteModalContent = (
  props: InternalOrderReviewTteModalContentProps,
) => {
  // Props
  const { order, onSuccess, close } = props;

  // States
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Mutations
  const uploadTteMutation = useUploadOrderTteInvoice();

  // Handlers
  const handleFileAccept = (details: { files: File[] }) => {
    const file = details.files[0];
    if (!file) {
      setSelectedFiles([]);
      return;
    }
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setFileError("Format berkas harus PDF");
      setSelectedFiles([]);
      return;
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
      setFileError("Ukuran berkas maksimal 10 MB");
      setSelectedFiles([]);
      return;
    }
    setFileError(null);
    setSelectedFiles([file]);
  };

  const handleFileReject = () => {
    setFileError("Berkas tidak valid atau melebihi batas ukuran maksimal (10 MB)");
    setSelectedFiles([]);
  };

  const handleSubmit = () => {
    const file = selectedFiles[0];
    if (!file) return;

    uploadTteMutation.mutate(
      {
        orderId: order.orderId,
        file,
      },
      {
        onSuccess: () => {
          close();
          onSuccess?.();
        },
      },
    );
  };

  const isSubmitDisabled = selectedFiles.length === 0 || uploadTteMutation.isPending;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"} align={"start"}>
          <Modal.Title>{"Pasang Tanda Tangan Elektronik (TTE)"}</Modal.Title>

          <P fontSize={"xs"} color={"fg.subtle"}>
            {`Pesanan: ${order.orderId} • Mitra: ${order.mitraName}`}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          <Alert.Root status={"info"} variant={"subtle"}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>
                {
                  "Unggah dokumen invoice resmi yang telah dibubuhi Tanda Tangan Elektronik (TTE). File invoice original tetap disimpan sebagai arsip."
                }
              </Alert.Title>
            </Alert.Content>
          </Alert.Root>

          <Field
            variant={"default"}
            label={"Berkas Invoice TTE (.pdf)"}
            helperText={"Maksimal ukuran file: 10 MB (Format PDF Only)"}
            invalid={Boolean(fileError)}
            errorText={fileError ?? undefined}
          >
            <Box w={"full"}>
              <FileInput
                accept={[".pdf", "application/pdf"]}
                maxFiles={1}
                maxFileSize={MAX_PDF_SIZE_BYTES}
                onFileAccept={handleFileAccept}
                onFileReject={handleFileReject}
              />
            </Box>
          </Field>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <HStack gap={"sm"} w={"full"} justify={"end"}>
          <Button onClick={close} disabled={uploadTteMutation.isPending}>
            {"Batal"}
          </Button>

          <Button
            primary
            colorPalette={"green"}
            loading={uploadTteMutation.isPending}
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            <AppIcon icon={FileSignatureIcon} />
            {"Pasang TTE"}
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
