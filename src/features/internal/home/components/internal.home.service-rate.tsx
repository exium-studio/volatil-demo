// src/features/internal/home/components/internal.home.service-rate.tsx

import { IconButton } from "@/design-system/components/button/ui/button";
import { StatGrid } from "@/design-system/components/data-display/ui/stat-grid";
import { Skeleton } from "@/design-system/components/feedback/ui/skeleton";
import { AppIcon } from "@/design-system/components/icon/ui/app-icon";
import { InfoTip } from "@/design-system/components/input/ui/toggle-tip";
import { Circle } from "@/design-system/components/layout/ui/box";
import {
  Container,
  useContainerContext,
} from "@/design-system/components/layout/ui/container";
import { HStack, VStack } from "@/design-system/components/layout/ui/flex-box";
import { Separator } from "@/design-system/components/layout/ui/separator";
import { Heading } from "@/design-system/components/typography/ui/heading";
import { P } from "@/design-system/components/typography/ui/p";
import type { InternalHomeServiceRateProps } from "@/features/internal/home/types/internal.home.service-rate.type";
import { InternalSystemPolicyModalTrigger } from "@/features/internal/system-policies/components/internal.system-policies.modal";
import { usePricingPolicy } from "@/features/mitra/data-request/hooks/use-pricing-policy";
import type { SystemPolicyItem } from "@/features/mitra/data-request/types/mitra.data-request.pricing-policy.type";
import {
  ClockIcon,
  CoinsIcon,
  CreditCardIcon,
  HourglassIcon,
  LayersIcon,
  MapPinIcon,
  PencilIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
} from "lucide-react";
import { useMemo } from "react";

export const InternalHomeServiceRate = (
  props: InternalHomeServiceRateProps,
) => {
  return (
    <Container.Root flex={"1 1 350px"} withContext={true} {...props}>
      <InternalHomeServiceRateContent />
    </Container.Root>
  );
};

const InternalHomeServiceRateContent = () => {
  // Contexts
  const { isSmContainer } = useContainerContext();

  // Queries / Data — Unified endpoint GET /api/mitra/data-request/policies
  const { pricing, order, isLoading } = usePricingPolicy();

  // Derived Values - Category 1: Pricing & PNBP Items
  const pricingItems = useMemo<SystemPolicyItem[]>(() => {
    const list: SystemPolicyItem[] = [];
    if (!pricing) return list;

    // 1. Kode Akun PNBP SIMPONI
    list.push({
      key: "pnbp_code",
      value: pricing.pnbpCode ?? "425121",
      valueType: "string",
      label: "Kode Akun PNBP SIMPONI",
      description: "Kode akun setoran resmi SIMPONI untuk transaksi data spasial ATR/BPN.",
    });

    // 2. Fallback Timeout Pembayaran
    list.push({
      key: "payment_timeout_fallback_hours",
      value: String(pricing.paymentTimeoutFallbackHours ?? 24),
      valueType: "number",
      label: "Timeout Pembayaran SIMPONI",
      unit: "jam",
      description: "Batas waktu kedaluwarsa kode billing pembayaran jika SIMPONI tidak mengembalikan tanggal jatuh tempo.",
    });

    // 3. Global Limits / Rates
    if (pricing.globalLimits) {
      list.push(
        {
          key: "price_per_bidang",
          value: String(pricing.globalLimits.pricePerBidang ?? 7500),
          valueType: "number",
          label: "Tarif Dasar per Bidang",
          unit: "IDR",
          description: "Tarif dasar PNBP ATR/BPN per objek bidang tanah.",
        },
        {
          key: "price_per_kawasan_ha",
          value: String(pricing.globalLimits.pricePerKawasanHa ?? 20000),
          valueType: "number",
          label: "Tarif Dasar per Hektar Kawasan",
          unit: "IDR",
          description: "Tarif dasar PNBP per hektar area kawasan.",
        },
        {
          key: "minimum_bidang_count",
          value: String(pricing.globalLimits.minimumBidangCount ?? 1000),
          valueType: "number",
          label: "Minimal Pembelian Bidang",
          unit: "Bidang",
          description: "Batas minimum jumlah objek bidang tanah per permohonan data.",
        },
        {
          key: "minimum_kawasan_ha",
          value: String(pricing.globalLimits.minimumKawasanHa ?? 1000),
          valueType: "number",
          label: "Minimal Luas Kawasan",
          unit: "Ha",
          description: "Batas minimum luas kawasan dalam hektar per permohonan data.",
        },
      );
    }

    // 4. Per Layer / Specific Master Items (if any overrides exist)
    if (pricing.items && pricing.items.length > 0) {
      pricing.items.forEach((p) => {
        // If it's a specific layer override
        if (p.layerId || p.layerTitle) {
          list.push({
            key: `price_layer_${p.id}`,
            value: String(p.unitPrice),
            valueType: "number",
            label: `Tarif: ${p.layerTitle ?? p.id}`,
            unit: "IDR",
            description: p.description
              ? `${p.description} (Min: ${p.minPurchase} ${p.minUnit})`
              : `Kode PNBP: ${p.kodePnbp ?? "-"}`,
          });
        }
      });
    }

    return list;
  }, [pricing]);

  // Derived Values - Category 2: Order & Lifecycle Policies
  const orderItems = useMemo<SystemPolicyItem[]>(() => {
    const list: SystemPolicyItem[] = [];
    if (!order) return list;

    list.push(
      {
        key: "order_access_duration_days",
        value: String(order.accessDurationDays ?? 365),
        valueType: "number",
        label: "Durasi Masa Aktif Akses Data",
        unit: "hari",
        description: "Durasi masa aktif akses data terbayar pada workspace mitra (default 365 hari).",
      },
      {
        key: "order_max_extension_count",
        value: String(order.maxExtensionCount ?? 1),
        valueType: "number",
        label: "Batas Maksimal Perpanjangan",
        unit: "kali",
        description: "Batas maksimal berapa kali pesanan diperbolehkan diperpanjang (default 1 kali).",
      },
      {
        key: "order_extension_window_days",
        value: String(order.extensionWindowDays ?? 7),
        valueType: "number",
        label: "Jendela Tombol Perpanjang (H-)",
        unit: "hari",
        description: "Rentang waktu sebelum expired saat tombol perpanjang diizinkan muncul (default 7 hari).",
      },
    );

    return list;
  }, [order]);

  if (isLoading) {
    return <Skeleton minH={isSmContainer ? "320px" : "240px"} w={"full"} />;
  }

  return (
    <Container.Body gap={5} pt={"md"}>
      {/* Category 1: Pricing & PNBP Limits */}
      <VStack align={"stretch"} gap={"sm"}>
        <HStack wrap={"wrap"} align={"center"} justify={"space-between"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading size={"md"}>{"1. Kebijakan Tarif & Limit PNBP (Pricing)"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{
                size: "xs",
                color: "fg.subtle",
              }}
            >
              {
                "Konfigurasi harga per objek/kawasan, limit minimal pembelian, kode PNBP SIMPONI, dan timeout pembayaran."
              }
            </InfoTip>
          </HStack>
          <P color={"fg.muted"} fontSize={"xs"}>
            {"Kategori: pricing"}
          </P>
        </HStack>

        <Separator borderColor={"bg.canvas"} />
        <InternalSystemPoliciesStats items={pricingItems} />
      </VStack>

      <Separator borderColor={"border.muted"} />

      {/* Category 2: Order & Lifecycle Policies */}
      <VStack align={"stretch"} gap={"sm"}>
        <HStack wrap={"wrap"} align={"center"} justify={"space-between"} px={"md"}>
          <HStack gap={"xs"} align={"center"}>
            <Heading size={"md"}>{"2. Kebijakan Siklus & Perpanjangan Pesanan (Order)"}</Heading>
            <InfoTip
              variant={"icon"}
              appIconProps={{
                size: "xs",
                color: "fg.subtle",
              }}
            >
              {
                "Aturan masa aktif akses data terbayar, batas perpanjangan pesanan, dan rentang jendela perpanjangan H-7."
              }
            </InfoTip>
          </HStack>
          <P color={"fg.muted"} fontSize={"xs"}>
            {"Kategori: order"}
          </P>
        </HStack>

        <Separator borderColor={"bg.canvas"} />
        <InternalSystemPoliciesStats items={orderItems} />
      </VStack>
    </Container.Body>
  );
};

const InternalSystemPoliciesStats = (props: {
  items: SystemPolicyItem[];
}) => {
  const { items } = props;
  const { isSmContainer } = useContainerContext();

  const cols = isSmContainer ? 1 : 2;

  const getPolicyIcon = (key: string) => {
    if (key.includes("pnbp_code")) return CreditCardIcon;
    if (key.includes("bidang") && key.includes("price")) return MapPinIcon;
    if (key.includes("kawasan") && key.includes("price")) return LayersIcon;
    if (key.includes("minimum") || key.includes("min")) return CoinsIcon;
    if (key.includes("timeout")) return HourglassIcon;
    if (key.includes("duration") || key.includes("access")) return ClockIcon;
    if (key.includes("extension_count") || key.includes("max_extension")) return RefreshCwIcon;
    if (key.includes("extension_window") || key.includes("window")) return ShieldAlertIcon;
    return ClockIcon;
  };

  const getPolicyColor = (key: string) => {
    if (key.includes("pnbp_code")) return "emerald";
    if (key.includes("bidang") && key.includes("price")) return "teal";
    if (key.includes("kawasan") && key.includes("price")) return "purple";
    if (key.includes("minimum") || key.includes("min")) return "orange";
    if (key.includes("timeout")) return "amber";
    if (key.includes("duration") || key.includes("access")) return "blue";
    if (key.includes("extension_count") || key.includes("max_extension")) return "cyan";
    if (key.includes("extension_window") || key.includes("window")) return "red";
    return "blue";
  };

  return (
    <StatGrid.Root columns={cols}>
      {items.map((policy, index) => {
        const IconComp = getPolicyIcon(policy.key);
        const colorPalette = getPolicyColor(policy.key);
        const isCurrency =
          policy.unit === "IDR" || policy.unit === "Rupiah";
        const formattedValue =
          policy.valueType === "number" && !Number.isNaN(Number(policy.value))
            ? isCurrency
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(Number(policy.value))
              : `${new Intl.NumberFormat("id-ID").format(Number(policy.value))} ${policy.unit ?? ""}`
            : `${policy.value} ${policy.unit ?? ""}`;

        return (
          <StatGrid.Item key={policy.key} index={index} columns={cols}>
            <StatGrid.Header>
              <HStack gap={"2xs"} align={"center"}>
                <Circle bg={`${colorPalette}.subtle`} p={"2xs"}>
                  <AppIcon icon={IconComp} size={"xs"} color={`${colorPalette}.fg`} />
                </Circle>

                <StatGrid.Label>{policy.label ?? policy.key}</StatGrid.Label>
              </HStack>

              <InternalSystemPolicyModalTrigger policy={policy}>
                <IconButton
                  variant={"ghost"}
                  aria-label={`Ubah kebijakan ${policy.label ?? policy.key}`}
                >
                  <AppIcon icon={PencilIcon} />
                </IconButton>
              </InternalSystemPolicyModalTrigger>
            </StatGrid.Header>

            <StatGrid.Value value={formattedValue} />

            {policy.description && (
              <StatGrid.Description>
                {policy.description}
              </StatGrid.Description>
            )}
          </StatGrid.Item>
        );
      })}
    </StatGrid.Root>
  );
};

