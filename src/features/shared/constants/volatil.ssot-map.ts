// src/features/shared/constants/volatil.ssot-map.ts

import type { FocusSelectOption } from "@/design-system/components/input/types/focus-select.type";
import type {
  PaymentMethod,
  PaymentMethodConfig,
  SelectionType,
  SelectionTypeConfig,
  IgtBasisType,
  IgtBasisTypeConfig,
} from "@/features/mitra/cart/types/mitra.cart.order.type";
import type {
  MitraRegistrationStatus,
  MitraRegistrationStatusConfig,
  MyDataStatus,
  MyDataStatusConfig,
  OrderStatus,
  OrderStatusConfig,
  TransactionStatus,
  TransactionStatusConfig,
  UserRoleConfig,
} from "@/shared/types/status.type";
import { IconPolygon } from "@tabler/icons-react";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  FolderArchiveIcon,
  Grid2X2Icon,
  HandshakeIcon,
  LandmarkIcon,
  Layers2Icon,
  ListIcon,
  LoaderIcon,
  QrCodeIcon,
  RotateCcwIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  TimerOffIcon,
  XCircleIcon,
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
    colorPalette: "purple",
    icon: ListIcon,
  },
  upload_aoi: {
    label: "Upload AOI",
    variant: "subtle",
    colorPalette: "orange",
    icon: FolderArchiveIcon,
  },
  draw_aoi: {
    label: "Draw AOI",
    variant: "subtle",
    colorPalette: "blue",
    icon: IconPolygon,
  },
};

/**
 * SSOT for MapLibre AOI & Coverage polygon layer colors by SelectionType:
 * - catalog: Purple (#a855f7 / #7c3aed)
 * - upload_aoi: Orange (#f97316 / #ea580c)
 * - draw_aoi: Blue (#3b82f6 / #2563eb)
 */
export const SELECTION_TYPE_MAP_COLOR: Record<
  SelectionType,
  {
    fill: string;
    line: string;
  }
> = {
  catalog: {
    fill: "#a855f7",
    line: "#7c3aed",
  },
  upload_aoi: {
    fill: "#f97316",
    line: "#ea580c",
  },
  draw_aoi: {
    fill: "#3b82f6",
    line: "#2563eb",
  },
};

/**
 * Returns the fill and line colors for MapLibre AOI & Coverage polygon layers based on selectionType.
 */
export const getSelectionTypeMapColors = (
  selectionType?: string | null,
): {
  fill: string;
  line: string;
  fillColor: string;
  lineColor: string;
} => {
  const normalized = (selectionType ?? "catalog") as SelectionType;
  const color =
    SELECTION_TYPE_MAP_COLOR[normalized] ?? SELECTION_TYPE_MAP_COLOR.catalog;
  return {
    fill: color.fill,
    line: color.line,
    fillColor: color.fill,
    lineColor: color.line,
  };
};

export const IGT_BASIS_MAP: Record<IgtBasisType, IgtBasisTypeConfig> = {
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

export const IGT_BASIS_OPTIONS: {
  value: IgtBasisType;
  label: string;
  colorPalette: "blue" | "orange";
  icon: typeof Layers2Icon;
}[] = [
  {
    value: "bidang",
    label: IGT_BASIS_MAP.bidang.label,
    colorPalette: IGT_BASIS_MAP.bidang.colorPalette,
    icon: IGT_BASIS_MAP.bidang.icon,
  },
  {
    value: "kawasan",
    label: IGT_BASIS_MAP.kawasan.label,
    colorPalette: IGT_BASIS_MAP.kawasan.colorPalette,
    icon: IGT_BASIS_MAP.kawasan.icon,
  },
];

export const PAYMENT_METHOD_MAP: Record<PaymentMethod, PaymentMethodConfig> = {
  MPN_GEN2: {
    label: "MPN Gen 2 (Simponi / BPN)",
    colorPalette: "blue",
    icon: LandmarkIcon,
  },
  VA_MANDIRI: {
    label: "Virtual Account Mandiri",
    colorPalette: "blue",
    icon: CreditCardIcon,
  },
  VA_BRI: {
    label: "Virtual Account BRI",
    colorPalette: "blue",
    icon: CreditCardIcon,
  },
  VA_BCA: {
    label: "Virtual Account BCA",
    colorPalette: "blue",
    icon: CreditCardIcon,
  },
  QRIS: {
    label: "QRIS",
    colorPalette: "teal",
    icon: QrCodeIcon,
  },
};

export const PAYMENT_METHOD_LABEL_MAP: Record<PaymentMethod, string> = {
  MPN_GEN2: PAYMENT_METHOD_MAP.MPN_GEN2.label,
  VA_MANDIRI: PAYMENT_METHOD_MAP.VA_MANDIRI.label,
  VA_BRI: PAYMENT_METHOD_MAP.VA_BRI.label,
  VA_BCA: PAYMENT_METHOD_MAP.VA_BCA.label,
  QRIS: PAYMENT_METHOD_MAP.QRIS.label,
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
    icon: CheckCircleIcon,
  },
  expired: {
    label: "Kedaluwarsa",
    colorPalette: "gray",
    icon: TimerOffIcon,
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
  requesting: {
    label: "Menyiapkan Data IGT",
    colorPalette: "blue",
    icon: LoaderIcon,
    iconColor: "blue.fg",
    noticeDescription:
      "Sedang mengkalkulasi clipping, luas kawasan & estimasi harga di server...",
  },
  preparing: {
    label: "Penyiapkan Pesanan",
    colorPalette: "gray",
    icon: LoaderIcon,
    iconColor: "gray.fg",
    noticeDescription: "Sedang menyiapkan pesanan...",
  },
  pending_payment: {
    label: "Menunggu Pembayaran",
    colorPalette: "orange",
    icon: ClockIcon,
    iconColor: "orange.fg",
  },
  paid: {
    label: "Terbayar",
    colorPalette: "blue",
    icon: CheckCircleIcon,
    iconColor: "blue.fg",
    noticeDescription: "Pesanan telah berhasil dibayar.",
  },
  processing: {
    label: "Menyiapkan Layanan WMS",
    colorPalette: "purple",
    icon: LoaderIcon,
    iconColor: "purple.fg",
    noticeDescription: "Layanan WMS sedang dipersiapkan...",
  },
  pending_review: {
    label: "Menunggu Validasi Admin",
    colorPalette: "orange",
    icon: LoaderIcon,
    iconColor: "orange.fg",
    noticeDescription: "Menunggu validasi Admin Internal...",
  },
  rejected: {
    label: "Ditolak",
    colorPalette: "red",
    icon: AlertCircleIcon,
    iconColor: "red.fg",
    noticeDescription: "Pesanan ditolak oleh Admin Internal.",
  },
  ready: {
    label: "Siap Digunakan",
    colorPalette: "green",
    icon: CheckCircleIcon,
    iconColor: "green.fg",
    noticeDescription: "Layanan data spasial siap digunakan.",
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
    label: "Menyiapkan Layanan WMS",
    colorPalette: "purple",
    icon: LoaderIcon,
    iconColor: "purple.fg",
  },
  active: {
    label: "Aktif",
    colorPalette: "green",
    icon: CheckCircleIcon,
    iconColor: "green.fg",
  },
  ready: {
    label: "Aktif",
    colorPalette: "green",
    icon: CheckCircleIcon,
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
    icon: TimerOffIcon,
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

/**
 * SSOT 5: User Role Map
 */
export const USER_ROLE_MAP: Record<"internal" | "mitra", UserRoleConfig> = {
  internal: {
    label: "Internal",
    colorPalette: "purple",
    icon: ShieldCheckIcon,
  },
  mitra: {
    label: "Mitra",
    colorPalette: "blue",
    icon: HandshakeIcon,
  },
};

/**
 * SSOT 6: Mitra Registration Status Map
 */
export const MITRA_REGISTRATION_STATUS_MAP: Record<
  MitraRegistrationStatus,
  MitraRegistrationStatusConfig
> = {
  pending_verification: {
    label: "Menunggu Verifikasi",
    colorPalette: "orange",
    icon: ClockIcon,
  },
  verified: {
    label: "Terverifikasi",
    colorPalette: "green",
    icon: CheckCircleIcon,
  },
  approved: {
    label: "Disetujui",
    colorPalette: "green",
    icon: CheckCircleIcon,
  },
  rejected: {
    label: "Ditolak",
    colorPalette: "red",
    icon: XCircleIcon,
  },
};

export const MITRA_REGISTRATION_STATUS_OPTIONS: FocusSelectOption[] = [
  { label: "Semua Status", value: "all" },
  { label: "Menunggu Verifikasi", value: "pending_verification" },
  { label: "Terverifikasi", value: "verified" },
  { label: "Ditolak", value: "rejected" },
];
