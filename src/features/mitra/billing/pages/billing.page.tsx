// src/features/mitra/billing/pages/billing.page.tsx

import { Button } from "@/design-system/components/button/ui/button";
import { ClipboardButton } from "@/design-system/components/data-display/ui/clipboard-button";
import { Accordion } from "@/design-system/components/disclosure/ui/accordion";
import { FocusAlertItem } from "@/design-system/components/focus-alert/ui/focus-alert";
import { focusAlert } from "@/design-system/components/focus-alert/utils/focus-alert";
import { Box } from "@/design-system/components/layout/ui/box";
import { Container } from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { PanelContentContainer } from "@/design-system/components/layout/ui/page-container";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { List } from "@/design-system/components/typography/ui/list";
import { P, TNum } from "@/design-system/components/typography/ui/p";
import { useThemeStore } from "@/design-system/stores/theme-store";
import { BillingRoute } from "@/shared/libs/tanstack-router/routes";
import { useNavigate } from "@tanstack/react-router";

import { useCheckOrderPaymentStatus } from "@/features/mitra/cart/hooks/use-mitra-cart";

export const BillingPage = () => {
  return (
    <PanelContentContainer>
      <BillingPageBillingCode />

      <BillingPagePaymentMethods />
    </PanelContentContainer>
  );
};

const BillingPageBillingCode = () => {
  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const { billingCode } = BillingRoute.useParams();
  const search = BillingRoute.useSearch();
  const navigate = useNavigate();

  // Mutations
  const checkPaymentMutation = useCheckOrderPaymentStatus();

  // Handlers
  const handleCheckStatus = () => {
    // Check order payment status via GET /api/mitra/orders/:orderId/status
    const targetOrderId = search?.orderId || billingCode;
    checkPaymentMutation.mutate(targetOrderId, {
      onSuccess: (res) => {
        if (
          res.transactionStatus === "settled" ||
          res.transactionStatus === "paid"
        ) {
          focusAlert("payment-success", () => (
            <FocusAlertItem
              variant={"celebrate"}
              title={"Pembayaran Berhasil!"}
              description={
                "Pembayaran telah terverifikasi dengan status 'settled'. Pemotongan AOI dan pembuatan service layer WMS/WFS sedang diproses oleh sistem GeoServer internal."
              }
              onDone={() => {
                void navigate({
                  to: "/mitra/transaction-history",
                  from: "/",
                });
              }}
            />
          ));
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

  return (
    <Container.Root>
      <Container.Body>
        <HStack
          align={"center"}
          justify={"space-between"}
          gap={"md"}
          p={"md"}
        >
          <VStack gap={1}>
            <Heading>Kode Billing </Heading>

            <HStack align={"center"} gap={"sm"}>
              <Heading color={`${theme.colorPalette}.fg`}>
                <TNum>{billingCode}</TNum>
              </Heading>

              <ClipboardButton value={billingCode} size={"xs"} />
            </HStack>
          </VStack>

          <Button
            primary
            loading={checkPaymentMutation.isPending}
            onClick={handleCheckStatus}
          >
            Cek status pembayaran
          </Button>
        </HStack>
      </Container.Body>
    </Container.Root>
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
