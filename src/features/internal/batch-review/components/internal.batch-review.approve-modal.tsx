// src/features/internal/batch-review/components/internal.batch-review.approve-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Field } from "@/design-system/components/input/ui/field";
import { Input } from "@/design-system/components/input/ui/input";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P } from "@/design-system/components/typography/ui/p";
import { useApproveBatch } from "@/features/internal/batch-review/hooks/use-batch-review";
import type { InternalBatchItem } from "@/features/internal/batch-review/types/batch-review.type";
import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

export type InternalBatchReviewApproveTriggerProps = {
  modalKey?: string;
  batch: InternalBatchItem;
  children?: ReactNode;
  onSuccessRedirect?: () => void;
};

export const InternalBatchReviewApproveTrigger = (
  props: InternalBatchReviewApproveTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey,
    batch,
    children,
    onSuccessRedirect,
  } = props;
  const key = customModalKey || `approve-modal-${batch.batchId}`;

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
      size={"lg"}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalBatchReviewApproveModalContent
        batch={batch}
        isOpen={isOpen}
        onSuccessRedirect={onSuccessRedirect}
        close={close}
      />
    </Modal.Root>
  );
};

type InternalBatchReviewApproveModalContentProps = {
  batch: InternalBatchItem;
  isOpen: boolean;
  onSuccessRedirect?: () => void;
  close: () => void;
};

const InternalBatchReviewApproveModalContent = (
  props: InternalBatchReviewApproveModalContentProps,
) => {
  // Props
  const { batch, onSuccessRedirect, close } = props;

  // Mutations
  const approveMutation = useApproveBatch();

  // States: Map of itemId -> { externalWmsUrl, externalWfsUrl }
  const [urls, setUrls] = useState<
    Record<string, { externalWmsUrl: string; externalWfsUrl: string }>
  >(() => {
    const initial: Record<
      string,
      { externalWmsUrl: string; externalWfsUrl: string }
    > = {};
    for (const item of batch.items ?? []) {
      initial[item.id] = {
        externalWmsUrl: item.externalWmsUrl ?? "",
        externalWfsUrl: item.externalWfsUrl ?? "",
      };
    }
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handlers
  const handleUrlChange = (
    itemId: string,
    field: "externalWmsUrl" | "externalWfsUrl",
    value: string,
  ) => {
    setUrls((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
    if (errors[itemId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }
  };

  const handleApprove = () => {
    // Validation: WMS URL is required for every layer
    const newErrors: Record<string, string> = {};
    for (const item of batch.items ?? []) {
      const itemUrls = urls[item.id];
      if (!itemUrls?.externalWmsUrl?.trim()) {
        newErrors[item.id] = "URL WMS dari INTEROP wajib diisi";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payloadItems = (batch.items ?? []).map((item) => ({
      id: item.id,
      externalWmsUrl: urls[item.id]?.externalWmsUrl.trim() ?? "",
      externalWfsUrl: urls[item.id]?.externalWfsUrl.trim() || undefined,
    }));

    approveMutation.mutate(
      {
        batchId: batch.batchId,
        items: payloadItems,
      },
      {
        onSuccess: () => {
          close();
          onSuccessRedirect?.();
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
        <VStack align={"stretch"} gap={"md"}>
          <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
            <AppIcon icon={InfoIcon} />
            <Alert.Title>
              {
                "Salin URL WMS internal Volatil di bawah, buka aplikasi INTEROP Pusdatin ATR/BPN untuk mendaftarkan layer dan mendapatkan link wrapper resmi, lalu masukkan link tersebut ke formulir di bawah ini."
              }
            </Alert.Title>
          </Alert.Root>

          <VStack align={"stretch"} gap={"sm"}>
            {(batch.items ?? []).map((item, index) => {
              const previewUrl =
                item.previewWmsUrl ||
                item.wmsUrl ||
                `/api/proxy/wms?layerId=${item.sourceLayerId}`;
              const itemError = errors[item.id];

              return (
                <VStack
                  key={item.id || index}
                  align={"stretch"}
                  p={"sm"}
                  border={"1px solid"}
                  borderColor={itemError ? "red.subtle" : "border.subtle"}
                  rounded={"md"}
                  bg={"bg.subtle"}
                  gap={"xs"}
                >
                  <HStack justify={"space-between"} align={"center"}>
                    <P fontWeight={"semibold"} fontSize={"sm"}>
                      {item.sourceLayerTitle}
                    </P>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {item.sourceLayerId}
                    </P>
                  </HStack>

                  {/* Volatil GeoServer WMS URL */}
                  <VStack align={"stretch"} gap={1} mt={1}>
                    <P fontSize={"xs"} color={"fg.muted"}>
                      {"URL WMS GeoServer Volatil (Internal):"}
                    </P>
                    <HStack
                      gap={"xs"}
                      bg={"bg.panel"}
                      p={1.5}
                      rounded={"sm"}
                      border={"1px solid"}
                      borderColor={"border.subtle"}
                    >
                      <P
                        fontSize={"xs"}
                        fontFamily={"mono"}
                        flex={1}
                        truncate
                        color={"fg.default"}
                      >
                        {previewUrl}
                      </P>
                      <ClipboardButton
                        value={previewUrl}
                        variant={"ghost"}
                        size={"xs"}
                        aria-label={"Salin URL WMS"}
                      />
                    </HStack>
                  </VStack>

                  {/* Input INTEROP WMS */}
                  <Field
                    label={"URL WMS Resmi (INTEROP Pusdatin)"}
                    errorText={itemError}
                    invalid={Boolean(itemError)}
                    mt={2}
                  >
                    <Input
                      placeholder={
                        "https://geoportal.atrbpn.go.id/wms?layers=..."
                      }
                      value={urls[item.id]?.externalWmsUrl ?? ""}
                      onChange={(e) =>
                        handleUrlChange(
                          item.id,
                          "externalWmsUrl",
                          e.target.value,
                        )
                      }
                    />
                  </Field>

                  {/* Input INTEROP WFS (Optional) */}
                  <Field label={"URL WFS Resmi (INTEROP Pusdatin - Opsional)"}>
                    <Input
                      placeholder={
                        "https://geoportal.atrbpn.go.id/wfs?typename=..."
                      }
                      value={urls[item.id]?.externalWfsUrl ?? ""}
                      onChange={(e) =>
                        handleUrlChange(
                          item.id,
                          "externalWfsUrl",
                          e.target.value,
                        )
                      }
                    />
                  </Field>
                </VStack>
              );
            })}
          </VStack>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <HStack justify={"end"} gap={"sm"} w={"full"}>
          <Button variant={"outline"} onClick={close}>
            {"Batal"}
          </Button>

          <Button
            colorPalette={"green"}
            loading={approveMutation.isPending}
            onClick={handleApprove}
          >
            <AppIcon icon={CheckCircle2Icon} />
            {"Simpan & Setujui"}
          </Button>
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
