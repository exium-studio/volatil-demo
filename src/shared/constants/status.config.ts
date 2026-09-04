// src/shared/constants/status.config.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import type {
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
} from "lucide-react";

/**
 * SSOT 1: Transaction Status Map (Payment & Billing)
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
    colorPalette: "blue",
    icon: CheckCircle2Icon,
  },
  processing: {
    label: "Sedang Diproses",
    colorPalette: "purple",
    icon: LoaderIcon,
  },
  settled: {
    label: "Selesai",
    colorPalette: "green",
    icon: CheckCircle2Icon,
  },
  expired: {
    label: "Kedaluwarsa",
    colorPalette: "red",
    icon: AlertCircleIcon,
  },
  failed: {
    label: "Gagal",
    colorPalette: "red",
    icon: AlertCircleIcon,
  },
};

export const TRANSACTION_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "" },
  { label: "Selesai (Lunas)", value: "settled" },
  { label: "Menunggu Pembayaran", value: "pending" },
  { label: "Kedaluwarsa", value: "expired" },
  { label: "Gagal", value: "failed" },
];

/**
 * SSOT 2: Order & Provisioning Status Map (Cart Batch & Spatial Data Services)
 */
export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusConfig> = {
  pending_payment: {
    label: "Menunggu Pembayaran",
    colorPalette: "orange",
    icon: CheckCircle2Icon,
    iconColor: "orange.fg",
  },
  paid: {
    label: "Terbayar",
    colorPalette: "blue",
    icon: CheckCircle2Icon,
    iconColor: "green.fg",
  },
  processing: {
    label: "Menyiapkan Layanan WMS",
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
  approved: {
    label: "Disetujui Admin",
    colorPalette: "green",
    icon: CheckCircle2Icon,
    iconColor: "green.fg",
  },
  rejected: {
    label: "Ditolak",
    colorPalette: "red",
    icon: AlertCircleIcon,
    iconColor: "red.fg",
  },
  expired: {
    label: "Kedaluwarsa",
    colorPalette: "neutral",
    icon: AlertCircleIcon,
    iconColor: "fg",
  },
  queued: {
    label: "Dalam Antrean",
    colorPalette: "gray",
    icon: ClockIcon,
  },
  provisioning: {
    label: "Menyiapkan Data",
    colorPalette: "blue",
    icon: LoaderIcon,
  },
  ready: {
    label: "Siap Digunakan",
    colorPalette: "green",
    icon: CheckCircle2Icon,
  },
  revoked: {
    label: "Dicabut",
    colorPalette: "red",
    icon: AlertCircleIcon,
  },
  failed: {
    label: "Gagal",
    colorPalette: "red",
    icon: AlertCircleIcon,
  },
};
