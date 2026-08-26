// src/features/mitra/transaction-history/components/transaction-history.detail-modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-list-table.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { DataListTable } from "@/design-system/components/data-display/ui/data-list-table";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { SPACING } from "@/design-system/constants/styles";
import { useThemeStore } from "@/design-system/stores/theme-store";
import type {
  TransactionOrderItem,
  TransactionRecord,
} from "@/features/mitra/transaction-history/types/transaction-history.type";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "lucide-react";
import { useMemo } from "react";

export type TransactionHistoryDetailModalProps = {
  modalKey?: string;
  transaction: TransactionRecord | null;
  onClose?: () => void;
};

export const TransactionHistoryDetailModal = (
  props: TransactionHistoryDetailModalProps,
) => {
  // Props
  const {
    modalKey: customModalKey = "transaction-detail",
    transaction,
    onClose,
  } = props;

  // Stores & Hooks
  const { theme } = useThemeStore();
  const { modalKey, isOpen, open, close } = usePopModal({
    modalKey: customModalKey,
  });

  const handleClose = () => {
    close();
    onClose?.();
  };

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
            td: (
              <VStack align={"start"} gap={0}>
                <P fontWeight={"medium"}>{item.sourceLayerTitle}</P>
                <P fontSize={"sm"} color={"fg.subtle"}>
                  {item.sourceLayerId}
                </P>
              </VStack>
            ),
            align: "start" as const,
          },
          {
            value: item.spatialBasis,
            td: (
              <Badge
                colorPalette={isBidang ? "blue" : "orange"}
                variant={"subtle"}
              >
                {isBidang ? "Bidang" : "Kawasan"}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: item.selectionType,
            td: (
              <Badge variant={"outline"} colorPalette={"gray"}>
                {item.selectionType.replace(/_/g, " ")}
              </Badge>
            ),
            align: "start" as const,
          },
          {
            value: quantityText,
            td: (
              <P fontSize={"sm"} color={"fg.muted"}>
                {quantityText}
              </P>
            ),
            align: "start" as const,
          },
          {
            value: item.subtotalPrice,
            td: (
              <P fontSize={"sm"} fontWeight={"medium"}>
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

  if (!transaction) return null;

  const isSettled = transaction.transactionStatus === "settled";
  const isPending = transaction.transactionStatus === "pending";

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={handleClose}
      size={"lg"}
    >
      <Modal.Content>
        <Modal.Header>
          <Modal.CloseButton />

          <VStack gap={SPACING.xs}>
            <Modal.Title>{"Detail Transaksi & Order"}</Modal.Title>
            <P fontSize={"xs"} textAlign={"center"} color={"fg.subtle"}>
              {transaction.transactionNumber}
            </P>
          </VStack>
        </Modal.Header>

        <Separator borderColor={"bg.canvas"} />

        <Modal.Body p={0}>
          {/* Transaction Status Summary Box */}
          <Box w={"full"} p={SPACING.md}>
            <HStack
              p={SPACING.md}
              rounded={theme.radii.component}
              bg={"bg.canvas"}
              justify={"space-between"}
              align={"center"}
              wrap={"wrap"}
              gap={SPACING.sm}
            >
              <HStack gap={SPACING.sm} align={"center"}>
                <AppIcon
                  icon={
                    isSettled
                      ? CheckCircleIcon
                      : isPending
                        ? ClockIcon
                        : XCircleIcon
                  }
                  color={
                    isSettled ? "green.fg" : isPending ? "orange.fg" : "red.fg"
                  }
                />

                <VStack align={"start"} gap={0}>
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
          </Box>

          {/* Transaction Metadata Grid */}
          <VStack
            align={"stretch"}
            gap={SPACING.xs}
            px={SPACING.md}
            py={SPACING.xs}
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
                <ClipboardButton value={transaction.billingCode} size={"xs"} />
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

          {/* Order Items Table */}
          <VStack align={"stretch"} gap={SPACING.xs} py={SPACING.md}>
            <Box px={SPACING.md}>
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
              <DataListTable.Root
                headers={orderItemHeaders}
                items={orderItemsData}
                withNumbering={false}
                shadow={"none"}
              >
                <DataListTable.Header />
                <DataListTable.Body />
              </DataListTable.Root>
            </Box>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <Button variant={"outline"} flex={1} onClick={back}>
            {t["action.close"]()}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
