// src/features/internal/mitra-registration/services/mitra-registration.service.ts

import {
  approveMitraRegistrationApi,
  fetchMitraRegistrationDetailApi,
  fetchMitraRegistrationsApi,
  rejectMitraRegistrationApi,
} from "@/features/internal/mitra-registration/api/mitra-registration.api";
import type {
  ApproveMitraRegistrationPayload,
  InternalMitraRegistrationItem,
  InternalMitraRegistrationListResponse,
  InternalMitraRegistrationQueryParams,
  RejectMitraRegistrationPayload,
} from "@/features/internal/mitra-registration/types/mitra-registration.type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeMitraRegistrationItem = (raw: any): InternalMitraRegistrationItem => {
  if (!raw || typeof raw !== "object") return raw;
  return {
    id: raw.id ?? raw._id ?? "",
    registrationNumber:
      raw.registrationNumber ??
      raw.registration_number ??
      raw.noRegistrasi ??
      raw.no_registrasi ??
      "",
    namaInstansi: raw.namaInstansi ?? raw.nama_instansi ?? raw.instansi ?? "",
    alamatKantor: raw.alamatKantor ?? raw.alamat_kantor ?? raw.alamat ?? "",
    nib: raw.nib ?? "",
    npwp: raw.npwp ?? "",
    website: raw.website ?? null,
    namaPenanggungJawab:
      raw.namaPenanggungJawab ??
      raw.nama_penanggung_jawab ??
      raw.penanggungJawab ??
      raw.penanggung_jawab ??
      "",
    jabatan: raw.jabatan ?? "",
    email: raw.email ?? "",
    nomorHp:
      raw.nomorHp ??
      raw.nomor_hp ??
      raw.noHp ??
      raw.no_hp ??
      raw.phone ??
      "",
    status: raw.status ?? "pending_verification",
    statusDescription: raw.statusDescription ?? raw.status_description ?? null,
    suratPermohonan: raw.suratPermohonan ?? raw.surat_permohonan ?? null,
    dokumenDik: raw.dokumenDik ?? raw.dokumen_dik ?? null,
    suratPernyataanHukum:
      raw.suratPernyataanHukum ?? raw.surat_pernyataan_hukum ?? null,
    suratKomitmenEvaluasi:
      raw.suratKomitmenEvaluasi ?? raw.surat_komitmen_evaluasi ?? null,
    suratKomitmenPerbaikan:
      raw.suratKomitmenPerbaikan ?? raw.surat_komitmen_perbaikan ?? null,
    proposalTeknis: raw.proposalTeknis ?? raw.proposal_teknis ?? null,
    contractDocument: raw.contractDocument ?? raw.contract_document ?? null,
    rejectionReason: raw.rejectionReason ?? raw.rejection_reason ?? null,
    verifiedAt: raw.verifiedAt ?? raw.verified_at ?? null,
    verifiedBy: raw.verifiedBy ?? raw.verified_by ?? null,
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.updated_at ?? undefined,
  };
};

export const getInternalMitraRegistrationsList = async (
  params?: InternalMitraRegistrationQueryParams,
  signal?: AbortSignal,
): Promise<InternalMitraRegistrationListResponse> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await fetchMitraRegistrationsApi(params, signal);

  let rawData = response;
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    response.data
  ) {
    rawData = response.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawItems: any[] = [];
  let pagination = undefined;

  if (Array.isArray(rawData)) {
    rawItems = rawData;
    pagination = response.pagination ?? response.meta;
  } else if (rawData && typeof rawData === "object") {
    if (Array.isArray(rawData.items)) {
      rawItems = rawData.items;
      pagination = rawData.pagination ?? rawData.meta ?? response.pagination;
    } else if (Array.isArray(rawData.data)) {
      rawItems = rawData.data;
      pagination = rawData.pagination ?? rawData.meta ?? response.pagination;
    }
  } else if (response && Array.isArray(response.items)) {
    rawItems = response.items;
    pagination = response.pagination;
  }

  const items = rawItems.map(normalizeMitraRegistrationItem);

  const finalPagination = pagination ?? {
    currentPage: params?.page ?? 1,
    pageSize: params?.pageSize ?? 10,
    itemsPerPage: params?.pageSize ?? 10,
    totalItems: items.length,
    totalPages: Math.ceil(items.length / (params?.pageSize ?? 10)) || 1,
    hasNextPage:
      (params?.page ?? 1) <
      (Math.ceil(items.length / (params?.pageSize ?? 10)) || 1),
    hasPrevPage: (params?.page ?? 1) > 1,
  };

  return {
    items,
    pagination: finalPagination,
  };
};

export const getInternalMitraRegistrationDetail = async (
  id: string | number,
  signal?: AbortSignal,
): Promise<InternalMitraRegistrationItem | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await fetchMitraRegistrationDetailApi(id, signal);
  const raw = response?.data ?? response;
  if (!raw) return null;
  return normalizeMitraRegistrationItem(raw);
};

export const approveInternalMitraRegistration = async (
  payload: ApproveMitraRegistrationPayload,
  signal?: AbortSignal,
): Promise<InternalMitraRegistrationItem> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await approveMitraRegistrationApi(payload, signal);
  const raw = response?.data ?? response;
  if (!raw) {
    throw new Error(response?.message || "Gagal menyetujui permohonan mitra.");
  }
  return normalizeMitraRegistrationItem(raw);
};

export const rejectInternalMitraRegistration = async (
  payload: RejectMitraRegistrationPayload,
  signal?: AbortSignal,
): Promise<InternalMitraRegistrationItem> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await rejectMitraRegistrationApi(payload, signal);
  const raw = response?.data ?? response;
  if (!raw) {
    throw new Error(response?.message || "Gagal menolak permohonan mitra.");
  }
  return normalizeMitraRegistrationItem(raw);
};
