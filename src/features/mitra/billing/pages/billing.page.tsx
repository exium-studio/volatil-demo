// src/features/mitra/billing/pages/billing.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";
import { Alert } from "@/design-system/components/feedback/ui/alert";
import { FocusAlertItem } from "@/design-system/components/focus-alert/ui/focus-alert";
import { focusAlert } from "@/design-system/components/focus-alert/utils/focus-alert";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { AppContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Badge } from "@/design-system/components/typography/ui/badge";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { List } from "@/design-system/components/typography/ui/list";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { BillingRoute } from "@/shared/libs/tanstack-router/routes";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  ClockIcon,
  CreditCardIcon,
  FileCheck2Icon,
  InfoIcon,
  RefreshCwIcon,
  UploadCloudIcon,
} from "lucide-react";
import { useCallback, useEffect } from "react";

import { usePublicSimponiStatusQuery } from "@/features/mitra/billing/hooks/use-simponi-status.query";
import { ManualPaymentProofTrigger } from "@/features/mitra/billing/components/manual-payment-proof-modal";
import {
  useCartOrderDetailQuery,
  useCheckOrderPaymentStatus,
} from "@/features/mitra/cart/hooks/use-mitra-cart";

export const BillingPage = () => {
  return (
    <AppContentContainer>
      <BillingPageBillingCode />

      <BillingPagePaymentMethods />
    </AppContentContainer>
  );
};

const BillingPageBillingCode = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const { billingCode } = BillingRoute.useParams();
  const search = BillingRoute.useSearch();
  const navigate = useNavigate();

  // Queries
  const { data: simponiConfig } = usePublicSimponiStatusQuery();
  const targetOrderId = search?.orderId || billingCode;
  const { orderDetail, refetch: refetchOrderDetail } =
    useCartOrderDetailQuery(targetOrderId);

  // Derived Values
  const isRenewal =
    targetOrderId.startsWith("ord-renew-") ||
    targetOrderId.startsWith("renew-");

  const isPendingBillingCode =
    orderDetail?.status === "pending_billing_code" ||
    orderDetail?.orderStatus === "pending_billing_code";

  const isPendingManualVerification =
    orderDetail?.status === "pending_manual_payment_verification" ||
    orderDetail?.orderStatus === "pending_manual_payment_verification";

  const isManualPendingPayment =
    orderDetail?.status === "manual_pending_payment" ||
    orderDetail?.orderStatus === "manual_pending_payment";

  // Mode manual active if SIMPONI integration is disabled, or order is in manual flow
  const isSimponiDisabled = simponiConfig?.isEnabled === false;
  const isManualVerificationMode =
    isSimponiDisabled ||
    isPendingBillingCode ||
    isManualPendingPayment ||
    isPendingManualVerification ||
    Boolean(orderDetail?.isManualPayment);

  // Effective billing code string: only show if not equal to orderId
  const effectiveBillingCode =
    orderDetail?.billingCode ||
    (billingCode && billingCode !== targetOrderId ? billingCode : "");

  // Mutations
  const checkPaymentMutation = useCheckOrderPaymentStatus();

  // Handlers
  const renderPaymentSuccessAlert = useCallback(
    (isRenew: boolean) => {
      focusAlert("payment-success", () => (
        <FocusAlertItem
          variant={"celebrate"}
          title={"Pembayaran Berhasil!"}
          description={
            isRenew
              ? "Pembayaran perpanjangan layanan telah terverifikasi. Masa aktif workspace dan layer interop GeoServer telah berhasil diperpanjang (+1 Tahun) dan berstatus Aktif/Ready."
              : "Pembayaran telah terverifikasi dengan status 'paid'. Pemotongan AOI dan pembuatan service layer WMS/WFS sedang diproses oleh sistem GeoServer internal."
          }
          onDone={() => {
            if (isRenew) {
              void navigate({
                to: "/mitra/my-data",
              });
            } else {
              void navigate({
                to: "/mitra/transaction-history",
              });
            }
          }}
        />
      ));
    },
    [navigate],
  );

  const handleCheckStatus = () => {
    checkPaymentMutation.mutate(targetOrderId, {
      onSuccess: (res) => {
        if (res.transactionStatus === "paid") {
          renderPaymentSuccessAlert(isRenewal);
        } else {
          focusAlert("payment-status-info", () => (
            <FocusAlertItem
              variant={"info"}
              title={`Status Transaksi: ${res.transactionStatus}`}
              description={
                "Pembayaran belum terkonfirmasi settled. Silakan selesaikan pembayaran sebelum batas waktu billing berakhir."
              }
            />
          ));
        }
      },
    });
  };

  // Auto trigger payment-success alert if query param contains activeModalKey=payment-success
  useEffect(() => {
    if (search?.activeModalKey === "payment-success") {
      renderPaymentSuccessAlert(isRenewal);
    }
  }, [search?.activeModalKey, isRenewal, renderPaymentSuccessAlert]);

  return (
    <VStack align={"stretch"} gap={"md"}>
      {/* Alert: Menunggu Penerbitan Kode Billing oleh Internal ATR/BPN */}
      {isPendingBillingCode && (
        <Alert.Root
          status={"warning"}
          colorPalette={"yellow"}
          variant={"subtle"}
        >
          <AppIcon icon={ClockIcon} />
          <Alert.Content>
            <Alert.Title fontWeight={"semibold"}>
              {"Menunggu Penerbitan Kode Billing"}
            </Alert.Title>
            <Alert.Description>
              {
                "Layanan inkuiri otomatis SIMPONI sedang dalam mode manual. Petugas Internal ATR/BPN sedang menerbitkan Kode Billing pembayaran PNBP resmi melalui portal SIMPONI Kemenkeu. Kode billing akan tampil otomatis di sini setelah diterbitkan."
              }
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {/* Alert: Penolakan Bukti Pembayaran Sebelumnya (Mitra dapat mengunggah ulang) */}
      {orderDetail?.rejectionReason && (
        <Alert.Root status={"warning"} colorPalette={"red"} variant={"subtle"}>
          <AppIcon icon={AlertCircleIcon} />
          <Alert.Content>
            <Alert.Title fontWeight={"semibold"}>
              {"Bukti Pembayaran Ditolak Petugas"}
            </Alert.Title>
            <Alert.Description>
              {`Alasan penolakan: "${orderDetail.rejectionReason}". Silakan periksa kembali berkas transfer atau nomor NTPN Anda, lalu unggah ulang bukti pembayaran yang sah.`}
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {/* Status Alert jika bukti bayar sedang diverifikasi petugas */}
      {isPendingManualVerification && (
        <Alert.Root status={"info"} colorPalette={"blue"} variant={"subtle"}>
          <AppIcon icon={ClockIcon} />
          <Alert.Content>
            <Alert.Title fontWeight={"semibold"}>
              {"Menunggu Verifikasi Petugas"}
            </Alert.Title>
            <Alert.Description>
              {
                "Bukti pembayaran telah diterima dan sedang diverifikasi oleh Bendahara/Petugas ATR/BPN."
              }
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {/* Container Billing Code & Actions */}
      <Container.Root>
        <Container.Body>
          <HStack
            wrap={"wrap"}
            align={"center"}
            justify={"space-between"}
            gap={"md"}
            p={"md"}
          >
            <VStack gap={1}>
              <HStack align={"center"} gap={"sm"}>
                <Heading>{"Kode Billing"}</Heading>

                {isPendingBillingCode && (
                  <Badge colorPalette={"yellow"} variant={"subtle"}>
                    <AppIcon icon={ClockIcon} size={"xs"} />
                    {"Menunggu Diterbitkan"}
                  </Badge>
                )}

                {isPendingManualVerification && (
                  <Badge colorPalette={"blue"} variant={"subtle"}>
                    <AppIcon icon={ClockIcon} size={"xs"} />
                    {"Menunggu Verifikasi"}
                  </Badge>
                )}
              </HStack>

              <HStack align={"center"} gap={"sm"}>
                {effectiveBillingCode ? (
                  <>
                    <Heading fontSize={"xl"} color={`${theme.colorPalette}.fg`}>
                      <TNum>{effectiveBillingCode}</TNum>
                    </Heading>

                    <ClipboardButton value={effectiveBillingCode} size={"xs"} />
                  </>
                ) : (
                  <P fontSize={"sm"} color={"fg.muted"} fontStyle={"italic"}>
                    {"Sedang disiapkan oleh Petugas ATR/BPN..."}
                  </P>
                )}
              </HStack>
            </VStack>

            <HStack align={"center"} gap={"sm"} wrap={"wrap"}>
              {/* Tombol Segarkan saat status pending_billing_code */}
              {isPendingBillingCode && (
                <Button
                  variant={"outline"}
                  onClick={() => {
                    void refetchOrderDetail();
                  }}
                >
                  <AppIcon icon={RefreshCwIcon} />
                  {"Segarkan Status"}
                </Button>
              )}

              {/* Jika kode billing sudah ada dan belum upload bukti, tampilkan tombol upload bukti bayar */}
              {isManualVerificationMode &&
                !isPendingBillingCode &&
                !isPendingManualVerification && (
                  <ManualPaymentProofTrigger
                    orderId={targetOrderId}
                    billingCode={effectiveBillingCode}
                    modalKey={`upload-proof-${targetOrderId}`}
                  >
                    <Button colorPalette={"blue"} variant={"outline"}>
                      <AppIcon icon={UploadCloudIcon} />
                      {"Konfirmasi & Unggah Bukti Pembayaran"}
                    </Button>
                  </ManualPaymentProofTrigger>
                )}

              {/* Jika sudah upload bukti, sediakan opsi perbarui bukti bayar */}
              {isManualVerificationMode && isPendingManualVerification && (
                <ManualPaymentProofTrigger
                  orderId={targetOrderId}
                  billingCode={effectiveBillingCode}
                  modalKey={`upload-proof-${targetOrderId}`}
                >
                  <Button colorPalette={"gray"} variant={"outline"}>
                    <AppIcon icon={FileCheck2Icon} />
                    {"Perbarui Bukti Pembayaran"}
                  </Button>
                </ManualPaymentProofTrigger>
              )}

              {/* Cek Status Pembayaran button (untuk SIMPONI otomatis / settled check) */}
              {!isPendingBillingCode && (
                <Button
                  primary={true}
                  loading={checkPaymentMutation.isPending}
                  onClick={handleCheckStatus}
                >
                  <AppIcon icon={CreditCardIcon} />
                  {"Cek status pembayaran"}
                </Button>
              )}
            </HStack>
          </HStack>

          <Box p={"md"}>
            {isManualVerificationMode && !isPendingBillingCode && (
              <Alert.Root
                status={"warning"}
                colorPalette={"orange"}
                variant={"subtle"}
              >
                <AppIcon icon={InfoIcon} />
                <Alert.Content>
                  <Alert.Title fontWeight={"semibold"}>
                    {"Verifikasi Manual Bukti Setor PNBP"}
                  </Alert.Title>

                  <Alert.Description>
                    {
                      "Layanan inkuiri otomatis SIMPONI sedang dalam mode manual. Silakan lakukan pembayaran di bank/teller/ATM menggunakan Kode Billing di bawah, kemudian unggah bukti transfer beserta Nomor Transaksi Penerimaan Negara (NTPN)."
                    }
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}
          </Box>
        </Container.Body>
      </Container.Root>
    </VStack>
  );
};

const BillingPagePaymentMethods = () => {
  const PAYMENT_METHODS_MAP = {
    teller: {
      title: "Teller Bank/Pos",
      content: (
        <P>
          Datang langsung ke bank/pos persepsi, serahkan Kode Billing ke petugas
          teller
        </P>
      ),
    },
    atm: {
      title: "ATM",
      content: (
        <List.Root as={"ol"}>
          <List.Item>1. Pilih menu Pebayaran</List.Item>
          <List.Item>2. MPN/Pennerimaan Negara/Pajak-PNBP</List.Item>
          <List.Item>3. Masukkan Kode Billing</List.Item>
        </List.Root>
      ),
    },
    mobileInternet: {
      title: "Mobile / Internet Banking",
      content: (
        <List.Root as={"ol"}>
          <List.Item>1. Login m-banking / i-banking</List.Item>
          <List.Item>2. Menu MPN / Penerimaan Negara</List.Item>
          <List.Item>3. Masukkan Kode Billing</List.Item>
        </List.Root>
      ),
    },
    web: {
      title: "Mobile / Internet Banking",
      content: (
        <List.Root as={"ol"}>
          <List.Item>1. Buka mpn.kemenkeu.go.id</List.Item>
          <List.Item>2. input Kode Billing</List.Item>
          <List.Item>3. Bayar via QRIS (khusus nominal ≤ Rp 10 juta)</List.Item>
        </List.Root>
      ),
    },
    edcFintech: {
      title: "EDC / Fintech",
      content: (
        <P>
          Gunakan fasilitas EDC atau dompet elektronik yang meniadi Collecting
          Agent
        </P>
      ),
    },
  } as const;

  const PAYMENT_METHODS_LIST = Object.entries(PAYMENT_METHODS_MAP).map(
    ([methodKey, methodValue]) => ({
      key: methodKey,
      ...methodValue,
    }),
  );

  return (
    <Container.Root>
      <Container.Body>
        <VStack>
          <Box p={"md"}>
            <Heading>Panduan Metode Pembayaran</Heading>
          </Box>

          <Separator borderColor={"bg.canvas"} />

          <Accordion.Root multiple>
            {PAYMENT_METHODS_LIST.map((method) => {
              return (
                <Accordion.Item
                  key={method.key}
                  value={method.key}
                  px={"md"}
                  py={2}
                >
                  <Accordion.ItemTrigger>
                    <P flex={1}>{method.title}</P>

                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>

                  <Accordion.ItemContent color={"fg.subtle"}>
                    {method.content}
                  </Accordion.ItemContent>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </VStack>
      </Container.Body>
    </Container.Root>
  );
};
