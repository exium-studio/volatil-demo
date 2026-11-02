import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { ConfirmationTrigger } from "@/design-system/components/feedback/ui/confirmation-trigger";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { usePopModal } from "@/design-system/components/overlay/hooks/use-pop-modal";
import { Modal } from "@/design-system/components/overlay/ui/modal";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { FormatNumber } from "@/design-system/components/utilities/ui/fornat-number";
import { InternalOrderReviewInputBillingTrigger } from "@/features/internal/order-review/components/internal.order-review.input-billing-modal";
import { InternalOrderReviewRejectTrigger } from "@/features/internal/order-review/components/internal.order-review.reject-modal";
import {
  useApproveManualPayment,
  useProvisionOrder,
} from "@/features/internal/order-review/hooks/use-order-review";
import type {
  InternalOrderReviewDetailModalContentProps,
  InternalOrderReviewDetailTriggerProps,
} from "@/features/internal/order-review/types/order-review.type";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import { IgtBasisBadge } from "@/features/shared/components/igt-basis.badge";
import { OrderStatusBadge } from "@/features/shared/components/order-status.badge";
import { SelectionTypeBadge } from "@/features/shared/components/selection-type.badge";
import { TteBadge } from "@/features/shared/components/tte.badge";
import {
  formatUtcDateTime,
  getPreferredUserTimezone,
} from "@/shared/utils/formatter/date.formatter";
import { formatNumber } from "@/shared/utils/formatter/number.formatter";
import { useNavigate } from "@tanstack/react-router";
import { Collapsible } from "@/design-system/components/disclosure/ui/collapsible";
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HashIcon,
  LayersIcon,
  LoaderIcon,
  MapPlusIcon,
  ReceiptTextIcon,
  XCircleIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

export const InternalOrderReviewDetailTrigger = (
  props: InternalOrderReviewDetailTriggerProps,
) => {
  const { modalKey: customModalKey, order, children } = props;
  const key = customModalKey || `detail-order-${order.orderId}`;

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

      <InternalOrderReviewDetailModalContent order={order} close={close} />
    </Modal.Root>
  );
};

const InternalOrderReviewDetailModalContent = (
  props: InternalOrderReviewDetailModalContentProps,
) => {
  const { order, close } = props;
  const preferredTimezone = useMemo(() => getPreferredUserTimezone(), []);
  const provisionOrderMutation = useProvisionOrder();
  const approveManualPaymentMutation = useApproveManualPayment();
  const pricingPolicy = usePricingPolicy();

  const navigate = useNavigate();

  // States
  const [isLayerListOpen, setIsLayerListOpen] = useState(false);

  const isPaid = order.status === "paid";
  const isProcessing = order.status === "processing";
  const isPendingBillingCode = order.status === "pending_billing_code";
  const isPendingManualVerification =
    order.status === "pending_manual_payment_verification";
  const isPendingReview = order.status === "pending_review";

  // Coverage Bidang Count
  const coverageBidangCount = useMemo(() => {
    if (order.bidangCoverageCount != null) {
      return order.bidangCoverageCount;
    }
    if (order.featuresCount != null) {
      return order.featuresCount;
    }
    return (order.items || [])
      .filter((it) => (it.igtBasis ?? it.spatialBasis) === "bidang")
      .reduce((sum, it) => sum + (it.featuresCount ?? 0), 0);
  }, [order]);

  // Coverage Kawasan Ha
  const coverageKawasanHa = useMemo(() => {
    if (order.kawasanCoverageHa != null) {
      return order.kawasanCoverageHa;
    }
    if (order.coverageHa != null) {
      return order.coverageHa;
    }
    const kawasanItems = (order.items || []).filter(
      (it) => (it.igtBasis ?? it.spatialBasis) === "kawasan",
    );
    if (kawasanItems.length === 0) return 0;
    return Math.max(...kawasanItems.map((it) => it.areaHa ?? 0), 0);
  }, [order]);

  // Unit Prices
  const unitPriceBidang = useMemo(() => {
    const itemWithPrice = (order.items || []).find(
      (it) => (it.igtBasis ?? it.spatialBasis) === "bidang" && (it.unitPrice ?? 0) > 0,
    );
    return itemWithPrice?.unitPrice ?? pricingPolicy.pricePerBidang ?? 0;
  }, [order, pricingPolicy.pricePerBidang]);

  const unitPriceKawasan = useMemo(() => {
    const itemWithPrice = (order.items || []).find(
      (it) => (it.igtBasis ?? it.spatialBasis) === "kawasan" && (it.unitPrice ?? 0) > 0,
    );
    return itemWithPrice?.unitPrice ?? pricingPolicy.pricePerKawasanHa ?? 0;
  }, [order, pricingPolicy.pricePerKawasanHa]);

  // Subtotals
  const subtotalBidang = useMemo(() => {
    if (order.subtotalBidangPrice != null) return order.subtotalBidangPrice;
    if (order.subtotalBidang != null) return order.subtotalBidang;
    return coverageBidangCount * unitPriceBidang;
  }, [order, coverageBidangCount, unitPriceBidang]);

  const subtotalKawasan = useMemo(() => {
    if (order.subtotalKawasanPrice != null) return order.subtotalKawasanPrice;
    if (order.subtotalKawasan != null) return order.subtotalKawasan;
    return coverageKawasanHa * unitPriceKawasan;
  }, [order, coverageKawasanHa, unitPriceKawasan]);

  const totalCalculated =
    (order.totalPrice ?? 0) > 0
      ? (order.totalPrice ?? 0)
      : subtotalBidang + subtotalKawasan;

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.CloseButton />

        <VStack gap={"2xs"}>
          <Modal.Title>{"Detail Permintaan Pesanan"}</Modal.Title>
          <P textAlign={"center"} color={"fg.muted"}>
            {order.orderNumber || order.orderId}
          </P>
        </VStack>
      </Modal.Header>

      <Modal.Body>
        <VStack align={"stretch"} gap={"md"}>
          {/* Rejection Alert if present */}
          {order.rejectionReason && (
            <Alert.Root
              status={"warning"}
              colorPalette={"red"}
              variant={"subtle"}
            >
              <AppIcon icon={XCircleIcon} />
              <Alert.Content>
                <Alert.Title fontWeight={"semibold"}>
                  {"Catatan Penolakan Sebelumnya"}
                </Alert.Title>
                <Alert.Description>{order.rejectionReason}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {/* Informasi Pesanan (Clean Key-Value Rows) */}
          <VStack align={"stretch"} gap={"xs"} py={"xs"}>
            <HStack justify={"space-between"} align={"center"}>
              <P color={"fg.muted"}>{"Pemohon"}</P>
              <P fontWeight={"medium"}>{order.mitraName}</P>
            </HStack>

            <HStack justify={"space-between"} align={"center"}>
              <P color={"fg.muted"}>{"Status Pesanan"}</P>
              <OrderStatusBadge>{order.status}</OrderStatusBadge>
            </HStack>

            <HStack justify={"space-between"} align={"center"}>
              <P color={"fg.muted"}>{"Metode Pengajuan"}</P>
              <SelectionTypeBadge>{order.selectionType}</SelectionTypeBadge>
            </HStack>

            <HStack justify={"space-between"} align={"center"}>
              <P color={"fg.muted"}>{"Waktu Dibuat"}</P>
              <P>{formatUtcDateTime(order.createdAt, preferredTimezone)}</P>
            </HStack>

            {Boolean(order.billingCode) && (
              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.muted"}>{"Kode Billing"}</P>
                <HStack align={"center"} gap={"xs"}>
                  <P fontFamily={"mono"} fontWeight={"semibold"}>
                    <TNum>{order.billingCode}</TNum>
                  </P>
                  <ClipboardButton
                    value={order.billingCode ?? ""}
                    variant={"ghost"}
                  />
                </HStack>
              </HStack>
            )}

            {(order.invoiceUrl || order.tteInvoiceUrl) && (
              <HStack justify={"space-between"} align={"center"}>
                <P color={"fg.muted"}>{"Dokumen & Faktur"}</P>
                <TteBadge
                  tte={order.tte}
                  invoiceUrl={order.invoiceUrl}
                  tteInvoiceUrl={order.tteInvoiceUrl}
                />
              </HStack>
            )}
          </VStack>

          <Separator />

          {/* Bukti Pembayaran Manual (Clean Flat Layout) */}
          {Boolean(
            order.isManualPayment || order.ntpn || order.paymentProofUrl,
          ) && (
            <VStack align={"stretch"} gap={"xs"} py={"xs"}>
              <HStack justify={"space-between"} align={"center"}>
                <P fontWeight={"semibold"}>{"Bukti Pembayaran PNBP"}</P>

                {order.paymentVerificationStatus && (
                  <Badge
                    colorPalette={
                      order.paymentVerificationStatus === "approved"
                        ? "green"
                        : order.paymentVerificationStatus === "rejected"
                          ? "red"
                          : "orange"
                    }
                    variant={"subtle"}
                  >
                    {order.paymentVerificationStatus === "approved"
                      ? "Disetujui"
                      : order.paymentVerificationStatus === "rejected"
                        ? "Ditolak"
                        : "Menunggu Verifikasi"}
                  </Badge>
                )}
              </HStack>

              <HStack justify={"space-between"} align={"center"}>
                <HStack gap={1} align={"center"}>
                  <AppIcon icon={HashIcon} color={"fg.muted"} />
                  <P color={"fg.muted"}>{"Nomor NTPN"}</P>
                </HStack>

                <HStack align={"center"} gap={"xs"}>
                  <P fontFamily={"mono"} fontWeight={"bold"}>
                    {order.ntpn || "-"}
                  </P>
                  {order.ntpn && (
                    <ClipboardButton
                      value={order.ntpn}
                      variant={"ghost"}
                    />
                  )}
                </HStack>
              </HStack>

              {order.paidAt && (
                <HStack justify={"space-between"} align={"center"}>
                  <HStack gap={1} align={"center"}>
                    <AppIcon
                      icon={CalendarIcon}
                      color={"fg.muted"}
                    />
                    <P color={"fg.muted"}>{"Tanggal Setor"}</P>
                  </HStack>
                  <P>{formatUtcDateTime(order.paidAt, preferredTimezone)}</P>
                </HStack>
              )}

              {order.paymentProofUrl && (
                <HStack justify={"space-between"} align={"center"} pt={"2xs"}>
                  <HStack gap={"xs"} align={"center"}>
                    <AppIcon
                      icon={FileTextIcon}
                      color={"fg.muted"}
                    />
                    <P color={"fg.muted"} truncate maxW={"260px"}>
                      {order.paymentProofName || "Berkas Bukti Bayar"}
                    </P>
                  </HStack>

                  <Button
                    asChild={true}
                    variant={"outline"}
                  >
                    <a
                      href={order.paymentProofUrl}
                      target={"_blank"}
                      rel={"noopener noreferrer"}
                    >
                      <AppIcon icon={ExternalLinkIcon} />
                      {"Lihat Berkas"}
                    </a>
                  </Button>
                </HStack>
              )}

              <Separator mt={"xs"} />
            </VStack>
          )}

          {/* Ringkasan Biaya PNBP */}
          <VStack align={"stretch"} gap={"xs"} py={"xs"}>
            <P fontWeight={"semibold"}>{"Ringkasan Biaya PNBP"}</P>

            {coverageBidangCount > 0 && (
              <HStack justify={"space-between"} align={"center"}>
                <VStack align={"start"} gap={0}>
                  <P color={"fg.muted"}>{"Cakupan Bidang"}</P>
                  {unitPriceBidang > 0 && (
                    <P color={"fg.subtle"}>
                      <TNum>{formatNumber(coverageBidangCount)}</TNum>
                      {" bidang × "}
                      <FormatNumber
                        value={unitPriceBidang}
                        style={"currency"}
                        currency={"IDR"}
                        maximumFractionDigits={0}
                      />
                    </P>
                  )}
                </VStack>

                <P fontWeight={"medium"}>
                  <FormatNumber
                    value={subtotalBidang}
                    style={"currency"}
                    currency={"IDR"}
                    maximumFractionDigits={0}
                  />
                </P>
              </HStack>
            )}

            {coverageKawasanHa > 0 && (
              <HStack justify={"space-between"} align={"center"}>
                <VStack align={"start"} gap={0}>
                  <P color={"fg.muted"}>{"Cakupan Kawasan"}</P>
                  {unitPriceKawasan > 0 && (
                    <P color={"fg.subtle"}>
                      <TNum>
                        {formatNumber(coverageKawasanHa, {
                          maximumFractionDigits: 2,
                        })}
                      </TNum>
                      {" ha × "}
                      <FormatNumber
                        value={unitPriceKawasan}
                        style={"currency"}
                        currency={"IDR"}
                        maximumFractionDigits={0}
                      />
                    </P>
                  )}
                </VStack>

                <P fontWeight={"medium"}>
                  <FormatNumber
                    value={subtotalKawasan}
                    style={"currency"}
                    currency={"IDR"}
                    maximumFractionDigits={0}
                  />
                </P>
              </HStack>
            )}

            <HStack justify={"space-between"} align={"center"} pt={"xs"}>
              <P fontWeight={"semibold"}>{"Total Tagihan"}</P>
              <P fontWeight={"bold"} color={"green.500"}>
                <FormatNumber
                  value={totalCalculated}
                  style={"currency"}
                  currency={"IDR"}
                  maximumFractionDigits={0}
                />
              </P>
            </HStack>
          </VStack>

          <Separator />

          {/* Daftar Layer IGT (Collapsible Simpel) */}
          <Collapsible.Root
            opened={isLayerListOpen}
            onOpenChange={(e) => setIsLayerListOpen(e.open)}
          >
            <VStack align={"stretch"} gap={"xs"}>
              <HStack
                justify={"space-between"}
                align={"center"}
                cursor={"pointer"}
                onClick={() => setIsLayerListOpen((prev) => !prev)}
                py={"2xs"}
              >
                <HStack gap={"xs"} align={"center"}>
                  <AppIcon icon={LayersIcon} color={"fg.muted"} />
                  <P fontWeight={"medium"}>
                    {`Total Layer: ${order.items.length} IGT Layer`}
                  </P>
                </HStack>

                <HStack gap={"2xs"} align={"center"}>
                  <P color={"fg.muted"}>
                    {isLayerListOpen ? "Tutup" : "Lihat Daftar"}
                  </P>
                  <AppIcon
                    icon={isLayerListOpen ? ChevronUpIcon : ChevronDownIcon}
                    color={"fg.muted"}
                  />
                </HStack>
              </HStack>

              <Collapsible.Content>
                <VStack
                  align={"stretch"}
                  gap={0}
                  rounded={"sm"}
                  border={"1px solid"}
                  borderColor={"border.subtle"}
                  overflow={"hidden"}
                >
                  {order.items.map((item, idx) => {
                    const basis =
                      item.igtBasis ?? item.spatialBasis ?? "kawasan";

                    return (
                      <Box
                        key={item.id || item.sourceLayerId || idx}
                        p={"xs"}
                        borderTop={idx > 0 ? "1px solid" : undefined}
                        borderColor={"border.subtle"}
                      >
                        <HStack justify={"space-between"} align={"center"}>
                          <HStack gap={"xs"} flex={1} minW={0}>
                            <IgtBasisBadge>{basis}</IgtBasisBadge>
                            <P fontWeight={"medium"} truncate>
                              {item.sourceLayerTitle || item.sourceLayerId}
                            </P>
                          </HStack>
                        </HStack>
                      </Box>
                    );
                  })}
                </VStack>
              </Collapsible.Content>
            </VStack>
          </Collapsible.Root>
        </VStack>
      </Modal.Body>

      <Modal.Footer>
        <HStack justify={"end"} gap={"sm"} w={"full"}>
          <Button variant={"outline"} onClick={close}>
            {"Tutup"}
          </Button>

          {isPaid && (
            <ConfirmationTrigger
              modalKey={`provision-wms-detail-modal-${order.orderId}`}
              icon={MapPlusIcon}
              colorPalette={"blue"}
              title={"Buat Layanan WMS"}
              description={`Apakah Anda yakin ingin memulai pembuatan layanan WMS untuk pesanan "${order.orderNumber || order.orderId}" (Mitra: ${order.mitraName})? Proses ini akan menyiapkan workspace dan service layer di latar belakang.`}
              confirmLabel={"Buat Layanan WMS"}
              onConfirm={() => {
                provisionOrderMutation.mutate(
                  { orderId: order.orderId },
                  {
                    onSuccess: () => {
                      close();
                    },
                  },
                );
              }}
            >
              <Button
                primary={true}
                colorPalette={"blue"}
                loading={provisionOrderMutation.isPending}
              >
                <AppIcon icon={MapPlusIcon} />
                {"Create Service WMS"}
              </Button>
            </ConfirmationTrigger>
          )}

          {isProcessing && (
            <Button variant={"outline"} disabled={true}>
              <AppIcon icon={LoaderIcon} className={"animate-spin"} />
              {"Menyiapkan Layanan WMS..."}
            </Button>
          )}

          {isPendingBillingCode && (
            <InternalOrderReviewInputBillingTrigger
              order={order}
              modalKey={`input-billing-detail-${order.orderId}`}
              onSuccess={close}
            >
              <Button primary={true} colorPalette={"blue"}>
                <AppIcon icon={ReceiptTextIcon} />
                {"Input Kode Billing"}
              </Button>
            </InternalOrderReviewInputBillingTrigger>
          )}

          {isPendingManualVerification && (
            <>
              {/* Tolak Pembayaran */}
              <InternalOrderReviewRejectTrigger
                order={order}
                modalKey={`reject-from-detail-${order.orderId}`}
                onSuccessRedirect={() => {
                  close();
                  void navigate({
                    to: "/internal/order-review",
                    search: (old: Record<string, unknown>) => {
                      const { activeModalKey: _, ...rest } = old;
                      return rest;
                    },
                  });
                }}
              >
                <Button variant={"outline"} colorPalette={"red"}>
                  <AppIcon icon={XCircleIcon} />
                  {"Tolak Pembayaran"}
                </Button>
              </InternalOrderReviewRejectTrigger>

              {/* Setujui Pembayaran (Konfirmasi: Ubah status menjadi 'paid' & trigger provision GeoServer) */}
              <ConfirmationTrigger
                modalKey={`approve-payment-confirm-${order.orderId}`}
                icon={CheckCircleIcon}
                colorPalette={"green"}
                title={"Setujui Pembayaran Manual"}
                description={`Apakah Anda yakin ingin menyetujui pembayaran manual untuk pesanan "${order.orderNumber || order.orderId}" (Mitra: ${order.mitraName}, NTPN: ${order.ntpn || "-"})? Tindakan ini akan mengonfirmasi status menjadi 'paid' dan memicu otomatis pemotongan data spasial GeoServer.`}
                confirmLabel={"Setujui Pembayaran"}
                onConfirm={() => {
                  approveManualPaymentMutation.mutate(order.orderId, {
                    onSuccess: () => {
                      provisionOrderMutation.mutate({ orderId: order.orderId });
                      close();
                    },
                  });
                }}
              >
                <Button
                  primary={true}
                  colorPalette={"green"}
                  loading={
                    approveManualPaymentMutation.isPending ||
                    provisionOrderMutation.isPending
                  }
                >
                  <AppIcon icon={CheckCircleIcon} />
                  {"Setujui Pembayaran"}
                </Button>
              </ConfirmationTrigger>
            </>
          )}

          {isPendingReview && (
            <Button
              primary={true}
              colorPalette={"blue"}
              onClick={() => {
                close();
                void navigate({
                  to: "/internal/order-review/$orderId",
                  params: { orderId: order.orderId },
                });
              }}
            >
              <AppIcon icon={LayersIcon} />
              {"Buka Peta & Data IGT"}
            </Button>
          )}
        </HStack>
      </Modal.Footer>
    </Modal.Content>
  );
};
