import { Button } from "@/design-system/components/button/ui/button";
import type { FormattedTableHeader } from "@/design-system/components/data-display/types/data-view-table.type";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
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
import type {
  InternalTransactionDetailModalContentProps,
  InternalTransactionDetailTriggerProps,
} from "@/features/internal/statistik-pesanan/types/internal.transaction-detail-modal.type";
import type { InternalTransactionOrderItem } from "@/features/internal/statistik-pesanan/types/internal.transaction-statistic.type";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { t } from "@/shared/libs/i18n";
import type { OrderStatus } from "@/shared/types/status.type";
import { back } from "@/shared/utils/client/navigation";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import {
  CheckIcon,
  ClockIcon,
  EyeIcon,
  Layers2Icon,
  LoaderIcon,
  RotateCcwIcon,
  TimerOffIcon,
  XIcon,
} from "lucide-react";
import { useMemo } from "react";

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

  const isPaid = transaction.transactionStatus === "paid";
  const isExpired = transaction.transactionStatus === "expired";
  const isRefunded = transaction.transactionStatus === "refunded";

  const effectiveOrderStatus: OrderStatus | undefined =
    transaction.transactionStatus === "expired" &&
    (!transaction.orderStatus || transaction.orderStatus === "pending_payment")
      ? "rejected"
      : transaction.orderStatus;

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
        <VStack gap={"md"}>
          {/* Top Section: Responsive SimpleGrid with Timeline & Metadata Details */}
          <Skeleton loaded={isMounted} w={"full"} px={"md"}>
            <SimpleGrid columns={[1, 1, 2]} gap={"md"}>
              {/* Kiri: Timeline Riwayat Alur Pesanan */}
              <VStack
                align={"stretch"}
                gap={"sm"}
                p={"md"}
                bg={"bg.subtle"}
                rounded={"md"}
                border={"1px solid"}
                borderColor={"border.subtle"}
              >
                <HStack justify={"space-between"} align={"center"} pb={"2xs"}>
                  <P fontSize={"xs"} fontWeight={"semibold"} color={"fg.muted"}>
                    {"Riwayat Alur Pesanan"}
                  </P>

                  <P fontSize={"xs"} fontWeight={"semibold"}>
                    <FormatNumber
                      value={transaction.totalAmount}
                      style={"currency"}
                      currency={"IDR"}
                      maximumFractionDigits={0}
                    />
                  </P>
                </HStack>

                <Timeline.Root size={"sm"}>
                  {/* Step 1: Transaksi Dibuat */}
                  <Timeline.Item>
                    <Timeline.Connector>
                      <Timeline.Separator />
                      <Timeline.Indicator colorPalette={"green"}>
                        <AppIcon icon={CheckIcon} size={"xs"} />
                      </Timeline.Indicator>
                    </Timeline.Connector>
                    <Timeline.Content>
                      <Timeline.Title fontSize={"xs"} fontWeight={"semibold"}>
                        {"Transaksi Dibuat"}
                      </Timeline.Title>
                      <Timeline.Description fontSize={"2xs"} color={"fg.subtle"}>
                        {formatUtcDateTime(transaction.createdAt, preferredTimezone)}
                      </Timeline.Description>
                    </Timeline.Content>
                  </Timeline.Item>

                  {/* Step 2: Pembayaran */}
                  <Timeline.Item>
                    <Timeline.Connector>
                      <Timeline.Separator />
                      <Timeline.Indicator
                        colorPalette={
                          isPaid
                            ? "green"
                            : isExpired
                              ? "red"
                              : isRefunded
                                ? "purple"
                                : "orange"
                        }
                      >
                        <AppIcon
                          icon={
                            isPaid
                              ? CheckIcon
                              : isExpired
                                ? TimerOffIcon
                                : isRefunded
                                  ? RotateCcwIcon
                                  : ClockIcon
                          }
                          size={"xs"}
                        />
                      </Timeline.Indicator>
                    </Timeline.Connector>
                    <Timeline.Content>
                      <Timeline.Title fontSize={"xs"} fontWeight={"semibold"}>
                        {isPaid
                          ? "Pembayaran Terverifikasi"
                          : isExpired
                            ? "Pembayaran Kedaluwarsa"
                            : isRefunded
                              ? "Pembayaran Dikembalikan"
                              : "Menunggu Pembayaran"}
                      </Timeline.Title>
                      <Timeline.Description fontSize={"2xs"} color={"fg.subtle"}>
                        {isPaid
                          ? transaction.paidAt
                            ? formatUtcDateTime(transaction.paidAt, preferredTimezone)
                            : `Terbayar (${transaction.paymentMethod || "MPN"})`
                          : isExpired
                            ? "Batas waktu pembayaran habis"
                            : isRefunded
                              ? "Dana transaksi telah dikembalikan"
                              : transaction.billingCode
                                ? `Billing: ${transaction.billingCode}`
                                : "Menunggu pembayaran"}
                      </Timeline.Description>
                    </Timeline.Content>
                  </Timeline.Item>

                  {/* Step 3: Validasi Admin Internal */}
                  <Timeline.Item opacity={!isPaid && !isExpired && !isRefunded ? 0.4 : 1}>
                    <Timeline.Connector>
                      <Timeline.Separator />
                      <Timeline.Indicator
                        colorPalette={
                          effectiveOrderStatus === "ready" || effectiveOrderStatus === "processing"
                            ? "green"
                            : effectiveOrderStatus === "pending_review"
                              ? "orange"
                              : effectiveOrderStatus === "rejected"
                                ? "red"
                                : "gray"
                        }
                      >
                        <AppIcon
                          icon={
                            effectiveOrderStatus === "ready" || effectiveOrderStatus === "processing"
                              ? CheckIcon
                              : effectiveOrderStatus === "pending_review"
                                ? LoaderIcon
                                : effectiveOrderStatus === "rejected"
                                  ? XIcon
                                  : ClockIcon
                          }
                          size={"xs"}
                        />
                      </Timeline.Indicator>
                    </Timeline.Connector>
                    <Timeline.Content>
                      <Timeline.Title
                        fontSize={"xs"}
                        fontWeight={"semibold"}
                        color={!isPaid && !isExpired && !isRefunded ? "fg.subtle" : undefined}
                      >
                        {"Validasi Admin Internal"}
                      </Timeline.Title>
                      <Timeline.Description fontSize={"2xs"} color={"fg.subtle"}>
                        {effectiveOrderStatus === "ready" || effectiveOrderStatus === "processing"
                          ? "Pesanan disetujui admin internal"
                          : effectiveOrderStatus === "pending_review"
                            ? "Menunggu tindakan review admin"
                            : effectiveOrderStatus === "rejected"
                              ? isExpired
                                ? "Dibatalkan otomatis (kedaluwarsa)"
                                : "Pesanan ditolak oleh admin"
                              : isPaid
                                ? "Menunggu validasi admin"
                                : "Diproses setelah pembayaran"}
                      </Timeline.Description>
                    </Timeline.Content>
                  </Timeline.Item>

                  {/* Step 4: Penyiapan Layanan WMS */}
                  <Timeline.Item
                    opacity={
                      effectiveOrderStatus !== "processing" && effectiveOrderStatus !== "ready"
                        ? 0.4
                        : 1
                    }
                  >
                    <Timeline.Connector>
                      <Timeline.Separator />
                      <Timeline.Indicator
                        colorPalette={
                          effectiveOrderStatus === "ready"
                            ? "green"
                            : effectiveOrderStatus === "processing"
                              ? "purple"
                              : "gray"
                        }
                      >
                        <AppIcon
                          icon={
                            effectiveOrderStatus === "ready"
                              ? CheckIcon
                              : effectiveOrderStatus === "processing"
                                ? LoaderIcon
                                : Layers2Icon
                          }
                          size={"xs"}
                        />
                      </Timeline.Indicator>
                    </Timeline.Connector>
                    <Timeline.Content>
                      <Timeline.Title
                        fontSize={"xs"}
                        fontWeight={"semibold"}
                        color={
                          effectiveOrderStatus !== "processing" && effectiveOrderStatus !== "ready"
                            ? "fg.subtle"
                            : undefined
                        }
                      >
                        {"Penyiapan Layanan WMS"}
                      </Timeline.Title>
                      <Timeline.Description fontSize={"2xs"} color={"fg.subtle"}>
                        {effectiveOrderStatus === "ready"
                          ? "Sinkronisasi layer spasial berhasil"
                          : effectiveOrderStatus === "processing"
                            ? "Sistem memproses sinkronisasi layer di background"
                            : "Diproses setelah validasi admin"}
                      </Timeline.Description>
                    </Timeline.Content>
                  </Timeline.Item>

                  {/* Step 5: Siap Digunakan */}
                  <Timeline.Item opacity={effectiveOrderStatus !== "ready" ? 0.4 : 1}>
                    <Timeline.Connector>
                      <Timeline.Separator />
                      <Timeline.Indicator
                        colorPalette={effectiveOrderStatus === "ready" ? "green" : "gray"}
                      >
                        <AppIcon
                          icon={effectiveOrderStatus === "ready" ? CheckIcon : CheckIcon}
                          size={"xs"}
                        />
                      </Timeline.Indicator>
                    </Timeline.Connector>
                    <Timeline.Content>
                      <Timeline.Title
                        fontSize={"xs"}
                        fontWeight={"semibold"}
                        color={effectiveOrderStatus !== "ready" ? "fg.subtle" : undefined}
                      >
                        {"Layanan Siap Digunakan"}
                      </Timeline.Title>
                      <Timeline.Description fontSize={"2xs"} color={"fg.subtle"}>
                        {effectiveOrderStatus === "ready"
                          ? "Layer IGT aktif dan dapat diakses oleh Mitra"
                          : "Layanan WMS siap diakses setelah selesai diproses"}
                      </Timeline.Description>
                    </Timeline.Content>
                  </Timeline.Item>
                </Timeline.Root>
              </VStack>

              {/* Kanan: Rincian Metadata Transaksi & Pesanan */}
              <VStack
                align={"stretch"}
                gap={"sm"}
                bg={"bg.body"}
                rounded={"md"}
                p={"md"}
                border={"1px solid"}
                borderColor={"border.subtle"}
              >
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
              </VStack>
            </SimpleGrid>
          </Skeleton>

          {/* Order Items Table */}
          <Skeleton loaded={isMounted} px={"md"} pb={"md"}>
            <VStack align={"stretch"} gap={"xs"} pt={"xs"}>
              <Box px={"xs"}>
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
        <Button w={"full"} onClick={back}>
          {t["action.close"]()}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
};
