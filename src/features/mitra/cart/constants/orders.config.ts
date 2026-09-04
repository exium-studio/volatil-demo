// src/features/mitra/cart/constants/orders.config.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import type {
  PaymentMethod,
  SelectionType,
  SelectionTypeConfig,
  SpatialBasisType,
  SpatialBasisTypeConfig,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import type {
  MyDataStatus,
  MyDataStatusConfig,
  OrderStatus,
  OrderStatusConfig,
  TransactionStatus,
  TransactionStatusConfig,
} from "@/shared/types/status.type";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  LoaderIcon,
  RotateCcwIcon,
  ShieldAlertIcon,
  Layers2Icon,
  Grid2X2Icon,
} from "lucide-react";

/**
 * SSOT 1: Selection & Spatial Basis Config Maps
 */

export const SELECTION_TYPE_CONFIG_MAP: Record<
  SelectionType,
  SelectionTypeConfig
> = {
  catalog: {
    label: "Katalog",
    variant: "subtle",
    colorPalette: "gray",
  },
  upload_aoi: {
    label: "Upload AOI",
    variant: "subtle",
    colorPalette: "orange",
  },
  draw_aoi: {
    label: "Draw AOI",
    variant: "subtle",
    colorPalette: "blue",
  },
};

export const SPATIAL_BASIS_CONFIG_MAP: Record<
  SpatialBasisType,
  SpatialBasisTypeConfig
> = {
  bidang: {
    label: "Bidang",
    colorPalette: "blue",
    icon: Layers2Icon,
  },
  kawasan: {
    label: "Kawasan",
    colorPalette: "orange",
    icon: Grid2X2Icon,
  },
};

export const PAYMENT_METHOD_LABEL_MAP: Record<PaymentMethod, string> = {
  MPN_GEN2: "MPN Gen 2 (Simponi / BPN)",
  VA_MANDIRI: "Virtual Account Mandiri",
  VA_BRI: "Virtual Account BRI",
  VA_BCA: "Virtual Account BCA",
  QRIS: "QRIS",
};

/**
 * SSOT 2: Transaction Status Map (Payment & Billing)
 */
export const TRANSACTION_STATUS_MAP: Record<
  TransactionStatus,
  TransactionStatusConfig
> = {
  pending: {
    label: "Menunggu Pembayaran",
    colorPalette: "orange",
    icon: ClockIcon,
  },
  paid: {
    label: "Terbayar",
    colorPalette: "green",
    icon: CheckCircle2Icon,
  },
  expired: {
    label: "Kedaluwarsa",
    colorPalette: "gray",
    icon: ClockIcon,
  },
  failed: {
    label: "Gagal",
    colorPalette: "red",
    icon: AlertCircleIcon,
  },
  refunded: {
    label: "Dikembalikan",
    colorPalette: "purple",
    icon: RotateCcwIcon,
  },
};

export const TRANSACTION_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "" },
  { label: "Terbayar", value: "paid" },
  { label: "Kedaluwarsa", value: "expired" },
  { label: "Gagal", value: "failed" },
  { label: "Dikembalikan", value: "refunded" },
];

/**
 * SSOT 3: Order & Provisioning Status Map (Single Order Table & Spatial Services)
 */
export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusConfig> = {
  pending_payment: {
    label: "Menunggu Pembayaran",
    colorPalette: "orange",
    icon: ClockIcon,
    iconColor: "orange.fg",
  },
  paid: {
    label: "Terbayar",
    colorPalette: "blue",
    icon: CheckCircle2Icon,
    iconColor: "blue.fg",
  },
  processing: {
    label: "Sedang Diproses",
    colorPalette: "purple",
    icon: LoaderIcon,
    iconColor: "purple.fg",
  },
  pending_review: {
    label: "Menunggu Validasi Admin",
    colorPalette: "orange",
    icon: LoaderIcon,
    iconColor: "orange.fg",
  },
  rejected: {
    label: "Ditolak",
    colorPalette: "red",
    icon: AlertCircleIcon,
    iconColor: "red.fg",
  },
  ready: {
    label: "Siap Digunakan",
    colorPalette: "green",
    icon: CheckCircle2Icon,
    iconColor: "green.fg",
  },
};

/**
 * SSOT 4: My Data Active Status Map (Mitra Data Saya)
 */
export const MY_DATA_STATUS_MAP: Record<MyDataStatus, MyDataStatusConfig> = {
  queued: {
    label: "Dalam Antrean",
    colorPalette: "gray",
    icon: ClockIcon,
    iconColor: "gray.fg",
  },
  provisioning: {
    label: "Sedang Diproses",
    colorPalette: "purple",
    icon: LoaderIcon,
    iconColor: "purple.fg",
  },
  ready: {
    label: "Aktif",
    colorPalette: "green",
    icon: CheckCircle2Icon,
    iconColor: "green.fg",
  },
  failed: {
    label: "Gagal",
    colorPalette: "red",
    icon: AlertCircleIcon,
    iconColor: "red.fg",
  },
  expired: {
    label: "Kedaluwarsa",
    colorPalette: "orange",
    icon: ClockIcon,
    iconColor: "orange.fg",
  },
  revoked: {
    label: "Dicabut",
    colorPalette: "red",
    icon: ShieldAlertIcon,
    iconColor: "red.fg",
  },
};

export const MY_DATA_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "" },
  { label: "Aktif", value: "ready" },
  { label: "Dalam Antrean", value: "queued" },
  { label: "Sedang Diproses", value: "provisioning" },
  { label: "Gagal", value: "failed" },
  { label: "Kedaluwarsa", value: "expired" },
  { label: "Dicabut", value: "revoked" },
];

/** @deprecated alias for backward compatibility */
export const MY_DATA_ORDER_STATUS_OPTIONS = MY_DATA_STATUS_OPTIONS;
