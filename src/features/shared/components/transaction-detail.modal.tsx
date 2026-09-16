// src/features/shared/components/transaction-detail.modal.tsx

import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Countdown } from "@/design-system/components/data-display/ui/countdown";
import { DataViewTable } from "@/design-system/components/data-display/ui/data-view-table";
import { Timeline } from "@/design-system/components/data-display/ui/timeline";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { SimpleGrid } from "@/design-system/components/layout/ui/grid";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { useMountTimeout } from "@/design-system/hooks/use-mount-timeout";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { ORDER_STATUS_MAP } from "@/features/shared/constants/volatil.ssot-map";
import type {
  SharedTransactionOrderItem,
  TransactionDetailModalContentProps,
  TransactionDetailTriggerProps,
} from "@/features/shared/types/transaction-detail.type";
import { t } from "@/shared/libs/i18n";
import type { OrderStatus } from "@/shared/types/status.type";
import { back } from "@/shared/utils/client/navigation";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import {
  CreditCardIcon,
  EyeIcon,
  Layers2Icon,
  RotateCcwIcon,
} from "lucide-react";
import { useMemo } from "react";

export const TransactionDetailTrigger = (
  props: TransactionDetailTriggerProps,
) => {
  // Props
  const {
    modalKey: customModalKey = "transaction-detail",
    transaction,
    children,
    showPayButton = false,
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
      size={"xl"}
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
        <TransactionDetailModalContent
          transaction={transaction}
          showPayButton={showPayButton}
        />
      )}
    </Modal.Root>
  );
};

export const TransactionDetailModalContent = (
  props: TransactionDetailModalContentProps,
) => {
  // Props
  const { transaction, showPayButton = false } = props;

  // Navigation
  const navigate = useNavigate();

  // Hooks
  const isMounted = useMountTimeout({
    mountDelay: 250,
  });

  // Derived Values
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);

  const isPaid = transaction.transactionStatus === "paid";
  const isExpired = transaction.transactionStatus === "expired";
  const isRefunded = transaction.transactionStatus === "refunded";
  const isPayable = !isPaid && !isRefunded && !isExpired && showPayButton;
  const targetExpiry = transaction.billingExpiredAt || transaction.expiredAt;

  const effectiveOrderStatus: OrderStatus | undefined =
    transaction.transactionStatus === "expired" &&
    (!transaction.orderStatus || transaction.orderStatus === "pending_payment")
      ? "rejected"
      : transaction.orderStatus;

  const timelineSteps = useMemo(() => {
    const isReady = effectiveOrderStatus === "ready";
    const isProcessing = effectiveOrderStatus === "processing";
    const isPendingReview = effectiveOrderStatus === "pending_review";
    const isRejected = effectiveOrderStatus === "rejected";

    return [
      {
        id: "preparing" as OrderStatus,
        title: "Transaksi Dibuat",
        description: formatUtcDateTime(transaction.createdAt, preferredTimezone),
        icon: ORDER_STATUS_MAP.ready.icon,
        colorPalette: ORDER_STATUS_MAP.ready.colorPalette,
        isMuted: false,
      },
      {
        id: "pending_payment" as OrderStatus,
        title: isPaid
          ? "Pembayaran Terverifikasi"
          : isExpired
            ? "Pembayaran Kedaluwarsa"
            : isRefunded
              ? "Pembayaran Dikembalikan"
              : ORDER_STATUS_MAP.pending_payment.label,
        description: isPaid
          ? transaction.paidAt
            ? formatUtcDateTime(transaction.paidAt, preferredTimezone)
            : `Terbayar (${transaction.paymentMethod || "MPN"})`
          : isExpired
            ? "Batas waktu pembayaran habis"
            : isRefunded
              ? "Dana transaksi telah dikembalikan"
              : transaction.billingCode
                ? `Billing: ${transaction.billingCode}`
                : "Menunggu pembayaran",
        icon: isPaid
          ? ORDER_STATUS_MAP.paid.icon
          : isExpired
            ? ORDER_STATUS_MAP.rejected.icon
            : isRefunded
              ? RotateCcwIcon
              : ORDER_STATUS_MAP.pending_payment.icon,
        colorPalette: isPaid
          ? ORDER_STATUS_MAP.ready.colorPalette
          : isExpired
            ? ORDER_STATUS_MAP.rejected.colorPalette
            : isRefunded
              ? "purple"
              : ORDER_STATUS_MAP.pending_payment.colorPalette,
        isMuted: false,
      },
      {
        id: "pending_review" as OrderStatus,
        title: "Validasi Admin Internal",
        description:
          isReady || isProcessing
            ? "Pesanan disetujui admin internal"
            : isPendingReview
              ? ORDER_STATUS_MAP.pending_review.label
              : isRejected
                ? isExpired
                  ? "Dibatalkan otomatis (kedaluwarsa)"
                  : "Pesanan ditolak oleh admin"
                : isPaid
                  ? "Menunggu validasi admin"
                  : "Diproses setelah pembayaran",
        icon:
          isReady || isProcessing
            ? ORDER_STATUS_MAP.ready.icon
            : isPendingReview
              ? ORDER_STATUS_MAP.pending_review.icon
              : isRejected
                ? ORDER_STATUS_MAP.rejected.icon
                : ORDER_STATUS_MAP.pending_payment.icon,
        colorPalette:
          isReady || isProcessing
            ? ORDER_STATUS_MAP.ready.colorPalette
            : isPendingReview
              ? ORDER_STATUS_MAP.pending_review.colorPalette
              : isRejected
                ? ORDER_STATUS_MAP.rejected.colorPalette
                : "gray",
        isMuted: !isPaid && !isExpired && !isRefunded,
      },
      {
        id: "processing" as OrderStatus,
        title: ORDER_STATUS_MAP.processing.label,
        description: isReady
          ? "Sinkronisasi layer spasial berhasil"
          : isProcessing
            ? "Sistem memproses sinkronisasi layer di background"
            : "Diproses setelah validasi admin",
        icon: isReady
          ? ORDER_STATUS_MAP.ready.icon
          : isProcessing
            ? ORDER_STATUS_MAP.processing.icon
            : Layers2Icon,
        colorPalette: isReady
          ? ORDER_STATUS_MAP.ready.colorPalette
          : isProcessing
            ? ORDER_STATUS_MAP.processing.colorPalette
            : "gray",
        isMuted: !isProcessing && !isReady,
      },
      {
        id: "ready" as OrderStatus,
        title: ORDER_STATUS_MAP.ready.label,
        description: isReady
          ? "Layer IGT aktif dan dapat diakses di menu Data Saya"
          : "Layanan WMS siap diakses setelah selesai diproses",
        icon: ORDER_STATUS_MAP.ready.icon,
        colorPalette: isReady ? ORDER_STATUS_MAP.ready.colorPalette : "gray",
        isMuted: !isReady,
      },
    ];
  }, [
    effectiveOrderStatus,
    isExpired,
    isPaid,
    isRefunded,
    preferredTimezone,
    transaction,
  ]);

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

    return transaction.items.map((item: SharedTransactionOrderItem) => {
      const isBidang = item.spatialBasis === "bidang";
      const count = item.featuresCount ?? item.snapshotFeaturesCount ?? 0;
      const area = item.areaHa ?? item.snapshotAreaHa ?? 0;
      const qty = isBidang
        ? `${formatNumber(count)} bidang`
        : `${formatNumber(area)} ha`;

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

  // Callbacks
  const handleGoToBilling = () => {
    if (transaction.billingCode) {
      back();
      void navigate({
        to: "/mitra/billing/$billingCode",
        params: { billingCode: transaction.billingCode },
        search: { orderId: transaction.orderId || transaction.id },
      });
    }
  };

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"xs"}>
          <Modal.Title>{"Detail Transaksi & Pesanan"}</Modal.Title>

          <P fontSize={"sm"} textAlign={"center"} color={"fg.subtle"}>
            {transaction.transactionNumber}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body p={0}>
        <VStack gap={"sm"}>
          {/* Top Section: Responsive SimpleGrid with Timeline & Metadata Details */}
          <Skeleton loaded={isMounted} w={"full"} px={"md"} pt={"sm"}>
            <SimpleGrid columns={[1, 1, 2]} gap={"sm"} p={"md"}>
              {/* Kiri: Timeline Riwayat Alur Pesanan */}
              <VStack gap={"md"}>
                <P fontWeight={"semibold"}>{"Riwayat Alur Pesanan"}</P>

                <Timeline.Root size={"sm"}>
                  {timelineSteps.map((step) => (
                    <Timeline.Item
                      key={step.id}
                      opacity={step.isMuted ? 0.4 : 1}
                    >
                      <Timeline.Connector>
                        <Timeline.Separator />

                        <Timeline.Indicator colorPalette={step.colorPalette}>
                          <AppIcon icon={step.icon} size={"xs"} />
                        </Timeline.Indicator>
                      </Timeline.Connector>

                      <Timeline.Content>
                        <Timeline.Title
                          fontSize={"xs"}
                          fontWeight={"semibold"}
                          color={step.isMuted ? "fg.subtle" : undefined}
                        >
                          {step.title}
                        </Timeline.Title>

                        <Timeline.Description
                          fontSize={"2xs"}
                          color={"fg.subtle"}
                        >
                          {step.description}
                        </Timeline.Description>
                      </Timeline.Content>
                    </Timeline.Item>
                  ))}
                </Timeline.Root>
              </VStack>

              {/* Kanan: Rincian Metadata Transaksi & Pesanan */}
              <VStack gap={"md"}>
                {/* Info Mitra (Hanya jika data mitra tersedia / Internal View) */}
                {transaction.mitra && (
                  <>
                    <VStack align={"start"} gap={"2xs"}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Nama Mitra"}
                      </P>
                      <P fontSize={"sm"} fontWeight={"medium"}>
                        {transaction.mitra.name}
                      </P>
                    </VStack>

                    <VStack align={"start"} gap={"2xs"}>
                      <P fontSize={"xs"} color={"fg.subtle"}>
                        {"Email Mitra"}
                      </P>
                      <P fontSize={"sm"} color={"fg.muted"}>
                        {transaction.mitra.email}
                      </P>
                    </VStack>

                    {transaction.mitra.agencyOrCompany && (
                      <VStack align={"start"} gap={"2xs"}>
                        <P fontSize={"xs"} color={"fg.subtle"}>
                          {"Instansi / Perusahaan"}
                        </P>
                        <P fontSize={"sm"} fontWeight={"medium"}>
                          {transaction.mitra.agencyOrCompany}
                        </P>
                      </VStack>
                    )}
                  </>
                )}

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Nomor Pesanan"}
                  </P>
                  <P fontSize={"sm"} fontWeight={"medium"}>
                    {transaction.orderNumber || "-"}
                  </P>
                </VStack>

                {effectiveOrderStatus && (
                  <VStack align={"start"} gap={"2xs"}>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {"Status Pesanan"}
                    </P>
                    <OrderStatusBadge showIcon={true}>
                      {effectiveOrderStatus}
                    </OrderStatusBadge>
                  </VStack>
                )}

                {transaction.billingCode && (
                  <VStack align={"start"} gap={"2xs"}>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {"Kode Billing (MPN)"}
                    </P>
                    <HStack gap={1} align={"center"}>
                      <P fontSize={"sm"} fontWeight={"medium"}>
                        <TNum>{transaction.billingCode}</TNum>
                      </P>
                      <ClipboardButton
                        value={transaction.billingCode}
                        size={"2xs"}
                      />
                    </HStack>
                  </VStack>
                )}

                {targetExpiry && !isPaid && !isRefunded && (
                  <VStack align={"start"} gap={"2xs"}>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {"Sisa Waktu Pembayaran"}
                    </P>
                    <Countdown
                      finishedAt={targetExpiry}
                      fontWeight={"medium"}
                      color={isExpired ? "fg.subtle" : "orange.fg"}
                    />
                  </VStack>
                )}

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Metode Pengajuan"}
                  </P>
                  <SelectionTypeBadge size={"xs"}>
                    {transaction.selectionType}
                  </SelectionTypeBadge>
                </VStack>

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Metode Pembayaran"}
                  </P>
                  {transaction.paymentMethod ? (
                    <Badge variant={"subtle"} colorPalette={"gray"}>
                      {transaction.paymentMethod}
                    </Badge>
                  ) : (
                    <P fontSize={"sm"}>{"-"}</P>
                  )}
                </VStack>

                {transaction.paidAt && (
                  <VStack align={"start"} gap={"2xs"}>
                    <P fontSize={"xs"} color={"fg.subtle"}>
                      {"Waktu Pembayaran"}
                    </P>
                    <P fontSize={"sm"} fontWeight={"medium"}>
                      {formatUtcDateTime(transaction.paidAt, preferredTimezone)}
                    </P>
                  </VStack>
                )}

                <VStack align={"start"} gap={"2xs"}>
                  <P fontSize={"xs"} color={"fg.subtle"}>
                    {"Total Pembayaran"}
                  </P>
                  <P fontSize={"sm"} fontWeight={"medium"}>
                    <FormatNumber
                      value={transaction.totalAmount}
                      style={"currency"}
                      currency={"IDR"}
                      maximumFractionDigits={0}
                    />
                  </P>
                </VStack>
              </VStack>
            </SimpleGrid>
          </Skeleton>

          {/* Order Items Table */}
          <Skeleton loaded={isMounted} px={"md"} pb={"md"}>
            <VStack align={"stretch"} gap={"xs"} pt={"xs"}>
              <Box px={"md"}>
                <P fontSize={"sm"} fontWeight={"semibold"}>
                  {`Daftar Pesanan Layer IGT (${transaction.items.length} Item)`}
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
        <HStack gap={"sm"} w={"full"}>
          <Button flex={1} onClick={back}>
            {t["action.close"]()}
          </Button>

          {isPayable && (
            <Button primary={true} flex={1} onClick={handleGoToBilling}>
              <AppIcon icon={CreditCardIcon} />
              {"Bayar Sekarang"}
            </Button>
          )}
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
