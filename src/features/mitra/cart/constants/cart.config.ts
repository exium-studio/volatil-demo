// src/features/mitra/cart/constants/cart.config.ts

import type {
  CartBatchStatus,
  CartBatchStatusConfig,
  PaymentMethod,
  SelectionType,
  SelectionTypeConfig,
  SpatialBasisType,
  SpatialBasisTypeConfig,
} from "@/features/mitra/cart/types/mitra.cart.batch.type";
import { AlertCircleIcon, CheckCircle2Icon, LoaderIcon } from "lucide-react";

/**
 * SSOT Configuration Maps for Cart, Orders & Transactions
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
  },
  kawasan: {
    label: "Kawasan",
    colorPalette: "orange",
  },
};

export const CART_BATCH_STATUS_CONFIG_MAP: Record<
  CartBatchStatus,
  CartBatchStatusConfig
> = {
  approved: {
    label: "Disetujui (Siap Bayar)",
    colorPalette: "green",
    icon: CheckCircle2Icon,
    iconColor: "green.fg",
  },
  ready: {
    label: "Disetujui (Siap Bayar)",
    colorPalette: "green",
    icon: CheckCircle2Icon,
    iconColor: "green.fg",
  },
  preparing: {
    label: "Menyiapkan data",
    colorPalette: "blue",
    icon: LoaderIcon,
    iconColor: "blue.fg",
  },
  pending_review: {
    label: "Menunggu review",
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
  expired: {
    label: "Kadaluwarsa",
    colorPalette: "red",
    icon: AlertCircleIcon,
    iconColor: "red.fg",
  },
};

export const PAYMENT_METHOD_LABEL_MAP: Record<PaymentMethod, string> = {
  MPN_GEN2: "MPN Gen 2 (Simponi / BPN)",
  VA_MANDIRI: "Virtual Account Mandiri",
  VA_BRI: "Virtual Account BRI",
  VA_BCA: "Virtual Account BCA",
  QRIS: "QRIS",
};
