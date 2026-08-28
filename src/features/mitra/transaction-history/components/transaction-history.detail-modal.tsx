// src/features/mitra/transaction-history/components/transaction-history.detail-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { DataView } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import {
  SELECTION_TYPE_CONFIG_MAP,
  SPATIAL_BASIS_CONFIG_MAP,
} from "@/features/mitra/cart/constants/cart.config";
import type {
  TransactionDetailModalContentProps,
  TransactionDetailTriggerProps,
} from "@/features/mitra/transaction-history/types/transaction-history.modal.type";
import type { TransactionOrderItem } from "@/features/mitra/transaction-history/types/transaction-history.type";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";
import { useMemo } from "react";

export const TransactionDetailTrigger = (
  props: TransactionDetailTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey = "transaction-detail",
    transaction,
    children,
  } = props;

  // Stores & Hooks
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
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

      {transaction && isMounted && (
        <TransactionDetailModalContent transaction={transaction} />
      )}
    </Modal.Root>
  );
};

export const TransactionDetailModalContent = (
  props: TransactionDetailModalContentProps,
) => {
  // Props
  const { transaction } = props;

  // Hooks
  const isMounted = useMountTimeout({
    mountDelay: 250,
  });

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const orderItemHeaders: FormattedTableHeader[] = useMemo(
    () => [
      { th: "Layer IGT", sortable: false, align: "start" },
      { th: "Basis Spasial", sortable: false, align: "start" },
      { th: "Metode Seleksi", sortable: false, align: "start" },
      { th: "Jumlah / Luas", sortable: false, align: "start" },
      { th: "Subtotal", sortable: false, align: "end" },
    ],
    [],
  );

  const orderItemsData = useMemo(() => {
    if (!transaction?.items) return [];

    return transaction.items.map((item: TransactionOrderItem) => {
      const isBidang = item.spatialBasis === "bidang";
      const quantityText = isBidang
        ? `${item.snapshotFeaturesCount} bidang`
        : `${item.snapshotAreaHa ?? 0} ha`;

      return {
        id: item.id,
        data: item,
        columns: [
          {
            value: item.sourceLayerTitle,
            td: <P>{item.sourceLayerTitle}</P>,
            align: "start" as const,
          },
          {
            value: item.spatialBasis,
            td: (
              <Badge
                colorPalette={
                  SPATIAL_BASIS_CONFIG_MAP[item.spatialBasis]?.colorPalette ??
                  "gray"
                }
                variant={"subtle"}
              >
                {SPATIAL_BASIS_CONFIG_MAP[item.spatialBasis]?.label ??
                  item.spatialBasis}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: item.selectionType,
            td: (
              <Badge
                colorPalette={
                  SELECTION_TYPE_CONFIG_MAP[item.selectionType]?.colorPalette
                }
                variant={
                  SELECTION_TYPE_CONFIG_MAP[item.selectionType]?.variant ??
                  "outline"
                }
              >
                {SELECTION_TYPE_CONFIG_MAP[item.selectionType]?.label ??
                  item.selectionType}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: quantityText,
            td: <P>{quantityText}</P>,
            align: "start" as const,
          },
          {
            value: item.subtotalPrice,
            td: (
              <P fontWeight={"medium"}>
                <FormatNumber
                  value={item.subtotalPrice}
                  style={"currency"}
                  currency={"IDR"}
                  maximumFractionDigits={0}
                />
              </P>
            ),
            align: "end" as const,
          },
        ],
      };
    });
  }, [transaction]);

  const isSettled = transaction.transactionStatus === "settled";
  const isPending = transaction.transactionStatus === "pending";

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"xs"}>
          <Modal.Title>{"Detail Transaksi & Order"}</Modal.Title>

          <P fontSize={"sm"} textAlign={"center"} color={"fg.subtle"}>
            {transaction.transactionNumber}
          </P>
        </VStack>
      </Modal.Header>

      <Separator borderColor={"bg.canvas"} />

      <Modal.Body p={0}>
        <VStack gap={"md"}>
          {/* Transaction Status Summary Box */}
          <Skeleton loaded={isMounted} w={"full"} px={"md"}>
            <HStack
              p={"md"}
              bg={"bg.canvas"}
              justify={"space-between"}
              align={"center"}
              wrap={"wrap"}
              gap={"md"}
            >
              <HStack gap={"md"} align={"center"}>
                <AppIcon
                  icon={
                    isSettled
                      ? CheckCircleIcon
                      : isPending
                        ? ClockIcon
                        : XCircleIcon
                  }
                  size={"lg"}
                  color={
                    isSettled ? "green.fg" : isPending ? "orange.fg" : "red.fg"
                  }
                />

                <VStack align={"start"} gap={"2xs"}>
                  <P fontWeight={"semibold"}>
                    {isSettled
                      ? "Pembayaran Berhasil"
                      : isPending
                        ? "Menunggu Pembayaran"
                        : "Transaksi Kedaluwarsa"}
                  </P>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {`Dibuat: ${formatUtcDateTime(transaction.createdAt, preferredTimezone)}`}
                  </P>
                </VStack>
              </HStack>

              <VStack align={"end"} gap={0}>
                <P fontSize={"xs"} color={"fg.subtle"}>
                  {"Total Nominal"}
                </P>
                <P fontSize={"lg"} fontWeight={"bold"}>
                  <FormatNumber
                    value={transaction.totalAmount}
                    style={"currency"}
                    currency={"IDR"}
                    maximumFractionDigits={0}
                  />
                </P>
              </VStack>
            </HStack>
          </Skeleton>

          {/* Transaction Metadata Grid */}
          <Skeleton loaded={isMounted}>
            <VStack
              align={"stretch"}
              gap={"xs"}
              px={"md"}
              bg={"bg.body"}
              rounded={"md"}
            >
              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Nomor Order"}</P>
                <P fontWeight={"medium"}>{transaction.orderNumber}</P>
              </HStack>

              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Kode Billing (MPN)"}</P>
                <HStack gap={1} align={"center"}>
                  <P fontWeight={"medium"}>
                    <TNum>{transaction.billingCode}</TNum>
                  </P>
                  <ClipboardButton
                    value={transaction.billingCode}
                    size={"xs"}
                  />
                </HStack>
              </HStack>

              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Metode Pembayaran"}</P>
                <Badge variant={"subtle"} colorPalette={"gray"}>
                  {transaction.paymentMethod}
                </Badge>
              </HStack>

              {transaction.paidAt && (
                <HStack
                  align={"center"}
                  justify={"space-between"}
                  h={"32px"}
                  fontSize={"sm"}
                >
                  <P color={"fg.subtle"}>{"Waktu Pembayaran"}</P>
                  <P fontWeight={"medium"}>
                    {formatUtcDateTime(transaction.paidAt, preferredTimezone)}
                  </P>
                </HStack>
              )}
            </VStack>
          </Skeleton>

          {/* Order Items Table */}
          <Skeleton loaded={isMounted}>
            <VStack align={"stretch"} gap={"xs"} pt={"md"}>
              <Box px={"md"}>
                <P fontSize={"sm"} fontWeight={"semibold"}>
                  {`Daftar Order Layer IGT (${transaction.items.length} Item)`}
                </P>
              </Box>

              <Box
                rounded={"md"}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"border.subtle"}
              >
                <DataView.Table.Root
                  headers={orderItemHeaders}
                  items={orderItemsData}
                  withNumbering={false}
                  pb={0}
                  shadow={"none"}
                >
                  <DataView.Table.Header />
                  <DataView.Table.Body />
                </DataView.Table.Root>
              </Box>
            </VStack>
          </Skeleton>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <Button flex={1} onClick={back}>
          {t["action.close"]()}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
