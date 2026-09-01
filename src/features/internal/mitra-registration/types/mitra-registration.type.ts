// src/features/internal/mitra-registration/types/mitra-registration.type.ts

import type { MitraRegistrationStatus } from "@/features/auth/types/mitra-registration.type";
import type {
  PaginatedParams,
  PaginationMeta,
} from "@/shared/types/common-response.type";

export type { MitraRegistrationStatus };

export type InternalMitraRegistrationItem = {
  id: string | number;
  registrationNumber: string;
  namaInstansi: string;
  alamatKantor: string;
  nib: string;
  npwp: string;
  website?: string | null;
  namaPenanggungJawab: string;
  jabatan: string;
  email: string;
  nomorHp: string;
  status: MitraRegistrationStatus;
  statusDescription?: string;
  suratPermohonan?: string | null;
  dokumenDik?: string | null;
  suratPernyataanHukum?: string | null;
  suratKomitmenEvaluasi?: string | null;
  suratKomitmenPerbaikan?: string | null;
  proposalTeknis?: string | null;
  contractDocument?: string | null;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type InternalMitraRegistrationQueryParams = PaginatedParams & {
  status?: MitraRegistrationStatus | "all";
};

export type InternalMitraRegistrationListResponse = {
  items: InternalMitraRegistrationItem[];
  pagination: PaginationMeta;
};

export type ApproveMitraRegistrationPayload = {
  id: string | number;
  contractDocument: File;
};

export type RejectMitraRegistrationPayload = {
  id: string | number;
  rejectionReason: string;
};

export type MitraRegistrationDocumentItem = {
  title: string;
  url?: string | null;
  desc: string;
  mimeType?: string;
};

