// src/features/internal/home/services/internal.home.policies.service.ts

import { fetchInternalHomePoliciesApi } from "@/features/internal/home/api/internal.home.policies.api";
import type { InternalHomePolicyItem } from "@/features/internal/home/types/internal.home.policies.type";
import { ApiError } from "@/shared/libs/api-client/api-error";
import { isDummyDataEnabled } from "@/shared/utils/env/env.utils";

const DUMMY_POLICIES: InternalHomePolicyItem[] = [
  {
    key: "order_access_duration_days",
    value: 365,
    valueType: "number",
    label: "Durasi Masa Aktif Pesanan / Layanan",
    description:
      "Durasi masa aktif masa pakai layanan spasial setelah pesanan lunas terbayar.",
    unit: "hari",
  },
  {
    key: "order_extension_window_days",
    value: 7,
    valueType: "number",
    label: "Jendela Waktu Aksi Perpanjangan",
    description:
      "Rentang waktu H-7 hari sebelum masa aktif pesanan habis di mana tombol perpanjang aktif.",
    unit: "hari",
  },
  {
    key: "order_max_extension_count",
    value: 1,
    valueType: "number",
    label: "Maksimal Perpanjangan Masa Pesanan",
    description:
      "Batas maksimal berapa kali pesanan dapat diperpanjang oleh mitra.",
    unit: "kali",
  },
  {
    key: "payment_timeout_fallback_hours",
    value: 24,
    valueType: "number",
    label: "Fallback Timeout Pembayaran",
    description:
      "Masa berlaku kode billing jika pihak SIMPONI tidak mengembalikan tanggal kedaluwarsa secara otomatis.",
    unit: "jam",
  },
];

export const getInternalHomePolicies = async (
  signal?: AbortSignal,
): Promise<InternalHomePolicyItem[]> => {
  try {
    const raw = await fetchInternalHomePoliciesApi(signal);

    if (raw && "data" in raw && Array.isArray(raw.data)) {
      return raw.data;
    }

    if (Array.isArray(raw)) {
      return raw;
    }

    return isDummyDataEnabled() ? DUMMY_POLICIES : [];
  } catch (error) {
    if ((error as { name?: string }).name === "AbortError") throw error;
    if (
      isDummyDataEnabled() &&
      error instanceof ApiError &&
      error.statusCode === 404
    ) {
      return DUMMY_POLICIES;
    }
    return isDummyDataEnabled() ? DUMMY_POLICIES : [];
  }
};
