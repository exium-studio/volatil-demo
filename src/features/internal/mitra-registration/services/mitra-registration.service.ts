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

  const organizationName =
    raw.organizationName ??
    raw.namaInstansi ??
    raw.nama_instansi ??
    raw.instansi ??
    "";
  const officeAddress =
    raw.officeAddress ??
    raw.alamatKantor ??
    raw.alamat_kantor ??
    raw.alamat ??
    "";
  const picName =
    raw.picName ??
    raw.namaPenanggungJawab ??
    raw.nama_penanggung_jawab ??
    raw.penanggungJawab ??
    raw.penanggung_jawab ??
    "";
  const position = raw.position ?? raw.jabatan ?? "";
  const phoneNumber =
    raw.phoneNumber ??
    raw.nomorHp ??
    raw.nomor_hp ??
    raw.noHp ??
    raw.no_hp ??
    raw.phone ??
    "";

  const documents = raw.documents ?? null;

  const suratPermohonan =
    (typeof documents?.suratPermohonan === "object"
      ? documents?.suratPermohonan?.url
      : documents?.suratPermohonan) ??
    raw.suratPermohonan ??
    raw.surat_permohonan ??
    null;
  const dokumenDik =
    (typeof documents?.dokumenDik === "object"
      ? documents?.dokumenDik?.url
      : documents?.dokumenDik) ??
    raw.dokumenDik ??
    raw.dokumen_dik ??
    null;
  const suratPernyataanHukum =
    (typeof documents?.suratPernyataanHukum === "object"
      ? documents?.suratPernyataanHukum?.url
      : documents?.suratPernyataanHukum) ??
    raw.suratPernyataanHukum ??
    raw.surat_pernyataan_hukum ??
    null;
  const suratKomitmenEvaluasi =
    (typeof documents?.suratKomitmenEvaluasi === "object"
      ? documents?.suratKomitmenEvaluasi?.url
      : documents?.suratKomitmenEvaluasi) ??
    raw.suratKomitmenEvaluasi ??
    raw.surat_komitmen_evaluasi ??
    null;
  const suratKomitmenPerbaikan =
    (typeof documents?.suratKomitmenPerbaikan === "object"
      ? documents?.suratKomitmenPerbaikan?.url
      : documents?.suratKomitmenPerbaikan) ??
    raw.suratKomitmenPerbaikan ??
    raw.surat_komitmen_perbaikan ??
    null;
  const proposalTeknis =
    (typeof documents?.proposalTeknis === "object"
      ? documents?.proposalTeknis?.url
      : documents?.proposalTeknis) ??
    raw.proposalTeknis ??
    raw.proposal_teknis ??
    null;

  return {
    id: String(raw.id ?? raw._id ?? ""),
    registrationNumber:
      raw.registrationNumber ??
      raw.registration_number ??
      raw.noRegistrasi ??
      raw.no_registrasi ??
      "",
    userId: raw.userId ?? raw.user_id ?? undefined,
    organizationName,
    officeAddress,
    nib: String(raw.nib ?? ""),
    npwp: String(raw.npwp ?? ""),
    website: raw.website ?? null,
    picName,
    position,
    email: raw.email ?? "",
    phoneNumber,
    status: raw.status ?? "pending_verification",
    statusDescription: raw.statusDescription ?? raw.status_description ?? null,
    documents,
    contractDocument: raw.contractDocument ?? raw.contract_document ?? null,
    rejectionReason: raw.rejectionReason ?? raw.rejection_reason ?? null,
    verifiedAt: raw.verifiedAt ?? raw.verified_at ?? null,
    verifiedBy: raw.verifiedBy ?? raw.verified_by ?? null,
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.updated_at ?? undefined,

    // Aliases
    namaInstansi: organizationName,
    alamatKantor: officeAddress,
    namaPenanggungJawab: picName,
    jabatan: position,
    nomorHp: phoneNumber,
    suratPermohonan,
    dokumenDik,
    suratPernyataanHukum,
    suratKomitmenEvaluasi,
    suratKomitmenPerbaikan,
    proposalTeknis,
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
