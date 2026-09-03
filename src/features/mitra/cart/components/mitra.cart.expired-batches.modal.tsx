// src/features/mitra/cart/components/mitra.cart.expired-batches.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { ClampedP, P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { useThemeStore } from "@/design-system/stores/theme-store";
import {
  useExpiredCartBatchesQuery,
  useReorderCartBatch,
} from "@/features/mitra/cart/hooks/use-mitra-cart";
import type { CartBatch } from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import { isEmptyArray } from "@/shared/utils/data/array";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { AlertCircleIcon, HistoryIcon, RotateCcwIcon } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export type MitraCartExpiredBatchesTriggerProps = {
  modalKey?: string;
  children: ReactNode;
};

export const MitraCartExpiredBatchesTrigger = (
  props: MitraCartExpiredBatchesTriggerProps,
) => {
  // Props
  const { modalKey: customModalKey = "mitra-expired-cart-batches", children } =
    props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const isMounted = useMountTimeout({
    isOpen,
    mountDelay: 0,
    unmountDelay: 250,
  });

  // Queries — Lazy fetch triggered only when modal is open
  const { expiredBatches, isLoading } = useExpiredCartBatchesQuery({
    enabled: isOpen,
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

      {isMounted && (
        <MitraCartExpiredBatchesModalContent
          modalKey={modalKey}
          close={close}
          expiredBatches={expiredBatches}
          isLoading={isLoading}
        />
      )}
    </Modal.Root>
  );
};

type MitraCartExpiredBatchesModalContentProps = {
  modalKey: string;
  close: () => void;
  expiredBatches: CartBatch[];
  isLoading: boolean;
};

const MitraCartExpiredBatchesModalContent = (
  props: MitraCartExpiredBatchesModalContentProps,
) => {
  // Props
  const { modalKey: _modalKey, close, expiredBatches, isLoading } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const [reorderingBatchId, setReorderingBatchId] = useState<string | null>(
    null,
  );

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  // Mutations
  const reorderMutation = useReorderCartBatch(() => {
    setReorderingBatchId(null);
    close();
  });

  const handleReorder = (batchId: string) => {
    setReorderingBatchId(batchId);
    reorderMutation.mutate(batchId, {
      onError: () => {
        setReorderingBatchId(null);
      },
    });
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>{"Batch Kedaluwarsa"}</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>

      <Modal.Body p={"md"}>
        {isLoading && (
          <VStack gap={"md"} align={"stretch"}>
            <Skeleton h={"100px"} rounded={"md"} />
            <Skeleton h={"100px"} rounded={"md"} />
          </VStack>
        )}

        {!isLoading && (
          <>
            {isEmptyArray(expiredBatches) && (
              <NoDataState
                icon={HistoryIcon}
                title={"Tidak Ada Batch Kedaluwarsa"}
                description={
                  "Semua permohonan data Anda aktif atau telah diselesaikan."
                }
              />
            )}

            {expiredBatches.length > 0 && (
              <VStack gap={"md"} align={"stretch"}>
                {expiredBatches.map((batch, index) => {
                  const totalBidang = batch.items
                    .filter((i) => i.spatialBasis === "bidang")
                    .reduce((sum, item) => sum + item.featuresCount, 0);

                  const totalKawasanHa = batch.items
                    .filter((i) => i.spatialBasis === "kawasan")
                    .reduce((sum, item) => sum + (item.areaHa ?? 0), 0);

                  const layerTitles = batch.items
                    .map((i) => i.sourceLayerTitle)
                    .join(", ");

                  const isThisReordering =
                    reorderMutation.isPending &&
                    reorderingBatchId === batch.batchId;

                  return (
                    <Box
                      key={batch.batchId}
                      w={"full"}
                      p={"md"}
                      bg={"bg.body"}
                      rounded={theme.radii.container}
                      border={"1.5px solid"}
                      borderColor={"border.subtle"}
                    >
                      <VStack align={"stretch"} gap={"sm"}>
                        {/* Header: Status Icon, Batch Number, Badge & Reorder Action */}
                        <HStack
                          wrap={"wrap"}
                          justify={"space-between"}
                          align={"center"}
                          gapX={"md"}
                          gapY={"xs"}
                          w={"full"}
                        >
                          <HStack gap={"sm"} align={"center"}>
                            <AppIcon
                              icon={AlertCircleIcon}
                              color={"red.fg"}
                              size={"lg"}
                            />

                            <VStack>
                              <P fontWeight={"semibold"} fontSize={"sm"}>
                                {`Batch #${index + 1}`}
                              </P>

                              <P fontSize={"xs"} color={"fg.subtle"}>
                                {`(${batch.batchId})`}
                              </P>
                            </VStack>
                          </HStack>

                          <HStack gap={"sm"} align={"center"}>
                            <Badge
                              size={"sm"}
                              variant={"subtle"}
                              colorPalette={"red"}
                            >
                              {"Kedaluwarsa"}
                            </Badge>
                          </HStack>
                        </HStack>

                        <Separator />

                        {/* Content Details */}
                        <VStack align={"stretch"} gap={"xs"} fontSize={"xs"}>
                          <HStack justify={"space-between"} align={"center"}>
                            <P color={"fg.muted"}>{"Daftar Layer IGT:"}</P>
                            <ClampedP
                              maxW={"65%"}
                              textAlign={"end"}
                              color={"fg.default"}
                            >
                              {layerTitles || "-"}
                            </ClampedP>
                          </HStack>

                          <HStack justify={"space-between"} align={"center"}>
                            <P color={"fg.muted"}>{"Volume Spasial:"}</P>
                            <P fontWeight={"medium"}>
                              {totalBidang > 0 && (
                                <>
                                  <TNum>{totalBidang}</TNum> {"bidang"}
                                </>
                              )}
                              {totalBidang > 0 && totalKawasanHa > 0 && " • "}
                              {totalKawasanHa > 0 && (
                                <>
                                  <TNum>{totalKawasanHa}</TNum> {"ha"}
                                </>
                              )}
                            </P>
                          </HStack>

                          <HStack justify={"space-between"} align={"center"}>
                            <P color={"fg.muted"}>{"Total Estimasi:"}</P>
                            <P fontWeight={"semibold"} color={"blue.fg"}>
                              <FormatNumber
                                value={batch.totalPrice}
                                style={"currency"}
                                currency={"IDR"}
                                maximumFractionDigits={0}
                              />
                            </P>
                          </HStack>

                          {batch.expiredAt && (
                            <HStack justify={"space-between"} align={"center"}>
                              <P color={"fg.muted"}>{"Waktu Kedaluwarsa:"}</P>
                              <P color={"fg.subtle"}>
                                {formatUtcDateTime(
                                  batch.expiredAt,
                                  preferredTimezone,
                                )}
                              </P>
                            </HStack>
                          )}
                        </VStack>

                        <Button
                          primary
                          size={"sm"}
                          w={"full"}
                          loading={isThisReordering}
                          mt={"sm"}
                          onClick={() => handleReorder(batch.batchId)}
                        >
                          <AppIcon icon={RotateCcwIcon} />
                          {"Pesan Ulang"}
                        </Button>
                      </VStack>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button flex={1} onClick={back}>
          {t["action.close"]()}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
