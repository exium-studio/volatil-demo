// src/features/mitra/cart/components/mitra.cart.expired-batches.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { NoDataState } from "@/design-system/components/feedback/ui/state.no-data";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
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
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { HistoryIcon, RotateCcwIcon } from "lucide-react";
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
        <Modal.Title>{"Batch Kadaluwarsa"}</Modal.Title>
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
            {expiredBatches.length === 0 && (
              <NoDataState
                icon={HistoryIcon}
                title={"Tidak Ada Batch Kadaluwarsa"}
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

                  const isThisReordering =
                    reorderMutation.isPending &&
                    reorderingBatchId === batch.batchId;

                  return (
                    <VStack
                      key={batch.batchId}
                      p={"md"}
                      bg={"bg.subtle"}
                      border={"1px solid"}
                      borderColor={"border"}
                      rounded={theme.radii.component}
                      align={"stretch"}
                      gap={"sm"}
                    >
                      {/* Header Row: Batch Index & Expired Time */}
                      <HStack
                        justify={"space-between"}
                        align={"center"}
                        wrap={"wrap"}
                      >
                        <HStack gap={"xs"} align={"center"}>
                          <Badge colorPalette={"red"} variant={"subtle"}>
                            {"Kadaluwarsa"}
                          </Badge>
                          <P fontWeight={"semibold"}>{`Batch #${index + 1}`}</P>
                        </HStack>

                        {batch.expiredAt && (
                          <P fontSize={"xs"} color={"fg.subtle"}>
                            {`Kadaluwarsa: ${formatUtcDateTime(batch.expiredAt, preferredTimezone)}`}
                          </P>
                        )}
                      </HStack>

                      <Separator borderColor={"border"} />

                      {/* List of Layers */}
                      <VStack align={"stretch"} gap={"xs"}>
                        {batch.items.map((item) => (
                          <HStack
                            key={item.id}
                            justify={"space-between"}
                            align={"center"}
                          >
                            <ClampedP fontSize={"sm"} maxW={"340px"}>
                              {item.sourceLayerTitle}
                            </ClampedP>
                            <Badge
                              size={"xs"}
                              colorPalette={
                                item.spatialBasis === "bidang"
                                  ? "blue"
                                  : "orange"
                              }
                              variant={"subtle"}
                            >
                              {item.spatialBasis === "bidang"
                                ? `${item.featuresCount} bidang`
                                : `${item.areaHa ?? 0} ha`}
                            </Badge>
                          </HStack>
                        ))}
                      </VStack>

                      <Separator borderColor={"border"} />

                      {/* Footer Row: Total Summary & Re-order Action */}
                      <HStack justify={"space-between"} align={"center"} pt={1}>
                        <VStack align={"start"} gap={0}>
                          <HStack gap={"xs"}>
                            {totalBidang > 0 && (
                              <P fontSize={"xs"} color={"fg.muted"}>
                                {`${totalBidang} Bidang`}
                              </P>
                            )}
                            {totalBidang > 0 && totalKawasanHa > 0 && (
                              <P fontSize={"xs"} color={"fg.muted"}>
                                {"•"}
                              </P>
                            )}
                            {totalKawasanHa > 0 && (
                              <P fontSize={"xs"} color={"fg.muted"}>
                                {`${totalKawasanHa} ha Kawasan`}
                              </P>
                            )}
                          </HStack>
                          <TNum fontWeight={"semibold"} fontSize={"sm"}>
                            <FormatNumber
                              value={batch.totalPrice}
                              style={"currency"}
                              currency={"IDR"}
                            />
                          </TNum>
                        </VStack>

                        <Button
                          primary
                          size={"xs"}
                          loading={isThisReordering}
                          onClick={() => handleReorder(batch.batchId)}
                        >
                          <AppIcon icon={RotateCcwIcon} />
                          {"Pesan Ulang"}
                        </Button>
                      </HStack>
                    </VStack>
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
