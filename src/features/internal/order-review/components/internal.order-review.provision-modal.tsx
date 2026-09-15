// src/features/internal/order-review/components/internal.order-review.provision-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { Progress } from "@/design-system/components/feedback/ui/progress";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { useOrderProvisionStream } from "@/features/internal/order-review/hooks/use-order-review";
import type {
  InternalOrderReviewProvisionModalContentProps,
  InternalOrderReviewProvisionTriggerProps,
} from "@/features/internal/order-review/types/order-review.type";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  LoaderIcon,
  MapPlusIcon,
  XCircleIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export const InternalOrderReviewProvisionTrigger = (
  props: InternalOrderReviewProvisionTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey,
    order,
    children,
    onSuccess,
  } = props;
  const key = customModalKey || `provision-modal-${order.orderId}`;

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
      closeOnInteractOutside={false}
    >
      <Modal.Trigger>{children}</Modal.Trigger>

      <InternalOrderReviewProvisionModalContent
        order={order}
        isOpen={isOpen}
        onSuccess={onSuccess}
        close={close}
      />
    </Modal.Root>
  );
};

export const InternalOrderReviewProvisionModalContent = (
  props: InternalOrderReviewProvisionModalContentProps,
) => {
  // Props
  const { order, isOpen, onSuccess, close } = props;

  // States
  const [isTriggering, setIsTriggering] = useState<boolean>(false);

  // Hooks — SSE Stream
  const {
    isConnected,
    isCompleted,
    isFatal,
    totalItems,
    processedItems,
    failedCount,
    items,
    errorMessage,
    triggerProvision,
    startListening,
    resetState,
  } = useOrderProvisionStream(order.orderId, {
    onCompleted: () => {
      onSuccess?.();
    },
  });

  // Derived Values
  const effectiveTotal = totalItems > 0 ? totalItems : (order.items?.length || 1);
  const percent = useMemo(() => {
    if (isCompleted) return 100;
    if (effectiveTotal <= 0) return 0;
    return Math.min(100, Math.round((processedItems / effectiveTotal) * 100));
  }, [isCompleted, effectiveTotal, processedItems]);

  // Handlers
  const handleStart = useCallback(async () => {
    try {
      setIsTriggering(true);
      await triggerProvision();
      startListening();
    } catch (err) {
      console.error("Failed to trigger provisioning:", err);
    } finally {
      setIsTriggering(false);
    }
  }, [triggerProvision, startListening]);

  // Auto-connect if modal opens and order status is already processing or paid
  useEffect(() => {
    if (isOpen) {
      if (order.status === "processing") {
        startListening();
      }
    } else {
      resetState();
    }
  }, [isOpen, order.status, startListening, resetState]);

  return (
    <Modal.Content>
      <Modal.Header>
        {!isTriggering && !isConnected && <Modal.CloseButton />}

        <VStack gap={"2xs"}>
          <Modal.Title>{"Pemrosesan Layer ke GeoServer"}</Modal.Title>
          <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
            {`ID Pesanan: ${order.orderId}`}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          {/* Initial Pre-Trigger State */}
          {!isConnected && !isCompleted && !isFatal && (
            <VStack align={"stretch"} gap={"sm"}>
              <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
                <Alert.Indicator>
                  <AppIcon icon={AlertCircleIcon} />
                </Alert.Indicator>
                <Alert.Content>
                  <Alert.Title>{"Mulai Pembuatan Service WMS"}</Alert.Title>
                  <Alert.Description>
                    {
                      "Sistem akan memotong AOI polygon dan mempublish setiap layer IGT ke GeoServer internal secara asinkron. Anda dapat memantau progresnya secara realtime melalui stream SSE."
                    }
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>

              <VStack
                align={"stretch"}
                gap={"xs"}
                p={"sm"}
                bg={"bg.subtle"}
                rounded={"md"}
                border={"1px solid"}
                borderColor={"border.subtle"}
              >
                <HStack justify={"space-between"}>
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {"Mitra Pemohon:"}
                  </P>
                  <P fontWeight={"semibold"} fontSize={"xs"}>
                    {order.mitraName}
                  </P>
                </HStack>
                <HStack justify={"space-between"}>
                  <P fontSize={"xs"} color={"fg.muted"}>
                    {"Total Layer IGT:"}
                  </P>
                  <P fontWeight={"semibold"} fontSize={"xs"}>
                    {`${order.items?.length || 0} Layer`}
                  </P>
                </HStack>
              </VStack>
            </VStack>
          )}

          {/* Active SSE Streaming State */}
          {(isConnected || isCompleted) && (
            <VStack align={"stretch"} gap={"sm"}>
              {/* Progress Bar */}
              <VStack align={"stretch"} gap={"2xs"}>
                <HStack justify={"space-between"} align={"center"}>
                  <P fontSize={"xs"} fontWeight={"medium"} color={"fg.muted"}>
                    {isCompleted ? "Pemrosesan Selesai" : "Memproses Layer..."}
                  </P>
                  <P fontSize={"xs"} fontWeight={"semibold"} color={"fg.default"}>
                    <TNum>{`${processedItems} / ${effectiveTotal} Layer (${percent}%)`}</TNum>
                  </P>
                </HStack>

                <Progress.Root value={percent}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              </VStack>

              {/* Layer Items Progress List */}
              <VStack
                align={"stretch"}
                gap={"xs"}
                maxH={"260px"}
                overflowY={"auto"}
                p={"xs"}
                bg={"bg.subtle"}
                rounded={"md"}
                border={"1px solid"}
                borderColor={"border.subtle"}
              >
                {(order.items ?? []).map((orderItem) => {
                  const itemStream = items[orderItem.sourceLayerId] || items[orderItem.id];
                  const itemStatus = itemStream?.status ?? (isCompleted ? "done" : "pending");

                  return (
                    <HStack
                      key={orderItem.id || orderItem.sourceLayerId}
                      justify={"space-between"}
                      align={"center"}
                      p={"xs"}
                      bg={"bg.body"}
                      rounded={"sm"}
                      border={"1px solid"}
                      borderColor={"border.subtle"}
                    >
                      <VStack align={"start"} gap={0} flex={1} minW={0}>
                        <P fontWeight={"medium"} fontSize={"xs"} truncate>
                          {orderItem.sourceLayerTitle}
                        </P>
                        <P fontSize={"2xs"} color={"fg.subtle"} truncate>
                          {orderItem.sourceLayerId}
                        </P>
                      </VStack>

                      <HStack align={"center"} gap={"xs"} flexShrink={0}>
                        {itemStatus === "processing" && (
                          <HStack gap={1} align={"center"}>
                            <AppIcon
                              icon={LoaderIcon}
                              size={"xs"}
                              className={"animate-spin"}
                              color={"fg.info"}
                            />
                            <P fontSize={"xs"} color={"fg.info"}>
                              {"Memproses..."}
                            </P>
                          </HStack>
                        )}
                        {itemStatus === "done" && (
                          <HStack gap={1} align={"center"}>
                            <AppIcon
                              icon={CheckCircleIcon}
                              size={"xs"}
                              color={"fg.success"}
                            />
                            <P fontSize={"xs"} color={"fg.success"} fontWeight={"medium"}>
                              {"Selesai"}
                            </P>
                          </HStack>
                        )}
                        {itemStatus === "failed" && (
                          <HStack gap={1} align={"center"}>
                            <AppIcon
                              icon={XCircleIcon}
                              size={"xs"}
                              color={"fg.error"}
                            />
                            <P fontSize={"xs"} color={"fg.error"} fontWeight={"medium"}>
                              {"Gagal"}
                            </P>
                          </HStack>
                        )}
                        {itemStatus === "pending" && (
                          <P fontSize={"xs"} color={"fg.subtle"}>
                            {"Menunggu"}
                          </P>
                        )}
                      </HStack>
                    </HStack>
                  );
                })}
              </VStack>

              {/* Completion Alert */}
              {isCompleted && (
                <Alert.Root status={"success"} colorPalette={"green"} variant={"subtle"}>
                  <Alert.Indicator>
                    <AppIcon icon={CheckCircleIcon} />
                  </Alert.Indicator>
                  <Alert.Content>
                    <Alert.Title>{"Provisioning Berhasil Diselesaikan!"}</Alert.Title>
                    <Alert.Description>
                      {failedCount > 0
                        ? `Seluruh layer selesai diproses (${failedCount} layer gagal). Status pesanan telah diperbarui menjadi Menunggu Validasi Admin.`
                        : "Seluruh layer AOI berhasil dipublish ke GeoServer internal. Status pesanan telah menjadi Menunggu Validasi Admin."}
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}
            </VStack>
          )}

          {/* Fatal Error State */}
          {isFatal && (
            <Alert.Root status={"error"} colorPalette={"red"} variant={"subtle"}>
              <Alert.Indicator>
                <AppIcon icon={AlertCircleIcon} />
              </Alert.Indicator>
              <Alert.Content>
                <Alert.Title>{"Gagal Memproses Layer"}</Alert.Title>
                <Alert.Description>
                  {errorMessage || "Terjadi kendala saat menghubungkan ke stream provisioning GeoServer."}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <HStack justify={"end"} gap={"sm"} w={"full"}>
          {!isConnected && !isCompleted && (
            <>
              <Button variant={"outline"} onClick={close}>
                {"Batal"}
              </Button>

              <Button
                primary={true}
                colorPalette={"blue"}
                loading={isTriggering}
                onClick={() => {
                  void handleStart();
                }}
              >
                <AppIcon icon={MapPlusIcon} />
                {"Proses Layer ke GeoServer"}
              </Button>
            </>
          )}

          {isConnected && !isCompleted && (
            <Button variant={"outline"} disabled={true}>
              <AppIcon icon={LoaderIcon} className={"animate-spin"} />
              {"Sedang Memproses..."}
            </Button>
          )}

          {isCompleted && (
            <Button
              primary={true}
              colorPalette={"green"}
              onClick={() => {
                close();
              }}
            >
              <AppIcon icon={CheckIcon} />
              {"Tutup & Lanjutkan"}
            </Button>
          )}

          {isFatal && (
            <Button variant={"outline"} onClick={close}>
              {"Tutup"}
            </Button>
          )}
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
