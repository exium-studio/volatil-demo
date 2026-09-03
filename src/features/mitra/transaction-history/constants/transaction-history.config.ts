// src/features/mitra/transaction-history/constants/transaction-history.config.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import type {
  OrderProvisionStatus,
  TransactionStatus,
} from "@/features/mitra/transaction-history/types/transaction-history.type";

export const TRANSACTION_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "" },
  { label: "Selesai (Lunas)", value: "settled" },
  { label: "Menunggu Pembayaran", value: "pending" },
  { label: "Kedaluwarsa", value: "expired" },
  { label: "Gagal", value: "failed" },
];

export const TRANSACTION_STATUS_BADGE_MAP: Record<
  TransactionStatus,
  { label: string; colorPalette: "green" | "orange" | "red" | "blue" }
> = {
  settled: { label: "Selesai", colorPalette: "green" },
  paid: { label: "Terbayar", colorPalette: "blue" },
  pending: { label: "Menunggu", colorPalette: "orange" },
  expired: { label: "Kedaluwarsa", colorPalette: "red" },
  failed: { label: "Gagal", colorPalette: "red" },
};

export const ORDER_PROVISION_STATUS_MAP: Record<
  OrderProvisionStatus,
  { label: string; colorPalette: "green" | "blue" | "red" | "gray" }
> = {
  ready: { label: "Siap Digunakan", colorPalette: "green" },
  provisioning: { label: "Menyiapkan Data", colorPalette: "blue" },
  queued: { label: "Dalam Antrean", colorPalette: "gray" },
  expired: { label: "Akses Berakhir", colorPalette: "red" },
  revoked: { label: "Dicabut", colorPalette: "red" },
  failed: { label: "Gagal", colorPalette: "red" },
};
