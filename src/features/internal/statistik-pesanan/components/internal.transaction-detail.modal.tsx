// src/features/internal/statistik-pesanan/components/internal.transaction-detail.modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import type {
  InternalTransactionDetailModalContentProps,
  InternalTransactionDetailTriggerProps,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-detail-modal.type";
import type { InternalTransactionOrderItem } from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.type";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { t } from "@/shared/libs/i18n";
import { back } from "@/shared/utils/client/navigation";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { EyeIcon } from "lucide-react";
import { useMemo } from "react";
import { TRANSACTION_STATUS_MAP } from "@/features/shared/constants/volatil.ssot-map";

export const InternalTransactionDetailTrigger = (
  props: InternalTransactionDetailTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey = "internal-transaction-detail",
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
    unmountDelay: 300,
  });

  return (
    <Modal.Root
      modalKey={modalKey}
      opened={isOpen}
      open={open}
      close={close}
      size={"md"}
    >
      <Modal.Trigger>
        {children ? (
          children
        ) : (
          <Button size={"xs"} variant={"subtle"} colorPalette={"blue"}>
            <AppIcon icon={EyeIcon} size={"xs"} />
            {"Detail"}
          </Button>
        )}
      </Modal.Trigger>

      {transaction && isMounted && (
        <InternalTransactionDetailModalContent transaction={transaction} />
      )}
    </Modal.Root>
  );
};

export const InternalTransactionDetailModalContent = (
  props: InternalTransactionDetailModalContentProps,
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
      { th: "Layer IGT", sortable: true },
      { th: "Basis IGT", sortable: true },
      { th: "Jumlah / Luas", sortable: true },
      { th: "Subtotal", sortable: true, align: "end" },
    ],
    [],
  );

  const orderItemsData = useMemo(() => {
    if (!transaction?.items) return [];

    return transaction.items.map((item: InternalTransactionOrderItem) => {
      const isBidang = item.spatialBasis === "bidang";
      const qty = isBidang
        ? `${formatNumber(item.snapshotFeaturesCount)} bidang`
        : `${formatNumber(item.snapshotAreaHa) ?? 0} ha`;

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
            td: <IgtBasisBadge>{item.spatialBasis}</IgtBasisBadge>,
            align: "start" as const,
          },
          {
            value: qty,
            td: <P>{qty}</P>,
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

  const statusConfig = TRANSACTION_STATUS_MAP[transaction.transactionStatus];

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

      <Modal.Body p={0}>
        <VStack gap={"md"}>
          {/* Transaction Status Summary Box */}
          <Skeleton loaded={isMounted} w={"full"} px={"md"}>
            <HStack
              p={"md"}
              bg={"bg.subtle"}
              justify={"space-between"}
              align={"center"}
              wrap={"wrap"}
              gap={"md"}
            >
              <HStack gap={"md"} align={"center"}>
                {statusConfig?.icon && (
                  <AppIcon
                    icon={statusConfig.icon}
                    size={"lg"}
                    color={`${statusConfig.colorPalette}.fg`}
                  />
                )}

                <VStack align={"start"} gap={"2xs"}>
                  <P fontWeight={"semibold"}>
                    {statusConfig?.label ?? transaction.transactionStatus}
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
                <P fontSize={"lg"} fontWeight={"semibold"}>
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
          <Skeleton loaded={isMounted} px={"md"}>
            <VStack
              align={"stretch"}
              gap={"xs"}
              bg={"bg.body"}
              rounded={"md"}
              px={"md"}
            >
              {/* Informasi Mitra (Khusus Internal) */}
              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Nama Mitra"}</P>
                <P fontWeight={"medium"}>{transaction.mitra.name}</P>
              </HStack>

              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Email Mitra"}</P>
                <P color={"fg.muted"}>{transaction.mitra.email}</P>
              </HStack>

              {transaction.mitra.agencyOrCompany && (
                <HStack
                  align={"center"}
                  justify={"space-between"}
                  h={"32px"}
                  fontSize={"sm"}
                >
                  <P color={"fg.subtle"}>{"Instansi / Perusahaan"}</P>
                  <P fontWeight={"medium"}>
                    {transaction.mitra.agencyOrCompany}
                  </P>
                </HStack>
              )}

              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Nomor Order"}</P>
                <P fontWeight={"medium"}>{transaction.orderNumber}</P>
              </HStack>

              {transaction.orderStatus && (
                <HStack
                  align={"center"}
                  justify={"space-between"}
                  h={"32px"}
                  fontSize={"sm"}
                >
                  <P color={"fg.subtle"}>{"Status Order"}</P>
                  <OrderStatusBadge showIcon={true} size={"xs"}>
                    {transaction.orderStatus}
                  </OrderStatusBadge>
                </HStack>
              )}

              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Kode Billing (MPN)"}</P>

                <HStack gap={1} align={"center"} mr={"-4px"}>
                  <P fontWeight={"medium"}>
                    <TNum>{transaction.billingCode}</TNum>
                  </P>

                  <ClipboardButton
                    value={transaction.billingCode}
                    size={"2xs"}
                  />
                </HStack>
              </HStack>

              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Metode Pengajuan"}</P>
                <SelectionTypeBadge size={"xs"}>
                  {transaction.selectionType}
                </SelectionTypeBadge>
              </HStack>

              <HStack
                align={"center"}
                justify={"space-between"}
                h={"32px"}
                fontSize={"sm"}
              >
                <P color={"fg.subtle"}>{"Metode Pembayaran"}</P>
                {transaction.paymentMethod ? (
                  <Badge variant={"subtle"} colorPalette={"gray"}>
                    {transaction.paymentMethod}
                  </Badge>
                ) : (
                  <P>-</P>
                )}
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
          <Skeleton loaded={isMounted} px={"md"} pb={"md"}>
            <VStack align={"stretch"} gap={"xs"} pt={"md"}>
              <Box px={"md"}>
                <P fontSize={"sm"} fontWeight={"semibold"}>
                  {`Daftar Order Layer IGT (${transaction.items.length} Item)`}
                </P>
              </Box>

              <Box
                rounded={"md"}
                overflow={"hidden"}
                borderColor={"border.subtle"}
              >
                <DataViewTable.Root
                  headers={orderItemHeaders}
                  items={orderItemsData}
                  withNumbering={false}
                  pb={0}
                >
                  <DataViewTable.Header />
                  <DataViewTable.Body />
                </DataViewTable.Root>
              </Box>
            </VStack>
          </Skeleton>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <Button w={"full"} onClick={back}>
          {t["action.close"]()}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
